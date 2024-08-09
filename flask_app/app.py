from flask import Flask, jsonify
from flask_cors import CORS
import subprocess
import shlex
import json
import os


app = Flask(__name__)

CORS(app, supports_credentials=True, origins=['http://localhost:3000'])

# @app.route('/api/test', methods=['GET']) 

@app.route('/test')
def test():
    return jsonify({'message': 'Hello World!'})

@app.route('/factcheck')
def run_factcheck_go():
    try:
        formatted_arg = ['-queries', 'Global Warming']
        result = subprocess.run(['./go/main.exe'] + formatted_arg, capture_output=True, text=True, encoding='utf-8')

        print(result.stdout)

        if result.returncode == 0:
            return jsonify(json.loads(result.stdout))
        else:
            return jsonify({'error': result.stderr}), 500
    except Exception as e:
        return jsonify({'error': str(e)}), 500



if __name__ == '__main__':
    app.run(debug=True, port=5000)