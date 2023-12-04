// static/script.js
function sendMessage() {
    let userInput = document.getElementById('user-input').value;

    // Display user message
    appendMessage('You', userInput);

    // Send user message to Flask backend
    fetch('/generate_response', {
        method: 'POST',
        body: new URLSearchParams({ 'user_input': userInput }),
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
    })
    .then(response => response.json())
    .then(data => {
        // Display bot response
        appendMessage('Bot', data.bot_response);

        // Display the image
        appendImage(data.image_url);

    const img = document.createElement('img-response');
    img.src = data.image_url;
    console.log(data.image_url);
    document.body.appendChild(img);
    })
    .catch(error => console.error('Error:', error));    
}


function appendMessage(sender, message) {
    let chatContainer = document.getElementById('chat');
    chatContainer.innerHTML += `<p><strong>${sender}:</strong> ${message}</p>`;
}

function appendImage(imageUrl) {
    let chatContainer = document.getElementById('chat');
    let img = document.createElement('img');
    img.src = imageUrl;
    img.classList.add('img-response'); // Add the class to the image
    chatContainer.appendChild(img);
}
