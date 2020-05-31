document.addEventListener('DOMContentLoaded', () => {

    // Create localStorage instance
    myStorage = window.localStorage;

    var channels_count = myStorage.length;

    // Show the list of existing channels
    if (channels_count > 2) {
        for (let i = 2; i < myStorage.length; i++) {
            let channel = myStorage.getItem(i);
            const input = document.createElement('input');
            input.setAttribute('type', 'radio');
            input.setAttribute('value', channel);
            input.setAttribute('name', 'channel');
            input.setAttribute('onclick', 'this.form.submit()');
            const label = document.createElement('label');
            label.setAttribute('for', channel);
            label.innerHTML = channel;
            document.querySelector('#radio').appendChild(input);
            document.querySelector('#radio').appendChild(label);
            const br = document.createElement('br');
            document.querySelector('#radio').appendChild(br);
        }
    }

    // If there is no saved username, show form to add it
    if (myStorage.getItem('messenger_username') === null) {
        document.querySelector('#new_user').style.display = 'block'; 
        document.querySelector('#old_user').style.display = 'none'; 
    } else {
        // Hide username form and show channels
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

    // Create new channel and display it
    document.querySelector('.create-chat').onclick = () => {
        const new_channel = document.querySelector('.new-channel').value;
        if (new_channel.length > 0 && new_channel.length < 64) {
            new_channel_key = myStorage.length;
            myStorage.setItem(new_channel_key, new_channel);

            const input = document.createElement('input');
            input.setAttribute('type', 'radio');
            input.setAttribute('value', new_channel);
            input.setAttribute('name', 'channel');
            input.setAttribute('onclick', 'this.form.submit()');
            const label = document.createElement('label');
            label.setAttribute('for', new_channel);
            label.innerHTML = new_channel;
            document.querySelector('#radio').appendChild(input);
            document.querySelector('#radio').appendChild(label);
            const br = document.createElement('br');
            document.querySelector('#radio').appendChild(br);
        }   
    };

});