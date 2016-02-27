'use strict';

angular.module("webSocketApp", ['KaazingClientService','ngSanitize'])
	.constant('connectionInfo', {
		URL: "ws://localhost:8001/amqp",
		TOPIC_PUB: "websocket-starter",
		TOPIC_SUB: "websocket-starter",
		username: "guest",
		password: "guest"
	})
	.controller("mainCtl", function ($scope, $log, $timeout, connectionInfo,AngularUniversalClient) {
		$scope.clientID="Client"+Math.random().toString(36).substring(2, 15);
		$scope.messageCounter=1;
		$scope.message="";
		$scope.messageToSend=null;

		$scope.sendMessageOnClick=function(){
			AngularUniversalClient.sendMessage({message:"From "+$scope.clientID+": "+$scope.messageToSend});
			$scope.messageCounter++;
			$scope.messageToSend="Message " + $scope.messageCounter + " is sent!"
		}

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

		AngularUniversalClient.connect(
			"amqp",
			connectionInfo.URL, // URL to connect
			connectionInfo.username, // User name
			connectionInfo.password, // User password
			connectionInfo.TOPIC_PUB, // Topic to send messages
			connectionInfo.TOPIC_SUB, // Topic to subscribe to receive messsages
			false, // noLocal flag set to false - allow receiving your own messages
			$scope.onMessage, // callback function to process received message
			$scope.onError, // callback function to process errors
			null, // no callback function to dologging
			function () { // function to call when the connection is established
				AngularUniversalClient.sendMessage({message:"From "+$scope.clientID+": Initial message is sent!"})
				$scope.messageToSend="Message " + $scope.messageCounter + " is sent!";
			});
	});
