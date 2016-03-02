var clientID="Client"+Math.random().toString(36).substring(2, 15);
var messageCounter = 1;
var client = UniversalClientDef("amqp");
var connectionInfo = {
	URL: "ws://localhost:8001/amqp",
	TOPIC_PUB: "websocket-starter",
	TOPIC_SUB: "websocket-starter",
	username: "guest",
	password: "guest"
};
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

client.connect(
	connectionInfo.URL, // URL to connect
	connectionInfo.username, // User name
	connectionInfo.password, // User password
	connectionInfo.TOPIC_PUB, // Topic to send messages
	connectionInfo.TOPIC_SUB, // Topic to subscribe to receive messsages
	false, // noLocal flag set to false - allow receiving your own messages
	onMessage, // callback function to process received message
	onError, // callback function to process errors
	null, // no callback function to dologging
	function () { // function to call when the connection is established
		client.sendMessage({message:"From "+clientID+": Initial message is sent!"});
		$('#messageToSend').val("Message " + messageCounter + " is sent!");
	});

// Handle the click on the button and send the message
var sendMessageOnClick = function () {
	var message="From "+clientID+": "+$('#messageToSend').val();
	client.sendMessage({message:message});
	messageCounter++;
	$('#messageToSend').val("Message " + messageCounter + " is sent!");
}
