const MessageText = {
    usage1: "◆入力パネルにスタート配置とゴール配置を入力して、計算開始を押してください。",
    usage2: "　パネルをクリックすると、色または空白を指定できます。",
    usage3: "◆スタート配置を入力して問題作成を押すと、ゴール配置に問題が表示されます。",
    usage4: "◆作問パネルでは問題を作成する際の設定や、ほかの問題例が表示されます。",

    complete: "計算が完了しました。",
    makeQuiz: "問題が作成されました。",

    errInput: "入力パネルが不正です。",
    errCause1: "スタート配置に入力してから開始ボタンを押してください。",
    errCause2: "空白を必ず１つ含めてください。",
    errCause3: "空白が多すぎます。１つにしてください。",
    errCause4: "スタート配置とゴール配置のパネルの色と個数の組み合わせが異なっています。",
    errCalc: "計算が完了しませんでした。",
    errCause5: "このゴール配置にはたどり着けませんでした。",

    errOther: "想定外のエラーです。"
};


var page;
class Builder {
    panes;
    elems;
    btnControl;
    messageBox;
    
    constructor() {
        page = this;
        this.initElems();
        this.buildInputPane();
        this.buildPanelMenu();
        this.buildOutputPane();
    }

    initElems() {
        this.panes = {
            input:  document.getElementById("input-pane"),
            output: document.getElementById("output-pane"),
        };
        // input pane
        this.panes.input.startPazzlePanel = document.getElementById("start-pazzle-panel-input");
        this.panes.input.goalPazzlePanel = document.getElementById("goal-pazzle-panel-input");
        // output pane
        this.panes.output.displayTrigger = document.getElementById("output-display-trigger");
        this.panes.output.pazzleContainer = document.getElementById("output-pazzle-panel-container");

        this.elems = {
            panelMenu: document.getElementById("panel-menu"),
            leastCount: document.getElementById("least-count")
        };
        this.btnControl = {
            start: document.getElementById("btn-start"),
            makeQuiz: document.getElementById("btn-makequiz"),
            clear: document.getElementById("btn-clear")
        };
        this.messageBox = document.getElementById("message-box");
    }

    // Panel Menu
    buildPanelMenu() {
        let elem = document.createElement("ul");
        let li = this.createMenuLi('blank');
        elem.appendChild(li);
        for (let c of Object.keys(colorList)) {
            li = this.createMenuLi(c);
            elem.appendChild(li);
        }
        this.elems.panelMenu.innerHTML = "";
        this.elems.panelMenu.appendChild(elem);
        // this.elems.panelMenu.addEventListener('blur', closePanelMenu);
    }
    
    createMenuLi(color) {
        let li = document.createElement("li");
        let text = colorText[color];
        li.textContent = text;
        li.dataset.color = color;
        return li;
    }

    // Input Pane
    buildInputPane() {
        let lbl = document.createElement('p');
        lbl.textContent = 'スタート配置';
        this.panes.input.startPazzlePanel.appendChild(lbl);
        this.panes.input.startPazzlePanel.appendChild(this.createPazzlePanel(true));
        
        lbl = document.createElement('p');
        lbl.textContent = 'ゴール配置';
        this.panes.input.goalPazzlePanel.appendChild(lbl);
        this.panes.input.goalPazzlePanel.appendChild(this.createPazzlePanel(true));
    }

    createPazzlePanel(isInput = true) {
        let svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        if (isInput) {
            svg.setAttribute('width', 300);
            svg.setAttribute('height', 300);
        } else {
            svg.setAttribute('width', 90);
            svg.setAttribute('height', 90);    
        }
        svg.classList.add("pazzle-canvas");
        if (isInput) svg.classList.add("input-pazzle-canvas");
        else svg.classList.add("output-pazzle-canvas");

        for (let i=0; i<3; i++) {
            for (let j=0; j<3; j++) {
                let rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
                if (isInput) {
                    rect.setAttribute('x', 100*j + 5);
                    rect.setAttribute('y', 100*i + 5);
                    rect.setAttribute('width', 90);
                    rect.setAttribute('height', 90);
                } else {
                    rect.setAttribute('x', 30*j + 1);
                    rect.setAttribute('y', 30*i + 1);
                    rect.setAttribute('width', 28);
                    rect.setAttribute('height', 28);                
                }
                rect.setAttribute('fill', blankColor);
                rect.dataset['color'] = 'blank';
                svg.appendChild(rect);
            }
        }
        return svg;
    }
 
