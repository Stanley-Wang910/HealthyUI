from flask import Flask, jsonify
from flask_cors import CORS
import json
import os


app = Flask(__name__)

CORS(app, supports_credentials=True, origins=['http://localhost:3000'])


@app.route('/api/test', methods=['GET']) 

@app.route('/test')
def test():
    return jsonify({'message': 'Hello World!'})

if __name__ == '__main__':
    app.run(debug=True, port=5000)