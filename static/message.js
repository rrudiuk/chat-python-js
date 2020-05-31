
document.addEventListener('DOMContentLoaded', () => {

    // Create localStorage instance
    myStorage = window.localStorage;

    // Connect to websocket
    var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

    // When connected, configure buttons
    socket.on('connect', () => {

        document.querySelector('.send-message').onclick = () => {

            const message_text = document.querySelector('#message').value;
            socket.emit('submit message', {'message_text': message_text});
        };

        // Execute a function when the user releases a key on the keyboard
        document.addEventListener("keyup", function(event) {
            // Number 13 is the "Enter" key on the keyboard
            if (event.keyCode === 13) {
                const message = document.querySelector('#message').value;
                if (message != "") {
                    let message_text = `${myStorage.getItem('messenger_username')}: ${message}`
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
        document.querySelector('#message').value = "";
    });

});