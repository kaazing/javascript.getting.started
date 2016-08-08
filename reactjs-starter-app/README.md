# ReactJS Starter Application

This is a reference implementation of a ReactJS Application that communicates with the Kaazing WebSocket Gateway.  
The application is implemented using the [Kaazing JavaScript Universal Client](https://github.com/kaazing/universal-client/tree/develop/javascript).

The application communicates uses the Kaazing Messaging Sandbox, a gateway hosted by Kaazing at sandbox.kaazing.com/messaging for use in rapid prototyping.

## Installation
The application is installed using NPM.

Make sure you are in the `/reactjs-starter-app/` subdirectory then:

```bash
npm install
```

### Running the application

The application is supplied with a NodeJS server component (server.js) that can be used to run the application.


```bash
node server.js
```

Point your browser to http://localhost:3000

You should see in the "Received from server” window, a message similar to: "From Client4a0xlat9w5t2f: Initial message is sent!" When you click on the "Send Message" button, you will see in the "Received from server" window message similar to "From Client4a0xlat9w5t2f: Message 1 is sent!" where "Message 1 is sent" should match the text in the input control.

#### Running directly from the Browser (Chrome)
If you were to drag the index.html file into Chrome, the application will not start and the Chrome console will show this error:

__Cross origin requests are only supported for protocol schemes: http, data, chrome, chrome-extension, https, chrome-extension-resource.__

The error is normal, as Chrome cannot load .jsx file directly. To make it work:

Start chrome with the following switch: _--allow-file-access-from-files_

On Mac Os X
```bash
open -a 'Google Chrome' --args -allow-file-access-from-files
```

On other *nix run (not tested)

```bash
google-chrome  --allow-file-access-from-files
```

or on windows edit the properties of the chrome shortcut and add the switch, e.g.

```
 C:\ ... \Application\chrome.exe --allow-file-access-from-files
```
