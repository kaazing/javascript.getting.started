# JavaScript Starter Application

This is a reference implementation of a ReactJS Application that communicates with Kaazing WebSocket Gateway.  
Application is implemented using [Kaazing JavaScript Universal Client](https://github.com/kaazing/universal-client/tree/develop/javascript).

Application communicates to Kaazing Messaging Sandbox (http://sandbox.kaazing.com/messaging).

## Installation
Application is installed using NPM

```bash
npm install
```

### Running the application

Application is supplied with NodeJS server component (server.js) that can be used to run application.


```bash
node server.js
```

Point your browser to http://localhost:3000


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
