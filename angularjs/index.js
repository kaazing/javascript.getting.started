'use strict';

angular.module("webSocketApp", ['KaazingClientService'])
	.constant('connectionInfo', {
		URL: "ws://localhost:8001/amqp",
		TOPIC_PUB: "websocket-starter",
		TOPIC_SUB: "websocket-starter",
		username: "guest",
		password: "guest"
	})
	.controller("mainCtl", function ($scope, $log, $timeout, connectionInfo,AngularUniversalClient) {
		$scope.messageCounter=1;
		$scope.message="No data yet!";

		$scope.sendMessageOnClick=function(){
			AngularUniversalClient.sendMessage("Message " + $scope.messageCounter + " is sent!");
			$scope.messageCounter++;
		}

		$scope.onMessage=function(msg){
			$log.info("Received server message: "+msg);
			$timeout(function(){$scope.message=msg;}, 100);
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
				AngularUniversalClient.sendMessage("Initial message is sent!")
			});
	});
