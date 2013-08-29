// defines constant, unique values for each piece
var WHITE_KING = 99;	
var WHITE_QUEEN = 90;	
var WHITE_ROOK = 50;	
var WHITE_BISHOP = 31;	
var WHITE_KNIGHT = 30;	
var WHITE_PAWN = 10;
	
var BLACK_KING = -WHITE_KING;	
var BLACK_QUEEN = -WHITE_QUEEN;	
var BLACK_ROOK = -WHITE_ROOK;	
var BLACK_BISHOP = -WHITE_BISHOP;	
var BLACK_KNIGHT = -WHITE_KNIGHT;	
var BLACK_PAWN = -WHITE_PAWN;

var WHITE = 1;
var BLACK = -1

var gameID = $_GET("id");

// Tracks users' clicks for piece movement purposes
var selected = false;
var from = 0;

var currentTurn = WHITE;

// Used to track users' choice of promotion piece for pawns
var promotionChoice = 0;

// Track draw offers. A value of 0 indicates normal circumstances. 1 indicates a draw offer. 2 indicates a rejection response.
// A positive result indicates it was submitted by white, and a negative reuslt indicates it was submitted by black
var drawOffer = 0;

// Variable used to prevent refreshing commands when background logic checks are running
var processRunning = false;

// Used to track when the game ends. Default value is 0, for when game is in progress. -1, 2, and 1 symbolize black win, stalemate, and white win
var winner = 0;
	
var board = [BLACK_ROOK, BLACK_KNIGHT, BLACK_BISHOP, BLACK_QUEEN, BLACK_KING, BLACK_BISHOP, BLACK_KNIGHT, BLACK_ROOK,	
             BLACK_PAWN, BLACK_PAWN, BLACK_PAWN, BLACK_PAWN, BLACK_PAWN, BLACK_PAWN, BLACK_PAWN, BLACK_PAWN,	
             0,0,0,0,0,0,0,0,	
             0,0,0,0,0,0,0,0,	
             0,0,0,0,0,0,0,0,	
             0,0,0,0,0,0,0,0,	
             WHITE_PAWN, WHITE_PAWN, WHITE_PAWN, WHITE_PAWN, WHITE_PAWN, WHITE_PAWN, WHITE_PAWN, WHITE_PAWN,	
             WHITE_ROOK, WHITE_KNIGHT, WHITE_BISHOP, WHITE_QUEEN, WHITE_KING, WHITE_BISHOP, WHITE_KNIGHT, WHITE_ROOK];
			
// Track time remaining for each player
var whiteTime = 900;
var blackTime = 900;
var tempTimeStorage = 900;
var whiteClock = "15:00";
var blackClock = "15:00";

// Track which player is which color
var whitePlayer = 0;
var blackPlayer = 0;
var me = 0;

// Tracks when the turn changes, for board refreshing purposes
var turnChange = false;

// Used for one-time notice of opponent joining game. Set to 2 after the alert is given so that it is not used again
var joined = 0;

// keeps track of whose turn was last, to keep track of when the turn changes
var prevTurn = 0;

// returns a string based on a piece's unique value
function getPiece(value){
    switch(value){
	case WHITE_KING:
            return 'WHITE_KING';	
            break;
        case WHITE_QUEEN:
            return 'WHITE_QUEEN';
            break;
        case WHITE_ROOK:
            return 'WHITE_ROOK';
            break;
        case WHITE_BISHOP:	
            return 'WHITE_BISHOP';
            break;
        case WHITE_KNIGHT:
            return 'WHITE_KNIGHT';
            break;
        case WHITE_PAWN:
            return 'WHITE_PAWN';
            break;
        
        case BLACK_KING:
            return 'BLACK_KING';
            break;
        case BLACK_QUEEN:
            return 'BLACK_QUEEN';
            break;
        case BLACK_ROOK:
            return 'BLACK_ROOK';
            break;
        case BLACK_BISHOP:
            return 'BLACK_BISHOP';
            break;
        case BLACK_KNIGHT:
            return 'BLACK_KNIGHT';
            break;
        case BLACK_PAWN:
            return 'BLACK_PAWN';
            break;
        
        default:
            return 'EMPTY';
            break;	
    }
}

