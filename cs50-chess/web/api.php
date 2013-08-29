<?php

// handles AJAX requests

// configuration
require("../includes/config.php");

// checks to make sure a game ID is specified
if(isset($_GET["id"]))
{
	switch($_POST["mode"])
	{
		// updates board with new position
		case "update":
		$update = query("UPDATE games SET board = ?, turn = ?, whiteTimer = ?, blackTimer = ? WHERE id = ?", $_POST["board"], $_POST["turn"], 
			$_POST["whiteTimer"], $_POST["blackTimer"], $_GET["id"]);
		break;

		// retrieves current state of the board
		case "retrieve":
		$getBoard = query("SELECT * FROM games WHERE id = ?", $_GET["id"]);
		echo json_encode($getBoard[0]);
		break;

		// returns the user's ID, stored in $_SESSION
		case "getUserSession":
		echo $_SESSION["id"];
		break;

		// makes query when game ends
		case "endgame":
		$update = query("UPDATE users SET wins = wins + ?, losses = losses + ?, draws = draws + ?, currentGame = 0 WHERE id = ?", $_POST["wins"], $_POST["losses"], $_POST["draws"], $_POST["id"]);
		$setGameOver = query("UPDATE games SET winner = ? WHERE id = ?", $_POST["winner"], $_POST["gameID"]);
		break;

		// makes query if draw is offered
		case "drawOffer":
		$drawOffer = query("UPDATE games SET drawOffer = ? WHERE id = ?", $_POST["drawOffer"], $_POST["gameID"]);
		break;

		// loads list of games to populate lobby
		case "lobby":
		$findGames = query("SELECT * FROM games WHERE winner = 0 AND (blackPlayer = 0 XOR whitePlayer = 0)");
		$string = array();
		$i = 0;
		foreach($findGames as $game){
			$temp = getUserGame($game["id"]);
			$open ="";
			if($game["blackPlayer"] == 0)
				$open = "Black";
			else
				$open = "White";
			$string[$i] = "<div class='entry'><strong>Created by:</strong> ". $temp["username"] ." <strong>Open Space: </strong>". $open ." <a href='play.php?id=". $game["id"] ."'>Join!</a></div>";
			$i++;
		}
		echo json_encode($string);
		break;
	}
}

?>