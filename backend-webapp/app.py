import os
from flask import Flask, render_template, request, redirect
import firebase_admin
from firebase_admin import credentials,firestore

cred = credentials.Certificate("firebaseKey.json")
defaultApp = firebase_admin.initialize_app(cred)
db = firestore.client()

app = Flask(__name__)

#Organiser's view
@app.route("/", methods = ["GET", "POST"])
@app.route("/login", methods = ["GET", "POST"])
def login():
    return "Hello"

#Organiser's view
@app.route("/signup", methods = ["GET", "POST"])
def signup():
    pass

#Organiser's view
@app.route("/select_institutions", methods = ["GET", "POST"])
def select_institutions():
    pass

#Teacher's function
@app.route("/<institute_id>/<board_id>", methods = ["GET", "POST"])
def teacher_select(institute_id = None, board_id = None):
    if request.method == "POST":
        instituteId = institute_id
        boardId = board_id
        grade = request.form['grade']
        lesson = request.form['lesson']
        subject = request.form['subject']
        tech = request.form['tech']
        lessonId = instituteId + '-' + boardId + '-' + grade + '-' + subject + '-' + lesson + '-' + tech
        url = 'http://team18-cfg.herokuapp.com/' + instituteId + '/' + boardId + '/' + lessonId
        return render_template("generate_url.html", url = url)
    return render_template("teacher_select.html")





if __name__ == "__main__":
    app.run(debug = True)