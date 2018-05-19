window.onload = _start;

function onKeyDown(event) {
    
}

function onKeyUp(event) {

}

function _start() {
    console.log("Starting GLUON");

    console.log("|| Creating GELLO context");
    var gello = new glc(document.getElementById("canvas-game"));
    gello.setCurrent();

    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Hook events //

    ut.hookEvent(ut.EVENT_KEYDOWN, this, onKeyDown);
    ut.hookEvent(ut.EVENT_KEYUP  , this, onKeyUp  );

    vao = new glvao();
    vao.bind();

    b_vertex = new glbuffer(new Float32Array([-1.0, -1.0, 1.0, -1.0, 0.0, 1.0]),
				gl.ARRAY_BUFFER, gl.STATIC_DRAW);
    b_index  = new glbuffer(new Uint32Array ([0, 1, 2]),
				gl.ELEMENT_ARRAY_BUFFER, gl.STATIC_DRAW);

    s_frag = new glshader("\
#version 300 es\n\
precision mediump float;\n\
in  vec2 uv;   \n\
out vec4 frag; \n\
void main() {  \n\
  frag = vec4(uv, 1.0, 1.0);\n\
}", gl.FRAGMENT_SHADER);

    s_vert = new glshader("\
#version 300 es\n\
in  vec2 pos;  \n\
out vec2 uv;   \n\
void main() {  \n\
  gl_Position = vec4(pos, 0.0, 1.0); \n\
  uv = pos;                          \n\
}", gl.VERTEX_SHADER);

    p_main = new glprogram([s_vert, s_frag]);
    p_main.use();
    
    gl.enableVertexAttribArray(0);
    b_vertex.bind();
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    b_index.bind();
    gl.drawElements(gl.TRIANGLES, 3, gl.UNSIGNED_INT, 0);
    
    requestAnimationFrame(loop);
}

function loop() {
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawElements(gl.TRIANGLES, 3, gl.UNSIGNED_INT, 0);
    requestAnimationFrame(loop);
}
