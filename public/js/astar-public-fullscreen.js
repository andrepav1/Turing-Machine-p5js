// ===============================
// @author: Andrea Pavan
// @project: A* Visualiser and Priority Queue
// ===============================
var cols, rows;
var animationPlaying;

var obstaclesAmount;

var allCells = [];

var availableCells;

var visitedColor;
var pathColor;
var checkedColor;
var targetCellColor;
var startingCellColor;
var obstaclesColor;
var unseenColor;

var startingCell;
var targetCell;
var insertMode;

var tableW, tableH;
var menuW;

var heuristic;
var searchAlgo;

var currCell;
var stepInterval;
var targetFound;

var manhattanButton;
var euclideanButton;

function setup() {


  // =========================================
  // Tunables

  obstaclesAmount = 3000;
  tableW = 800;
  tableH = 800;
  menuW = 120;
  cols = 100;
  rows = 100;

  stepInterval = 0; // In milliseconds
  //frameRate(1);

  // =========================================

  createCanvas(tableW + menuW, tableH);
  availableCells = new PriorityQueue();

  // Colors

  seenColor = color("#ceebed");
  visitedColor = color("#728bb3");
  //pathColor = color("#fa3ced");
  pathColor = color("#fffa6e");
  targetCellColor = color("#ff0000");
  startingCellColor = color("#00ff00");
  obstaclesColor = color(0);
  emptyCellColor = color(255);
  unseenColor = color("#ff9238");

  //print("Double click to set the starting cell and the target cell.");
  strokeWeight(0.2);
  stroke(180);

  // Set table
  background("#ffc226");
  setTimeout(setTable);
  setTimeout(drawTable, 10);
  setTimeout(setRandomObstaclesCells, 25);
  setTimeout(setRandomStartingAndTargetCell, 50);

  animationPlaying = false;
  targetFound = false;

  // Buttons 
  var startButton = createButton('Start');
  startButton.size(menuW / 2);
  startButton.position(tableW + (menuW / 4), (menuW / 4) * 1);
  startButton.mousePressed(startAnimation);

  var stopButton = createButton('Stop');
  stopButton.size(menuW / 2);
  stopButton.position(tableW + (menuW / 4), (menuW / 4) * 2);
  stopButton.mousePressed(stopAnimation);

  var resetButton = createButton('Reset');
  resetButton.size(menuW / 2);
  resetButton.position(tableW + (menuW / 4), (menuW / 4) * 3);
  resetButton.mousePressed(reset);

  manhattanButton = createButton('Manhattan');
  manhattanButton.size((menuW / 10) * 8);
  manhattanButton.position(tableW + (menuW / 10), (menuW / 4) * 6);
  manhattanButton.mousePressed(setHeuristicToManhattan);
  manhattanButton.style("border-width", "2px");
  manhattanButton.style("border-color", "blue");

  euclideanButton = createButton('Euclidean');
  euclideanButton.size((menuW / 10) * 8);
  euclideanButton.position(tableW + (menuW / 10), (menuW / 4) * 7);
  euclideanButton.mousePressed(setHeuristicToEuclidean);
  euclideanButton.style("border-width", "1px");
  euclideanButton.style("border-color", "grey");

  astarButton = createButton('A*');
  astarButton.size((menuW / 10) * 8);
  astarButton.position(tableW + (menuW / 10), (menuW / 4) * 9);
  astarButton.mousePressed(setSearchToAstar);
  astarButton.style("border-width", "2px");
  astarButton.style("border-color", "blue");

  dfsButton = createButton('Depth First');
  dfsButton.size((menuW / 10) * 8);
  dfsButton.position(tableW + (menuW / 10), (menuW / 4) * 10);
  dfsButton.mousePressed(setSearchToDFS);
  dfsButton.style("border-width", "1px");
  dfsButton.style("border-color", "grey");

  bfsButton = createButton('Breadth First');
  bfsButton.size((menuW / 10) * 8);
  bfsButton.position(tableW + (menuW / 10), (menuW / 4) * 11);
  bfsButton.mousePressed(setSearchToBFS);
  bfsButton.style("border-width", "1px");
  bfsButton.style("border-color", "grey");

  searchAlgo = "astar";
  heuristic = "manhattan";
}

function setSearchToAstar() {
  searchAlgo = "astar";
  astarButton.style("border-width", "2px");
  astarButton.style("border-color", "blue");
  dfsButton.style("border-width", "1px");
  dfsButton.style("border-color", "grey");
  bfsButton.style("border-width", "1px");
  bfsButton.style("border-color", "grey");
  print("Set Search algorithm to: " + searchAlgo);
}

