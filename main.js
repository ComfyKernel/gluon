window.onload = main;

function main() {
    console.log("Starting GLUON");

    console.log("|| Creating GELLO context");
    var gello = new glc(document.getElementById("canvas-game"));
    gello.setCurrent();

    gl.clearColor(0, 0, 0, 1);
    
    requestAnimationFrame(loop);
}

function loop() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    
    requestAnimationFrame(loop);
}
