import os
import requests

from flask import Flask, session, render_template, request, redirect, url_for
from flask_session import Session
from flask_socketio import SocketIO, emit

from collections import deque

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
channels_list = []
channels_number = len(channels_list)

# Dictionary that will store chat messages as [key]:[queue] values
chat_messages = {}

@app.route("/")
def index():
    channels_number = len(channels_list)
    return render_template("index.html", channels_count=channels_number, 
        channels_list=channels_list)

@app.route("/", methods=["POST"])
def new_channel():

    channel_name = request.form.get("channel_name")
    channels_number = len(channels_list)

    if channel_name == "":
        return render_template("index.html", message="Please enter a valid name", 
            channels_count=channels_number, channels_list=channels_list)

    if channel_name in channels_list:
        return render_template("index.html", message="Please enter a unique name", 
            channels_count=channels_number, channels_list=channels_list, channel_name=channel_name)

    channels_list.append(channel_name)
    channels_number = len(channels_list)

    # Queue that stores chat messages
    q = deque()
    q.append("Hey! This is the first message. Start chatting from here.")

    chat_messages[channel_name] = q

    return render_template("index.html", channels_count=channels_number, 
        channels_list=channels_list)

@app.route("/channel/<channel_name>", methods=["GET"])
def channel(channel_name):

    return render_template("messages.html", 
        channel_name=channel_name, messages=chat_messages[channel_name])

@socketio.on("submit message")
def submit_message(data):
    message_text = data["message_text"]
    channel_name = data["channel_name"]

    if len(chat_messages[channel_name]) < 100:
        chat_messages[channel_name].append(message_text)
    else:
        chat_messages[channel_name].popleft()
        chat_messages[channel_name].append(message_text)

    emit("announce message", {"message_text": message_text}, broadcast=True)

app.run()