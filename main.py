from flask import Flask
from flask import render_template, request, send_file, Response, jsonify, url_for
import os

app = Flask(__name__)

@app.route("/")
def homepage():
    return render_template("index.html")

@app.route("/get-songs", methods=['GET','POST'])
def getSongs():
    if request.method == "POST":
        print("****STARTED****")
        folder = request.get_json()
        print(folder)
        # path = f'{os.getcwd()}\\static\\songs\\{folder}'
        path = "\static\songs"
        print(path)
        songs = os.listdir(path)
        print(songs)
        return jsonify(songs)

@app.route("/get-cards", methods=['GET','POST'])
def getCards():
    path = f'{os.getcwd()}\\static\\songs'
    playlists = os.listdir(path)
    return jsonify(playlists)

@app.route('/play/<path:filename>')
def play_song(filename):
    file = f'{os.getcwd()}\\static\\songs\\{filename}.mp3'
    print("########SONG###### ", file)
    return send_file(file, mimetype='audio/mpeg')
    

# if __name__ == "__main__":
#     app.run(debug=False, host="0.0.0.0")
