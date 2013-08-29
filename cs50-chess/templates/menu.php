<div id="menu">
<ul>
<li><a href="index.php">Home</a></li>
<li><a href="play.php">Play</a></li>
<li><a href="leaderboard.php">Leaderboard</a></li>
<li<?php //check if user is logged in; if so, displays username and win/loss/draw data
if (isset($_SESSION["id"])): $userInfo = getUserInfo($_SESSION["id"]); ?> class="userInfo">
<p>Welcome, <strong><?= $userInfo["username"]; ?></strong>!</p>
<p>Wins: <?= $userInfo['wins'] ?> Losses: <?= $userInfo['losses'] ?> Draws: <?= $userInfo['draws'] ?></p>
<p><a href="logout.php">Logout?</a></p>
<?php else: ?>style="display: none;"><? endif; ?>
</li>
<li><a href="documentation.php">Doc</a></li>
<li><a href="design.php">Design</a></li>
</ul>
</div><!-- end menu -->
<div id="header">
<?php if(isset($title) && $title == "Home"): ?>
<div class="center home">
<?php 
// displays big menu if user is not logged in
if(!isset($_SESSION["id"])){ ?>
<div class="login">
<h3>Login</h3>
<form action="login.php" method="post"><input autofocus name="username" placeholder="Username" type="text"/>
<input name="password" placeholder="Password" type="password"/><input type="submit" style="position: absolute; left: -9999px;" />
<button type="submit" class="blue">Login</button>
</form>
</div>
<div class="register">
<h3>Register an Account</h3>
<form action="register.php" method="post">
    <input autofocus name="username" placeholder="Username" type="text"/>
    <input name="password" placeholder="Password" type="password"/>
    <input name="confirmation" placeholder="Confirmation" type="password"/>
    <div> <button type="submit" class="blue">Register</button>
</div>
</form>
</div>
<?php } else { // if player is logged in ?>
<form method="link" action="play.php">
<button class="blue big-button">Play!</button>
</form>
<?php } ?>
</div>
<?php else: ?>
<div class="center elsewhere">
</div>
<?php endif; ?></div><!-- end header -->
<?php if(!isset($title) || $title != "Home"){ ?><div id="container"><?php } ?>