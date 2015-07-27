$(document).ready(function() {
		var socket = io();                        
		//initiated socket client
		var game = new Chess();
//		var id = Number(window.location.pathname.match(/\/chat\/(\d+)$/)[1]);
//		socket.emit('join', id);
		var userList = $('#connectedusers');
		
		
		$('#setPlayer').on('click', function() {
			var select = $( "#connectedusers option:selected" ).text();
			console.log(select);
			//if (select != "") {
			socket.emit('set-new-player', select);
		//	}
		});
		
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
            draggable: false,
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
			userList.empty();
			for (var i = 0; i < users.length; i++) {
				userList.append('<option id=list_' + users[i] + '>' + users[i] + '</option>');
			}
		});
		
		//Updates the new connect user to the current board position
		socket.on('new-user', function(playable) {
			var boardPosition = board.fen();
			socket.emit('update', {board: boardPosition, game: game.fen()});
		});
		
		socket.on('set-params', function(playable) {
			$('#currentHost').text("Current Host: " + playable.p1);
			if (playable.p2 != "") {
				$('#gameState').text("Players: " + playable.p1 + " vs. " + playable.p2);
			}
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
		
		socket.on('set-playable', function(playable) {
			$('#gameState').text("Players: " + playable.p1 + " vs. " + playable.p2);
			if (playable.playable === true) {
				console.log("Im getting here!");
				        var cfg = {
						draggable: true,
						position: 'start',
						moveSpeed: 'slow',
						onDrop: onDrop,
						onSnapEnd: onSnapEnd,
						snapbackSpeed: 500,
						snapSpeed: 150,
					};
				board =  new ChessBoard('board', cfg);
			}
			else {
				    var cfg = {
						draggable: false,
						position: 'start',
						moveSpeed: 'slow',
						onDrop: onDrop,
						onSnapEnd: onSnapEnd,
						snapbackSpeed: 500,
						snapSpeed: 150,
					};
				board =  new ChessBoard('board', cfg);
			}
			board.start(false);
			game.reset();
			var boardPosition = board.fen();
			socket.emit('update', {board: boardPosition, game: game.fen()}); 
		});
		  
  });