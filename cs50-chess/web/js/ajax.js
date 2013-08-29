/*********
* 
* Updates database with current board positions and times
*
**********/

function updateDatabase()
{
	$.ajax({
		type: 'POST',
		url: 'api.php?id=' + gameID,
		data: {board: sendPieces(board),
			turn: currentTurn,
			mode: 'update',
			whiteTimer: whiteTime,
			blackTimer: blackTime
		},
		dataType: 'JSON',
		success: function(data)
		{
			console.log("Database updated");
		}
	});
}

/*********
* 
* Gets current state of game (game's unique ID, game's pieces, who the whiteplayer is, who the
* black player is, and who's turn it is)
*
**********/

function getGameState()
{
	$.ajax({
		type: 'POST',
		url: 'api.php?id=' + gameID,
		data: { mode: 'retrieve' },
		dataType: 'JSON',
		success: function(data)
		{
			gameID = data["id"];
			board = getPieces(data["board"]);
			whitePlayer = data["whitePlayer"];
			blackPlayer = data["blackPlayer"];
			winner = data["winner"];
			drawOffer = data["drawOffer"];
			if(data["turn"] != currentTurn)
			{
				currentTurn = data["turn"];
				turnChange = true;				
			}
			else
				turnChange = false;
			if(me == WHITE)
				tempTimeStorage = data["blackTimer"];
			else if(me == BLACK)
				tempTimeStorage = data["whiteTimer"];
		}
	});
}

/***************
*
* Updates user statistics depending on game result, where 1 symbolizes the correct result
*
***************/

function sendResults(win, loss, draw, user, victor, gameID)
{
	$.ajax({
		type: 'POST',
		url: 'api.php?id=' + gameID,
		data: {wins: win,
			losses: loss,
			draws: draw,
			id: user,
			winner: victor,
			gameID: gameID,
			mode: 'endgame'
		},
		dataType: 'JSON',
		success: function(data)
		{
			console.log("Results logged");
		}
	});
}

/*********
* 
* Updates the state of draw negotiations. A value of 0 indicates normal circumstances. 1 indicates a draw offer. 2 indicates a rejection response.
* A positive result indicates it was submitted by white, and a negative reuslt indicates it was submitted by black
*
**********/

function requestDraw(draw)
{
	$.ajax({
		type: 'POST',
		url: 'api.php?id=' + gameID,
		data: {
			drawOffer: draw,
			gameID: gameID,
			mode: 'drawOffer'
		},
		dataType: 'JSON',
		success: function(data)
		{
			console.log("Draw offered");
		}
	});
	
}


/*********
* 
* Returns which side you're playing as (white or black)
*
**********/

function whoAmI()
{
	$.ajax({
		type: 'POST',
		url: 'api.php?id=' + gameID,
		data: {mode: 'getUserSession'},
		dataType: 'JSON',
		success: function(data)
		{
			if(data == blackPlayer)
			{
				me = BLACK;
			}
			else
			{
				me = WHITE;
			}
		}
	});

	return me;
}

/*********
* 
* Gets data fom database on open games, and prints out a list
*
**********/

function lobby()
{	
	$.ajax({
		type: 'POST',
		url: 'api.php?id=42',
		data: {mode: 'lobby'},
		dataType: 'JSON',
		success: function(data)
		{
			var str = "";
			for(var i = 0; i < data.length; i++)
			{
				str += data[i];
			}
			$(".list").html(str);
		}
	});
}