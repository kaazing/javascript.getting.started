/*jshint quotmark:false */
/*jshint white:false */
/*jshint trailing:false */
/*jshint newcap:false */
/*global React */
var clientID="Client"+Math.random().toString(36).substring(2, 15);

var StarterAppLabel = React.createClass({
	createMessage:function(){
		return {__html: this.props.message};
	},

	render: function () {
		return (
			<span  ref="currentMessage" dangerouslySetInnerHTML={this.createMessage()}/>
		);
	}
});

var StarterAppButton = React.createClass({
	getInitialState:function(){
		return {messageCounter:1, messageToSend:"Message 1 is sent!"};
	},
	onChange: function(event) {
		this.setState({messageToSend: event.target.value});
	},
	sendMessageOnClick: function () {
		var messageToSend="From "+clientID+": "+this.refs.messageToSend.value;
		this.props.client.sendMessage({message:messageToSend});
		this.setState({messageCounter:this.state.messageCounter+1});
		this.setState({messageToSend:"Message "+this.state.messageCounter+" is sent!"});
	},
	render: function () {
		return (
			<div>
				<input type="text" ref="messageToSend" onChange={this.onChange} value={this.state.messageToSend}/>
				<button
					type="button"
					className="btn btn-primary"
					onClick={this.sendMessageOnClick}>
					Send Message
				</button>
			</div>
		)
	}
});

var StarterApp = React.createClass({
	getInitialState: function () {
		var client = UniversalClientDef("amqp");
		return {client:client, message:""};
	},
	onMessage:function(msg){
		console.log("Received from server: "+msg.message);
		var text=this.state.message;
		if (text.length!=0){
			text+="<br />"
		};

		this.setState({message:text+msg.message});
	},
	onError:function(err){
		alert(err);
	},
	onConnected:function(){
		this.state.client.sendMessage({message:"From "+clientID+": Initial message is sent!"});
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
				<div className="panel panel-default">
					<div className="panel-heading">
						<h5 className="panel-title">Received from the server</h5>
					</div>
					<div className="text-left panel-body">
						<StarterAppLabel message={this.state.message} />
					</div>
				</div>
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