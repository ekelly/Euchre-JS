var Stack = require('./stack.js'),
	Card  = require('./card.js');
	
	
/* A game is:

	{
		players: [Socket, Socket, Socket, Socket]
        round: Round
        score: [Number, Number],
        name: String
    }

    tricksTaken - How many tricks have been played / won
    flip - Card flipped over
    	* if undefined, play stage or game not started
    	* if null, card flipped over trump stage
    	* if card, trump stage
    The score - [Number, Number]
    
    A Round is:
    
    {
    	hands: [Stack, Stack, Stack, Stack],
        deck: Stack
        trick: [Card, Card, Card, Card],
        tricksTaken: [Number, Number, Number, Number],
        dealer: Player,
        calledTrump: Player,
        trump: Suit,
        flip: Card, Null, or Undefined,
        turn: Player,
    }
*/
	
	
// Creates a new game object
// Game Context -> Game
function start(game) {
    game.score = [0, 0];
	game.round = newRound();
    return game;
}

// Returns a new Round instance
// -> Round
function newRound() {
	var round = {},
		dealer = Math.floor(Math.random()*4),
		deck = Stack().makeDeck(1).shuffle(7),
		flip = deck.deal();

	deck.setTrump(flip.suit);
	
	// Deal
	round.hands = [];
	for(var i = 0; i < 4; i++) {
		round.hands[i] = new Stack();
		for(var j = 0; j < 5; j++) {
			round.hands[i].addCard(deck.deal());
		}
	}
	
    round.deck = deck;
    round.trick = [];
    round.tricksTaken = [];
    round.dealer = dealer;
    round.flip = flip;
    round.turn = nextPlayer(dealer);
        
    return round;
}

// Returns the next player in line after n
// Number -> Number
function nextPlayer(n) {
	return (n+1) % 4;
}

// Called when a player indicates trump has been set
// Round Suit -> Round
function setTrump(round, trump, player) {
	round.trump = trump;
	round.calledTrump = player;
	
	return game.round;
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

// Takes the score, the player who called trump, if player is going alone
// and returns the change in score
// Array of four numbers, Player, Boolean -> Number
function incrementScore(trickCount, calledTrump, alone) {
	var teamScore = trickCount[(calledTrump % 2)] + 
					trickCount[(calledTrump % 2) + 2];
	if(teamScore < 3) {
		return -3;
	} else if(teamScore == 5) {
		if(alone) {
			return 4;
		} else {
			return 2;
		}
	} else {
		return 1;
	}
}

// Receive a card.  Called when a player makes a move
// Game Number Card -> Number (next Player if continue, -1 if round ended)
function receiveCard(game, player, card) {
	alert('received card');
	var r = game.round,
		winningPlayer;
	r.trick[player] = card;
	// check if recieved cards = 4
	// if so, determine trick winner
	if(r.trick.length == 4) {
		winningPlayer = trickWinner(r.trick, r.trump, nextPlayer(player));
		r.tricksTaken[winningPlayer]++;
		if(arrSum(r.tricksTaken) == 5) {
			// Calculate the score
			game.score[(r.calledTrump % 2)] += 
				incrementScore(r.tricksTaken, r.calledTrump, r.alone);
			// Let the game know to start a new round
			return -1;
		}
		return winningPlayer;
	}
	return nextPlayer(player);
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
    return {
        name: gn,
        players: 0
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
exports.playCard = receiveCard;
exports.newRound = newRound;
exports.nextPlayer = nextPlayer;