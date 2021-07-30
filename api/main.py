from flask import Flask, send_file;
from flask_restful import reqparse, Resource, Api;

from gan_api import GenerativeAPI;

app = Flask(__name__)
api = Api(app)
gapi = GenerativeAPI()

class Generate(Resource):
    '''
    
    '''
    def get(self):
        parser = reqparse.RequestParser()
        parser.add_argument("seed", type=int)
        args = parser.parse_args()
        img_path = gapi.gen(args.get("seed", None))
        return send_file(img_path)

class Interpolate(Resource):
    '''
    
    '''
    def get(self, points=None, steps=10):
        return gapi.interpolate(points, steps)

class BulkGenerate(Resource):
    '''
    
    '''
    def get(self, num=10):
        return gapi.bulk(num)

api.add_resource(Generate, "/generate")
api.add_resource(Interpolate, "/interpolate")
api.add_resource(BulkGenerate, "/bulk")

if __name__ == "__main__":
    app.run()