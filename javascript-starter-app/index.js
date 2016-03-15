var clientID="Client"+Math.random().toString(36).substring(2, 15);
var messageCounter = 1;
var client = UniversalClientDef("amqp");
var connectionInfo = {
	url: "ws://localhost:8001/amqp",// URL to connect
	username: "guest",// User name
	password: "guest"// User password
};
var TOPIC_PUB="websocket-starter";
var	TOPIC_SUB="websocket-starter";
var subscription={};

var onMessage=function(msg) {
	console.log("Received from the server: " + msg.message);
	var text=$('#server-data').html().trim();
	if (text.length!=0){
		text+="<br/>"
	};
	$('#server-data').html(text+msg.message);
};

var onError=function(err) {
	alert(err);
};

client.connect(connectionInfo, // Connection info
				onError, // callback function to process errors
				function(connection){
					connection.subscribe(TOPIC_PUB, // Topic to send message
										 TOPIC_SUB, // Topic to subscribe to receive messsages
											onMessage, // callback function to process received message
											false, // noLocal flag set to false - allow receiving your own messages
						function(subscr){
							console.info("Subscription is created "+subscr);
							subscription=subscr;
							subscription.sendMessage({message:"From "+clientID+": Initial message is sent!"});
							$('#messageToSend').val("Message " + messageCounter + " is sent!");
						});
					}
				);
$( window ).unload(function() {
	// TODO: Disconnect
	client.close();
});


// Handle the click on the button and send the message
var sendMessageOnClick = function () {
	var message="From "+clientID+": "+$('#messageToSend').val();
	subscription.sendMessage({message:message});
	messageCounter++;
	$('#messageToSend').val("Message " + messageCounter + " is sent!");
}
