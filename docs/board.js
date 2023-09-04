const COUNTMAX = 40;
const COMPUTEALL = false;
const MOVE_WEIGHT = "bold";
const MOVE_COLOR = "brown";
const BLANK = "x";
const Letter = {'r': 'red', 'b': 'blue', 'g': 'green', 'w': 'lightgray', 'x': 'blank'};
function color2letter(c) {
    for (let k in Letter) {
        if (c == Letter[k]) return k;
    }
}
var Settings = {
    minCount: 8,
    maxCount: 32
};
const EnumTargetPanel = {
    start: -2,
    goal: -1,
    output_start: 0
}

class PazzleState {
    static history = {};
    
    // hole: int, 0-8, 穴の位置を指定
    // state: string, 8文字の文字列で盤面を表記, 色のみを指定したいときはr,g,b,wなどで表記, 空白はx
    // count: int, 現在の手数 
    constructor(state, count, prevState) {
        if (PazzleState.history[state] != undefined) {
            console.error("[PazzleState] state count overlapped.");
            return;
        }
        this.state = state;
        this.hole = state.indexOf(BLANK);
        this.count = count;

        this.prevState = prevState;
        if (prevState != "") this.lastMove = prevState.indexOf(BLANK);
        this.nextStates = [];

        PazzleState.history[state] = this;
    }

    static getLastMove(lastState) {
        if (lastState == "") return -1;
        else return lastState.indexOf(BLANK);
    }

    switchLetter(nextHole) {
        // var next_state = this.state.replace(sBlank, this.state.substr(next_hole, 1));
        // next_state = next_state.slice(0, next_hole) + sBlank + next_state.slice(next_hole+1);
        var nextState = this.state.replace(BLANK, this.state[nextHole]);
        nextState = nextState.slice(0, nextHole) + BLANK + nextState.slice(nextHole + 1);
        return nextState;
    }
    
    getNextState(){
        // var prev_hole = this.get_last_move();
        var nextHole = [];
        if (this.hole >= 3) nextHole.push(this.hole - 3); // up
        if (this.hole % 3 > 0) nextHole.push(this.hole - 1); // left
        if (this.hole % 3 < 2) nextHole.push(this.hole + 1); // right
        if (this.hole < 6) nextHole.push(this.hole + 3); // down

        for (let h of nextHole) {
            var nextState = this.switchLetter(h);
            if (!PazzleState.history[nextState]) {
                let state = new PazzleState(nextState, this.count + 1, this.state);
                this.nextStates.push(state);
            }
        };
    }

    setMoveDirection(next) {
        var nextHole = this.nextHole = PazzleState.getLastMove(next);
        if (this.hole == nextHole - 3) this.moveDirection = 0; // up
        else if (this.hole == nextHole - 1) this.moveDirection = 1; // left
        else if (this.hole == nextHole + 1) this.moveDirection = 2; // right
        else if (this.hole == nextHole + 3) this.moveDirection = 3; // down
    }

    static resetHistory() {
        PazzleState.history = {};
    }
}

class Board extends Page {
    
    init(start, end, mode = null) {
        this.start = start;
        this.end = end;
        if (mode != null) this.mode = mode;
    }
    
    // get_board(state) {
    //     var array = [["", "", ""],
    //                  ["", "", ""],
    //                  ["", "", ""]];
    //     for (let i=0; i<3; i++) {
    //         for (let j=0; j<3; j++) {
    //             let s = Letter[state[3 * i + j]];
    //             array[i][j] = s;
    //         }
    //     }
    //     return array;
    // }
    
    getPazzleCanvas(target) {
        /* target: input_goal(-1), output_start(0), output_cell(n) */
        var parent;
        if (target == EnumTargetPanel.start) {
            parent = this.panes.input.startPazzlePanel;
        } else if (target == EnumTargetPanel.goal) {
            parent = this.panes.input.goalPazzlePanel;
        } else if (target < COUNTMAX) { // within EnumTargetPanel.output_start
            parent = this.panes.output.pazzleContainer.querySelectorAll(".output-cell")[target];
        }
        return  parent.querySelector(".pazzle-canvas");        
    }
    load(target) {
        var canvas = this.getPazzleCanvas(target);
        var panels = canvas.querySelectorAll("rect");
        var ret = "";
        for (let panel of panels) {
            let color = panel.dataset.color;
            ret += color2letter(color);
        }
        if (ret.length != 9) {
          console.log("invalid length.");
        }
        return ret;      
    }
    show(state, target) {
        var canvas = this.getPazzleCanvas(target);
        var panels = canvas.querySelectorAll("rect");
        // var array = this.get_board(state);
        for (let i=0; i<9; i++) {
            let color = Letter[state[i]];
            this.changePanelColor(panels[i], color);
        }
    }
    
