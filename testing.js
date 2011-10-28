var logic = require('./logic.js'),
	Card = require('./card.js'),
	Stack = require('./stack.js'),
	rh = require('./requestHandlers.js');
	
var c1, c2, c3, c4, c5, s1, g1, testsPassed = 0;
	
function test() {
	creation();
	testLogic();
	testCard();
	testStack();
	console.log("# of passed tests: " + testsPassed);
}

function creation() {
	c1 = new Card("J", "H");
	c2 = new Card("J", "D");
	c3 = new Card("A", "S");
	c4 = new Card("9", "C");
	c5 = new Card("10", "D");
	s1 = new Stack();
}

function testLogic() {
	assertTrue("arrsum1", logic.arrsum([0, 2, 1, 2]) == 5);
	assertTrue("arrsum2", logic.arrsum([0, 2, 1, 6]) != 5);
	
	assertTrue("trickWinner1", logic.trickWinner(
		[c1, c2, c3, c4], "C", 3) == 3);
	assertTrue("trickWinner2", logic.trickWinner(
		[c1, c2, c3, c4], "H", 3) == 0);
	assertTrue("trickWinner3", logic.trickWinner(
		[c1, c2, c3, c5], "C", 1) == 1);
	assertTrue("trickWinner4", logic.trickWinner(
		[c1, c2, c3, c5], "C", 0) == 0);
	assertTrue("trickWinner5", logic.trickWinner(
		[c1, c2, c3, c5], "C", 2) == 2);
		
	assertTrue("handWinner1", logic.handWinner([2, 3, 0, 0]) == 1);
	assertTrue("handWinner1", logic.handWinner([2, 1, 1, 1]) == 0);
}

function testCard() {

	// switchSuit should be called before these functions
	// to adequately test them
	c1.switchSuit("C");
	c3.switchSuit("C");
	assertTrue("isHigher1", c3.isHigher(c1, "C"));
	c1.switchSuit("H");
	c2.switchSuit("H");
	assertTrue("isHigher2", c1.isHigher(c2, "H"));
	c1.switchSuit("D");
	c2.switchSuit("D");
	assertTrue("isHigher3", !(c1.isHigher(c2, "D")));
	c1.switchSuit("C");
	c2.switchSuit("C");
	assertTrue("isHigher4", c1.isHigher(c2, "C"));
	
	// reset the active suit of c1, c2
	c1.switchSuit("");
	c2.switchSuit("");	
}

function testStack() {

}

function assertTrue(name, test) {
	test ? testsPassed++ : console.log(name + " failed.");
}
	
exports.test = test;