function setSearchToDFS() {
  searchAlgo = "dfs";
  astarButton.style("border-width", "1px");
  astarButton.style("border-color", "grey");
  dfsButton.style("border-width", "2px");
  dfsButton.style("border-color", "blue");
  bfsButton.style("border-width", "1px");
  bfsButton.style("border-color", "grey");
  print("Set Search algorithm to: " + searchAlgo);
}

function setSearchToBFS() {
  searchAlgo = "bfs";
  astarButton.style("border-width", "1px");
  astarButton.style("border-color", "grey");
  dfsButton.style("border-width", "1px");
  dfsButton.style("border-color", "grey");
  bfsButton.style("border-width", "2px");
  bfsButton.style("border-color", "blue");
  print("Set Search algorithm to: " + searchAlgo);
}

function setHeuristicToEuclidean() {
  heuristic = "euclidean";
  euclideanButton.style("border-width", "2px");
  euclideanButton.style("border-color", "blue");
  manhattanButton.style("border-width", "1px");
  manhattanButton.style("border-color", "grey");
  print("Set Heuristic to: " + heuristic);
}

function setHeuristicToManhattan() {
  heuristic = "manhattan";
  euclideanButton.style("border-width", "1px");
  euclideanButton.style("border-color", "grey");
  manhattanButton.style("border-width", "2px");
  manhattanButton.style("border-color", "blue");
  print("Set Heuristic to: " + heuristic);
}

function reset() {
  availableCells.removeAll();
  resetTable();
}

// ======================================================
// Animation control functions
// ======================================================
function startAnimation() {

  if (areStartingAndTargetCellsSet()) {
    print("start animation");
    animationPlaying = true;
    AStar();
  } else {
    print("Before you can Start the animation, you need to set starting and target cells");
    print("Double click to set the starting cell and the target cell.");
  }
}

function stopAnimation() {
  animationPlaying = false;
  print("stop animation");
}

// ======================================================
// A Star Algorithm
// ======================================================
function AStar() {
  startingCell.visited = true;
  startingCell.f = 0;

  currCell = startingCell;
  setTimeout(AStarStep, stepInterval);
}

// A*: One step 
function AStarStep() {

  if (targetFound)
    return;

  // Set adjacent cells values and add them to priority queue
  setAdjacentCellValues(currCell);

  findPath(currCell, visitedColor);

  // Get the head of the priority Queue
  currCell = getMinimumSeenCell();

  if (currCell == null) {
    print("No path could be found.");
    targetFound = true;
    animationPlaying = false;

    updateUnseenCellsColor();
    return;
  }

  if (currCell.equal(targetCell)) {
    print("Target Found.");
    targetFound = true;
    animationPlaying = false;

    findPath(FindAdjacentLowestF(targetCell), pathColor);
    return;
  }

  currCell.visited = true;

  findPath(currCell, pathColor);

  if (animationPlaying)
    setTimeout(AStarStep, stepInterval);
}

function setAdjacentCellValues(curr) {

  // Get the available cells
  adjacentCells = getAvailableCells(curr);

  for (var i = 0; i < adjacentCells.length; i++) {
    var c = adjacentCells[i];
    if (!c.visited) {

      //Set path cost of cell
      var newF = curr.f + getDistance(curr, c);
      if (newF < c.f) c.f = newF;
      setHeuristic(c);

      //Add cell to priority queue
      availableCells.insert(c);

      if (!c.equal(startingCell) && !c.equal(targetCell))
        c.updateColor(seenColor);

      //print(c.toString() + " - f: " + c.f + " - h: " + c.heuristic);
    }
  }
}

/* This function returns an array of cells that can be reached from the given cell
 * Here, diagonal movement is only permitted where the 2 cells are reachable in 2 moves
 * only using the white cells 
 */
function getAvailableCells(curr) {
  var cellsArr = [];
  //print(curr.toString());

  for (var i = -1; i < 2; i++) {
    for (var j = -1; j < 2; j++) {

      if (curr.x + i >= 0 && curr.x + i < cols &&
        curr.y + j >= 0 && curr.y + j < rows) {
        var c = allCells[curr.x + i][curr.y + j];
        if (!c.obstacle) {

          if (getManhattanHeuristic(curr, c) == 2) {

            var cx = allCells[curr.x][curr.y + j];
            var cy = allCells[curr.x + i][curr.y];
            if (!cx.obstacle || !cy.obstacle)
              cellsArr[cellsArr.length] = c;

          } else {
            cellsArr[cellsArr.length] = c;
          }
        }
      }
    }
  }
  return cellsArr;
}

function getMinimumSeenCell() {

  return availableCells.pop();
}

function findPath(curr, col) {
  var count = 0;

  while (!curr.equal(startingCell)) {
    curr.updateColor(col);
    curr = FindAdjacentLowestF(curr);

    if (count++ > cols * rows) break;
  }

  //print(curr.toString() + " - " + curr.f + " - " + startingCell.toString() + " - " + startingCell.f );
  //print("found");

}



