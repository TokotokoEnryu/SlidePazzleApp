// Wrtie your code here.
var btnStart = document.getElementsByName("btn-start");
var btnMakeQuiz = document.getElementsByName("btn-makequiz");
var btnClear = document.getElementsByName("btn-clear");

function main() {
    btnStart.onclick((e) => {
        console.log("Hello, start calculation.");
    });
    btnMakeQuiz.onclick((e) => {
        console.log("Hello, start making quiz.");
    });
    btnClear.onclick((e) => {
        console.log("Hello, clear input panel.");
    })
}
main();