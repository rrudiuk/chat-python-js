document.addEventListener('DOMContentLoaded', () => {

    // Create localStorage instance
    myStorage = window.localStorage;

    var channels_count = myStorage.length;

    // Create list items for existing channels
    if (channels_count > 2) {
        for (let i = 2; i < myStorage.length; i++) {
            let channel = myStorage.getItem(i);
            const li = document.createElement('li');
            const a = document.createElement('a');
            a.setAttribute('href', "{{ url_for('channel', channel_name=channel) }}");
            a.innerHTML = channel;
            li.appendChild(a);
            document.querySelector('#exisiting-channels').appendChild(li);
        }
    }

    if (myStorage.getItem('messenger_username') === null) {
        document.querySelector('#new_user').style.display = 'block'; 
        document.querySelector('#old_user').style.display = 'none'; 
    } else {
        document.querySelector('#new_user').style.display = 'none'; 
        document.querySelector('#old_user').style.display = 'block';
        document.querySelector('#old_user > h1').innerHTML = 
        "Welcome back " + myStorage.getItem('messenger_username') + "!";
    }

    // Create username functionality
    document.querySelector(".login-btn").onclick = () => {
        const tmp_username = document.querySelector('.username').value;
        if(tmp_username !== "") {
            username = tmp_username;
            alert(username)
            myStorage.setItem('messenger_username', username)
            document.querySelector('#new_user').style.display = 'none'; 
            document.querySelector('#old_user').style.display = 'block';
        }
    };

    document.querySelector('.create-chat').onclick = () => {
        const new_channel = document.querySelector('.new-channel').value;
        if (new_channel.length > 0 && new_channel.length < 64) {
            new_channel_key = myStorage.length;
            myStorage.setItem(new_channel_key, new_channel);

            const li = document.createElement('li');
            const a = document.createElement('a');
            a.setAttribute('href', "{{ url_for('channel', channel_name=channel) }}");
            a.innerHTML = new_channel;
            li.appendChild(a);
            document.querySelector('#exisiting-channels').appendChild(li);
        }   
    };



    // Connect to websocket
    var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

    // When connected, allow form submit with a message
    socket.on('connect', () => {

        document.querySelector('.send-message').onclick = () => {

            const message_text = document.querySelector('.message').value;
            if (message_text != "") {
                socket.emit('submit message', {'message_text': message_text});
            }
        };

        // Execute a function when the user releases a key on the keyboard
        document.addEventListener("keyup", function(event) {
            // Number 13 is the "Enter" key on the keyboard
            if (event.keyCode === 13) {
                const message_text = document.querySelector('.message').value;
                if (message_text != "") {
                    socket.emit('submit message', {'message_text': message_text});
                }
            }
        });

    });

    // When a new message is announced, add to the unordered list
    socket.on('announce message', data => {
        const li = document.createElement('li');
        li.innerHTML = `${data.message_text}`;
        document.querySelector('#messages_list').append(li);
        document.querySelector('.message').value = "";
    });

});