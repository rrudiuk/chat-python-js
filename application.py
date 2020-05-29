import os

from flask import Flask, render_template, request
from flask_socketio import SocketIO, emit

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
socketio = SocketIO(app)

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

@app.route("/channels", methods=["POST"])
def channels():

	username = request.form.get("username")

	if username == "":
		return render_template("index.html", message="Please select a username")
	elif len(username) > 64:
		return render_template("index.html", message="Please select a shorter username")

	return render_template("channels.html", username=username,
		channels_count=channels_count, channels_list=channels_list)

@app.route("/channel/<channel_name>", methods=["GET"])
def channel(channel_name):

	return "This is {}".format(channel_name)

@app.route("/channel_created", methods=["POST"])
def channel_created():

	channel_name = request.form.get("channel_name")

	if channel_name == "":
		return render_template("channels.html", username=username,
		channels_count=channels_count, channels_list=channels_list,
		massage="Please add a valid name")

	channels_list.append(channel_name)

	return render_template("channels.html", username=username,
		channels_count=channels_count, channels_list=channels_list) 
