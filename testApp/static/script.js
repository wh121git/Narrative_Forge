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
    });
}

function appendMessage(sender, message) {
    let chatContainer = document.getElementById('chat');
    chatContainer.innerHTML += `<p><strong>${sender}:</strong> ${message}</p>`;
}