// Draws the board using nested for loops. 
// Makes sure the side you're playing is on the bottom
function drawBoard(id){
    if(typeof(id)==='undefined') id = 900;
    var str = '';
    var k = 0;
	if(me == WHITE)
	{
		for( var i = 0 ; i < 8 ; i++ ){
			str += '<div class="row">';
			for( var j = 0 ; j < 8 ; j++ ){
				str += '<div id="' + k + '" class="square column ' +
				( (i + j) % 2 === 0 ? 'light': 'dark') +
				 '">' + '<div class ="' + getPiece(board[i*8 + j]) + '"></div>' +
				'</div>';
				k++;
			}
			str += '</div>';			
		}
	}
	// Draw board in reverse if player is black
	else if(me == BLACK)
	{
        k = 63;
		for( var i = 7 ; i >= 0 ; i-- ){
			str += '<div class="row">';
			for( var j = 7 ; j >= 0 ; j-- ){
				str += '<div id="' + k + '" class="square column ' +
				( (i + j) % 2 === 0 ? 'light': 'dark') +
				 '">' + '<div class ="' + getPiece(board[i*8 + j]) + '"></div>' +
				'</div>';
				k--;
			}
			str += '</div>';			
		}
	}
    str += '</div>';
    $('.board').html(str);
    
    // highlights square that's selected
    if($("#" + id).children().attr("class") != "EMPTY")
    {
        $("#" + id).addClass("highlighted");
    }
}

$(function(){
	// hides dialog boxes onload
    $("#promotion").dialog({ autoOpen: false });
    $("#endGame").dialog({ autoOpen: false });
    $("#drawOffer").dialog({ autoOpen: false });

    // gets game state from server for first time
	getGameState();

	// delays running of whoAmI and drawBoard until getGameState retrieves all info from db
	setTimeout(function(){whoAmI()},1000);
	setTimeout(function(){drawBoard()},2500);

	// initializes timer
	var timer = setInterval(function(){ tickTime()}, 1000);

    // refreshes the board and runs the game
    var gameRefresh = setInterval(function(){        

        // retrieve game variables from database
		getGameState();

		// Used to alert players the first time both people are in the game. Sets value to 2 afterward so the alert no longer occurs
		if(joined == 1)
		{
			alert("Both players are now in the game. The game will now begin.");
			joined = 2;
		}
		
		// Occurs when opponent has submitted a draw offer. Sets state of drawOffer to 0 to avoid repeated requests, and prompts user for response
		if(drawOffer == (-1 * me) && !processRunning)
		{
			processRunning = true;
			requestDraw(0);
			offerDraw();
		}
		// Occurs when opponent has declined a draw offer. Alerts user as to the decline response and then sets drawOffer back to 0
		else if(drawOffer == (-2 * me) && !processRunning)
		{
			processRunning = true;
			requestDraw(0);
			processRunning = false;
			alert("Your opponent has declined your draw offer");			
		}
		if(turnChange)
		{
			if(!processRunning)
				drawBoard();
			else
				setTimeout(function(){ drawBoard()}, 1000);
		}
		
        // check if your clock has run down to 0
        if((me == WHITE && whiteTime <= 0) || (me == BLACK && blackTime <= 0))
        {
			clearInterval(timer);
			clearInterval(gameRefresh);
            // notifies the game of a win by the other player
            win(-1 * me);
        }
		else if(winner != 0)
		{			
			clearInterval(gameRefresh);
			clearInterval(timer);
			// Alert player of game end caused by other player's actions
			endGame(winner);
		}
		// Synchronize time
		if(me == WHITE && currentTurn == me)
			blackTime = tempTimeStorage;
		else if(me == BLACK && currentTurn == me)
			whiteTime = tempTimeStorage;
		
        if(whitePlayer != 0 && blackPlayer != 0)
        {
            $("#forfeit").removeAttr("disabled");
            $("#draw").removeAttr("disabled");
			if(joined != 2)
				joined = 1;
        }
		
		if(winner != 0)
		{
			$("#forfeit").attr("disabled", "disabled");
            $("#draw").attr("disabled", "disabled");
		}


    }, 2000);
	
	// captures window closing/leaving/refreshing, gives the win to the other player
	window.onbeforeunload = function confirmExit(){
		if(winner == 0)
			win(-1 * me);
	}
	
    // checks if square is clicked
	$(".board").on('click', '.square', function(event){
		// Disallow clicks if the game is over or it is not the user's turn
		if(winner != 0)
			return;
		if(me != currentTurn)
			return;
			
		var temp = parseInt($(this).attr("id"), 10);

		if(selected == true)
		{
			if(attemptMove(from, temp, currentTurn) && !processRunning)
            {
                updateDatabase();
            }
			selected = false;
            temp = 900;
		}
		else if (board[temp] !== 0)
		{
            $(this).css("background-color", "red");
			selected = true;
			from = parseInt(temp);
		}
		else
			selected = false;
		drawBoard(temp);

        if(currentTurn == WHITE)
            $("#whoseturn").html("White's Turn");
        else
            $("#whoseturn").html("Black's Turn");
    });

    // checks if forfeit
    $("#forfeit").on("click", function(event){
		clearInterval(gameRefresh);
		clearInterval(timer);
        // declares other player the winner
        win(-1 * me);		
    });

	$("#draw").on("click", function(event){
		requestDraw(me);
	});
});