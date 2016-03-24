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
		return {messageCounter:2, messageToSend:"Message 1 is sent!"};
	},
	onChange: function(event) {
		this.setState({messageToSend: event.target.value});
	},
	sendMessageOnClick: function () {
		var messageToSend="From "+clientID+": "+this.refs.messageToSend.value;
		this.props.subscription.sendMessage({message:messageToSend});
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
		return {client:client, message:"", subscription:{}};
	},
	onMessage:function(msg){
		console.log("Received from server: "+msg.message);
		var text=this.state.message;
		if (text.length!=0){
			text+="<br />"
		};

		this.setState({message:text+msg.message});
	},
	onError:function(err){ // replace with your own error handler
		alert(err);
	},
	onConnected:function(){
		this.state.subscription.sendMessage({message:"From "+clientID+": Initial message is sent!"});
	},
	componentDidMount: function () {
		var that=this;
		this.state.client.connect(this.props.connectionInfo, // Connection info
			this.onError, // callback function to process errors
			function(connection){
				connection.subscribe(that.props.pubTopic, // Topic to send message
					that.props.subTopic, // Topic to subscribe to receive messsages
					that.onMessage, // callback function to process received message
					false, // noLocal flag set to false - allow receiving your own messages
					function(subscr){
						console.info("Subscription is created "+subscr);
						that.setState({subscription:subscr});
						that.onConnected();
					}
				);
			}
		);
	},
	componentWillUnmount: function(){
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
						<StarterAppLabel message={this.state.message} />
					</div>
				</div>
			</div>
		);
	}
});

var connectionInfo = {
	url: "ws://localhost:8001/amqp",// URL to connect
	username: "guest",// User name
	password: "guest"// User password
};
var TOPIC_PUB="websocket-starter";
var TOPIC_SUB="websocket-starter";

function render() {
	ReactDOM.render(
		<StarterApp connectionInfo={connectionInfo} pubTopic={TOPIC_PUB} subTopic={TOPIC_SUB}/>,
		document.getElementsByClassName('websocketapp')[0]
	);
}

render();
