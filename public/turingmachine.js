class TuringMachine {

	constructor(_t) {
		this.rules = []
		this.tape = _t;
		this.displayCurrentTape = () => this.tape.show(); 
		this.currState = 0;
		this.currPosition = 0;
		
		// Run Turing Machine
		this.run = () => {
			if(this.step()) {
				setTimeout(this.run,2000);
			} // else do nothing
		}

		// Do one step of Turing Machine
		this.step = () => {

			let rule = this.getRule();

			// console.log(rule);

			if(rule == undefined) {
				console.log("No available moves: TM halts");
				return false;
			}

			this.applyRule(rule);
			return true;
		}

		// Add a new Rule
		this.addRule = (new_rule) => {
			this.rules[this.rules.length] = new_rule;
		}

		// Remove a rule
		this.removeRule = (rule) => {

		}
	}

	applyRule(rule) {

		this.setCurrentState(rule.new_state);
		this.setSymbol(rule.new_symbol);
		this.setCurrentPosition(rule.move);
		this.displayCurrentTape();
	}

	setCurrentState(new_state) {
		this.currState = new_state;
		this.tape.currState = new_state;
	}

	setSymbol(new_symbol) {
		this.tape.setCurrentSymbol(new_symbol)
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

	// Complexity here can be improved using a Map
	getRule() {
		let curr_state = this.currState;
		let curr_symbol = this.tape.getCurrentSymbol();

		// console.log("Searching: " + curr_state + ", " + curr_symbol);

		for (let i in this.rules) {
			// console.log(this.rules[i]);
			if(this.rules[i].old_state == curr_state.toString() && this.rules[i].old_symbol == curr_symbol.toString()) {
				return this.rules[i];
			}
		}
	}
}

// RULE: state,symbol -> state,symbol,move
class TMRule {
	constructor(_old_state, _old_symbol, _new_state, _new_symbol, _move) {
		this.old_state = _old_state;
		this.new_state = _new_state;
		this.old_symbol = _old_symbol;
		this.new_symbol = _new_symbol;
		this.move = _move;
	}
}