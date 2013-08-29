// Variables for handling castling legality
var blackQCastle = true;
var blackKCastle = true;
var whiteQCastle = true;
var whiteKCastle = true;
var castling = false;

// Attempts to make a move by the color in question. Returns true upon success, false upon failure
function attemptMove(from, to, color){
	var piece = board[from];
	var captured = board[to];
	// Make sure piece being moved is of right color
	if(piece * color <= 0)
		return false;
	// Make sure move is legal, and any piece being captured is of the opposite color
	if(board[to] * color <= 0 && isLegal(from, to, piece))
	{
		var temp = board[to];
		// Special move if this is a castle
		if(castling == true)
		{
			// Move the rook in to the right place
			if(to < from)
			{
				board[from - 1] = board[from - 4];
				board[from - 4] = 0;
			}
			else if (to > from)
			{
				board[from + 1] = board[from + 3];
				board[from + 3] = 0;
			}
			// Move the king
			board[to] = board[from];
			board[from] = 0;
			// Deny further castling by this player
			castling = false;
			if(color == WHITE)
			{
				whiteQCastle = false;
				whiteKCastle = false;
			}
			else
			{
				blackQCastle = false;
				blackKCastle = false;
			}
			currentTurn *= -1;
			return true;
		}
		
		// Make the move
		board[to] = board[from];
		board[from] = 0;
		// If this move leaves the king under attack, undo it and declare it invalid
		var kingLocation = search(color * WHITE_KING);
		if(isUnderAttack(kingLocation[0], color * -1))
		{
			board[from] = board[to];
			board[to] = temp;
			return false;
		}	
		
		// Changes castling privileges if necessary
		setCastling(from, to);	
		
		// Promotion if a pawn was moved into the last rank
		if((to >= 0 && to <= 7) && board[to] == WHITE_PAWN)
		{
			processRunning = true;
			promote(to);
		}
		if((to >= 56 && to <= 63) && board[to] == BLACK_PAWN)
		{
			processRunning = true;
			promote(to);
		}			
		
		// Check for checkmate and stalemate, and update user database with results if game is over
		if(isCheckMate())
		{
			if(currentTurn == BLACK)
				win(BLACK);
			else if(currentTurn == WHITE)
				win(WHITE);
		}
		else if(isStaleMate())
		{
			win(2);
		}
		
		// Turn moves to the other color		
		currentTurn *= -1;
		return true;
	}
	return false;
}

