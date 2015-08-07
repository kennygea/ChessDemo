// This file is required by app.js. It sets up event listeners
// for the two main URL endpoints of the application - /create and /chat/:id
// and listens for socket.io messages.

// Use the gravatar module, to turn email addresses into avatar images:

var gravatar = require('gravatar');
var host = "";
var otherplayer = "";

// Export a function, so that we can pass 
// the app and io instances from the app.js file:

module.exports = function(app,io){

	app.get('/', function(req, res){
		res.render('home');
	});
	
	app.get('/conference/:id', function(req,res) {
	//Render conference
		res.render('conference');
	});

	app.get('/create', function(req,res){

		// Generate unique id for the room
		var id = Math.round((Math.random() * 1000000));

		// Redirect to the random room
		res.redirect('/chat/'+id);
	});

	app.get('/chat/:id', function(req,res){;
		// Render the chant.html view
		res.render('chat');

	});
	
	

	// Initialize a new socket.io application, named 'chat'
	var chat = io.on('connection', function (socket) {
		
		socket.on('set-new-player', function(selected) {
			otherplayer = selected;
			var roomData = findClientsSocket(io, this.room);
			var data = [];
			for (var i = 0; i < roomData.length; i++) {
				var user = roomData[i].username;
				var id = roomData[i].id;
				data.push({username: user, id: id});
			}
			for (var n = 0; n < data.length; n++) {
				var username = data[n].username;
				var id = data[n].id
				if (host === username || selected === username) {
					io.to(id).emit('set-playable', {p1: host, p2: selected, playable: true});
				}
				else {
					io.to(id).emit('set-playable',  {p1: host, p2: selected, playable: false});
				}
			}
		});
		
		
		socket.on('move', function(move) { //move object emitter
		  console.log('user moved: ' + JSON.stringify(move));
		  io.sockets.in(socket.room).emit('move', move);
		});	
		
		socket.on('update', function(fen) {
			io.sockets.in(socket.room).emit('refresh', fen);
		});
		
		// When the client emits the 'load' event, reply with the 
		// number of people in this chat room

		socket.on('load',function(data){
			var room = findClientsSocket(io,data);
			if(room.length === 0 ) {
				socket.emit('peopleinchat', {number: 0});
				
			}
			else if(room.length >= 1) {

				socket.emit('peopleinchat', {
					number: room.length,
					user: room[0].username,
					avatar: room[0].avatar,
					id: data
				});
			}
			else if(room.length >= 5) {

				chat.emit('tooMany', {boolean: true});
			}
		});

		// When the client emits 'login', save his name and avatar,
		// and add them to the room
		socket.on('login', function(data) {
			var room = findClientsSocket(io, data.id);
			// Only five people per room are allowed
			if (room.length === 0) {
				host = data.user;
				socket.emit("sethost", host);
			}
			if (room.length < 5) {
				if (room.length >= 1) {
					socket.broadcast.emit('new-user', "test");
					socket.emit("set-params", {p1: host, p2: otherplayer});
				}
				// Use the socket object to store data. Each client gets
				// their own unique socket object

				socket.username = data.user;
				socket.room = data.id;
				socket.avatar = gravatar.url(data.avatar, {s: '140', r: 'x', d: 'mm'});

				// Tell the person what he should use for an avatar
				socket.emit('img', socket.avatar);


				// Add the client to the room
				socket.join(data.id);

				if (room.length >= 1) {

					var usernames = [],
						avatars = [];
					
					for (var i = 0; i < room.length; i++) {
					
						usernames.push(room[i].username);
						avatars.push(room[i].avatar);
					}
					usernames.push(socket.username);

					
					avatars.push(socket.avatar);
					
					io.sockets.in(socket.room).emit("users", usernames);

					// Send the startChat event to all the people in the
					// room, along with a list of people that are in it.

					chat.in(data.id).emit('startChat', {
						boolean: true,
						id: data.id,
						users: usernames,
						avatars: avatars
					});
				}
			}
			else {
				socket.emit('tooMany', {boolean: true});
			}
		});

		// Somebody left the chat
		socket.on('disconnect', function() {

			// Notify the other person in the chat room
			// that his partner has left
			var roomData = findClientsSocket(io, this.room);

			socket.broadcast.to(this.room).emit('leave', {
				boolean: true,
				room: this.room,
				user: this.username,
				avatar: this.avatar,
				part: roomData.length
			});

			// leave the room
			//socket.leave(socket.room);
		});
		
		//Handles new host
		socket.on('set-new-host', function(selected) {
			host = selected;
			io.sockets.in(socket.room).emit('sethost', selected);
		});


		// Handle the sending of messages
		socket.on('msg', function(data){

			// When the server receives a message, it sends it to the other person in the room.
			socket.broadcast.to(socket.room).emit('receive', {msg: data.msg, user: data.user, img: data.img});
		});
	});
};

function findClientsSocket(io,roomId, namespace) {
	var res = [],
		ns = io.of(namespace ||"/");    // the default namespace is "/"

	if (ns) {
		for (var id in ns.connected) {
			if(roomId) {
				var index = ns.connected[id].rooms.indexOf(roomId) ;
				if(index !== -1) {
					res.push(ns.connected[id]);
				}
			}
			else {
				res.push(ns.connected[id]);
			}
		}
	}
	return res;
}


