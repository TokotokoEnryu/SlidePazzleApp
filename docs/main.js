// Wrtie your code here.
var btnStart = document.getElementById("btn-start");
var btnMakeQuiz = document.getElementById("btn-makequiz");
var btnClear = document.getElementById("btn-clear");
var messageBox = document.getElementById("message-box");


function setMessageBox(s) {
    messageBox.innerHTML = '<p>' + s + '</p>';
}

function main() {
    console.log("JavaScript Start!");
    
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