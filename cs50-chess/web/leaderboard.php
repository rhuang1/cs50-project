<?php

    // configuration
    require("../includes/config.php"); 

    $rows = query("SELECT * FROM users WHERE wins > 0 ORDER BY wins DESC LIMIT 20");

    // render game
    render("leaderboard.php", array("rows" => $rows, "title" => "Leaderboard"));

?>
