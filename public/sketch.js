
function setup() {

  let arr = ["1","1","+","1","1","1","="];
  let size = 20;

  let tape = new TMTape(arr,size);
  drawCanvas(window.innerWidth, tape.pos.h + 60);

  let tm = new TuringMachine(tape);


  // RULE: state,symbol -> state,symbol,move
  let r1 = new TMRule("0","1","2","1","R");
  tm.addRule(r1);

  let r2 = new TMRule("2","1","0","","L");
  tm.addRule(r2);

  tm.displayCurrentTape();

  setTimeout(tm.run, 2000);
}

function drawCanvas(w,h) {

  let cnv = createCanvas(w, h);
  background(50);
  textAlign(CENTER);

  return cnv;
}
