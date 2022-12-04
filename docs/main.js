// Elements
var paneInput = document.getElementById("input-pane");
paneInput.startPazzlePanel = document.getElementById("start-pazzle-panel-input");
paneInput.goalPazzlePanel = document.getElementById("goal-pazzle-panel-input");

var paneOutput = document.getElementById("output-pane");
paneOutput.pazzleContainer = document.getElementById("output-pazzle-panel-container");

var btnControl = {
    'start': document.getElementById("btn-start"),
    'makeQuiz': document.getElementById("btn-makequiz"),
    'clear': document.getElementById("btn-clear")
};
var messageBox = document.getElementById("message-box");


const colorList = {
    'red': '#ff0000',
    'blue': '#0000ff',
    'green': '#00ff00',
    'yellow': '#ffff00',
    'black': '#000000',
    'lightgray': '#cccccc'
};
const blankColor = '#ffffff';

function setMessageBox(s) {
    messageBox.innerHTML = '<p>' + s + '</p>';
}

function createPazzlePanel() {
    let svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.width = 300;
    svg.height = 300;
    svg.classList.add("pazzle-panel");
    let colorList_ = Object.values(colorList);
    for (let i=0; i<3; i++) {
        for (let j=0; j<3; j++) {
            let rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            rect.x = 100+j + 5;
            rect.y = 100+i + 5;
            rect.width = 90;
            rect.height = 90;
            rect.colorIndex = 0;
            rect.fill = blankColor;
            rect.onclick = (e) => {
                let elem = e.target;
                elem.colorIndex += 1;
                if (elem.colorIndex >= colorList_.length) {
                    elem.fill = blankColor;
                    elem.colorIndex = -1;
                } else {
                    elem.fill = colorIndex_[elem.colorIndex];
                }
            };
            svg.appendChild(rect);
        }
    }
    return svg;
}

function buildInputPane() {
    let h2 = document.createElement('h2');
    h2.textContent = 'スタート配置';
    paneInput.startPazzlePanel.appendChild(h2);
    paneInput.startPazzlePanel.appendChild(createPazzlePanel());
    
    h2 = document.createElement('h2');
    h2.textContent = 'ゴール配置';
    paneInput.goalPazzlePanel.appendChild(h2);
    paneInput.goalPazzlePanel.appendChild(createPazzlePanel());
}

function main() {
    console.log("JavaScript Start!");
    
    buildInputPane();

    btnStart.onclick = (e) => {
        console.log("Hello, start calculation.");
    };
    btnMakeQuiz.onclick = (e) => {
        console.log("Hello, start making quiz.");
    };
    btnClear.onclick = (e) => {
        console.log("Hello, clear input panel.");
    };
}
main();


// {/* <div id="output-pane" style="
//     margin: 0 auto;
//     width: max(80%, 320px);
//     /* align-items: center; */
//     /* padding-left: 5%; */
//     ">
//     <h2>出力パネル</h2>

// <div id="pazzle-panel-container" style="
// /* padding: 0 calc(50% - 150px); */
// " class="pazzle-panel-container">
// <p>スタート配置</p>
// <svg width="300px" height="300px" class="pazzle-canvas">
// <rect x="5px" y="5px" width="90px" height="90px" fill="#0000ff" onclick="javascript:alert('click')"></rect>
// <rect x="105px" y="5px" width="90px" height="90px" fill="#ff0000"></rect>
// <rect x="5px" y="105px" width="90px" height="90px" fill="#00ff00"></rect>
// <rect x="205px" y="205px" width="90px" height="90px" fill="#ffff00"></rect>
// </svg>
// </div><div id="pazzle-panel-container" style="
// /* padding: 0 calc(50% - 150px); */
// " class="pazzle-panel-container">
// <p>ゴール配置</p>
// <svg width="300px" height="300px" class="pazzle-canvas">
// <rect x="5px" y="5px" width="90px" height="90px" fill="#0000ff" onclick="javascript:alert('click')"></rect>
// <rect x="105px" y="5px" width="90px" height="90px" fill="#ff0000"></rect>
// <rect x="5px" y="105px" width="90px" height="90px" fill="#00ff00"></rect>
// <rect x="205px" y="205px" width="90px" height="90px" fill="#ffff00"></rect>
// </svg>
// </div>

//     <p class="clear-both">最小手数: <span id="least-count-output"></span></p>
//     <div id="output-grid-pane">
//       <p>手順</p>
//     </div>
//   </div> */}