// Determines if a move from "from" to "to" on the board is legal for the piece specified. Does not account for king vulnerability
function isLegal(from, to, piece){
	if(piece == 0)
		return false;
	if(piece == WHITE_PAWN)
	{			
		// Check if the move is a capture, and disallow wrapping around the board
		if(from % 8 == 0 && (to - from) == -9)
			return false;
		else if(from % 8 == 7 && (to - from) == -7)
			return false;
		else if((to - from) == -7 || (to - from) == -9)
			return board[to] !== 0;
		// If not moving diagonal, destination space cannot be occupied
		if(board[to] !== 0)
			return false;
		// Check for ability to move 2 spaces if in the beginning rank
		if(from >=48 && from <= 55)
			return ((to - from == -16 && board[from - 8] == 0)|| to - from == -8);
		
		return (to - from == -8);
	}
	else if(piece == BLACK_PAWN)
	{
		// Same as white pawn, but with numbers reversed
		if(from % 8 == 0 && (to - from) == 7)
			return false;
		else if(from % 8 == 7 && (to - from) == 9)
			return false;
		else if((to - from) == 7 || (to - from) == 9)
			return board[to] !== 0;
		if(board[to] !== 0)
			return false;
		if(from >=8 && from <= 15)
			return ((to - from == 16 && board[from + 8] == 0)|| to - from == 8);
		
		return (to - from == 8);
	}
	else if(Math.abs(piece) == WHITE_BISHOP)
	{
		var val = to - from;
		
		// Check if difference between square values is a multiple of 7 or 9
		if(Math.abs(val) / 7.0 === parseInt(Math.abs(val) / 7.0,10))
		{
			if(val > 0)
			{
				// Prevent wrap-around
				if(val / 7 > (from % 8))
					return false;
				// Check if there are any pieces in the way
				for(var i = 7; from + i != to; i = i + 7)
				{
					if(board[from + i] !== 0)
						return false;
				}
			}
			else if(val < 0)
			{
				// Prevent wrap-around
				if(val / 7 < -1 * (7 - (from % 8)))
					return false;
				// Check if there are any pieces in the way
				for(var i = 7; from - i != to; i = i + 7)
				{
					if(board[from - i] !== 0)
						return false;
				}
			}
			return true;
		}
		else if(Math.abs(val) / 9.0 === parseInt(Math.abs(val) / 9.0, 10))
		{
			if(val > 0)
			{
				if(val / 9 > (7 - from % 8))
					return false;
				for(var i = 9; from + i != to; i = i + 9)
				{
					if(board[from + i] !== 0)
						return false;		
				}
			}
			else if(val < 0)
			{
				if(val / 9 < -1 * (from % 8))
					return false;
				for(var i = 9; from - i != to; i = i + 9)
				{
					if(board[from - i] !== 0)
						return false;
				}
			}
			return true;
		}
		return false;
	}
	else if(Math.abs(piece) == WHITE_ROOK)
	{
		var val = Math.abs(to - from);
		
		// Check if difference between square values is a multiple of 8
		if(val / 8.0 === parseInt(val / 8.0,10))
		{
			// Check if there are pieces in the way
			if((to - from) > 0)
				for(var i = 8; from + i != to; i = i + 8)
				{
					if(board[from + i] !== 0)
						return false;
				}
			else if((to - from) < 0)
				for(var i = 8; from - i != to; i = i + 8)
				{
					if(board[from - i] !== 0)
						return false;
				}
			return true;
		}
		// Check if the squares are in the same row
		else if((to/8) - (from/8) < 1 && val < 8)
		{
			if((to - from) > 0)
				for(var i = 1; from + i != to; i = i + 1)
				{
					if(board[from + i] !== 0)
						return false;
				}
			else if((to - from) < 0)
				for(var i = 1; from - i != to; i = i + 1)
				{
					if(board[from - i] !== 0)
						return false;
				}
			return true;
		}
		return false;
	}
	else if(Math.abs(piece) == WHITE_QUEEN)
	{
		var val = to - from;
		// Combine Bishop and Rook checks
		if(Math.abs(val) / 7.0 === parseInt(Math.abs(val) / 7.0,10))
		{
			if(val > 0)
			{
				if(val / 7 > (from % 8))
					return false;
				for(var i = 7; from + i != to; i = i + 7)
				{
					if(board[from + i] !== 0)
						return false;
				}
			}
			else if(val < 0)
			{
				if(val / 7 < -1 * (7 - (from % 8)))
					return false;
				for(var i = 7; from - i != to; i = i + 7)
				{
					if(board[from - i] !== 0)
						return false;
				}
			}
			return true;
		}
		else if(Math.abs(val) / 9.0 === parseInt(Math.abs(val) / 9.0, 10))
		{
			if(val > 0)
			{
				if(val / 9 > (7 - from % 8))
					return false;
				for(var i = 9; from + i != to; i = i + 9)
				{
					if(board[from + i] !== 0)
						return false;		
				}
			}
			else if(val < 0)
			{
				if(val / 9 < -1 * (from % 8))
					return false;
				for(var i = 9; from - i != to; i = i + 9)
				{
					if(board[from - i] !== 0)
						return false;
				}
			}
			return true;
		}
		if(val / 8.0 === parseInt(val / 8.0,10))
		{
			if((to - from) > 0)
				for(var i = 8; from + i != to; i = i + 8)
				{
					if(board[from + i] !== 0)
						return false;
				}
			else if((to - from) < 0)
				for(var i = 8; from - i != to; i = i + 8)
				{
					if(board[from - i] !== 0)
						return false;
				}
			return true;
		}
		else if((to/8) - (from/8) < 1 && val < 8)
		{
			if((to - from) > 0)
				for(var i = 1; from + i != to; i = i + 1)
				{
					if(board[from + i] !== 0)
						return false;
				}
			else if((to - from) < 0)
				for(var i = 1; from - i != to; i = i + 1)
				{
					if(board[from - i] !== 0)
						return false;
				}
			return true;
		}
		return false
	}
	else if(Math.abs(piece) == WHITE_KNIGHT)
	{
		var val = to - from;
		// Prevent wrap-around
		if(from % 8 == 0 && ((val == 15) || (val == 6) || (val == -10) || (val == -17)))
			return false;
		if(from % 8 == 1 && ((val == -10) || (val == 6)))
			return false;
		if(from % 8 == 6 && ((val == -6) || (val == 10)))
			return false;
		if(from % 8 == 7 && ((val == -15) || (val == -6) || (val == 10) || (val == 17)))
			return false;
		val = Math.abs(val);
		// Values for knight's normal possible movements
		return (val == 17 || val == 15 || val == 10 || val == 6);
	}
	// Kings are separate due to castling possibilities
	else if(piece == WHITE_KING)
	{
		// Castling abilities
		if((to == 62 && whiteKCastle == true) && !isUnderAttack(60, BLACK) && !isUnderAttack(61, BLACK)
			&& !isUnderAttack(62, BLACK) && board[61] == 0 && board[62] == 0)
		{
			castling = true;
			return true;
		}
		if((to == 58 && whiteQCastle == true) && !isUnderAttack(60, BLACK) && !isUnderAttack(59, BLACK)
			&& !isUnderAttack(58, BLACK) && board[59] == 0 && board[58] == 0 && board[57] == 0)
		{
			castling = true;
			return true;
		}
		var val = to - from;
		// Prevent wrap-around
		if(from % 8 == 0 && ((val == -1) || (val == -9) || (val == 7)))
			return false;
		if(from % 8 == 7 && ((val == 1) || (val == 9) || (val == -7)))
			return false;
		val = Math.abs(val);
		// Movement by 1 space
		return (val == 7 || val == 8 || val == 9 || val == 1);
	}
	else if(piece == BLACK_KING)
	{
		// Castling abilities
		if((to == 6 && blackKCastle == true) && !isUnderAttack(4, WHITE) && !isUnderAttack(5, WHITE)
			&& !isUnderAttack(6, WHITE) && board[5] == 0 && board[6] == 0)
		{
			castling = true;
			return true;
		}
		if((to == 2 && blackQCastle == true) && !isUnderAttack(2, WHITE) && !isUnderAttack(3, WHITE)
			&& !isUnderAttack(4, WHITE) && board[1] == 0 && board[2] == 0 && board[3] == 0)
		{
			castling = true;
			return true;
		}
		var val = to - from;
		// Prevent wrap-around
		if(from % 8 == 0 && ((val == -1) || (val == -9) || (val == 7)))
			return false;
		if(from % 8 == 7 && ((val == 1) || (val == 9) || (val == -7)))
			return false;
		val = Math.abs(val);
		// Movement by 1 space
		return (val == 7 || val == 8 || val == 9 || val == 1);
	}
}