    showMove(move, direction, target) {
        var panel = this.getPazzleCanvas(target).querySelectorAll("rect")[move];
        this.emphasizePanel(panel, direction);
    }
    
    makeFootprint(goal) {
        if (this.mode != "quiz" && goal.state != this.end) return;
        var footprint = [];
        var cur = goal;
        var prev;
        while(cur.state != this.start) {
            footprint.unshift(cur);
            if (!PazzleState.history[cur.prevState]) {
                console.log("something is wrong");
                return footprint;
            }
            prev = cur;
            cur = PazzleState.history[cur.prevState];
            cur.setMoveDirection(prev.state);
        }
        cur.setMoveDirection(prev.state);
        footprint.unshift(cur);
        return footprint;
    }
    
    startSearch() {
        var startState = new PazzleState(this.start, 0, "");
        var curState = startState;
        var queue = [];
        var isFound = true;

        while (curState.count < COUNTMAX) {
            if (this.mode != "quiz" && !COMPUTEALL && curState.state == this.end) break;

            curState.getNextState();
            for (let s of curState.nextStates) {
                queue.push(s);
            }

            if (queue.length == 0) {
                console.log("Search is stopped!");
                console.log(curState);
                console.log(Object.keys(PazzleState.history).length);

                if (this.mode == "quiz") {
                    curState = this.chooseQuiz();
                    break;
                }
                if (!PazzleState.history[this.end]) {
                    isFound = false;
                } else {
                    curState = PazzleState.history[this.end];
                }
                break;
            }
            curState = queue.shift();
        }
        if (curState.count == COUNTMAX) {
            console.log("Reach max count: last state is " + curState.state);
            console.log("Total states: " + Object.keys(PazzleState.history).length);
            console.log("Queue remained: " + queue.length);
            isFound = false;
            // return;
        }
        if (isFound) this.goalState = curState;
        this.footprint = this.makeFootprint(curState);
        return this.footprint;
    }
    
    chooseQuiz() {
        var cand = Object.values(PazzleState.history).filter((state) => {
            return (state.count >= Settings.minCount &&
                    state.count <= Settings.maxCount);
        });
        var randIdx = Math.floor(Math.random() * cand.length);
        if (randIdx == cand.length) randIdx -= 1;
        // console.log(randIdx, cand.length, cand[randIdx]);
        this.end = cand[randIdx].state;
        return cand[randIdx];
    }    

    checkInput(start, goal) {
        // 文字数が同じ
        if (start.length != goal.length) {
            console.warn("Warning: length of input and output different.");
            return 999;
        }
        if (start == BLANK.repeat(9)) {
            console.warn("Warning: start is all blank.");
            return 1;
        }
        // 含まれる文字の種類と数が同じ
        var letterCount = {};
        for (let s of start) {
            if (!letterCount[s]) letterCount[s] = 1;
            else letterCount[s] += 1;
        }
        if (letterCount[BLANK] == undefined || letterCount[BLANK] != 1) {
            console.warn("Warning: blank in input is invalid. " + letterCount[BLANK]);
            if (letterCount[BLANK] == undefined) return 2;
            else return 3;
        }
        for (let s of goal) {
            if (letterCount[s] == undefined) {
                console.warn("Warning: %s is not in input. %s", s, letterCount[s]);
                return 4;
            }
            else letterCount[s] -= 1;
        }
        if (this.mode == "quiz") return 0;
        for (let s in letterCount) {
            if (letterCount[s] != 0) {
                console.warn("Warning: count of letter %s is different.", s);
                return 4;
            }
        }
        return 0;
    }

    clearQuizSetting() {
        // TODO in future.
    }

    clearOutput() {
        this.clearAllPanelEmphasis();
        var canvases = this.panes.output.pazzleContainer.querySelectorAll(".pazzle-canvas");
        for (let cv of canvases) {
            for (let rect of cv.querySelectorAll("rect")) {
                this.clearPanel(rect);
            }
        }
        this.resetGoalCell();
        this.elems.leastCount.textContent = "";
        // this.hideOutput();
    }
      
