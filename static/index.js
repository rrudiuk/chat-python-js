document.addEventListener('DOMContentLoaded', () => {

    // Create localStorage instance
    myStorage = window.localStorage;

    var channels_count = myStorage.length;

    // If there is no saved username, show form to add it
    if (myStorage.getItem('messenger_username') === null) {
        document.querySelector('#new_user').style.display = 'block'; 
        document.querySelector('#old_user').style.display = 'none'; 
    } else {
        // Hide username form and show channels
        document.querySelector('#new_user').style.display = 'none'; 
        document.querySelector('#old_user').style.display = 'block';
        document.querySelector('#old_user > h1').innerHTML = 
        "Hi " + myStorage.getItem('messenger_username') + "!";
    }

    // Create username functionality
    document.querySelector(".login-btn").onclick = () => {
        const tmp_username = document.querySelector('.username').value;
        if(tmp_username !== "") {
            username = tmp_username;
            myStorage.setItem('messenger_username', username)
            document.querySelector('#new_user').style.display = 'none'; 
            document.querySelector('#old_user').style.display = 'block';
        }
    };

});