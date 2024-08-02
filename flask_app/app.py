from flask import Flask


app = Flask(__name__)

@app.route('/')
def home_page():
    return "Hi Belal"

@app.route('/liked-videos')
def show_liked_vids():
    return "youtube vid"


if __name__ == '__main__':
    app.run(debug=True, port=5000)