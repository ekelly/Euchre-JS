/*
*
*	Credit for about half this code goes to BrainJar
*   They provided a nice base implementation which I
*   altered to work with Euchre
*
*/

var trumpRank = {
    "9": 0,
    "10": 1,
    "Q": 2,
    "K": 3,
    "A": 4,
    "J": 5
}, normalRank = {
    "9": 0,
    "10": 1,
    "J": 2,
    "Q": 3,
    "K": 4,
    "A": 5
};

// Card Suit -> boolean
// Returns true if this card is higher than that card, given the trump suit
function isHigher(card, trump) {
    var diff;
    if (this.activeSuit == trump) {
        if (card.activeSuit == trump) {
            diff = trumpRank[this.rank] - trumpRank[card.rank];
            if (diff > 1) {
                return true;
            } else if (diff < 1) {
                return false;
            } else {
                return this.suit == trump;
            }
        } else {
            return true;
        }
    } else {
        if (card.activeSuit == trump) {
            return true;
        } else {
            diff = normalRank[this.rank] - normalRank[card.rank];
            if (diff > 1) {
                return true;
            } else if (diff < 1) {
                return false;
            } else {
                return true;
            }
        }
    }
}

// Suit -> 
// Switches the active suit of the card if it is the left bauer
// (left bauer is the Jack of the opposing suit)
function switchSuit(trump) {
    if (this.rank == "J") {
        switch (trump) {
        case "C":
            if(this.suit == "S") {
            	this.activeSuit = "C";
            }
            break;
        case "D":
            if(this.suit == "H") {
            	this.activeSuit = "D";
            }
            break;
        case "H":
            if(this.suit == "D") {
            	this.activeSuit = "H";
            }
            break;
        case "S":
			if(this.suit == "C") {
            	this.activeSuit = "S";
            }            break;
        }
    }
}

function cardToString() {

    var rank, suit;

    switch (this.rank) {
    case "A":
        rank = "Ace";
        break;
    case "9":
        rank = "Nine";
        break;
    case "10":
        rank = "Ten";
        break;
    case "J":
        rank = "Jack";
        break;
    case "Q":
        rank = "Queen";
        break;
    case "K":
        rank = "King";
        break;
    default:
        rank = null;
        break;
    }

    switch (this.suit) {
    case "C":
        suit = "Clubs";
        break;
    case "D":
        suit = "Diamonds";
        break;
    case "H":
        suit = "Hearts";
        break;
    case "S":
        suit = "Spades";
        break;
    default:
        suit = null;
        break;
    }

    if (rank === null || suit === null) {
        return "";
    }

    return rank + " of " + suit;
}

// A rank is a String "2" - "10", "J", "Q", "K", "A"
// A suit is one of "H", "D", "S", "C"
// A card is a new Card(Rank, Suit);

function Card(rank, suit) {

    this.rank = rank;
    this.suit = suit;
    this.activeSuit = suit;

    this.toString = cardToString;
    this.switchSuit = switchSuit;
    this.isHigher = isHigher;
}

module.exports = Card;


/*
 Alternative Constructor.  Not used
 I decided to go for the method that explicitly needs new.
 I'll probably change my mind again later down the road
function card(rank, suit) {

  return {
      rank: rank,
      suit: suit,
      activeSuit: suit,
      toString: cardToString,
      switchSuit: switchSuit,
      isHigher: isHigher
  }
}
*/