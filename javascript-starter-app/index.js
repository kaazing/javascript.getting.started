'use strict';

/* index.js - this is the client javascript code for the (vanilla) javascript starter app
 * This shows the basic process for establishing a WebSocket connection and sending/receiving messages
 * It makes use of jQuery (only to manipulate the DOM) as well as the Kaazing Javascript UniversalClient library
 */

var connectionInfo = {
    url: "wss://sandbox.kaazing.net/amqp091", // URL to Kaazing's public sandbox for WebSocket testing
    username: "guest",
    password: "guest"
};
var clientID = "Client" + Math.random().toString(36).substring(2, 15); // generate a random ID
var messageCounter = 1;
var client = UniversalClientDef("amqp");

var topicPub = "websocket-starter"; // the 'publication' topic in pub-sub
var topicSub = "websocket-starter"; // the matching 'subscription' topic in pub-sub
var subscription = {};
var msgToSend = $('#messageToSend'); // the DOM node for messages to send
var serverData = $('#server-data'); // the DOM node that will display messages from the server

var onMessage = function (msg) { // callback to process received messages
    console.log("Received from the server: " + msg.message);
    var text = serverData.html().trim();
    if (text.length) {
        text += "<br/>";
    }
    serverData.html(text + msg.message);
};

var onError = function (err) { // replace this with your own error handler
    alert(err);
};

client.connect(connectionInfo, // Connection info
    onError,           // callback to process errors
    function (conn) {
        conn.subscribe(
            topicPub,  // Topic to send message
            topicSub,  // Topic to subscribe to receive messages
            onMessage, // callback function to process received message
            false,     // noLocal flag - setting this to 'false' allows you to receive your own messages
            function (sub) {
                subscription = sub;
                console.info("Subscription is created " + subscription);
                subscription.sendMessage({ message: "From " + clientID + ": Initial message is sent!" });
                msgToSend.val("Message " + messageCounter + " sent!");
            });
    }
);
$(window).unload(function () {
    // TODO: Disconnect
    client.close();
});

// Handle the click on the button and send the message
var sendMessageOnClick = function () {
    var message = "From " + clientID + ": " + msgToSend.val();
    subscription.sendMessage({ message: message });
    messageCounter++;
    msgToSend.val("Message " + messageCounter + " sent!");
};