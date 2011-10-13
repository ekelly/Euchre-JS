<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html>
	<head>
		<title>Euchre</title>
		<script src="http://code.jquery.com/jquery-latest.js"></script>
		<script src="http://localhost:80/socket.io/socket.io.js"></script>
	</head>
	<body>
		{{#noshow}}
			{{#games}}
				<a href="http://localhost:8888/wait?gamename="+{{name}}>{{name}}</a> : {{length}} players
			{{/games}}
		{{/noshow}}
		<br />
		<form name="input" action="http://localhost:8888/wait" method="get">
			Create a new game: <input type="text" name="gamename" />
			<input type="submit" Value="Submit" />
		</form>
	</body>
</html>
