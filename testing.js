var logic = require('./logic.js'),
	Card = require('./card.js'),
	Stack = require('./stack.js'),
	rh = require('./requestHandlers.js');
	
var c1, c2, c3, c4, c5, d1, s1, g1, g2, testsPassed = 0;
	
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
	d1 = new Stack();
	d1.makeDeck(1);
	g1 = { 
		hands: [new Stack(), new Stack(), new Stack(), new Stack()],
        deck: d1,
        trick: [],
        tricksTaken: [0, 0, 0, 0],
        dealer: undefined,
        calledTrump: undefined,
        trump: undefined,
        flip: undefined,
        score: [0, 0],
        turn: undefined,
        name: 'test'
    };
    g2 = { 
		hands: [new Stack(), new Stack(), new Stack(), new Stack()],
        deck: d1,
        trick: [],
        tricksTaken: [0, 0, 0, 0],
        dealer: undefined,
        calledTrump: undefined,
        trump: undefined,
        flip: undefined,
        score: [0, 0],
        turn: undefined,
        name: 'test'
    };
    o1 = { 
		hands: [new Stack(), new Stack(), new Stack(), new Stack()],
        deck: d1,
        trick: [],
    };
    o2 = { 
		hands: [new Stack(), new Stack(), new Stack(), new Stack()],
        deck: d1,
        trick: [],
    };
    assertTrue("objectEquals", objEqual(o1, o2));
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
	assertTrue("handWinner2", logic.handWinner([2, 1, 1, 1]) == 0);
	
	var testg = logic.setup('test');
	assertTrue("setUpGame", objEqual(testg, g1));
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

function objEqual(o1, o2) {
  for(p in o1) {
      if(typeof(o2[p])=='undefined' && typeof(o1[p])!='undefined') {
      	return false;
      }
  }

  for(p in o1) {
      if (o1[p]) {
          switch(typeof(o1[p])) {
              case 'object':
                  if (!objEqual(o1[p], o2[p])) { 
                  	return false; 
                  } 
                  break;
              case 'function':
                  if (typeof(o2[p])=='undefined' ||
                      (p != 'equals' && o1[p].toString() != o2[p].toString()))
                      return false;
                  break;
              default:
                  if (o1[p] != o2[p] && !(typeof(o1[p])=='undefined' && 
                  						  typeof(o2[p])=='undefined')) { 
                  	return false;
                  }

          }
      } else {
          if (o2[p])
              return false;
      }
  }

  for(p in o2) {
      if(typeof(o1[p])=='undefined' && typeof(o1[p])!='undefined') {
      	return false;
      }
  }

  return true;
}

// Personal test function to check status
function printObj(obj) {
    var output = '';
            
    console.log("Data:  \n{");
    for (property in obj) {
      console.log("\t" + property + ": " + obj[property] + ";");
    }
    console.log("}");
}

function assertTrue(name, test) {
	test ? testsPassed++ : console.log(name + " failed.");
}
	
exports.test = test;