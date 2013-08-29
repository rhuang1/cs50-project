// Takes an array of pieces and converts it into a string for storage. Returns this string.
// Each piece is represented as a 3 digit string, where the first digit is 1 for positive, 0 for negative. Other digits are the piece value
function sendPieces(input){
	var storage = "";
	var temp;
	for(var i = 0; i < input.length; i++)
	{
		temp = Math.abs(board[i]);
		temp = temp.toString();
		if(board[i] == 0)
			storage += "000";
		else if(board[i] > 0)
		{
			storage += "1";
			storage += temp;
		}
		else if(board[i] < 0)
		{
			storage += "0";
			storage += temp;
		}
	}
	return storage;
}

// Takes the stored string and converts it into an array of pieces, and returns this array
function getPieces(storage){
	var output = new Array();
	var temp = "";
	for(var i = 0; i < storage.length; i = i + 3)
	{	
		temp = "";
		temp += storage[i+1];
		temp += storage[i+2];
		temp = parseInt(temp, 10);
		if(storage[i] == 0)
			temp *= -1;
		output[i / 3] = temp;
	}
	return output;
}

// Helper function to retrieve GET variables from URL just using JQuery
// Since we don't know RegEx, taken from http://stackoverflow.com/questions/10001726/access-get-variables-using-jquery-javascript

function $_GET( name ){
  name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
  var regexS = "[\\?&]"+name+"=([^&#]*)";
  var regex = new RegExp( regexS );
  var results = regex.exec( window.location.href );
  if( results == null )
    return "";
  else
    return results[1];
}

// Updates results with the passed in color as the winner. If 2 is passed in, a stalemate is declared. Alerts user as to result
function win(color){
	endGame(color);
	if(color == WHITE)
	{
		sendResults(0, 1, 0, blackPlayer, WHITE, gameID);
		sendResults(1, 0, 0, whitePlayer, WHITE, gameID);		
	}
	else if(color == BLACK)
	{
		sendResults(0, 1, 0, whitePlayer, BLACK, gameID);
		sendResults(1, 0, 0, blackPlayer, BLACK, gameID);
		
	}
	else if(color == 2)
	{
		sendResults(0, 0, 1, whitePlayer, 2, gameID);
		sendResults(0, 0, 1, blackPlayer, 2, gameID);
	}
}

// displays a dialog based on who won, where the color passed in is the winner
function endGame(who){

	if(who == WHITE && me == who)
	{
		$("#endGame").html("<h3>You (white) won!</h3>");
	}
	else if(who == WHITE && me != who)
	{	
		$("#endGame").html("<h3>You (black) lost!</h3>");
	}
	else if(who == BLACK && me == who)
	{
		$("#endGame").html("<h3>You (black) won!</h3>");
	}
	else if(who == BLACK && me != who)
	{
		$("#endGame").html("<h3>You (white) lost!</h3>");
	}
	else if(who == 2)
	{
		$("#endGame").html("<h3>Stalemate!</h3>");
	}

	$("#endGame").dialog({
    buttons: {"OK" : function(){
        
        $("#endGame").dialog("close");
    }},
    modal: true,
    resizable: false,
    closeOnEscape: false,
    title: "Game Over"
    });

    $("#endGame").dialog("open");
}	

// Prompts the user to accept or decline a draw offer
function offerDraw(){
	var response = false;

	$("#drawOffer").dialog({
		buttons: {
			"Accept" : function(){
				response = true;
				requestDraw(0);
				// Declares stalemate
				win(2);
				processRunning = false;
				$("#drawOffer").dialog("close");
			},
			"Decline" : function(){
				response = false;
				// Set state of drawOffer to show a decline response
				requestDraw(2 * me);
				processRunning = false;
				$("#drawOffer").dialog("close");
			}
		},
		modal: true,
		resizable: false,
		closeOnEscape: false,
		title: "Draw Offered"

	});

	$("#drawOffer").dialog("open");

	return response;
}

// Changes castling privileges if necessary, based on last move
function setCastling(from, to){
	if(from == 0 || to == 0)
		blackQCastle = false;
	else if(from == 7 || to == 0)
		blackKCastle = false;
	else if(from == 4)
	{
		blackQCastle = false;
		blackKCastle = false;
	}
	else if(from == 56 || to == 0)
		whiteQCastle = false;
	else if(from == 63 || to == 0)
		whiteKCastle = false;
	else if(from == 60)
	{
		whiteQCastle = false;
		whiteKCastle = false;
	}
}

// Counts down the clocks
function tickTime(){
    if(whitePlayer != 0 && blackPlayer != 0)
    {
    	if(currentTurn == WHITE && whiteTime > 0)
        {
    		whiteTime--;    		
        }
    	if(currentTurn == BLACK && blackTime > 0)
        {
    		blackTime--;    		
        }
    }

    // formats times 
	var temp = whiteTime % 60;
	if(temp < 10)
		whiteClock = (parseInt(whiteTime / 60, 10)).toString() + ":0" + (whiteTime % 60).toString();
	else
		whiteClock = (parseInt(whiteTime / 60, 10)).toString() + ":" + (whiteTime % 60).toString();
	temp = blackTime % 60;
	if(temp < 10)
		blackClock = (parseInt(blackTime / 60, 10)).toString() + ":0" + (blackTime % 60).toString();
	else
		blackClock = (parseInt(blackTime / 60, 10)).toString() + ":" + (blackTime % 60).toString();

    // outputs timers
    $("#whiteTimer").html(whiteClock);
    $("#blackTimer").html(blackClock);
}