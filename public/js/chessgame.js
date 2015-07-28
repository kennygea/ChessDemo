$(document).ready(function() {
		var socket = io();                        
		//initiated socket client
		var game = new Chess();
		var userList = $('#connectedusers');
		var turn = $('#Turn');
		turn.css('display', 'none');
		
		
		$('#setPlayer').on('click', function() {
			var select = $( "#connectedusers option:selected" ).text();
			if (select != "") {
			socket.emit('set-new-player', select);
			}
		});
		
		$('#setStartBtn').on('click', function() {
			board.start(false);
			game.reset();
			var whosTurn = game.turn();
			if (whosTurn === 'b') {
				turn.text("Black's turn!");
			}
			else {
				turn.text("White's turn!");
			}
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
		
		if(game.game_over()) {
			alert("Game is Over! Start a New Game!");
		}
		
		var whosTurn = game.turn();
		if (whosTurn === 'b') {
			turn.text("Black's turn!");
		}
		else {
			turn.text("White's turn!");
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
			
			if (game.game_over()) {
				alert("Game is Over! Start a New Game!");		
			}
			var whosTurn = game.turn();
			if (whosTurn === 'b') {
				turn.text("Black's turn!");
			}
			else {
				turn.text("White's turn!");
			}
			board.position(game.fen());
		  });
		
		socket.on('set-playable', function(playable) {
			turn.css('display', 'inline');
			$('#gameState').text("Players: " + playable.p1 + " vs. " + playable.p2);
			if (playable.playable === true) {
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
			var whosTurn = game.turn();
			if (whosTurn === 'b') {
				turn.text("Black's turn!");
			}
			else {
				turn.text("White's turn!");
			}
			var boardPosition = board.fen();
			socket.emit('update', {board: boardPosition, game: game.fen()}); 
		});
		  
  });