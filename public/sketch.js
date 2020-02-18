
// TM elements
let symbols = [];
let tm;

// UX elements
let canvas;
let ruleValues = [];
let TM_import_export_input;
let importJSONButton;
let exportJSONButton;
let addRuleButton;
let stepButton;
let runButton;
let selectVel;
let symbolsInput;
let addSymbolsButton;
let tapeLengthInput;
let resetTMButton;

let anim_velocity;

function setup() {
  initSketch();

}

function initSketch() {

  // symbols = ["1","1","1","1","1","1","1","1","1","1","1","1","1"];

  // Create Turing Machine Tape
  let size = symbols.length*2 < 20 ? 20 : symbols.length*2 + 4;
  let tape = new TMTape(symbols,size);


  // Draw Canvas
  canvas = createCanvas(window.innerWidth, tape.pos.h + 560);

  textAlign(CENTER);
  background(50);

  // Display actual Turing Machine
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

  textAlign(LEFT);
  textSize(12);

  text("q0: old state", 10, y_offset + 110);
  text("s0: old symbol", 10, y_offset + 125);
  text("q1: new state", 10, y_offset + 140);
  text("s1: new symbol", 10, y_offset + 155);
  text("m: move", 10, y_offset + 170);


  // ======================================
  // Creating All UX elements


  textAlign(CENTER);
  let offset = 20;
  for(let i = 0; i < 5; i++) {
	  ruleValues[i] = createInput("");
	  ruleValues[i].size(16,16);

	  let pos = offset + 20*i + 10*i;
	  // console.log(pos);

	  ruleValues[i].position(pos,y_offset + 60);
	  ruleValues[i].input(inputListener);
  }

  push(); 

  textAlign(LEFT);
  textSize(16);
  text("Your rules: ", 400, y_offset + 40);

  strokeWeight(2);
  stroke(50);
  line(380, y_offset + 20, 380, height - 20);
  line(650, y_offset + 20, 650, height - 20);

  pop();

  // =======================================
  // Dealing with JSON rules added by user

  textAlign(LEFT);
  textSize(14);

  text("Import / Export your Turing Machine here:", 10, y_offset + 200);
  TM_import_export_input = createElement("textarea");
  TM_import_export_input.size(140, 120);
  TM_import_export_input.position(10, y_offset + 210);
  TM_import_export_input.attribute("placeholder",'{\n  "rules": [],\n  "tape": []\n}');

  importJSONButton = createButton('Import');
  importJSONButton.size(60);
  importJSONButton.position(160,y_offset + 210);
  importJSONButton.mousePressed(importTM);

  exportJSONButton = createButton('Export');
  exportJSONButton.size(60);
  exportJSONButton.position(225,y_offset + 210);
  exportJSONButton.mousePressed(exportTM);

  resetTMButton = createButton("Reset TM");
  resetTMButton.size(110);
  resetTMButton.position(260, y_offset + 120)
  resetTMButton.mousePressed(function() {
    // T0 reset Turing Machine, we just need to press 'Export' and then 'Import', so I cheeky'd it
    exportTM(); importTM("cheeky");
  });
  
  // =======================================

  text("Set symbols on the tape and length:", 10, y_offset + 360);
  symbolsInput = createInput();
  symbolsInput.size(90, 16);
  symbolsInput.position(10, y_offset + 370);
  symbolsInput.attribute("placeholder", "1,2,a,b,,+");

  text("'auto' for automatic best length", 10, y_offset + 410);
  tapeLengthInput = createInput();
  tapeLengthInput.size(40, 16);
  tapeLengthInput.position(110, y_offset + 370);
  tapeLengthInput.attribute("placeholder", "auto");

  addSymbolsButton = createButton('Add symbols');
  addSymbolsButton.size(100);
  addSymbolsButton.position(160,y_offset + 370);
  addSymbolsButton.mousePressed(addSymbols);

  textAlign(CENTER);
  textSize(32);
  addRuleButton = createButton('add');
  addRuleButton.size(40);
  addRuleButton.position(180,y_offset + 60);
  addRuleButton.mousePressed(addRule);

  stepButton = createButton('step');
  stepButton.size(50);
  stepButton.position(260,y_offset + 60);
  stepButton.mousePressed(step);

  runButton = createButton('run');
  runButton.size(50);
  runButton.position(320,y_offset + 60);
  runButton.mousePressed(run);

  selectVel = createSelect();
  selectVel.size(110);
  selectVel.position(260, y_offset + 90)
  selectVel.option('immediate');
  selectVel.option('fast');
  selectVel.option('normal');  
  selectVel.option('slow');
  selectVel.changed(() => {
    switch (selectVel.value()) {
      case "immediate":
        anim_velocity = 0;
        break;
      case "fast":
        anim_velocity = 40;
        break;
      case "normal":
        anim_velocity = 140;
        break;
      case "slow":
        anim_velocity = 400;
        break;
      default: // Set normal by default
        anim_velocity = 140;
      break;
    }
  });

  // Set animation velocity to 0 when page is loaded for the first time
  anim_velocity = 0; 
}

