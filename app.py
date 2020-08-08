import os
from flask import Flask, render_template, request, redirect
import firebase_admin
from firebase_admin import credentials,firestore

cred = credentials.Certificate("firebaseKey.json")
defaultApp = firebase_admin.initialize_app(cred)
db = firestore.client()

app = Flask(__name__)

@app.route("/", methods = ["GET", "POST"])
@app.route("/login", methods = ["GET", "POST"])
def login():
    return "Hello"

@app.route("/signup", methods = ["GET", "POST"])
def signup():
    pass

if __name__ == "__main__":
    app.run(debug = True)