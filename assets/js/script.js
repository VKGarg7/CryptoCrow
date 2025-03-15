'use strict';

/**
 * add event on element
 */

const addEventOnElem = function (elem, type, callback) {
  if (elem.length > 1) {
    for (let i = 0; i < elem.length; i++) {
      elem[i].addEventListener(type, callback);
    }
  } else {
    elem.addEventListener(type, callback);
  }
}

/**
 * navbar toggle
 */

const navbar = document.querySelector("[data-navbar]");
const navbarLinks = document.querySelectorAll("[data-nav-link]");
const navToggler = document.querySelector("[data-nav-toggler]");

const toggleNavbar = function () {
  navbar.classList.toggle("active");
  navToggler.classList.toggle("active");
  document.body.classList.toggle("active");
}

addEventOnElem(navToggler, "click", toggleNavbar);

const closeNavbar = function () {
  navbar.classList.remove("active");
  navToggler.classList.remove("active");
  document.body.classList.remove("active");
}

addEventOnElem(navbarLinks, "click", closeNavbar);

/**
 * header active
 */

const header = document.querySelector("[data-header]");

const activeHeader = function () {
  if (window.scrollY > 300) {
    header.classList.add("active");
  } else {
    header.classList.remove("active");
  }
}

addEventOnElem(window, "scroll", activeHeader);

/**
 * toggle active on add to fav
 */

const addToFavBtns = document.querySelectorAll("[data-add-to-fav]");

const toggleActive = function () {
  this.classList.toggle("active");
}

addEventOnElem(addToFavBtns, "click", toggleActive);

/**
 * scroll revreal effect
 */

const sections = document.querySelectorAll("[data-section]");

const scrollReveal = function () {
  for (let i = 0; i < sections.length; i++) {
    if (sections[i].getBoundingClientRect().top < window.innerHeight / 1.5) {
      sections[i].classList.add("active");
    } else {
      sections[i].classList.remove("active");
    }
  }
}

scrollReveal();

document.addEventListener('DOMContentLoaded', function() {
  var button = document.querySelector('.btn-primary');
  var chatInputSection = document.querySelector('.chat-input-section');

  button.addEventListener('click', function() {
    chatInputSection.scrollIntoView({ behavior: 'smooth' });
  });
});

addEventOnElem(window, "scroll", scrollReveal);

document.getElementById('chatButton').addEventListener('click', function() {
  const userQuery = document.getElementById('userQuery').value;
  console.log('User query:', userQuery);

  initiateChat(userQuery);
});



/**
 * integrate chat functionality
 */

const initiateChat = async (userQuery) => {
  try {
    console.log("inside initiateChat")
    const sessionResponse = await fetch('https://gateway-dev.on-demand.io/chat/v1/sessions', {
      method: 'POST',
      headers: {
        'apikey': '5kq5vek7dnWiXAHUlAikryDf8HS5JV6t',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "pluginIds": ["plugin-1715808194"],
        "externalUserId": "Code_mavericks"
      })
    });
    if (!sessionResponse.ok) {
      const sessionErrorData = await sessionResponse.json();
      console.error('Session creation failed:', sessionErrorData);
      throw new Error('Failed to create chat session');
    }

    const sessionData = await sessionResponse.json();
    const sessionId = sessionData.chatSession.id;

    const queryResponse = await fetch(`https://gateway-dev.on-demand.io/chat/v1/sessions/${sessionId}/query`, {
      method: 'POST',
      headers: {
        'apikey': '5kq5vek7dnWiXAHUlAikryDf8HS5JV6t',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "endpointId": "predefined-openai-gpt4o",
        "query": userQuery,
        "pluginIds": ["plugin-1717412985"],
        "responseMode": "sync"
      })
    });
    console.log("line-146",queryResponse);
    if (!queryResponse.ok) {
      const queryErrorData = await queryResponse.json();
      console.error('Query processing failed:', queryErrorData);
      throw new Error('Failed to process query');
    }

    const responseData = await queryResponse.json();
    console.log(responseData); // Handle the response data as needed
    var ans = responseData.chatMessage.answer
    console.log(ans)
    responseNew(ans)
  } catch (error) {
    console.error('Error:', error);
    // Handle errors gracefully
  }
}

function responseNew(input){
  const responseData = input;
  // document.getElementById('ResponseToUser').value = input;
  document.getElementById('response').innerHTML = `<p>${input}</p>`;

}

// Add event listener for initiating chat
// const chatButton = document.getElementById('chatButton'); // Replace 'chatButton' with the ID of your chat button
// chatButton.addEventListener('click', initiateChat);
