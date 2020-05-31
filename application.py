import os
import requests

from flask import Flask, session, render_template, request, redirect, url_for
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
channels_count = 2
channels_list = ["Example", "Another example"]

@app.route("/")
def index():
    return render_template("index.html", channels_count=channels_count, 
    	channels_list=channels_list)

@app.route("/", methods=["POST"])
def new_channel():

	channel_name = request.form.get("channel_name")

	if channel_name == "":
		return render_template("index.html", message="Please enter a valid name", 
			channels_count=channels_count, channels_list=channels_list)

	name_taken = False

	if channel_name in channels_list:
		name_taken = True

	if not name_taken:
		channels_list.append(channel_name)
		channels_count += channels_count

	return render_template("index.html", channels_count=channels_count, 
		channels_list=channels_list)

@app.route("/channel", methods=["POST"])
def channel_ch():

	channel_name = request.form.get("channel_name")

	if channel_name == "":
		return render_template("index.html", message="Please enter a valid name", 
			channels_count=channels_count, channels_list=channels_list, channel_name=channel_name)

	channels_list.append(channel_name)

	return render_template("messages.html", channel_name=channel_name)

@app.route("/channel/<channel_name>", methods=["GET"])
def channel(channel_name):

	return render_template("messages.html", channel_name=channel_name)

@socketio.on("submit message")
def submit_message(data):
    message_text = data["message_text"]
    emit("announce message", {"message_text": message_text}, broadcast=True)

app.run()