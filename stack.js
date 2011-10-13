var Card = require('./card.js');

function Stack() {

  // Create an empty array of cards.

  this.cards = [];

  this.makeDeck      = stackMakeDeck;
  this.shuffle       = stackShuffle;
  this.deal          = stackDeal;
  this.draw          = stackDraw;
  this.addCard       = stackAddCard;
  this.combine       = stackCombine;
  this.cardCount     = stackCardCount;
  this.size          = stackCardCount;
  this.sort          = sort;
  this.playableCards = playable;
  this.contains      = contains;
}
/*
 Alternative constructor.  Not used
function stack() {

  return {
    // Create an empty array of cards.
    cards: [],
    
    makeDeck: stackMakeDeck,
    shuffle: stackShuffle,
    deal: stackDeal,
    draw: stackDraw,
    addCard: stackAddCard,
    combine: stackCombine,
    cardCount: stackCardCount,
    size: stackCardCount,
    sort: stackSort,
    playableCards: playable
  }
}
*/
// A Deck is a stack
// Creates a Deck with the given number of cards
// number -> Deck
function stackMakeDeck(n) {

  var ranks = new Array("9", "10", "J", "Q", "K", "A");
  var suits = new Array("C", "D", "H", "S");
  var i, j, k;
  var m;

  m = ranks.length * suits.length;

  // Set array of cards.

  this.cards = new Array(n * m);

  // Fill the array with 'n' packs of cards.

  for (i = 0; i < n; i++)
    for (j = 0; j < suits.length; j++)
      for (k = 0; k < ranks.length; k++)
        this.cards[i * m + j * ranks.length + k] =
          new Card(ranks[k], suits[j]);
}

// Shuffles the stack n times
// number -> Stack
function stackShuffle(n) {

  var i, j, k;
  var temp;

  // Shuffle the stack 'n' times.

  for (i = 0; i < n; i++)
    for (j = 0; j < this.cards.length; j++) {
      k = Math.floor(Math.random() * this.cards.length);
      temp = this.cards[j];
      this.cards[j] = this.cards[k];
      this.cards[k] = temp;
    }
}

// Deals a single card from the stack
// That card is removed from the stack and returned
// -> Card
function stackDeal() {

  if (this.cards.length > 0)
    return this.cards.shift();
  else
    return null;
}

// Draw a single card from the stack at index n
// That card is removed from the stack and returned
// number -> Card
function stackDraw(n) {

  var card;

  if (n >= 0 && n < this.cards.length) {
    card = this.cards[n];
    this.cards.splice(n, 1);
  }
  else
    card = null;

  return card;
}

// Returns the number of cards in the stack
// -> Number
function stackCardCount() {

  return this.cards.length;
}

// Adds the given card to the stack
// Card -> Stack
function stackAddCard(card) {

  this.cards.push(card);
}

// Combines this stack with that stack
// Stack -> Stack
function stackCombine(stack) {

  this.cards = this.cards.concat(stack.cards);
  stack.cards = new Array();
}

// Returns the index of the lowest card
// Stack Suit -> Number
function lowestCard(hand, trump) {
  var lowest = 0;
  hand.stackDeal();
  
  for(var i = 0; i < hand.stackCardCount(); i++) {
    // checks each card to find lowest
    if(hand.cards[i].isHigher(hand.cards[lowest], trump)) {
      lowest = i;
    }
  }
  
  return lowest;
}

// Sorts the cards in a stack given a trump Suit
// suit -> Stack
function sort(s) {
  var temp = new Stack();
  
  for(var i = 0; i < this.stackCardCount(); i++) {
    temp.addCard(this.stackDraw(lowestCard(this, s)));
  }
  
  return temp;
}

// Checks to see if the stack contains a card of the given suit
// Suit -> Boolean
function contains(s) {
  var r = false;
  for(var i = 0; i < this.stackCardCount(); i++) {
    r = r || this.cards[i].activeSuit == s;
  }
  return r;
}

// Returns a stack of the playable cards
// Suit -> Stack
function playable(s) {
  var temp = new Stack();
  if(this.contains(s)) {
    for(var i = 0; i < this.stackCardCount(); i++) {
      if(this.cards[i].activeSuit == s) {
        temp.addCard(this.cards[i]);
      }
    }
    return temp;
  } else {
    return this;
  }
}

function setTrump(s) {
	for(c in this.cards) {
		c.switchSuit(s);
	}
}

module.exports = Stack;