// ================================================
// This function is wrong and needs to be re-done
// ================================================
function FindAdjacentLowestF(curr) {
  var minC = curr;
  var adjacentCellsArr = getAvailableCells(curr);

  for (var i = 0; i < adjacentCellsArr.length; i++) {
    var c = adjacentCellsArr[i];

    if (c.visited) {
      if (c.f < minC.f) {
        minC = c;
      }
    }
  }
  return minC;
}

// ================================================
// ================================================
// ================================================



function setHeuristic(cell) {
  //Set heuristic of cell
  switch (heuristic) {
    case "manhattan":
      cell.heuristic = getManhattanHeuristic(cell, targetCell);
      break;
    case "euclidean":
      cell.heuristic = getEuclideanHeuristic(cell, targetCell);
      break;
    default: // manhattan by default
      cell.heuristic = getManhattanHeuristic(cell, targetCell);
  }
}

function getManhattanHeuristic(from, to) {
  xD = from.x > to.x ? from.x - to.x : to.x - from.x;
  yD = from.y > to.y ? from.y - to.y : to.y - from.y;
  return xD + yD;
}

function getEuclideanHeuristic(from, to) {
  return getDistance(from, to);
}

function getDistance(from, to) {
  var a = from.x - to.x;
  var b = from.y - to.y;
  return Math.sqrt(a * a + b * b);
}

// ======================================================
// table functions
// ======================================================
function setTable() {
  for (var i = 0; i < cols; i++) {
    allCells[i] = [];
    for (var j = 0; j < rows; j++) {
      c = new Cell(i, j);
      allCells[i][j] = c;
    }
  }
}

function drawTable() {
  fill(emptyCellColor);
  for (var i = 0; i < cols; i++) {
    for (var j = 0; j < rows; j++) {
      allCells[i][j].draw();
    }
  }
}

function updateUnseenCellsColor() {
  fill(unseenColor);
  for (var i = 0; i < cols; i++) {
    for (var j = 0; j < rows; j++) {
      var c = allCells[i][j];
      if (!c.obstacle && !c.visited)
        c.draw();
    }
  }
}

function resetTable() {
  animationPlaying = false;
  targetFound = false;

  setTimeout(setTable);
  setTimeout(drawTable, 10);
  setTimeout(setRandomObstaclesCells, 25);
  setTimeout(setRandomStartingAndTargetCell, 50);
}

// ============================================================
// Other cell functions
// ============================================================
function areStartingAndTargetCellsSet() {
  return (startingCell.exists() && targetCell.exists());
}

function setRandomObstaclesCells() {

  if (obstaclesAmount > cols * rows) {
    obstaclesAmount = cols * rows;
  }
  for (var i = 0; i < obstaclesAmount; i++) {
    var c = allCells[floor(random(0, cols))][floor(random(0, rows))];
    //print(c.toString());
    if (c.obstacle) i--;

    c.updateColor(obstaclesColor);
    c.obstacle = true;
  }
}

function setRandomStartingAndTargetCell() {
  // Initialise starting and target cell
  startingCell = allCells[floor(random(0, cols))][floor(random(0, rows))];
  targetCell = allCells[floor(random(0, cols))][floor(random(0, rows))];
  startingCell.updateColor(startingCellColor);
  targetCell.updateColor(targetCellColor);
  startingCell.obstacle = false;
  targetCell.obstacle = false;
}

// ============================================================
// Mouse Event
// ============================================================
function mousePressed() {
  if (!areStartingAndTargetCellsSet() || animationPlaying || targetFound) return;
  
  if(mouseX > tableW || mouseX < 0 || mouseY > tableH || mouseY < 0) return;
  
  var mouse_pos = getCellFromMousePosition();
  //print(mouse_pos);
  var tableMouseCell = allCells[mouse_pos.x][mouse_pos.y];

  insertMode = !tableMouseCell.obstacle;

  if (!tableMouseCell.equal(startingCell) && !tableMouseCell.equal(targetCell)) {
    tableMouseCell.obstacle = insertMode;
    tableMouseCell.updateColor(insertMode ? obstaclesColor : emptyCellColor);
  }
}

function mouseDragged() {
  if (!areStartingAndTargetCellsSet() || animationPlaying || targetFound) return;

  if(mouseX > tableW || mouseX < 0 || mouseY > tableH || mouseY < 0) return;
  
  var mouse_pos = getCellFromMousePosition();
  var tableMouseCell = allCells[mouse_pos.x][mouse_pos.y];

  if (!tableMouseCell.equal(startingCell) && !tableMouseCell.equal(targetCell)) {
    tableMouseCell.obstacle = insertMode;
    tableMouseCell.updateColor(insertMode ? obstaclesColor : emptyCellColor);
  }
}

