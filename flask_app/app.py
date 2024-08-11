from flask import Flask, jsonify
from flask_cors import CORS
import subprocess
import json
from services import user_videos

app = Flask(__name__)

# CORS(app, supports_credentials=True, origins=['*'])
# the supports credentials option is bugging sometimes
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

@app.route('/api/video/get-playlist')
def get_user_videos_playlist():
    return jsonify(user_videos.get_user_videos_playlist_service())


@app.route('/api/test')
def test():
    return jsonify({'message': 'Hello World!'})


@app.route('/api')
def run_factcheck_go():
    try:
        run = 'news'
        command = ['-c', run]
        # sub_command = ['-q', 'JD Vance Couch']
        sub_command = []

        result = subprocess.run(['./go/go.exe'] + command + (sub_command if sub_command is not None else ''),
                                capture_output=True, text=True, encoding='utf-8')
        # result = subprocess.run(['./go/main.exe'], capture_output=True, text=True, encoding='utf-8')

        # print(result.stdout)

        if result.returncode == 0:
            return jsonify(json.loads(result.stdout))
            # return jsonify(result.stdout)
        else:
            return jsonify({'error': result.stderr}), 500
    except Exception as e:
        return jsonify({'error': str(e)}), 500


# @app.route('/api/test', methods=['GET'])
#
# @app.route('/test')
# def test():
#     return jsonify({'message': 'Hello World!'})

if __name__ == '__main__':
    app.run(debug=True, port=5000)
