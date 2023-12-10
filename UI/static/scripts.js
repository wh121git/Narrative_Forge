/*!
* Start Bootstrap - Freelancer v7.0.7 (https://startbootstrap.com/theme/freelancer)
* Copyright 2013-2023 Start Bootstrap
* Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-freelancer/blob/master/LICENSE)
*/
//
// Scripts
// 

window.addEventListener('DOMContentLoaded', event => {

    // Navbar shrink function
    var navbarShrink = function () {
        const navbarCollapsible = document.body.querySelector('#mainNav');
        if (!navbarCollapsible) {
            return;
        }
        if (window.scrollY === 0) {
            navbarCollapsible.classList.remove('navbar-shrink')
        } else {
            navbarCollapsible.classList.add('navbar-shrink')
        }

    };

    // Shrink the navbar 
    navbarShrink();

    // Shrink the navbar when page is scrolled
    document.addEventListener('scroll', navbarShrink);

    // Activate Bootstrap scrollspy on the main nav element
    const mainNav = document.body.querySelector('#mainNav');
    if (mainNav) {
        new bootstrap.ScrollSpy(document.body, {
            target: '#mainNav',
            rootMargin: '0px 0px -40%',
        });
    };

    // Collapse responsive navbar when toggler is visible
    const navbarToggler = document.body.querySelector('.navbar-toggler');
    const responsiveNavItems = [].slice.call(
        document.querySelectorAll('#navbarResponsive .nav-link')
    );
    responsiveNavItems.map(function (responsiveNavItem) {
        responsiveNavItem.addEventListener('click', () => {
            if (window.getComputedStyle(navbarToggler).display !== 'none') {
                navbarToggler.click();
            }
        });
    });

});

var selectedOption; // Variable to store the selected option
var storyScale = ['Introduction', 'Rising Action', 'Climax', 'Falling Action', 'Conclusion'];
var scalePosition = 0;

// Function to update the story scale display
function updateScale() {
    var scalePositionElement = document.getElementById("scalePosition");
    scalePositionElement.innerText = storyScale[scalePosition];
}
// retrieves the input from the usera and displays the input on the page
function handleInput() {
    var userInput = document.getElementById("myInput").value;
    var displayArea = document.getElementById("displayArea");
    displayArea.innerHTML = "<p>You entered: " + userInput + "</p>";
    // remember this clears the text area
    document.getElementById("myInput").value = "";

    // Show the option buttons after displaying the text
    document.getElementById("optionButtons").style.display = "block";

    // Show the image container after displaying the buttons
    document.getElementById("imageContainer").style.display = "flex";

}

// Sidebar stuff
function w3_open() {
    var sidebar = document.getElementById("mySidebar");
    sidebar.style.display = "block";
    sidebar.classList.add("teal-background");
}

function w3_close() {
    var sidebar = document.getElementById("mySidebar");
    sidebar.style.display = "none";
    sidebar.classList.remove("teal-background");
}

// get the selected option
function selectOption(option) {
    // Set the value of the textarea
    document.getElementById('myInput').value = option;

     // Move to the next stop in the story scale
     if (scalePosition < storyScale.length - 1) {
        scalePosition++;
        updateScale();
    // Call the sendMessage function
    sendMessage();    
    }

    // Check if it's the last stop, then disable the buttons
    if (scalePosition === storyScale.length - 1) {
        disableOptionButtons();
    }
}

        // Function to disable the option buttons
    function disableOptionButtons() {
    document.getElementById("optionButtons").style.pointerEvents = "none";
    alert("You have reached the end of the story, you can no longer change the narrative. Thanks for using our application!");
}

// js/script.js




function sendMessage() {
    let userInput = document.getElementById('myInput').value;

    // Display user message
    appendMessage('You', userInput);

    // Send user message to Flask backend
    fetch('/generate_response', {
        method: 'POST',
        body: `myInput=${encodeURIComponent(userInput)}`,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
    })
    .then(response => response.json())
    .then(data => {

    appendMessage('Bot', data.bot_response);

    fetch('/write_to_file', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },              
        body: JSON.stringify({
            user: userInput,
            bot: data.bot_response,
        }),
    });

        // Get the displayArea div
    let displayArea = document.getElementById('displayArea');

    
    // Split response - Will's version
    let responseArray = data.bot_response.split(" ");

    // Format Text
    responseArray.forEach(word => {
        if(word == "Option")
        {
            word = "\nOption";
        }
    });

    // Set the innerHTML of the displayArea div to the response text
    // displayArea.innerHTML = data.bot_response;
    





    // // spliiting response - Hibah's version
    // let responseArray = data.bot_response.split(" ");

    // responseArray = responseArray.map(word => {
    //     if (word === "Option") {
    //         return "\nOption";
    //     }
    //     return word;
    // });

    // let formattedResponse = responseArray.join(" ");





    
    // Set the innerHTML of the displayArea div to the response text
    // displayArea.innerHTML = data.bot_response;

    // Make the displayArea visible
    displayArea.style.display = 'block';

        // Get the image URL from the response
    let imageUrl = data.image_url;

    // Create an img element
    let img = document.createElement('img');
    img.src = imageUrl;

    // Append the img element to the imageContainer
    let imageContainer = document.getElementById('imageContainer');
    imageContainer.appendChild(img);

    // Make the imageContainer visible
    imageContainer.style.display = 'flex';
})
.catch(error => console.error('Error:', error));

    // const img = document.createElement('img-response');
   // img.src = data.image_url;
    //console.log(data.image_url);
   // document.body.appendChild(img);
   // })
    //.catch(error => console.error('Error:', error));    
}

    
function sanitizeHTML(text) {
    const element = document.createElement('div');
    element.innerText = text;
    return element.innerHTML;
}

function appendMessage(sender, message) {
    let chatContainer = document.getElementById('displayArea');
    chatContainer.innerHTML = `<b>${sender}</b>: <p style="white-space: pre-line;">${sanitizeHTML(message)}</p>`;
}

function appendImage(imageUrl) {
    let chatContainer = document.getElementById('imageContainer');
    let img = document.createElement('img');
    img.src = imageUrl;
    img.classList.add('img-response'); // Add the class to the image
    chatContainer.appendChild(img);
}




