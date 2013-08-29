<h1>Leaderboard</h1><table>
<?php
print("<tr><td id=\"name\">Name</td><td id=\"wins\">Wins</td><td id=\"losses\">Losses</td><td id=\"draws\">Draws</td></tr>");

// print out rows of leaderboard table
foreach($rows as $row){
	print("<tr><td>" . $row["username"] . "</td>" . "<td>" . $row["wins"] . "</td><td>" . $row["losses"] . "</td><td>" . $row["draws"] . "</td></tr>");
}
?>
</table>