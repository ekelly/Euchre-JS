<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html>
	<head>
		<title>Euchre</title>
		<script src="http://code.jquery.com/jquery-latest.js"></script>
		<script src="http://localhost/card.js"></script>
		<script src="http://localhost/stack.js"></script>
		<script src="http://localhost:8888/socket.io/socket.io.js"></script>
		<script>
			var client = io.connect('http://localhost:8888/');
			
			client.on('connect', function() {
				client.emit('join game', '{{name}}', function(response) {
					console.log(response);
				});
			});
			
			client.on('msg', function(msg) {
				console.log(msg);
				$('body').append(msg);
			});
			
			client.on('turn', function() {
				console.log('My turn!');
				// if we are selecting trump
				
				// if the flip has been turned over
				
				// otherwise, play a card
			});
			
			client.on('status', function(gamestate) {
			
			});
			
			client.on('disconnect', function() {
				$('body').append('Uh oh! Something went wrong. Disconnect');
			});
			
			// This function is just to call server code for testing purposes
			function testCode() {
				client.emit('test');
			}
			
		</script>
	</head>
	<body>
		{{message}}
	</body>
</html>