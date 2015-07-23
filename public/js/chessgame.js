$(document).ready(function() {
		var socket = io();                        
		//initiated socket client
		var game = new Chess();
//		var id = Number(window.location.pathname.match(/\/chat\/(\d+)$/)[1]);
//		socket.emit('join', id);
		var userList = $('#connectedusers');
		
		
		$('#setStartBtn').on('click', function() {
			board.start(false);
			game.reset();
			var boardPosition = board.fen();
			socket.emit('update', {board: boardPosition, game: game.fen()}); 
		});
		
		$('#rotateBoard').on('click', function() {
			board.flip();
		});
		
    var onDrop = function(source, target, piece, newPos, oldPos, orientation) {
        //move object
        var moveObj = ({
          from: source,
          to: target,
          promotion: 'q' // NOTE: always promote to a queen for example simplicity
        });
        // see if the move is legal
        var move = game.move(moveObj);
        // illegal move
        if (move === null) {
          return 'snapback';
        }
        socket.emit('move', moveObj);
    };
	
	var onSnapEnd = function() {
            board.position(game.fen());
        };

	
        var cfg = {
            draggable: true,
            position: 'start',
            moveSpeed: 'slow',
            onDrop: onDrop,
			onSnapEnd: onSnapEnd,
            snapbackSpeed: 500,
            snapSpeed: 150,
        };
		
        var board = new ChessBoard('board', cfg);
		
		//Populates the user list
		
		socket.on("users", function(users) {
			console.log(users);
			userList.empty();
			for (var i = 0; i < users.length; i++) {
				console.log(users[i]);
				userList.append('<li id=list_' + users[i] + '>' + users[i] + '</li>');
			}
		});
		
		//Updates the new connect user to the current board position
		socket.on('new-user', function(string) {
			var boardPosition = board.fen();
			socket.emit('update', {board: boardPosition, game: game.fen()});
		});
		
		socket.on('refresh', function(fen) {
			var check = game.load(fen.game);
			board.position(fen.board, false);
		});
		
		socket.on('move', function(moveObj){ //remote move by peer
			 var move = game.move(moveObj);
			// illegal move
			if (move === null) {
			  return;
			}
			board.position(game.fen());
		  });
  });