import os
import requests

from flask import Flask, session, render_template, request
from flask_session import Session
from flask_socketio import SocketIO, emit

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
app.config['SESSION_COOKIE_SECURE'] = False
socketio = SocketIO(app)

# Configure session to use filesystem
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
Session(app)

# Global variable to store username
username = ""
channels_count = 1
channels_list = ["Example"]

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/channels", methods=["GET"])
def channels_logged():
	if username != "":
		return  render_template("channels.html", channels_count=channels_count,
		username=username, channels_list=channels_list)

	return render_template("index.html")

@app.route("/channel", methods=["POST"])
def channel():

	channel_name = request.form.get("channel")

	return render_template("messages.html", channel_name=channel_name)

@app.route("/channel/<channel_name>", methods=["GET"])
def channel_messages(channel_name):

	return render_template("messages.html", channel_name=channel_name)

@socketio.on("submit message")
def submit_message(data):
    message_text = data["message_text"]
    emit("announce message", {"message_text": message_text}, broadcast=True)

@socketio.on("submit vote")
def vote(data):
    selection = data["selection"]
    emit("announce vote", {"selection": selection}, broadcast=True)

app.run()