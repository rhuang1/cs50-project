<?php
    // configuration
    require("../includes/config.php"); 

    if(isset($_GET["id"]))
    {
    	$findGame = query("SELECT * FROM games WHERE id = ?", $_GET["id"]);

    	// check to see if game exists and one spot is empty
    	if(count($findGame) == 1 && ($findGame[0]["blackPlayer"] == 0 || $findGame[0]["whitePlayer"] == 0))
    	{
            // join the game
            if($findGame[0]["blackPlayer"] == 0)
            {
                query("UPDATE games SET blackPlayer = ? WHERE id = ?", $_SESSION["id"], $_GET["id"]);
            }
            else
            {
                query("UPDATE games SET whitePlayer = ? WHERE id = ?", $_SESSION["id"], $_GET["id"]);
            }

            // update the currentGame in your user db entry
            query("UPDATE users SET currentGame = ? WHERE id = ?", $_GET["id"], $_SESSION["id"]);

    		render("game.php", array("title" => "Play", "gameID" => $_GET["id"]));
    	}
    	else
    	{
    		// create a new game
    		if($_SERVER["REQUEST_METHOD"] == "POST")
    		{
                // check player color choice
    			if($_POST["choice"] == "white")
    			{
    				$createGame = query("INSERT INTO games (id, board, whiteTimer, blackTimer, turn, deadPieces, whitePlayer, blackPlayer) VALUES(?, ?, 900, 900, 1, 0, ?, 0)", $_GET["id"], DEFAULTSETUP, $_SESSION["id"]);
    			}
    			else
    			{
    				$createGame = query("INSERT INTO games (id, board, whiteTimer, blackTimer, turn, deadPieces, whitePlayer, blackPlayer) VALUES(?, ?, 900, 900, 1, 0, 0, ?)", $_GET["id"], DEFAULTSETUP, $_SESSION["id"]);
    			}

    			if($createGame === false)
    				apologize("Could not create game!");

                // update the currentGame in your user db entry
                query("UPDATE users SET currentGame = ? WHERE id = ?", $_GET["id"], $_SESSION["id"]);

    			render("game.php", array("title" => "Play", "gameID" => $_GET["id"]));

    		}
    		else
    		{
       			apologize("An open game with the ID you indicated cannot be found!");	
    		}
    	}
    }
    else
    {
    	$uniqueID = "";

	    // Generates a unique game ID in case the user wants to start a new game
	    do {
	    	$uniqueID = substr(md5(time()), 0, 8);
	    }
	    while(count(query("SELECT * FROM games WHERE id = ?", $uniqueID)) > 0);

        // get list of available games
        $rows = query("SELECT * FROM games WHERE winner = 0 AND (whitePlayer = 0 XOR blackPlayer = 0)");

        if($rows === FALSE)
            apologize("Could not find any games!");

        // display lobby
    	render("lobby.php", array("title" => "Lobby", "uniqueID" => $uniqueID, "rows" => $rows));
    }
?>
