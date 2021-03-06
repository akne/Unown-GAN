import sys
import getopt

from flask import Flask, send_file
from flask_cors import CORS
from flask_restful import reqparse, Resource, Api

from gan_api import GenerativeAPI
from daemon import Daemon

app = Flask(__name__)
CORS(app)
api = Api(app)
gapi = GenerativeAPI()
dmon = Daemon()

class Generate(Resource):
    '''
    End point that generates a random Unown.
    Returns an image file and the seed.
    '''
    def get(self):
        parser = reqparse.RequestParser()
        parser.add_argument("seed", type=int)
        args = parser.parse_args()
        img_path, seed = gapi.gen(args.get("seed", None))
        res = send_file(img_path)
        res.headers["seed"] = seed
        return res

class Interpolate(Resource):
    '''
    End point that interpolates between two points/images.
    Returns a zip file of generated images.
    '''
    def get(self):
        parser = reqparse.RequestParser()
        parser.add_argument("seeds", type=str)
        parser.add_argument("steps", type=int)
        args = parser.parse_args()
        zip_path = gapi.interpolate(args.get("seeds", None), args.get("steps", None))
        return send_file(zip_path)

class BulkGenerate(Resource):
    '''
    End point that generates a bulk of random Unowns.
    Returns a zip file containing the generated images.
    '''
    def get(self):
        parser = reqparse.RequestParser()
        parser.add_argument("amount", type=int)
        parser.add_argument("seed", type=int)
        args = parser.parse_args()
        zip_path = gapi.bulk(args.get("seed", None), args.get("amount", None))
        return send_file(zip_path)

api.add_resource(Generate, "/generate")
api.add_resource(Interpolate, "/interpolate")
api.add_resource(BulkGenerate, "/bulk")

if __name__ == "__main__":
    host = "0.0.0.0"
    port = 5000
    if len(sys.argv) > 1:
        args = sys.argv[1:]
        opts = "h:p:"
        optl = ["host=", "port="]

        arg_f, vals = getopt.getopt(args, opts, optl)

        for arg, val in arg_f:
            if arg in ("-h", "--host"):
                host = val
            elif arg in ("-p", "--port"):
                port = val
    app.run(host=host, port=port)