function getCellFromMousePosition() {
  mouseI = floor(mouseX * cols / tableW);
  mouseJ = floor(mouseY * rows / tableH);

  if (mouseI < 0) mouseI = 0;
  if (mouseJ < 0) mouseJ = 0;
  if (mouseI > cols - 1) mouseI = cols - 1;
  if (mouseJ > rows - 1) mouseJ = rows - 1;
  //print(mouseI);
  //print(mouseJ);
  return new Cell(mouseI, mouseJ);
}

function doubleClicked() {

  if (animationPlaying || targetFound) return;

  var mouse_pos = getCellFromMousePosition();
  var tableMouseCell = allCells[mouse_pos.x][mouse_pos.y];

  if (startingCell.equal(tableMouseCell)) {
    startingCell = new Cell(-1);
    print("Starting cell removed.");
    tableMouseCell.obstacle = false;
    tableMouseCell.updateColor(emptyCellColor);
    return;
  }
  if (targetCell.equal(tableMouseCell)) {
    targetCell = new Cell(-1);
    print("Target cell removed.");
    tableMouseCell.obstacle = false;
    tableMouseCell.updateColor(emptyCellColor);
    return;
  }
  if (!startingCell.exists()) {
    print("Starting cell set!");
    startingCell = tableMouseCell;
    tableMouseCell.obstacle = false;
    tableMouseCell.updateColor(startingCellColor);
    return;
  } else if (!targetCell.exists()) {
    print("Target cell set!");
    targetCell = tableMouseCell;
    tableMouseCell.obstacle = false;
    tableMouseCell.updateColor(targetCellColor);
    return;
  }
}

// ============================================================
// Cell object
// ============================================================
class Cell {
  constructor(_x, _y) {
    this.x = _x;
    this.y = _y;
    this.xPos = tableW / cols * this.x;
    this.yPos = tableH / rows * this.y;
    this.h = tableH / rows;
    this.w = tableW / cols;
    this.heuristic = Infinity;
    this.f = Infinity;
    this.visited = false;
    this.obstacle = false;
    this.path = false;
  }

  exists() {
    return (this.x != -1);
  }

  equal(c) {
    if (!this.exists()) return false;
    return (this.x == c.x && this.y == c.y)
  }

  updateColor(color) {
    fill(color);
    this.draw();
  }

  draw() {
    if (!this.exists()) return;

    strokeWeight(0.2);
    stroke(180);
    rect(this.xPos, this.yPos, this.w, this.h);
  }

  toString() {
    if (!this.exists()) return "";
    return "x: " + this.x + " y: " + this.y;
  }
}

// ============================================================
// Priority Queue implementation
// ============================================================
class PriorityQueue {

  constructor() {
    this.size = 0;
    this.headNode = null;
  }

  insert(newElement) {

    var newNode = new PriorityNode(newElement);

    // Adds an element to an empty queue
    if (this.size == 0) {
      this.headNode = newNode;
      this.size++;
      return;
    }

    // Case when new Node has the lowest value
    if (this.headNode.value > newNode.value) {
      newNode.nextNode = this.headNode;
      this.headNode = newNode;
      this.size++;
      return;
    }

    var currNode = this.headNode;

    // Adding an element to the queue
    while (currNode != null && currNode.nextNode != null) {

      // If cell already exists in priority queue, do not add it again
      if (currNode.cell.equal(newNode.cell))
        return;

      if (searchAlgo == "bfs" || searchAlgo == "astar") {

        if (currNode.nextNode.value > newNode.value) {
          newNode.nextNode = currNode.nextNode;
          currNode.nextNode = newNode;
          this.size++;
          return;
        }
      }
      else if(searchAlgo == "dfs")
      {
        if (currNode.nextNode.value < newNode.value) {
          newNode.nextNode = currNode.nextNode;
          currNode.nextNode = newNode;
          this.size++;
          return;
        }
      }
      
      currNode = currNode.nextNode;
    }

    // Case when new Node has the highest/lowest value 
    currNode.nextNode = newNode;
    this.size++;

  }

  pop() {

    if (this.size == 0) {
      return null;
    }

    if (this.size == 1) {
      var tmpNode = this.headNode;
      this.headNode = null;
      this.size--;
      return tmpNode.cell;
    }

    var tmp = this.headNode;
    this.headNode = this.headNode.nextNode;
    this.size--;

    return tmp.cell;
  }

  removeHead() {
    this.headNode = this.headNode.nextNode;
    this.size--;
  }
  removeAll() {
    this.headNode = null;
    this.size = 0;
  }
}

class PriorityNode {

  constructor(c) {
    this.nextNode = null;
    if(searchAlgo == "astar") {
      this.value = c.f + c.heuristic;
    }
    else if(searchAlgo == "bfs" || searchAlgo == "dfs") 
    {
      this.value = c.f;
    }
    this.cell = c;
  }
}