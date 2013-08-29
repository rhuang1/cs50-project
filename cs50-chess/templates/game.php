<div id="options">
Invite a Friend: <input type="text" value="<?= "http://www.hcs.harvard.edu/~cs50-chess/play.php?id=" . $gameID ?>" />
<button class="blue" disabled="disabled" id="forfeit">Forfeit</button>
<button class="blue" disabled="disabled" id="draw">Offer Draw</button>
</div>
<div class="timers">
White:
<div id="whiteTimer">
</div>
Black:
<div id="blackTimer">
</div>
</div>
<div class="board"></div>
</div>
<div id="promotion">
<label for="queen" class="choice"><input type="radio" id="queen" name="choice" value="queen" /> <img src="img/bQueen.png" /></label>
<label for="rook" class="choice"><input type="radio" id="rook" name="choice" value="rook" /> <img src="img/bRook.png" /></label>
<label for="bishop" class="choice"><input type="radio" id="bishop" name="choice" value="bishop" /> <img src="img/bBishop.png" /></label>
<label for="knight" class="choice"><input type="radio" id="knight" name="choice" value="knight" /> <img src="img/bKnight.png" /></label>
</div>
<div id="endGame"></div>
<div id="drawOffer"></div>