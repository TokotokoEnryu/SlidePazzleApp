// Elements
var paneInput = document.getElementById("input-pane");
paneInput.startPazzlePanel = document.getElementById("start-pazzle-panel-input");
paneInput.goalPazzlePanel = document.getElementById("goal-pazzle-panel-input");

var paneOutput = document.getElementById("output-pane");
paneOutput.pazzleContainer = document.getElementById("output-pazzle-panel-container");

var panelMenu = document.getElementById("panel-menu");

var btnControl = {
    'start': document.getElementById("btn-start"),
    'makeQuiz': document.getElementById("btn-makequiz"),
    'clear': document.getElementById("btn-clear")
};
var messageBox = document.getElementById("message-box");

const colorText = {
    'blank': '空白',
    'red': '赤',
    'blue': '青',
    'green': '緑',
    // 'yellow': '黄色',
    'lightgray': '白',
    // 'black': '黒'
};
const colorList = {
    'red': '#ff0000',
    'blue': '#0000ff',
    'green': '#00ff00',
    // 'yellow': '#ffff00',
    // 'black': '#000000',
    'lightgray': '#cccccc'
};
const blankColor = '#ffffff';

function setMessageBox(s) {
    messageBox.innerHTML = '<p>' + s + '</p>';
}

function noscroll(e) {
    e.preventDefault();
};
function showPanelMenu() {
    panelMenu.classList.add('show');
    document.addEventListener('wheel', noscroll, {'passive': false});
    document.addEventListener('touchmove', noscroll, {'passive': false});
}
function closePanelMenu() {
    panelMenu.classList.remove('show');
    document.removeEventListener('touchmove', noscroll, {'passive': false});
    document.removeEventListener('wheel', noscroll, {'passive': false});
}
var selectedPanel = undefined;
function createMenuLi(color) {
    let li = document.createElement("li");
    let text = colorText[color];
    li.textContent = text;
    li.onclick = (e) => {
        if (color == 'blank') selectedPanel.setAttribute('fill', blankColor);
        else selectedPanel.setAttribute('fill', colorList[color]);
        closePanelMenu();
    };
    return li;
}
// input pattern: <li><input type="text" placeholder="その他の文字"></li>

function buildPanelMenu() {
    let elem = document.createElement("ul");
    let li = createMenuLi('blank');
    elem.appendChild(li);
    for (let c of Object.keys(colorList)) {
        li = createMenuLi(c);
        elem.appendChild(li);
    }
    panelMenu.innerHTML = "";
    panelMenu.appendChild(elem);
    panelMenu.addEventListener('blur', closePanelMenu);

    document.addEventListener('click', (e) => {
        console.log(e.target.closest('div#panel-menu'));
        if(!e.target.closest('div#panel-menu')) {
            closePanelMenu();
        }
    });
}
function createPazzlePanel() {
    let svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', 300);
    svg.setAttribute('height', 300);
    svg.classList.add("pazzle-canvas");
    svg.classList.add("input-pazzle-canvas");
    let colorList_ = Object.values(colorList);
    for (let i=0; i<3; i++) {
        for (let j=0; j<3; j++) {
            let rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            rect.setAttribute('x', 100*j + 5);
            rect.setAttribute('y', 100*i + 5);
            rect.setAttribute('width', 90);
            rect.setAttribute('height', 90);
            rect.colorIndex = -1;
            rect.setAttribute('fill', blankColor);
            rect.onclick = (e) => {
                let elem = e.target;
                selectedPanel = elem;
                showPanelMenu();
                panelMenu.style.left = e.clientX + 'px';
                panelMenu.style.top = e.clientY + 'px';
                // elem.colorIndex += 1;
                // if (elem.colorIndex >= colorList_.length) {
                //     elem.setAttribute('fill', blankColor);
                //     elem.colorIndex = -1;
                // } else {
                //     elem.setAttribute('fill', colorList_[elem.colorIndex]);
                // }
            };
            svg.appendChild(rect);
        }
    }
    return svg;
}

function buildInputPane() {
    let lbl = document.createElement('p');
    lbl.textContent = 'スタート配置';
    paneInput.startPazzlePanel.appendChild(lbl);
    paneInput.startPazzlePanel.appendChild(createPazzlePanel());
    
    lbl = document.createElement('p');
    lbl.textContent = 'ゴール配置';
    paneInput.goalPazzlePanel.appendChild(lbl);
    paneInput.goalPazzlePanel.appendChild(createPazzlePanel());
}

function main() {
    console.log("JavaScript Start!");
    
    buildInputPane();
    buildPanelMenu();

    btnControl.start.onclick = (e) => {
        console.log("Hello, start calculation.");
    };
    btnControl.makeQuiz.onclick = (e) => {
        console.log("Hello, start making quiz.");
    };
    btnControl.clear.onclick = (e) => {
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