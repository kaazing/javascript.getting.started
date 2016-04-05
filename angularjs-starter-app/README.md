# JavaScript Starter Application

This is a reference implementation of an AngularJS Application that communicates with the Kaazing WebSocket Gateway.  
This application is implemented using the [Kaazing JavaScript Universal Client](https://github.com/kaazing/universal-client/tree/develop/javascript).

The application communicates uses the Kaazing Messaging Sandbox, a gateway hosted by Kaazing at sandbox.kaazing.com/messaging for use in rapid prototyping.

## Installation
The application is installed using NPM

```bash
npm install
```

### Running the application

The application is supplied with NodeJS server component (server.js) that can be used to run the application.


```bash
node server.js
```

Point your browser to http://localhost:3000

You should see in the "Received from server” window, a message similar to: "From Client4a0xlat9w5t2f: Initial message is sent!" When you click on the "Send Message" button, you will see in the "Received from server" window message similar to "From Client4a0xlat9w5t2f: Message 1 is sent!" where "Message 1 is sent" should match the text in the input control.
