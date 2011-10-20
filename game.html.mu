<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html>
	<head>
		<title>Euchre</title>
		<script src="http://code.jquery.com/jquery-latest.js"></script>
		<script src="http://localhost:80/socket.io/socket.io.js"></script>
		<script>
			var client = io.connect('http://localhost:80/');
			
			client.on('connect', function() {
				client.emit('join room', {{name}}, function(response) {
					console.log(response);
				});
			});
			
			client.on('msg', function (msg) {
				console.log(msg);
				$('body').append(msg);
			});
			
			client.on('turn', function() {
				console.log('My turn!');
			});
			
		</script>
	</head>
	<body>
		{{message}}
	</body>
</html>