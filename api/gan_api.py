import imageio
import random
import os
import numpy as np
import tensorflow as tf

from PIL import Image
from tensorflow import keras
from zipfile import ZipFile

from cfg_parser import CFGParser

class GenerativeAPI():
    '''
    Class that contains methods that interact directly with the GAN, generating
    images in both single/bulk amounts and interpolating between points.
    '''
    def __init__(self, name=None):
        if name is None:
            name = CFGParser().get_model()
        self.model = keras.models.load_model(name)
        self.noise_dim = self.model.layers[0].output_shape[0][1]
        self.channels = self.model.layers[-1].output_shape[-1]
        if self.channels == 3:
            self.img_cf = "RGB"
        elif self.channels == 4:
            self.img_cf = "RGBA"

    def hash_request(self, args):
        """
        Hashes the request to reduce computation for future
        identical requests.
        """
        g = "-".join([str(arg) for arg in args])
        return hash(g)

    def check_exists(self, hash, ftype="image"):
        """
        Returns the file path if the request has already been fulfilled
        previously.
        """
        path = CFGParser().get_path()
        if ftype == "image":
            path = "{0}/img/{1}.png".format(path, hash)
        elif ftype == "zip":
            path = "{0}/{1}.zip".format(path, hash)  
        else:
            path = "{0}/{1}.gif".format(path, hash)               

        if os.path.exists(path):
            return path, True
        return path, False

    def get_seed(self):
        """
        Returns a random integer between 0 and 10^8.
        """
        return random.randint(0, 1e8)

    def set_seed(self, seed=None):
        """
        Sets and returns the seed, generating one if one
        isn't supplied.
        """
        if seed is None:
            seed = self.get_seed()
        random.seed(seed)
        tf.random.set_seed(seed)

        return seed

    def get_noise(self, amount=1):
        """
        Returns noise usable by the model.
        """
        return tf.random.normal([amount, self.noise_dim])

    def gen(self, seed=None):
        '''
        Method that generates a single image.
        Returns the path of the generated image and the seed.
        '''
        seed = self.set_seed(seed)
        name = self.hash_request(["gen", seed])
        path, exists = self.check_exists(name, "image")
        if exists:
            return path, seed

        noise = self.get_noise()
        pred = self.model.predict(noise)
        pred = ((0.5 * pred[0] + 0.5) * 256).astype("uint8")

        img = Image.fromarray(pred, self.img_cf)
        img.save(path, format="PNG")

        return path, seed

    def bulk(self, seed=None, amount=None):
        '''
        Method that generates images in bulk.
        Returns the path of the zip containing the generated images.
        '''
        cfg = CFGParser()
        seed = self.set_seed(seed)
        if amount is None or amount < 1:
            amount = cfg.get_amount()
        elif amount > cfg.get_max_bulk():
            amount = cfg.get_max_bulk()
        name = self.hash_request(["bulk", amount, seed])
        path, exists = self.check_exists(name, "zip")
        if exists:
            return path

        noise = self.get_noise(amount)
        pred = self.model.predict(noise)
        pred = ((0.5 * pred + 0.5) * 256).astype("uint8")

        fnames = []
        for i, p in enumerate(pred):
            img = Image.fromarray(p, self.img_cf)
            fname = "{0}/img/{1}-{2}.png".format(CFGParser().get_path(), name, i+1)
            fnames.append(fname)
            img.save(fname, format="PNG")

        fzip = ZipFile(path, "w")
        for i in range(len(fnames)):
            fzip.write(fnames[i], "{0}-{1}.png".format(name, i))
        fzip.close()

        return path

    def interpolate(self, seeds=None, steps=None):
        '''
        Method that generates images interpolating between 2(+) points.
        Returns the path of the created animation (as .gif).
        '''
        cfg = CFGParser()
        if seeds is None:
            seeds = [self.get_seed(), self.get_seed()]
        elif type(seeds) == str:
            seeds = [int(s) for s in seeds.split(",")]
        if len(seeds) == 1:
            seeds.append(self.get_seed())

        if steps is None:
            steps = cfg.get_steps()
        if steps * (len(seeds) - 1) > cfg.get_max_frames():
            steps = cfg.get_max_frames() // (len(seeds) - 1)

        name = self.hash_request(["interpolate", steps, *seeds])
        path, exists = self.check_exists(name, "gif")
        if exists:
            return path

        points = []
        for seed in seeds:
            self.set_seed(seed)
            points.append(self.get_noise())
        
        noise = []
        for i in range(1, len(points)):
            percents = np.linspace(0, 1, num=steps)
            i_noise = [((1.0 - p) * points[i-1]) + (p * points[i]) for p in percents]
            noise.append(i_noise)
        noise = np.array(noise).reshape(((len(points) - 1) * steps, points[0].shape[1]))
        pred = self.model.predict(noise)
        pred = ((0.5 * pred + 0.5) * 256).astype("uint8")

        fnames = []
        imgs = []
        for i, p in enumerate(pred):
            img = Image.fromarray(p, self.img_cf)
            fname = "{0}/img/{1}-{2}.png".format(CFGParser().get_path(), name, i+1)
            fnames.append(fname)
            img.save(fname, format="PNG")
            imgs.append(img)
        imgs += imgs[::-1]
        
        imageio.mimsave(path, imgs)

        return path