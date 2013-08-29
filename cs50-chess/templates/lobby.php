<?php

?>
<h1><?= $title ?></h1>
<div id="startNew">
<form action="play.php?id=<?= $uniqueID ?>" method="POST">
<h3>Start a New Game</h3>
<label for="white" class="choice"><input type="radio" id="white" name="choice" value="white" checked="checked"/> <img src="img/wKing.png" /> <p>White</p></label>
<label for="black" class="choice"><input type="radio" id="black" name="choice" value="black" /> <img src="img/bKing.png" /> <p>Black</p></label>
<input type="submit" name="submit" id="submit" value="Play!" />
</form>
</div>
<div id="lobby">
<h3>List of Available Games</h3>
<div class="list">
<?php foreach($rows as $row){
?>
<div class="entry"><strong>Created by:</strong> <?php 
$temp = getUserGame($row["id"]);
echo $temp["username"]; ?> <strong>Open Space:</strong> <?php echo ($row["whitePlayer"] == 0 ? "White" : "Black") ?> <a href="play.php?id=<?= $row["id"] ?>">Join!</a></div>
<?php } ?>
</div>
</div>
</form>