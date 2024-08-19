from flask import Flask, render_template, url_for

app = Flask(__name__)

@app.route('/')
def home():
    return(render_template("youtube.html"))


@app.route('/test')
def test():
    return(render_template("test.html"))

app.run(
    host="0.0.0.0", port=3000,
    debug = True
        )
