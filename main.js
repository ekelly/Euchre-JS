// Starts the game by dealing
// Then flipping the top card
function start(game, context) {
	var dealer = Math.floor(Math.random()*4),
		deck = new Stack().makeDeck(24).shuffle(7),
		flip = deck.stackDeal();
	deck.setTrump(flip.suit);
	
	// Fix this later.  There has to be a better way
	var playerOne = new Stack.stackAddCard(deck.stackDeal())
			.stackAddCard(deck.stackDeal())
			.stackAddCard(deck.stackDeal())
			.stackAddCard(deck.stackDeal())
			.stackAddCard(deck.stackDeal());
		playerTwo = new Stack.stackAddCard(deck.stackDeal())
			.stackAddCard(deck.stackDeal())
			.stackAddCard(deck.stackDeal())
			.stackAddCard(deck.stackDeal())
			.stackAddCard(deck.stackDeal());
		playerThree = new Stack.stackAddCard(deck.stackDeal())
			.stackAddCard(deck.stackDeal())
			.stackAddCard(deck.stackDeal())
			.stackAddCard(deck.stackDeal())
			.stackAddCard(deck.stackDeal());
		playerFour = new Stack.stackAddCard(deck.stackDeal())
			.stackAddCard(deck.stackDeal())
			.stackAddCard(deck.stackDeal())
			.stackAddCard(deck.stackDeal())
			.stackAddCard(deck.stackDeal());
	data = {
		hands: [playerOne, playerTwo, playerThree, playerFour], 
        deck: deck,
        trick: [],
        tricksTaken: [],
        dealer: dealer,
        flip: flip,
        trump: flip.suit,
        score: [0, 0],
        turn: nextPlayer(dealer),
	};
	broadcast(game['connection'], 'status', data);
}

// Sends the result of each action
function broadcast(connection, msg, data) {
	connection.emit(msg, data);
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
function receiveCard() {
	alert('received card');
}

exports.start = start;
exports.playCard = receiveCard;