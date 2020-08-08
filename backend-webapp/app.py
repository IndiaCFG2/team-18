import os
from flask import Flask, render_template, request, redirect, url_for, flash
import firebase_admin
from firebase_admin import credentials,firestore
from datetime import datetime, time


cred = credentials.Certificate("firebaseKey.json")
defaultApp = firebase_admin.initialize_app(cred)
db = firestore.client()

app = Flask(__name__)
app.secret_key = 'thisIsSecretKeyhuehuehue'


@app.route("/", methods = ['GET', 'POST'])
def login():
    if request.method == 'POST':
        message = ""
        username = request.form['username']
        password = request.form['password']

        if username == '' and password == '':
            return redirect(url_for('select_institutions'))
        else:
            flash("College already exists!")
            return redirect(url_for('login'))
        return render_template('login.html')
    return render_template('login.html')


#Organiser's view
@app.route("/select_institutions", methods = ["GET", "POST"])
def select_institutions():
    if request.method == "POST":
        institute_name = request.form['institute']
        board_name = request.form['board']
        doc_institute = db.collection('institutionDetails').document(institute_name).get().to_dict()
        instituteId = doc_institute['id']

        doc_board = db.collection('boardID').document(board_name).get().to_dict()
        boardId = doc_board['id']
        url = 'http://team18-cfg.herokuapp.com/app/' + str(instituteId) + '/' + str(boardId)
        return render_template("generate_url.html", url = url)
    return render_template("select_institutions.html")

#Teacher's function
@app.route("/app/<institute_id>/<board_id>", methods = ["GET", "POST"])
def teacher_select(institute_id = None, board_id = None):
    if request.method == "POST":
        instituteId = institute_id
        boardId = board_id
        grade = request.form['grade']
        lesson = request.form['lesson']
        subject = request.form['subject']
        tech = request.form['tech']
        lessonId = instituteId + '_' + boardId + '_' + grade + '_' + subject + '_' + lesson + '_' + tech
        url = 'http://team18-cfg.herokuapp.com/app/' + lessonId
        return render_template("generate_url.html", url = url)
    return render_template("teacher_select.html")

#Generates links for students
@app.route("/app/<lessonId>")
def count_incrementer(lessonId = None):
    midnight = datetime.combine(datetime.today(), time.min)
    print(int(midnight.timestamp()))
    todays_timestamp = int(midnight.timestamp()) + 86400
    print(todays_timestamp)
    doc_ref = db.collection('lessons').document(lessonId).collection('dates').document(str(todays_timestamp))
    doc = doc_ref.get()
    current_count = doc.to_dict()['count']
    doc_ref.set({'count' : current_count + 1})
    google_slide_link = lessonId.split('_')[1:]
    doc_for_link = "_".join(google_slide_link)
    print(doc_for_link)
    url = db.collection('google_slide_links').document(doc_for_link).get()
    url = 'https://'+ url.to_dict()['link']
    return redirect(url)

if __name__ == "__main__":
    app.run(debug = True)