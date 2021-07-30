import base64
import random
import numpy as np
import tensorflow as tf
import matplotlib.pyplot as plt

from io import BytesIO
from PIL import Image
from tensorflow import keras
from tensorflow.keras import layers

class GenerativeAPI():
    '''
    
    '''
    def __init__(self):
        self.build_generator()
        self.model.load_weights("gen_weights.h5")

    def gen(self, seed=None):
        '''
        
        '''
        if seed is None:
            seed = random.randint(0, 1e8)
        random.seed(seed)
        tf.random.set_seed(seed)

        noise = tf.random.normal([1, 32])
        pred = self.model.predict(noise)
        pred = ((0.5 * pred[0] + 0.5) * 256).astype("uint8")

        buff = BytesIO()
        img = Image.fromarray(pred, "RGB")
        img.save(buff, format="PNG")
        fname = "img/gen-s{0}.png".format(seed)
        img.save(fname, format="PNG")

        return fname

    def bulk(self, amount=10):
        '''
        
        '''
        pass

    def interpolate(self, points=None, steps=10):
        '''
        
        '''
        pass

    def build_generator(self):
        '''
        
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