    // Output Pane
    buildOutputPane() {
        for (let i=0; i<=COUNTMAX; i++) {
            this.panes.output.pazzleContainer.appendChild(this.createOutputCell(i));

        }
    }
    
    createOutputCell(i) {
        let div = document.createElement('div');
        div.classList.add("output-cell");
        let label = document.createElement('p');
        label.textContent = (i == 0) ? 'スタート': i;
        div.appendChild(label);
        let svg = this.createPazzlePanel(false);
        div.appendChild(svg);
        div.hidden = true;
        return div;
    }
    
}

class Page extends Builder {
    selectedPanel = undefined;
    displayOutput = false;

    constructor() {
        super();

        this.registerMenuLiCallback();
        this.registerInputPazzlePanelCallback();
        this.registerClosePanelMenu();
        this.registerOutputDisplayTrigger();
        // this.registerButtonControls();

        this.showUsage();

        // debug
        // this.showOutputCell(24);
        // this.showInputErrorMessage(2);

    }

    setMessageBox(s, isError=false) {
        let lines = s.split("\n");
        let text = '';
        for (let msg of lines) {
            text += '<p>' + msg + '</p>';
        }
        this.messageBox.innerHTML = text;
        if (isError) {
            this.messageBox.classList.add("error")
        } else {
            this.messageBox.classList.remove("error");
        }
    }

    showPanelMenu(x, y) {
        this.elems.panelMenu.classList.add('show');
        this.elems.panelMenu.style.left = x + 'px';
        this.elems.panelMenu.style.top = y + 'px';
        document.addEventListener('wheel', noscroll, {'passive': false});
        document.addEventListener('touchmove', noscroll, {'passive': false});
    }
    closePanelMenu() {
        this.elems.panelMenu.classList.remove('show');
        document.removeEventListener('touchmove', noscroll, {'passive': false});
        document.removeEventListener('wheel', noscroll, {'passive': false});
    }
    toggleOutputGrid(e) {
        if (page.displayOutput) {
            page.panes.output.displayTrigger.classList.add('hide-grid');
            page.panes.output.displayTrigger.classList.remove('show-grid');
            page.panes.output.pazzleContainer.hidden = true;
            page.panes.output.displayTrigger.textContent = "手順を見る";
        } else {
            page.panes.output.displayTrigger.classList.remove('hide-grid');
            page.panes.output.displayTrigger.classList.add('show-grid');
            page.panes.output.pazzleContainer.hidden = false;
            page.panes.output.displayTrigger.textContent = "手順を隠す";
        }
        page.displayOutput = !page.displayOutput;
    }
    showOutputCell(length) {
        var cells = page.panes.output.querySelectorAll("div.output-cell");
        var i = 0;
        for (let div of cells) {
            if (i++ > length) div.hidden = true;
            else div.hidden = false;
        }
    }
    hideOutputCell() {
        var cells = page.panes.output.querySelectorAll("div.output-cell");
        for (let div of cells) {
            div.hidden = true;
        }
    }
    changePanelColor(panel, color) {
        panel.dataset['color'] = color;
        if (color == 'blank') panel.setAttribute('fill', blankColor);
        else panel.setAttribute('fill', colorList[color]);
    }
    clearPanel(panel) {
        panel.dataset['color'] = "blank";
        panel.setAttribute('fill', blankColor);
    }
    createPolygon(x, y, w, h, direction) {
        var s1,s2,s3,t1,t2,t3;
        var a = 4, b = 6;
        if (direction == 0) {
            s1 = w/2; s2 = b; s3 = w - b;
            t1 = a;   t2 = t3 = h - a;
        } else if (direction == 1) {
            s1 = a;   s2 = s3 = w - a;
            t1 = h/2; t2 = b; t3 = h - b;
        } else if (direction == 2) {
            s1 = w - a; s2 = s3 = a;
            t1 = h/2; t2 = b; t3 = h - b;
        } else if (direction == 3) {
            s1 = w/2; s2 = b; s3 = w - b;
            t1 = h - a; t2 = t3 = a;
        }
        s1 += x; s2 += x; s3 += x;
        t1 += y; t2 += y; t3 += y;
        var points = `${s1},${t1} ${s2},${t2} ${s3},${t3}`;
        var pol = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
        pol.setAttribute("points", points);
        pol.setAttribute("fill", "#777");
        return pol;
    }
    emphasizePanel(panel, direction) {
        // 0:up 1:left 2:right 3:down
        var x1 = panel.getAttribute("x");
        var y1 = panel.getAttribute("y");
        var w = panel.getAttribute("width");
        var h = panel.getAttribute("height");
        var gap;
        if (w < 30) gap = 1;
        else gap = 5;

        var pol = this.createPolygon(x1 - gap, y1 - gap, w, h, direction);
        var svg = panel.closest("svg");
        svg.appendChild(pol);

        // panel.setAttribute("fill-opacity", 0.6);
        // panel.setAttribute("stroke", "#333");
        // panel.setAttribute("stroke-width", "2px");
    }
    clearPanelEmphasis(panel) {
        // panel.removeAttribute("fill-opacity");
        // panel.removeAttriubute("stroke");
        // panel.removeAttribute("stroke-width");

    }
    clearAllPanelEmphasis() {
        var canvases = document.querySelectorAll(".pazzle-canvas");
        // for (let cv of canvases) {
        //     for (let p of cv.querySelectorAll("rect")) {
        //         if (p.hasAttribute("stroke")) this.clearPanelEmphasis(p);
        //     }
        // }
        for (let cv of canvases) {
            for (let p of cv.querySelectorAll("polygon")) {
                cv.removeChild(p);
            }
        }
    }
    setGoalCell(panel) {
        this.goalPanel = panel;
        panel.classList.add("goal");
    }
    resetGoalCell() {
        if (this.goalPanel) {
            this.goalPanel.classList.remove("goal");
            this.goalPanel = null;
        }
    }
    registerMenuLiCallback() {
        page = page;
        var lilist = page.elems.panelMenu.querySelectorAll("li");
        for (let li of lilist) {
            let color = li.dataset.color;
            li.onclick = (e) => {
                // console.log(page);
                page.changePanelColor(page.selectedPanel, color);
                page.closePanelMenu();
            };    
        }
    }
    registerInputPazzlePanelCallback() {
        var panellist = page.panes.input.querySelectorAll("rect");
        for (let rect of panellist) {
            rect.onclick = (e) => {
                let elem = e.target;
                page.selectedPanel = elem;
                page.showPanelMenu(e.clientX, e.clientY);
            };
        }
    }
    // input pattern: <li><input type="text" placeholder="その他の文字"></li>
    registerClosePanelMenu() {
        document.addEventListener('click', (e) => {
            if(!e.target.closest('.pazzle-canvas')) {
                page.closePanelMenu();
            }
        });
    }   
    registerOutputDisplayTrigger() {
        page.panes.output.displayTrigger.addEventListener('click', this.toggleOutputGrid);
    }

