# Unown-GAN
This project aims to showcase the utilisation of a Generative Adversarial Network (GAN) as a web service, allowing users to access an API via a Web Interface to generate (singular and in bulk) images and interpolate between points in the latent space of a GAN.

The project currently utilises a Wasserstein GAN, REST API (Flask), and Web Interface with the current capabilities consisting of:

 * Generating a single image (with and without a seed)
 * Interpolating between multiple images (with and without seeds, and a variable amount of steps)
 * Generating images in bulk (with and without initial seed)

There are plans to retrain the model to allow for higher quality results, and to allow users to supply a label to aid in the generation of an image (e.g., supplying the letter 'E' may generate an 'E'-shaped Unown).

The API and Web Interface can be used as a framework for other GANs if desired, so feel free to fork and modify this repository.