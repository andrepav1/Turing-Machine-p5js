const empty = "Λ";

// =========================================
// TMTape Class
// =========================================
class TMTape {

  constructor(_symbols, _size) {
    this.squareSize = Math.ceil(window.innerWidth / (_size + 1));
    this.pos = new Position(0,40,window.innerWidth, this.squareSize);
    this.symbols = _symbols;
    this.tapeSize = _size;
    this.offsetPos = Math.floor((_size - _symbols.length) / 4);
    this.TMsquares = [];
    this.currPosition = 0;
    this.currState = 0;

    // Initialise Tape
    this.initTape();
  }

  initTape() {

    let midTapePos = Math.floor((this.tapeSize - (this.symbols.length)) / 4);
    // console.log(window.innerWidth + " - " + midTapePos);

    for(let i = 0; i < this.tapeSize + 2; i++) {
      let pos = new Position(i * this.squareSize - 4, 40, this.squareSize, this.squareSize);
      let tapePos = i - this.offsetPos;
      let symbol = "" 

      if(i >= midTapePos && i < midTapePos + this.symbols.length) {
        symbol = this.symbols[i - midTapePos].trim();
      }

      if(symbol === " ") symbol = "";

      if(i == 0 || i == this.tapeSize + 1) {
        symbol = "...";
        tapePos = "";
      }

      this.TMsquares[i] = new TMSquare(pos,tapePos, symbol, this.squareSize * 0.6);
    }

    // Set square at position 0 to highlighted
    this.TMsquares[this.offsetPos].highlighted = true;
  }

  deleteTape(arr) {
    this.tape = [];
  }

  setHighlightSquare(pos) {
    for(let i in this.TMsquares) {
      this.TMsquares[i].highlighted = false
    }
    this.TMsquares[pos].highlighted = true;
  }

  setCurrentSymbol(new_symbol) {

    if(new_symbol === " ") new_symbol = "";
    this.TMsquares[this.currPosition + this.offsetPos].symbol = new_symbol;
  }
  
  getCurrentSymbol(new_symbol) {
    return this.TMsquares[this.currPosition + this.offsetPos].symbol;
  }

  show() {
    
    console.log("state:" + this.currState + "pos: " + this.currPosition);

    fill(230);
    rect(this.pos.x,this.pos.y,this.pos.w,this.pos.h);

    if(this.TMsquares.length == 0) {
      console.log("Turing Machine is empty");
      alert("Turing Machine is empty");
      return;
    }

    this.setHighlightSquare(this.currPosition + this.offsetPos);

    fill(50);
    rect(0,0,width, this.squareSize + 50);

    for(let i in this.TMsquares) {
      this.TMsquares[i].show(this.currState);
    }

    this.TMsquares[this.currPosition + this.offsetPos].show(this.currState);
  }
}

// =========================================
// TapeSquare Class
// =========================================
class TMSquare {

  constructor(_pos, _tapePos, _sym, _size) {
    this.pos = _pos;
    this.tapePos = _tapePos;
    this.symbol = _sym;
    this.fontSize = _size;
    this.highlighted = false;
  }

  show(state) {

    fill(250);
    if(this.highlighted) {
      stroke(0,160,240)
      strokeWeight(3);
      rect(this.pos.x,this.pos.y,this.pos.w,this.pos.h);
      strokeWeight(0);
      fill(0,120,200)
      let arrow_pos_x = this.pos.x + this.pos.w*0.5;

      // triangle( arrow_pos_x - this.pos.w/4, 35 - this.pos.w/6, 
      //           arrow_pos_x + this.pos.w/4, 35 - this.pos.w/6, 
      //           arrow_pos_x, 35);

      fill(256);
      textSize(32); 
      text(state.toString(), arrow_pos_x, 32);
    }
    else {
      stroke(0);
      strokeWeight(1);
      rect(this.pos.x,this.pos.y,this.pos.w,this.pos.h);
      strokeWeight(0);
    }

    fill(0);

    // Draw Symbol
    textSize(this.fontSize); 
    let sym = this.symbol;

    if(sym === "" || sym === " ") sym = empty;
    text(sym, this.pos.x + this.pos.w*0.5, this.pos.y + this.pos.h*0.75);

    // Draw TMSquare position on the bottom-right corner 
    textSize(this.fontSize * 0.35);
    text(this.tapePos, this.pos.x + this.pos.w*0.8, this.pos.y + this.pos.h*0.94); 

  }

}

// =========================================
// Position Class
// =========================================
class Position {
    constructor(_x,_y,_w,_h) {
    this.x = _x;
    this.y = _y;
    this.w = _w;
    this.h = _h;
  }
}

