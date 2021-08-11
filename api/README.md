# Unown-GAN API
## Setup
The API can be started by installing the required modules (in `requirements.txt` - **Not tested yet**) and starting the `main.py` script as follows:
 * `pip install -r requirements.txt`
 * `python main.py`

For a production build, the API can be setup by using the Dockerfile (soon) via the following instructions:
 * `docker ...`

## Functionality / Endpoints
Alongside the endpoints, the API currently has features setup to automatically delete generated files after a set amount of time (e.g.: 3 hours), and many of the default values and paths can be configured by editing `config.ini`.

The API is also (or should be) fully reusable with other GANs, as long as the name parameter for the GenerativeAPI class matches the path to your desired model - which can also be done by editing `config.ini`. ***This hasn't been tested, but it should work with models that produce images in both RGB and RGBA formats, and models that have varying noise input sizes.***

*There are plans to implement additional features, such as basic logging (requests + status, errors, etc).*

The endpoints of the API, parameters, and functionality are as follows:

### `/generate`
The endpoint responsible for generating a single image.
 * Parameters:
    * `seed` - A seed, keeps results fixed (Default None).
 * Example: `localhost:5000/generate?seed=37`


### `/interpolate` 
The endpoint responsible for creating animations of the interpolation between multiple points.
 * Parameters:
    * `seeds` - A set of two or more seeds to keep results fixed (Default None).
    * `steps` - The number of steps taken to interpolate between two points (Default 10).
 * Example: `localhost:5000/interpolate?seeds=1, 2, 3&steps=20`

### `/bulk`
The endpoint responsible for the bulk generation of images.
 * Parameters:
    * `seed` - The initial seed, keeps results fixed if done multiple times (Default None).
    * `amount` - The number of images to generate  (Default 32).
 * Example: `localhost:5000/bulk?seed=37&amount=64`

