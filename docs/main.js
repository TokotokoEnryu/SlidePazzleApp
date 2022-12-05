function main() {
    console.log("JavaScript Start!");
    
    var board = new Board();
    board.registerButtonControl();

    // debug
    // board.show("rrggbbwwx", EnumTargetPanel.start);
    // board.show("rgbwxrgbw", EnumTargetPanel.goal);
}
main();