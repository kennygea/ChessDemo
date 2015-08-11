// This is the main file of our chat app. It initializes a new 
// express.js instance, requires the config and routes files
// and listens on a port. Start the application by running
// 'node app.js' in your terminal

var easyrtc = require("easyrtc");
var express = require('express'),
	app = express();
// This is needed if the app is run on heroku:

var port = process.env.PORT || 8080;

// Initialize a new socket.io object. It is bound to 
// the express app, which allows them to coexist.

var io = require('socket.io').listen(app.listen(port));

// Require the configuration and the routes files, and pass
// the app and io as arguments to the returned functions.

require('./config')(app, io);
require('./routes')(app, io);

/*
var myIceServers = [{url: "stun:stun.l.google.com:19302"},
{url: "stun:stun.sipgate.net"},
{url: "stun:217.10.68.152"},
{url: "stun:stun.sipgate.net:10000"},
{url: "stun:217.10.68.152:10000"},
{
	url: 'turn:numb.viagenie.ca',
	credential: 'freepp0808',
	username: 'kennygea@mit.edu'
}];

easyrtc.setOption("appIceServers", myIceServers);
*/
easyrtc.setOption("roomAutoCreateEnable", true);
easyrtc.setOption("roomDefaultEnable", false); 
var rtc = easyrtc.listen(app, io);


console.log('Your application is running on http://localhost:' + port);

