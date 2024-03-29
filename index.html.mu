<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html>
	<head>
		<title>Euchre</title>
		<script src="http://code.jquery.com/jquery-latest.js"></script>
		<!--<script src="http://localhost:80/socket.io/socket.io.js"></script>-->
		<script>	
			function joinGame(name) {
				client.emit('join game', name, function(response) {
					if(response.error) {
						alert(response.error);
					} else {
						alert(response);	
					}
				});
			}
		</script>
	</head>
	<body>
		<h2>Game list</h2>
		{{#show}}
			{{#games}}
				<a onclick="joinGame({{name}})">{{name}}</a> : {{length}} players
			{{/games}}
		{{/show}}
		{{^show}}
			There are currently no games!  Why don't you make one.
		{{/show}}
		<br />
		<br />
		<form name="input" action="http://localhost:8888/wait" method="get">
			Create a new game: <input type="text" name="gamename" />
			<input type="submit" Value="Submit" />
		</form>
	</body>
</html>
