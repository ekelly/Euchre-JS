var Stack = require('./stack.js'),
	Card  = require('./card.js');
	
// Starts the game by dealing
// Then flipping the top card
function start(game, context) {
	var dealer = Math.floor(Math.random()*4),
		deck = new Stack().makeDeck(24).shuffle(7),
		flip = deck.stackDeal();
	deck.setTrump(flip.suit);
	
	// Deal
	games[game].hands = [];
	for(var i = 0; i < 4; i++) {
		games[game].hands[i] = new Stack()
		for(var j = 0; i < 5; j++) {
			games[game].hands[i].stackAddCard(deck.stackDeal());
		}
	}
	
    games[game].deck = deck;
    games[game].trick = [];
    games[game].tricksTaken = [];
    games[game].dealer = dealer;
    games[game].flip = flip
    games[game].trump = flip.suit;
    games[game].score = [0, 0];
    games[game].turn = nextPlayer(dealer);

	broadcast(game, 'status', data);
}

// Sends the result of each action
// String String Object
function broadcast(game, msg, data) {
	io.sockets.to(game).send(msg, data);
}

// Returns the next player in line after n
// Number -> Number
function nextPlayer(n) {
	return (n+1) % 4;
}

// Sets trump.  Called when a player indicates trump is set
// Game Context -> 
function setTrump(game, context) {
	game['trump'] = context['trump'];
	data = {
		trump: game['trump'],
	};
	if(context['pickUp']) {
		game['turn'] = game['dealer'];
		data['turn'] = game['turn'];
		broadcast(context, 'status', data);
		broadcast(game.players[game['dealer']], 'discard', data);
	} else {
		game['turn'] = nextPlayer(game['dealer']);
		data['turn'] = game['turn'];
		broadcast(context, 'status', data);
	}
}

// Receive a card.  Called when a player makes a move
function receiveCard(game, msg) {
	alert('received card');
}

exports.start = start;
exports.setTrump = setTrump;
exports.playCard = receiveCard;
exports.broadcast = broadcast;