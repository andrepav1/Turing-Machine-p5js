let ruleValues = [];
let tm;

function setup() {

  let arr = ["1","1","1","1","1","1","1","1","1","1","1","1","1"];
  let size = 30;

  let tape = new TMTape(arr,size);


  drawCanvas(window.innerWidth, tape.pos.h + 400);

  tm = new TuringMachine(tape);
  tm.displayCurrentTape();

  fill(250);
  rect(0,tape.pos.h + 50, width, height - 50);

  let y_offset = tape.pos.h + 40;


  fill(0);
  textSize(20);
  text("(q0, s0, q1, s1, m)", 90, y_offset + 40);

  textSize(32);
  text("(", 10, y_offset + 80);
  text(",", 45, y_offset + 80);
  text(",", 75, y_offset + 80);
  text(",", 105, y_offset + 80);
  text(",", 135, y_offset + 80);
  text(")", 170, y_offset + 80);

  let offset = 20;
  for(let i = 0; i < 5; i++) {
	  ruleValues[i] = createInput("");
	  ruleValues[i].size(16,16);

	  let pos = offset + 20*i + 10*i;
	  // console.log(pos);

	  ruleValues[i].position(pos,y_offset + 60);
	  ruleValues[i].input(inputListener);
  }

  textAlign(LEFT);
  textSize(12);

  text("q0: old state", 10, y_offset + 110);
  text("s0: old symbol", 10, y_offset + 125);
  text("q1: new state", 10, y_offset + 140);
  text("s1: new symbol", 10, y_offset + 155);
  text("m: move", 10, y_offset + 170);

  textAlign(CENTER);
  textSize(32);
  var addRuleButton = createButton('add');
  addRuleButton.size(40);
  addRuleButton.position(180,y_offset + 60);
  addRuleButton.mousePressed(addRule);

  var stepButton = createButton('step');
  stepButton.size(50);
  stepButton.position(280,y_offset + 60);
  stepButton.mousePressed(step);

  var runButton = createButton('run');
  runButton.size(50);
  runButton.position(340,y_offset + 60);
  runButton.mousePressed(run);

}

function step() {
  tm.step();
}

function run() {
  tm.run(50);
}

function drawCanvas(w,h) {

  let cnv = createCanvas(w, h);
  background(50);
  textAlign(CENTER);

  return cnv;
}

function addRule() {

  // RULE: state,symbol -> state,symbol,move
  // let r1 = new TMRule("0","1","2","1","R");
  // tm.addRule(r1);

  // let r2 = new TMRule("2","1","0","","L");
  // tm.addRule(r2);

  // setTimeout(tm.run, 1000);

  if(ruleValues[0].value() == " " || ruleValues[0].value() == "" ||
  	 ruleValues[2].value() == " " || ruleValues[2].value() == "") {
  	console.log("You need to specify both states before adding a rule");
  	return;
  }

  let rule = new TMRule(ruleValues[0].value(),
  						ruleValues[1].value(), 
  						ruleValues[2].value(), 
  						ruleValues[3].value(), 
  						ruleValues[4].value().toUpperCase());

  // console.log(rule);
  tm.addRule(rule);

  for(let i in ruleValues) {
	ruleValues[i].elt.value = "";
  }
}

function inputListener() {
	// console.log(this.value());
	if(this.value().length == 1) return;
	this.elt.value = this.value().substring(1,2);
}