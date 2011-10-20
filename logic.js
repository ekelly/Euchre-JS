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
    
    return games[game];
}

// Returns the next player in line after n
// Number -> Number
function nextPlayer(n) {
	return (n+1) % 4;
}

// Called when a player indicates trump has been set
// String Suit ->
function setTrump(game, trump) {
	games[game].trump = trump;
}

// Tells the dealer to pick up the card
function pickUp(game, dealer) {
	
}

// Receive a card.  Called when a player makes a move
// String Number Card ->
function receiveCard(game, player, card) {
	alert('received card');
}

exports.start = start;
exports.setTrump = setTrump;
exports.pickUp = pickUp;
exports.playCard = receiveCard;
exports.broadcast = broadcast;