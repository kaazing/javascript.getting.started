'use strict';

angular.module("webSocketApp", ['ngSanitize'])
	.controller("mainCtl", function ($scope, $log, $timeout) {
		var connectionInfo = {
			url: "ws://localhost:8001/amqp",// URL to connect
			username: "guest",// User name
			password: "guest"// User password
		};
		var TOPIC_PUB="websocket-starter";
		var	TOPIC_SUB="websocket-starter";

		$scope.clientID="Client"+Math.random().toString(36).substring(2, 15);
		$scope.messageCounter=1;
		$scope.message="";
		$scope.messageToSend=null;

		$scope.client = UniversalClientDef("amqp");
		$scope.subscription={};

		$scope.onMessage=function(msg){
			$log.info("Received server message: "+msg.message);
			var text=$scope.message.trim();
			if (text.length!=0){
				text+="<br/>"
			};

			// Need a small timeout for the angular binding to work
			$timeout(function(){$scope.message=text+msg.message;}, 100);

		}

		$scope.onError=function(err){
			alert(err);
		}

		$scope.client.connect(connectionInfo, // Connection info
			$scope.onError, // callback function to process errors
			function(connection){
				connection.subscribe(TOPIC_PUB, // Topic to send message
					TOPIC_SUB, // Topic to subscribe to receive messsages
					$scope.onMessage, // callback function to process received message
					false, // noLocal flag set to false - allow receiving your own messages
					function(subscr){
						console.info("Subscription is created "+subscr);
						$scope.subscription=subscr;
						$scope.subscription.sendMessage({message:"From "+$scope.clientID+": Initial message is sent!"})
						$scope.messageToSend="Message " + $scope.messageCounter + " is sent!";
					});
			}
		);
		$( window ).unload(function() {
			$scope.client.disconnect();
		});

		$scope.sendMessageOnClick=function(){
			$scope.subscription.sendMessage({message:"From "+$scope.clientID+": "+$scope.messageToSend});
			$scope.messageCounter++;
			$scope.messageToSend="Message " + $scope.messageCounter + " is sent!"
		}

	});
