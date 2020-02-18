class TuringMachine {

	constructor(_t) {
		this.rules = new Map();
		this.tape = _t;
		this.displayCurrentTape = () => this.tape.show(); 
		this.currState = 0;
		this.currPosition = 0;
		this.timeout = undefined;

		this.exportTM = () => { 

			let formatted_rules = [];

			for (let rule of this.rules.values()) {
				// console.log(rule);
				let rule_arr = [rule.TMpair.pair.state,
								rule.TMpair.pair.symbol,
								rule.TMtriple.triple.state,
								rule.TMtriple.triple.symbol,
								rule.TMtriple.triple.move ];

				formatted_rules[formatted_rules.length] = rule_arr;
			}

			return JSON.stringify({ rules : formatted_rules, tape: this.tape.symbols }, undefined, 2);
		}
		// Run Turing Machine
		this.run = (timeout) => {
			if(this.timeout == undefined) this.timeout = timeout;

			if(this.timeout == 0) {
				while(this.step());
				this.displayCurrentTape();
				return;
			}
			
			// console.log(this.timeout);

			if(this.step()) {
				setTimeout(this.run, this.timeout); 
			} // else do nothing
		}

		// Do one step of Turing Machine
		this.step = () => {

			if(this.tape.getCurrentSymbol() === "...") {
				console.log("Tape finished: TM halts");
				alert("Tape finished: TM halts");
				return false;
			}

			let rule = this.getRule();

			if(rule == undefined) {
				// console.log("No available moves: TM halts");
				alert("No available moves: TM halts");
				return false;
			}

			this.applyRule(rule);
			return true;
		}

		// Add a new Rule
		this.addRule = (new_rule) => {

			// Adding the rule to hashmap 
			this.rules.set(new_rule.TMpair.toString(),new_rule);
			console.log("Rule added successfully: " + new_rule.toPrettyString());

			this.showRules();
		}

		// Remove a rule
		this.removeRule = (rule) => {

		}
	}

	applyRule(rule) {

		console.log("Apply: " + rule.toPrettyString());

		this.setCurrentState(rule.TMtriple.triple.state);
		this.setSymbol(rule.TMtriple.triple.symbol);
		this.setCurrentPosition(rule.TMtriple.triple.move);
		this.displayCurrentTape();
	}

	setCurrentState(new_state) {
		this.currState = new_state;
		this.tape.currState = new_state;
	}

	setSymbol(new_symbol) {
		this.tape.setCurrentSymbol(new_symbol);
	}

	setCurrentPosition(move) {
		switch(move) {
			case "R":
				this.currPosition = this.currPosition + 1;
				this.tape.currPosition = this.tape.currPosition + 1;
				break;
			case "L":
				this.currPosition = this.currPosition - 1;
				this.tape.currPosition = this.tape.currPosition - 1;
				break;
			default: // Nothing happens
				break;
		}
	}

	getRule() {
		let pair = new TMPair(this.currState.toString(), this.tape.getCurrentSymbol());
		// console.log("=======================")
		// console.log("Getting " + pair.toPrettyString() + ": ");

		return this.rules.get(pair.toString());
	}

	showRules() {
		// console.log("=======================")
		// console.log("Listing:")

		textAlign(LEFT);
		textSize(16);

		fill(250);
		rect(385, this.tape.pos.h + 60, 260,height - (this.tape.pos.h + 70));
		fill(0);

		text("Your rules: ", 400, this.tape.pos.h + 80);

		textSize(14);
		let index = 0;
		let xPos = 390;
		for (const [pair, rule] of this.rules) {
			// console.log(pair);
			// console.log(rule.toPrettyString());
			let yPos = 20 * index + this.tape.pos.h + 100;

			if(yPos > height - 20) { // If rules go off screen, show them on the right side
				index = 0; 
				yPos = 20 * index + this.tape.pos.h + 100;
				xPos += 130;
			}

			index++;
			// console.log(y);
			text("- " + rule.toPrettyString(), xPos, yPos);	
		}
		textAlign(CENTER);
	}
}

// RULE: state,symbol -> state,symbol,move
class TMRule {
	constructor(_pair,_triple) {
		this.TMpair = _pair;
		this.TMtriple = _triple;
		this.toString = () => JSON.stringify(this);
		this.toPrettyString = () => this.TMpair.toPrettyString() + " -> " + this.TMtriple.toPrettyString();
	}

}

class TMPair {
	constructor(_state, _symbol) {
		this.pair = { state: _state, symbol: _symbol };
		this.toString = () => JSON.stringify(this);
		this.toPrettyString = () => {
			return "(" + this.pair.state + ", " + 
				((this.pair.symbol == "" || this.pair.symbol == " ") ? 
					empty : this.pair.symbol) + ")"; }

	}
}

class TMTriple {
	constructor(_state, _symbol, _move) {
		this.triple = { state: _state, symbol: _symbol, move: _move };
		this.toString = () => JSON.stringify(this);
		this.toPrettyString = () => {
			return "(" + this.triple.state + ", " + 
				((this.triple.symbol == "" || this.triple.symbol == " ") ? 
					empty : this.triple.symbol) + ", " + 
				((this.triple.move != "R" && this.triple.move != "L") ? 
					"0" : this.triple.move) + ")"; }
	}
}