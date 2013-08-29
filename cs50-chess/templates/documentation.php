<h1>Documentation</h1>
<h3>How to use this project</h3>
<p>This is a multiplayer chess game that allows two players to play online against each other. <strong>Two connected players are necessary for play</strong>. Site navigation is done through the menu options on the top bar. 
An account is necessary to play. Register an account on either index.php or register.php, or log in to an existing account using index.php or login.php.
Going to play.php sends you to a page where you can either create a new game, or find a game in the lobby. 
To join a game in the lobby, simply click an open game in the list on the right, and the game will begin immediately.  
Creating a game is simple. Choose the color you want to play as, then hit "Play!". The game will begin as soon as another player joins. Players can join through the lobby, or you can send them the "share" link provided at the top for them to join directly (an account is necessary).
Once in a game, you can play based on the standard rules of chess. You can win by a) checkmating the opponent's king, b) having the other player's timer run out before yours, c) having the other player forfeit, or d) having the other player leave the page. </p>
<p>In the menu bar, home takes users to the homepage, where they can login or register if they are not already logged in, or proceed to the play page if they are 
logged in. The leaderboard button takes users to the leaderboard, which displays the top ranked users by number of wins. Documentation on how to use the project 
is found through the Doc tab, and the design tab takes users to a page detailing how this website and game work.</p>
<p>The player's personal statistics are displayed in the upper right. Overall rankings for all players in the database can be seen on the leaderboard, which 
is based on number of wins.</p>
<h3>How to run this project</h3>
<p>This project requires PHP and MySQL on the server to run, as well as JavaScript on the client side. An active internet
connection is necessary to load JQuery's libraries. Before running the project on your own personal server, make sure that the MySQL-related entries in config.php
match your server's values (i.e. database name, location, login information). Also, make sure the "includes" and "templates" folders reside in
a directory level above the "main" application files, which should reside in "web" or "public_html", or whatever your directory
open to the public happens to be.</p>
<p>If you want to view this project on the web, the URL is <a href="http://hcs.harvard.edu/cs50-chess">hcs.harvard.edu/cs50-chess</a>.</p>