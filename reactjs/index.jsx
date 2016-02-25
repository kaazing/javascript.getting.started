/*jshint quotmark:false */
/*jshint white:false */
/*jshint trailing:false */
/*jshint newcap:false */
/*global React */
var app = app || {};

app.messageCounter = 1;

var StarterAppLabel = React.createClass({
	render: function () {
		return (
			<h5>Received from the server
				<span className="label label-success">{this.props.message}</span>
			</h5>

		);
	}
});

var StarterAppButton = React.createClass({
	getInitialState:function(){
		return {messageCounter:1};
	},
	sendMessageOnClick: function () {
		this.props.client.sendMessage({message:"Message " + this.state.messageCounter + " is sent!"});
		this.setState({messageCounter:this.state.messageCounter+1});
	},
	render: function () {
		return (
			<button
				type="button"
				className="btn btn-primary"
				onClick={this.sendMessageOnClick}>
				Send Message
			</button>
		)
	}
});

var StarterApp = React.createClass({
	getInitialState: function () {
		var client = UniversalClientDef("amqp");
		return {client:client, message:"No data yet!"};
	},
	onMessage:function(msg){
		console.log("Received from server: "+msg.message);
		this.setState({message:msg.message});
	},
	onError:function(err){
		alert(err);
	},
	onConnected:function(){
		this.state.client.sendMessage({message:"Initial message is sent!"});
	},
	componentDidMount: function () {
		this.state.client.connect(
			this.props.connectionInfo.URL, // URL to connect
			this.props.connectionInfo.username, // User name
			this.props.connectionInfo.password, // User password
			this.props.connectionInfo.TOPIC_PUB, // Topic to send messages
			this.props.connectionInfo.TOPIC_SUB, // Topic to subscribe to receive messsages
			false, // noLocal flag set to false - allow receiving your own messages
			this.onMessage, // callback function to process received message
			this.onError, // callback function to process errors
			null, // no callback function to dologging
			this.onConnected // function to call when the connection is established
		);
	},
	render: function () {
		return (
			<div>
				<StarterAppLabel message={this.state.message} />
				<StarterAppButton client={this.state.client}/>
			</div>
		);
	}
});

var connectionInfo = {
	URL: "ws://localhost:8001/amqp",
	TOPIC_PUB: "websocket-starter",
	TOPIC_SUB: "websocket-starter",
	username: "guest",
	password: "guest"
};

function render() {
	ReactDOM.render(
		<StarterApp connectionInfo={connectionInfo}/>,
		document.getElementsByClassName('websocketapp')[0]
	);
}

render();