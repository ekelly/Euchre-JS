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
	// Not implemented yet	
}

// sums up the values in the given array
// array -> number
function arrSum(arr) {
	var sum = 0;
	for(var i = 0; i < arr.length; i++) {
		sum += arr[i];
	}
	return sum;
}

// Receive a card.  Called when a player makes a move
// String Number Card ->
function receiveCard(game, player, card) {
	alert('received card');
	var g = games[game],
		winningPlayer;
	g.trick[player] = card;
	// check if recieved cards = 4
	if(g.trick.length == 4) {
		winningPlayer = trickWinner(g.trick, g.trump, nextPlayer(player));
		g.tricksTaken[winningPlayer]++;
		if(arrSum(g.tricksTaken) == 5) {
			// Calculate the score
		}
	}
	// if so, determine trick winner
}

// A trick is an array of four cards

// Given a trick, trump, and the player who led the trick, return the trick winner
// trick trump Number -> number
function trickWinner(trick, trump, lead) {
	var winner = lead;
	for(var i = 0; i < 4; i++) {
		if(trick[i].isHigher(trick[winner])) {
			winner = i;
		}
	}
	return winner;
}

// a handResult is an array of 4 numbers, where the sum
// of all the numbers if 5

// Given a handResult, determine the winning team
// handResult -> Number
function handWinner(hR) {
	return hR[0] + hR[2] > hR[1] + hR[3] ? 0 : 1;
}

function setUpGame(gn) {

	// Create the game
	/*
	    Each player's hand - [Stack, Stack, Stack, Stack]
	    The deck - Stack
	    The trick - [Card, Card, Card, Card]
	    How many tricks have been played / won - [Number, Number, Number, Number] 
	    The dealer - Player
	    Who called trump - Player
	    trump - Suit
	    flip - Card flipped over
	    The score - [Number, Number]
	    Who's turn it is - Player
	    Communication with this 'room' - socket.io connection
    */
    return {
        hands: [new Stack(), new Stack(), new Stack(), new Stack()],
        deck: new Stack().makeDeck(24),
        trick: [],
        tricksTaken: [0, 0, 0, 0],
        dealer: undefined,
        calledTrump: undefined,
        trump: undefined,
        flip: undefined,
        score: [0, 0],
        turn: undefined,
        name: gn
    }
}

exports.setup = setUpGame;
exports.start = start;
exports.setTrump = setTrump;
exports.pickUp = pickUp;
exports.playCard = receiveCard;