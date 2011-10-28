var Stack = require('./stack.js'),
	Card  = require('./card.js');
	
	
/* A game is:

	{
        hands: [Stack, Stack, Stack, Stack],
        deck: Stack
        trick: [Card, Card, Card, Card],
        tricksTaken: [Number, Number, Number, Number],
        dealer: Player,
        calledTrump: Player,
        trump: Suit,
        flip: Card, Null, or Undefined,
        score: [Number, Number],
        turn: Player,
        name: String
    }

    tricksTaken - How many tricks have been played / won
    flip - Card flipped over
    	* if undefined, play stage or game not started
    	* if null, card flipped over trump stage
    	* if card, trump stage
    The score - [Number, Number]
*/
	
	
// Starts the game by dealing
// Then flipping the top card
// Game Context -> Game
function start(game, context) {
	var dealer = Math.floor(Math.random()*4),
		deck = (new Stack()).makeDeck(1).shuffle(7),
		flip = deck.stackDeal();
	deck.setTrump(flip.suit);
	
	// Deal
	game.hands = [];
	for(var i = 0; i < 4; i++) {
		game.hands[i] = new Stack()
		for(var j = 0; i < 5; j++) {
			game.hands[i].stackAddCard(deck.stackDeal());
		}
	}
	
    game.deck = deck;
    game.trick = [];
    game.tricksTaken = [];
    game.dealer = dealer;
    game.flip = flip
    game.score = [0, 0];
    game.turn = nextPlayer(dealer);
    
    return game;
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
	var leadSuit = trick[lead].suit;
	for(var i = 0; i < 4; i++) {
		if(trick[i].suit == leadSuit || trick[i].suit == trump) {
			if(!trick[winner].isHigher(trick[i])) {
				winner = i;
			}
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

// Creates an inital game object
// String -> Game
function setUpGame(gn) {

	var tempdeck = new Stack();
	tempdeck.makeDeck(1);

    return {
        hands: [new Stack(), new Stack(), new Stack(), new Stack()],
        deck: tempdeck,
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

// Temporarily externally visible for testing
exports.arrsum = arrSum;
exports.handWinner = handWinner;
exports.trickWinner = trickWinner;

// Externally visible
exports.setup = setUpGame;
exports.start = start;
exports.setTrump = setTrump;
exports.pickUp = pickUp;
exports.playCard = receiveCard;