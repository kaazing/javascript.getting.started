'use strict';

/* index.js - this is the client AngularJS code for the AngularJS starter app
 * This shows the basic process for establishing a WebSocket connection and sending/receiving messages
 * It makes use of jQuery (only to manipulate the DOM) as well as the Kaazing Javascript UniversalClient library
 */

angular.module("webSocketApp", ['ngSanitize'])
    .controller("mainCtl", function ($scope, $log, $timeout) {
        var connectionInfo = {
            url: "wss://demos.kaazing.com/amqp", // URL to Kaazing's public sandbox for WebSocket testing
            username: "guest",
            password: "guest"
        },
            topicPub = "websocket-starter", // the 'publication' topic in pub-sub
            topicSub = "websocket-starter"; // the matching 'subscription' topic in pub-sub

        $scope.clientID = "Client" + Math.random().toString(36).substring(2, 15); // generate a random ID
        $scope.messageCounter = 1;
        $scope.message = "";
        $scope.messageToSend = null;

        $scope.client = UniversalClientDef("amqp");
        $scope.subscription = {};

        $scope.onMessage = function (msg) {
            $log.info("Received server message: " + msg.message);
            var text = $scope.message.trim();
            if (text.length) {
                text += "<br/>";
            }
            // Need a small timeout for the angular binding to work
            $timeout(function () {
                $scope.message = text + msg.message;
            }, 100);
        };

        $scope.onError = function (err) { // replace this with your own error handler
            alert(err);
        };

        $scope.client.connect(connectionInfo,
            $scope.onError,           // callback to process errors
            function (conn) {
                conn.subscribe(
                    topicPub,         // Topic to send messages
                    topicSub,         // Topic to subscribe to receive messsages
                    $scope.onMessage, // callback function to process received message
                    false,            // noLocal flag - setting this to 'false' allows you to receive your own messages
                    function (sub) {
                        $scope.subscription = sub;
                        console.info("Subscription is created " + $scope.subscription);
                        $scope.subscription.sendMessage({message: "From " + $scope.clientID + ": Initial message is sent!"});
                        $scope.messageToSend = "Message " + $scope.messageCounter + " sent!";
                    });
            }
        );
        $(window).unload(function () {
            $scope.client.close();
        });

        $scope.sendMessageOnClick = function () {
            $scope.subscription.sendMessage({message: "From " + $scope.clientID + ": " + $scope.messageToSend});
            $scope.messageCounter++;
            $scope.messageToSend = "Message " + $scope.messageCounter + " is sent!";
        };

    });
