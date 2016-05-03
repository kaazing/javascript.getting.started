'use strict';

/* index.js - this is the client ReactJS javascript code for the ReactJS starter app
 * This shows the basic process for establishing a WebSocket connection and sending/receiving messages
 * It makes use of the Kaazing Javascript UniversalClient library
 */

var clientID = "Client" + Math.random().toString(36).substring(2, 15); // generate a random ID

var StarterAppLabel = React.createClass({
    createMessage: function () {
        return {__html: this.props.message };
    },

    render: function () {
        return (
            <span ref="currentMessage" dangerouslySetInnerHTML={this.createMessage()}/>
        );
    }
});

var StarterAppButton = React.createClass({ // the "Send Message" Button"
    getInitialState: function () {
        return {messageCounter: 2, messageToSend: "Message 1 is sent!"};
    },
    onChange: function (event) {
        this.setState({messageToSend: event.target.value});
    },
    sendMessageOnClick: function () {
        var messageToSend = "From " + clientID + ": " + this.refs.messageToSend.value;
        this.props.subscription.sendMessage({message: messageToSend});
        this.setState({messageCounter: this.state.messageCounter + 1});
        this.setState({messageToSend: "Message " + this.state.messageCounter + " sent!"});
    },
    render: function () {
        return (
            <div>
                <input type="text" ref="messageToSend" onChange={this.onChange} value={this.state.messageToSend}/>
                <button type="button" className="btn btn-primary" onClick={this.sendMessageOnClick}>
                    Send Message
                </button>
            </div>
        )
    }
});

var StarterApp = React.createClass({ // the application itself
    getInitialState: function () {
        var client = UniversalClientDef("amqp");
        return { client: client, message: "", subscription: {} };
    },
    onMessage: function (msg) {
        console.log("Received from server: " + msg.message);
        var text = this.state.message;
        if (text.length) {
            text += "<br />"
        }
        this.setState({message: text + msg.message});
    },
    onError: function (err) { // replace this with your own error handler
        alert(err);
    },
    onConnected: function () {
        this.state.subscription.sendMessage({message: "From " + clientID + ": Initial message sent!"});
    },
    componentDidMount: function () {
        var that = this;
        this.state.client.connect(this.props.connectionInfo,
            this.onError,                // callback to process errors
            function (conn) {
                conn.subscribe(
                    that.props.pubTopic, // Topic to send messages
                    that.props.subTopic, // Topic to subscribe to receive messages
                    that.onMessage,      // callback function to process received message
                    false,               // noLocal flag - setting this to 'false' allows you to receive your own messages
                    function (subscr) {
                        console.info("Subscription is created " + subscr);
                        that.setState({subscription: subscr});
                        that.onConnected();
                    }
                );
            }
        );
    },
    componentWillUnmount: function () {
        this.state.client.close();
    },
    render: function () {
        return (
            <div>
                <StarterAppButton subscription={this.state.subscription}/>
                <div className="panel panel-default">
                    <div className="panel-heading">
                        <h5 className="panel-title">Received from the server</h5>
                    </div>
                    <div className="text-left panel-body">
                        <StarterAppLabel message={this.state.message}/>
                    </div>
                </div>
            </div>
        );
    }
});

var connectionInfo = {
    url: "wss://sandbox.kaazing.net/amqp091", // URL to Kaazing's public sandbox for WebSocket testing
    username: "guest",
    password: "guest"
};
var topicPub = "websocket-starter"; // the 'publication' topic in pub-sub
var topicSub = "websocket-starter"; // the matching 'subscription' topic in pub-sub

function render() {
    ReactDOM.render(
        <StarterApp connectionInfo={connectionInfo} pubTopic={topicPub} subTopic={topicSub}/>,
        document.getElementsByClassName('websocketapp')[0]
    );
}

render();
