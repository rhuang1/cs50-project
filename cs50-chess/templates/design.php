<h1>Design</h1>
<h3>How this project works</h3>
<p>This project runs on a combination of PHP, MySQL, and Javascript. Also, we extensively use Javascript's jQuery library, both for aesthetic effects
	and making AJAX queries. We store all of the player's information and chess game states in a MySQL database.</p>
<p>The most complex part of this project is, of course, the chess game. We use AJAX/Javascript to continually refresh the chess board based on what
is stored in the database, as well as dynamically upload new moves to the server.</p>
<p>For the actual chess game, the first thing we had to decide was how to represent the board. For this, we chose to use a one dimensional array of 64 elements,
 with each element being a numerical value. The pieces were all given constant values for representation on the board, and black pieces were given the 
 negative equivalent of their white counterparts' values. By making white pieces positive and black pieces negative, we are able to easily determine whether 
 two pieces are of the same color by simply multiplying them and seeing if the result is positive or negative. On the board, for any square number, its 
 number % 8 will yield the column, and its number / 8 will yield the row. Having a one dimensional array for the board also made storage of the board's 
 state simpler, as we can easily convert it into a string to store in the central database.</p>
<p>After a user has issued two appropriate clicks, to select a piece and move it, we attempt to move the piece. We first check legality of moves ignoring 
the king's vulnerability, and then check if the king is under attack afterward. If the move leaves the player's king under attack, we undo the move and wait 
for another. We decided to check for checkmate situations by checking every piece on the map, searching for any possible legal moves. If a player has no 
possible moves remaining, then we have a stalemate situation. If the player has no possible moves and has his king currently under attack, then 
we have a checkmate situation.</p>
<p>To circumvent the issue of different pieces of code running at the same time, we created a variable to track whether an important background process 
is currently running. If there is, then data and display refreshing is temporarily halted until it is done. This prevents issues with inaccurate displays 
when logic checks require temporary manipulation of the board and other data.</p>
<p>Since each game has two players at once, we had to keep all game state data synchronized. Each player periodically requests the current game state from 
the MySQL database to know when it has changed, and each player updates the database with the new game state after making each move. This prevents double 
submission of data such as wins and losses as well, since only the player to discover the game has ended submits this data. The other player finds out upon 
requesting the game state, and is then notified of the game's result.</p>
<p>The timers specifically require special attention to synchronize properly, as the delay caused by having to update the database and then read in the new info 
each turn will rapidly cause the players' clocks to fall very out of sync. To solve this, each player only has their own clock accurate at all times. 
When a player sees his opponent's clock ticking down, it is only an approximation. When a player's turn ends, his clock time is submitted to the database, 
and whenever a player's turn begins, he reads in the time on his opponent's clock from the database. This synchronizes the players' clocks each time play 
changes turns. While it reliably keeps the clocks synchronized, this method can cause some confusion amongst players as they see their opponents' clocks 
"jump" up in time each time their turn ends.</p>
<p>Outside of the chess logic, the site's games are organized around each new game having a unique game identifier. This ID can be directly linked to friends 
for them to join a user's game, and games with open slots are also automatically displayed in the site's lobby. Once a game is full or is abandoned, it is 
removed from the lobby. Our lobby is refreshed every 7 seconds using AJAX and PHP to fetch information from the database on open games.</p>
<h3>Colophon</h3>
<p>This project uses the jQuery library (extensively, so thank you!). It also uses the chess icon set produced by Wikipedia user
<a href="http://en.wikipedia.org/wiki/User:Cburnett">Cburnett</a> under the Creative Commons Attribution-Share 
Alike 3.0 Unported license. The logo on the main page, which features a visualization of a white king chess piece, was produced by
Wikimedia user <a href="http://commons.wikimedia.org/wiki/User:Rommel2">Rommel2</a>, also under the Creative Commons Attribution-Share 
Alike 3.0 Unported license. It also uses the <a href="http://stackoverflow.com/questions/10001726/access-get-variables-using-jquery-javascript">RegEx-based
function written by Stack Overflow user Shahrukh</a> as a helper function to retrieve $_GET data within JavaScript (data which would have been otherwise much harder
to get at with our lack of knowledge with regular expressions). Finally, we used the MVC frameworke provided in
CS50's Pset 7 as a foundation for our whole site, especially the user-account system.
</p>