function step() {
  tm.step();
}

function run() {
  tm.run(anim_velocity);
}

function addSymbols() {
  let new_symbols = symbolsInput.value().split(",");

  console.log(new_symbols);

  for (s of new_symbols) {
    if(!s.match(/^.$|^$/g)) {
      alert("Wrong format: Insert each symbol separated by a comma");
      return;
    }
  }
  symbols = new_symbols;

  try{
    let userInput = tapeLengthInput.value();
    if(userInput == "auto" || userInput == "") {
      var size = symbols.length*2 < 20 ? 20 : symbols.length*2 + 4;
    }
    else {
      var size = parseInt(userInput);
    }
  } catch(e) {
    alert(e);
  }

  // Cover current tape with a rect element
  push();
  fill(50);
  rect(0,0,width,tm.tape.pos.h + 50);
  pop();

  console.log(size);

  // Create and draw new tape
  tm.tape = new TMTape(symbols,size);
  tm.displayCurrentTape();

  tapeLengthInput.elt.value = "";
  symbolsInput.elt.value = "";
  console.log("Symbols added successfully");
  alert("Symbols added successfully");
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
    alert("You need to specify both states before adding a rule");
  	return;
  }

  let pair = new TMPair(ruleValues[0].value(),ruleValues[1].value());
  let triple = new TMTriple(ruleValues[2].value(),ruleValues[3].value(),ruleValues[4].value().toUpperCase());
  let rule = new TMRule(pair,triple);
  // console.log(rule);

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

function importTM(isCheeky) {
  // console.log(TM_import_export_input.value());
  
  let importedTM = TM_import_export_input.value();


  try {
      var newTM = JSON.parse(importedTM);
  } catch(e) {
      alert(e);
      return;
  }

  // console.log(newTM);

  if(newTM.tape == undefined || newTM.rules == undefined) {
    console.log("JSON string is not a Turing Machine");
    alert("JSON string is not a Turing Machine");
    return;
  }

  // ====================================
  // Delete all UX elements

  canvas.remove();
  for(let i in ruleValues) ruleValues[i].remove();
  TM_import_export_input.remove();
  importJSONButton.remove();
  exportJSONButton.remove();
  addRuleButton.remove();
  stepButton.remove();
  runButton.remove();
  selectVel.remove();
  symbolsInput.remove();
  addSymbolsButton.remove();
  tapeLengthInput.remove();
  resetTMButton.remove();

  // ====================================

  try {
    // Adding symbols
    symbols = newTM.tape;

    initSketch(); 

    //Adding Rules
    for(let rule of newTM.rules) {
      let new_pair = new TMPair(rule[0],rule[1]);
      let new_triple = new TMTriple(rule[2], rule[3], rule[4]);
      let new_rule = new TMRule(new_pair,new_triple);
      tm.addRule(new_rule);
    }

  } catch(e) {
    alert(e); 
    return;
  }

  TM_import_export_input.elt.value = "";
  if(isCheeky == undefined) alert("TM imported successfully");
}

function exportTM() {
  TM_import_export_input.elt.value = tm.exportTM();

  // TM_import_export_input.value().select();
  // document.execCommand("copy");
}
