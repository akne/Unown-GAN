import random
import numpy as np
import tensorflow as tf

from io import BytesIO
from PIL import Image
from tensorflow import keras
from tensorflow.keras import layers
from zipfile import ZipFile

from cfg_parser import CFGParser

class GenerativeAPI():
    '''
    Class that contains methods that interact directly with the GAN, generating
    images in both single/bulk amounts and interpolating between points.
    '''
    def __init__(self):
        self.build_generator()
        self.model.load_weights("gen_weights.h5")

    def set_seed(self, seed=None):
        """
        Sets and returns the seed, generating one if one
        isn't supplied.
        """
        if seed is None:
            seed = random.randint(0, 1e8)
        random.seed(seed)
        tf.random.set_seed(seed)

        return seed

    def get_noise(self, amount=1):
        """
        Returns noise usable by the model.
        """
        return tf.random.normal([amount, 32])

    def gen(self, seed=None):
        '''
        Method that generates a single image.
        Returns the path of the generated image and the seed.
        '''
        seed = self.set_seed(seed)
        noise = self.get_noise()
        pred = self.model.predict(noise)
        pred = ((0.5 * pred[0] + 0.5) * 256).astype("uint8")

        buff = BytesIO()
        img = Image.fromarray(pred, "RGB")
        img.save(buff, format="PNG")
        fname = "{0}/img/gen-s{1}.png".format(CFGParser().get_path(), seed)
        img.save(fname, format="PNG")

        return fname, seed

    def bulk(self, seed=None, amount=None):
        '''
        Method that generates images in bulk.
        Returns the path of the zip containing the generated images.
        '''
        seed = self.set_seed(seed)
        if amount is None or amount < 1:
            amount = CFGParser().get_amount()

        noise = self.get_noise(amount)
        pred = self.model.predict(noise)
        pred = ((0.5 * pred + 0.5) * 256).astype("uint8")

        path = CFGParser().get_path()
        fnames = []
        for i, p in enumerate(pred):
            buff = BytesIO()
            img = Image.fromarray(p, "RGB")
            img.save(buff, format="PNG")
            fname = "{0}/img/gen-b{1}-{2}.png".format(path, seed, i+1)
            fnames.append(fname)
            img.save(fname, format="PNG")

        fzname = "{0}/bulk-s{1}-{2}.zip".format(path, seed, amount)
        fzip = ZipFile(fzname, "w")
        for fname in fnames:
            fzip.write(fname)
        fzip.close()

        return fzname

    def interpolate(self, seeds=None, steps=None):
        '''
        Method that generates images interpolating between 2(+) points.
        Returns the path of the zip containing the generated images.
        '''
        if seeds is None:
            seeds = [random.randint(0, 1e8), random.randint(0, 1e8)]
        elif type(seeds) == str:
            seeds = [int(s) for s in seeds.split(",")]
        elif len(seeds) == 1:
            seeds.append(random.randint(0, 1e8))

        points = []
        for seed in seeds:
            self.set_seed(seed)
            points.append(self.get_noise())
        
        if steps is None:
            steps = CFGParser().get_steps()

        noise = []
        for i in range(len(points)):
            if i == 0:
                continue
            else:
                percents = np.linspace(0, 1, num=steps)
                i_noise = [((1.0 - p) * points[i-1]) + (p * points[i]) for p in percents]
                noise.append(i_noise)
        noise = np.array(noise).reshape(((len(points) - 1) * steps, points[0].shape[1]))
        pred = self.model.predict(noise)
        pred = ((0.5 * pred + 0.5) * 256).astype("uint8")

        path = CFGParser().get_path()
        fnames = []
        for i, p in enumerate(pred):
            buff = BytesIO()
            img = Image.fromarray(p, "RGB")
            img.save(buff, format="PNG")
            fname = "{0}/img/gen-i{1}-{2}.png".format(path, "_".join([str(s) for s in seeds]), i+1)
            fnames.append(fname)
            img.save(fname, format="PNG")
        
        fzname = "{0}/interpolate-s{1}-st{2}.zip".format(path, "_".join([str(s) for s in seeds]), steps)
        fzip = ZipFile(fzname, "w")
        for fname in fnames:
            fzip.write(fname)
        fzip.close()

        return fzname

    def build_generator(self):
        '''
        Builds the generator model to allow weights to be loaded.
        Could be replaced by compiling the model and loading it instead.
        '''
        inputs = keras.Input(shape=(32,))
        x = layers.Dense(5*5*512)(inputs)
        x = layers.LeakyReLU(0.2)(x)
        x = layers.Reshape((5,5,512))(x)

        x = layers.Conv2DTranspose(256, 4, strides=1, padding="same", use_bias=False)(x)
        x = layers.BatchNormalization(momentum=0.8)(x)
        x = layers.LeakyReLU(0.2)(x)

        x = layers.Conv2DTranspose(128, 4, strides=2, padding="same", use_bias=False)(x)
        x = layers.BatchNormalization(momentum=0.8)(x)
        x = layers.LeakyReLU(0.2)(x)

        x = layers.Conv2DTranspose(64, 4, strides=2, padding="same", use_bias=False)(x)
        x = layers.BatchNormalization(momentum=0.8)(x)
        x = layers.LeakyReLU(0.2)(x)

        x = layers.Conv2DTranspose(32, 4, strides=2, padding="same", use_bias=False)(x)
        x = layers.BatchNormalization(momentum=0.8)(x)
        x = layers.LeakyReLU(0.2)(x)

        output = layers.Conv2DTranspose(3, 4, strides=2, padding="same", use_bias=False, activation="tanh")(x)
        self.model = keras.Model(inputs=inputs, outputs=output)