    clearInput() {
        var canvas = this.getPazzleCanvas(EnumTargetPanel.start);
        for (let rect of canvas.querySelectorAll("rect")) {
            this.clearPanel(rect);
        }
        canvas = this.getPazzleCanvas(EnumTargetPanel.goal);
        for (let rect of canvas.querySelectorAll("rect")) {
            this.clearPanel(rect);
        }
    }
      
    clearAll() {
        this.clearInput();
        this.clearOutput();
        this.clearQuizSetting();
        this.showUsage();
    }

    writeOutput(footprint) {
        // var row = 6;
        // var col = 2;
        var target = EnumTargetPanel.output_start;
        for (let state of footprint) {
          // if (state == start_string) continue;
          this.show(state.state, target);
          if (state.nextHole != undefined) this.showMove(state.nextHole, state.moveDirection, target);
          target += 1;
          if (target == footprint.length) {
              this.setGoalCell(this.getPazzleCanvas(state.count).closest(".output-cell"));
          }
        }
        this.showOutputCell(footprint.length - 1);
        // this.showOutput();

        // 入力ページに出力
        if (this.mode == "quiz") {
          // console.log(board.goal);
          this.show(this.end, EnumTargetPanel.goal);
        }
    }

    loadQuizSetting() {
        // TODO in future.
    }

    writeAllQuiz() {
        // TODO in future.
    }

    run(mode) {
        console.log("Run mode:", mode);
        this.mode = mode;
        if (mode == "quiz") this.loadQuizSetting();
        PazzleState.resetHistory();
      
        var sStart = this.load(EnumTargetPanel.start);
        var sGoal = this.load(EnumTargetPanel.goal);
        this.init(sStart, sGoal);
        var errno = this.checkInput(sStart, sGoal);
        if (errno != 0) {
            this.showInputErrorMessage(errno);
            return;
        }

        this.clearOutput();
      
        var footprint = this.startSearch();
        // console.log(footprint);
        if (!footprint) return;
        if (mode == "quiz") this.writeAllQuiz();

        this.writeOutput(footprint);
        this.showLeastCount(footprint.length - 1);

        if (mode == "solve") this.showCompleteMessage();
        else if (mode == "quiz") this.showMakeQuizMessage();      
    }

    registerButtonControl() {
        this.registerButtonControls(
            /* on start */
            (e) => {
                this.run("solve");
            },
            /* on make quiz */
            (e) => {
                this.run("quiz");
            },
            /* on clear */
            (e) => {
                this.clearAll();
            }
        );
        // console.log("register Board callbacks.");
    }
}

/*


function loadQuizSetting(sheet) {
  var rng = sheet.getRange(2, 2, 3, 1).getValues();
  // 最小手数
  if (rng[0][0] != "") quizSettings.minCount = Number(rng[0][0]);
  // 最大手数
  if (rng[1][0] != "") quizSettings.maxCount = Number(rng[1][0]);
  // 計算限界手数
  if (rng[2][0] != "") COUNTMAX = Number(rng[2][0]);
}

function writeAllQuiz(sheet, board) {
  clear_quizSetting(sheet);
  if (!pazzleStateHistory) return;
  
  var quizList = {};
  for (let state of Object.values(pazzleStateHistory)) {
    var n = state.count;
    if (n < quizSettings.minCount || n > quizSettings.maxCount) continue;
    if (quizList[n] == undefined) {
      quizList[n] = {
        "count": 1,
        "list": [state]
      };
    } else {
      quizList[n].count += 1;
      if (quizList[n].list.length < 7) {
        quizList[n].list.push(state);
      }
    }
  }

  var row = 2;
  var col;
  for (let i = quizSettings.minCount; i <= quizSettings.maxCount; i++) {
    if (quizList[i] == undefined) continue;
    var data = quizList[i];
    sheet.getRange(row, 4).setValue(i); // 手数
    sheet.getRange(row, 5).setValue(data.count); // 問題数
    
    col = 6;
    let hist = [];
    for (let j = 0; j < data.list.length; j++) {
      if (j > 7) break;
      let r = Math.floor(Math.random() * (data.list.length - hist.length));
      while (hist.includes(r)) r = (r + 1) % data.list.length;
      hist.push(r);
      board.show(data.list[r].state, sheet, row, col);
      col += 3;
    }
    row += 3;
  }
}

function run(mode="solve") {
}

function start() {
  run("solve");
}

function makeQuiz() {
  // 作問モード
  run("quiz");
}
*/