// Finds if location is under attack by the the color "attackingColor"
function isUnderAttack(location, attackingColor){
	// Pawns
	var attackers = search(attackingColor * WHITE_PAWN);
	for(var i = 0, k = attackers.length; i < k; i++)
	{
		if(isLegal(attackers[i], location, attackingColor * WHITE_PAWN))
			return true;
	}
	// Bishops
	attackers = search(attackingColor * WHITE_BISHOP);
	for(var i = 0, k = attackers.length; i < k; i++)
	{
		if(isLegal(attackers[i], location, attackingColor * WHITE_BISHOP))
			return true;
	}
	// Rooks
	attackers = search(attackingColor * WHITE_ROOK);
	for(var i = 0, k = attackers.length; i < k; i++)
	{
		if(isLegal(attackers[i], location, attackingColor * WHITE_ROOK))
			return true;
	}
	// Queen
	attackers = search(attackingColor * WHITE_QUEEN);
	for(var i = 0, k = attackers.length; i < k; i++)
	{
		if(isLegal(attackers[i], location, attackingColor * WHITE_QUEEN))
			return true;
	}
	// Knights
	attackers = search(attackingColor * WHITE_KNIGHT);
	for(var i = 0, k = attackers.length; i < k; i++)
	{
		if(isLegal(attackers[i], location, attackingColor * WHITE_KNIGHT))
			return true;
	}
	// Kings
	attackers = search(attackingColor * WHITE_KING);
	for(var i = 0, k = attackers.length; i < k; i++)
	{
		if(isLegal(attackers[i], location, attackingColor * WHITE_KING))
			return true;
	}
	return false;
}

// Return an array containing the location of every instance of the piece being searched for
function search(piece){
	var locations = new Array();
	var index = 0;
	for(var i = 0; i < 64; i++)
	{
		if(board[i] == piece)
			locations[index++] = i;
	}
	return locations;
}

