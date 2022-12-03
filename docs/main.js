// Wrtie your code here.
var btnStart = document.getElementsByName("btn-start")[0];
var btnMakeQuiz = document.getElementsByName("btn-makequiz")[0];
var btnClear = document.getElementsByName("btn-clear")[0];

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