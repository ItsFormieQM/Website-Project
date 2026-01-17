from flask import Flask, render_template

app = Flask(__name__)

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/pc")
def pc():
    return render_template("pc.html")

@app.route("/mobile")
def mobile():
    return render_template("mobile.html")

if __name__ == "__main__":
    app.run(debug=True)
