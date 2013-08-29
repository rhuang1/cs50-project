<!DOCTYPE html>
<html>
<head>
<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js"></script>
<script src="js/jquery.color-2.1.0.min"></script>
<?php 
// checks if on a game page 
if(isset($title) && $title == "Play"): ?>
<script src="http://ajax.googleapis.com/ajax/libs/jqueryui/1.9.2/jquery-ui.min.js"></script>
<script src="js/util.js"></script>
<script src="js/draw.js"></script>
<script src="js/ajax.js"></script>
<script src="js/chess.js"></script>
<?php endif;
//checks if on a lobby page
if(isset($title) && $title == "Lobby"): ?>
<script src="js/ajax.js"></script>
<script src="js/lobby.js"></script>
<?php endif; ?>
<script src="js/aesthetics.js"></script>
<link href='http://fonts.googleapis.com/css?family=Strait' rel='stylesheet' type='text/css'>
<link href='http://fonts.googleapis.com/css?family=Electrolize' rel='stylesheet' type='text/css'>
<link rel="stylesheet" type="text/css" href="http://code.jquery.com/ui/1.9.2/themes/base/jquery-ui.css" />
<link rel="stylesheet" type="text/css" href="css/style.css" />
<link rel="stylesheet" type="text/css" href="css/pieces.css" />
<?php 
//checks if on a lobby page
if(isset($title) && $title == "Lobby"): ?>
<link rel="stylesheet" type="text/css" href="css/lobby.css" />
<?php endif; ?>
<?php if (isset($title)): ?>
<title>Buggy Chess | <?= htmlspecialchars($title) ?></title>
<?php else: ?>
<title>Buggy Chess</title>
<?php endif ?>
</head>
<body>
