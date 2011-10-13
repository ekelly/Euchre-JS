<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html>
	<head>
		<title>Euchre</title>
		<script src="http://code.jquery.com/jquery-latest.js"></script>
		<script src="http://localhost:80/socket.io/socket.io.js"></script>
		<script>
			var client = io.connect('http://localhost:80/{{gamename}}');
			
			client.on('msg', function (msg) {
				console.log(msg);
				$('body').append(msg);
			});
			
		</script>
	</head>
	<body>
		{{message}}
	</body>
</html>