// Checks for a checkmate situation after each move is made by searching for legal moves
// If no possible legal moves are found and the king is under attack, then a checkmate situation is declared
// Function is called after each move is made, and declares whether that move has created a checkmate
function isCheckMate(){
	var kingLocation = search(-1 * currentTurn * WHITE_KING);
	if(isUnderAttack(kingLocation[0], currentTurn))
		return isStaleMate();
	return false;
}

// Checks for stalemate situation, which is equivalent to a checkmate situation except that the king is not currently under attack
// Checks if the player has any possible legal moves
// When this function is called, currentTurn is still the turn of the player who has just moved, before play passes to the other player
function isStaleMate(){
	processRunning = true;
	for(var i = 0; i < 64; i++)
	{
		if(board[i] * currentTurn < 0)
		{
			for(var k = 0; k < 64; k++)
			{
				if(isLegal(i, k, board[i]) && (board[i] * board[k] <= 0))
				{					
					// Try the move to see if it keeps the king out of check
					
					var temp = board[k];
					board[k] = board[i];
					board[i] = 0;
					var kingLocation = search(-1 * currentTurn * WHITE_KING);
					if(!isUnderAttack(kingLocation[0], currentTurn))
					{
						board[i] = board[k];
						board[k] = temp;
						processRunning = false;
						return false;
					}
					board[i] = board[k];
					board[k] = temp;
				}
			}
		}
	}
	processRunning = false;
	return true;
}

// Displays a dialog box to show promotion options for a pawn
function promote(to){

    // Changes promotion options shown to you depending on if you're white or black
    if(currentTurn == WHITE)
    {
        $("[for='queen']").html('<input type="radio" id="queen" name="choice" value="queen" checked="checked" /> <img src="img/wQueen.png" />');
        $("[for='knight']").html('<input type="radio" id="knight" name="choice" value="knight" /> <img src="img/wKnight.png" />');
        $("[for='bishop']").html('<input type="radio" id="bishop" name="choice" value="bishop" /> <img src="img/wBishop.png" />');
        $("[for='rook']").html('<input type="radio" id="rook" name="choice" value="rook" /> <img src="img/wRook.png" />');
    }
    else
    {
        $("[for='queen']").html('<input type="radio" id="queen" name="choice" value="queen" checked="checked" /> <img src="img/bQueen.png" />');
        $("[for='knight']").html('<input type="radio" id="knight" name="choice" value="knight" /> <img src="img/bKnight.png" />');
        $("[for='bishop']").html('<input type="radio" id="bishop" name="choice" value="bishop" /> <img src="img/bBishop.png" />');
        $("[for='rook']").html('<input type="radio" id="rook" name="choice" value="rook" /> <img src="img/bRook.png" />');
    }

    // promotion dialog box option
    $("#promotion").dialog({
    buttons: {"OK" : function(){
        $("input").each(function(){
       		// checks if radio button is selected
            if (this.checked == true){
                if(currentTurn == WHITE)
                {
                    switch($(this).val())
                    {
                        case 'knight':
                        promotionChoice = WHITE_KNIGHT;
                        break;

                        case 'queen':
                        promotionChoice = WHITE_QUEEN;
                        break;  

                        case 'rook':
                        promotionChoice = WHITE_ROOK;
                        break;

                        case 'bishop':
                        promotionChoice = WHITE_BISHOP;
                        break;
                    }
                }
                else
                {
                    switch($(this).val())
                    {
                        case 'knight':
                        promotionChoice = BLACK_KNIGHT;
                        break;

                        case 'queen':
                        promotionChoice = BLACK_QUEEN;
                        break;

                        case 'rook':
                        promotionChoice = BLACK_ROOK;
                        break;

                        case 'bishop':
                        promotionChoice = BLACK_BISHOP;
                        break;
                    }
                }
            }
			// Promote to appropriate piece
			if(to >= 0 && to <= 7)
				board[to] = Math.abs(promotionChoice);
			else if(to >= 56 && to <= 63)
				board[to] = -1 * Math.abs(promotionChoice);
        });
        
		// Refresh board and update database with promotion info
		drawBoard();
		updateDatabase();
        $("#promotion").dialog("close");
        processRunning = false;
    }},
    modal: true,
    resizable: false,
    closeOnEscape: false,
    title: "Promotion"
    });

    $("#promotion").dialog("open");
}

