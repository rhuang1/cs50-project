<?php
    // configuration
    require("../includes/config.php");
    
    // if form was submitted
    if ($_SERVER["REQUEST_METHOD"] == "POST")
    {
        if(empty($_POST["username"]) || empty($_POST["password"]) || empty($_POST["confirmation"]))
            apologize("Please fill out all fields!");
        else if($_POST["password"] != $_POST["confirmation"])
            apologize("Passwords don't match!");
        
        if(query("INSERT INTO users (username, password, currentGame, wins, losses, draws) VALUES(?, ?, 0, 0, 0, 0)", 
            $_POST["username"], crypt($_POST["password"])) === false)
             apologize("Error: Unable to register");
             
        $rows = query("SELECT LAST_INSERT_ID() AS id");
        $id = $rows[0]["id"]; 
        $_SESSION["id"] = $id;
               
        redirect("index.php");
    }
    else
    {
        // else render form
        render("register_form.php", array("title" => "Register"));
    }
?>