    registerButtonControls(onstart, onmakequiz, onclear) {
        page.btnControl.start.onclick = onstart;
        page.btnControl.makeQuiz.onclick = onmakequiz;
        page.btnControl.clear.onclick = onclear;    
    }

    showUsage() {
        var msg = MessageText.usage1 + "\n";
        msg += MessageText.usage2 + "\n";
        // msg += MessageText.usage3 + "\n";
        // msg += MessageText.usage4;
        msg += MessageText.usage3;
        this.setMessageBox(msg, false);
    }
    showCompleteMessage() {
        this.setMessageBox(MessageText.complete, false);
    }
    showMakeQuizMessage() {
        this.setMessageBox(MessageText.makeQuiz, false);
    }
    showInputErrorMessage(errno) {
        var msg = MessageText.errInput + "\n";
        if (errno == 1) {
            msg += MessageText.errCause1 + "\n";
            msg += MessageText.usage2.substr(1);
        } else if (errno == 2) {
            msg += MessageText.errCause2;
        } else if (errno == 3) {
            msg += MessageText.errCause3;
        } else if (errno == 4) {
            msg += MessageText.errCause4;
        } else {
            msg = MessageText.errOther;
        }
        this.setMessageBox(msg, true);
    }
    showCalcErrorMessage() {
        var msg = MessageText.errCalc + "\n";
        msg += MessageText.errCause5;
        this.setMessageBox(msg);
    }
    showOtherErrorMessage() {
        this.setMessageBox(MessageText.errOther, true);
    }
    showLeastCount(n) {
        this.elems.leastCount.textContent = n;
    }
    showOutput() {
        this.panes.output.hidden = false;
    }
    hideOutput() {
        this.panes.output.hidden = true;
    }
}