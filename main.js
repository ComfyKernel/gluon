window.onload = main;

function onKeyDown(event) {
    
}

function onKeyUp(event) {

}

var gello;

function main() {
    console.log("Starting SUPERSHOT");

    console.log("|| Creating GELLO context");
    gello = new glc(document.getElementById("canvas-game"));
    gello.setCurrent();

    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Hook events //

    ut.hookEvent(ut.EVENT_KEYDOWN, this, onKeyDown);
    ut.hookEvent(ut.EVENT_KEYUP  , this, onKeyUp  );

    vao = new glvao();
    vao.bind();

    b_vertex = new glbuffer(new Float32Array([-1.0, -1.0, 0.0, 1.0, -1.0, 0.0, 0.0, 1.0, 0.0]),
				gl.ARRAY_BUFFER, gl.STATIC_DRAW);
    b_index  = new glbuffer(new Uint32Array ([0, 1, 2]),
				gl.ELEMENT_ARRAY_BUFFER, gl.STATIC_DRAW);

    s_frag = new glshader("\
#version 300 es\n\
precision mediump float;\n\
in  vec2 uv;       \n\
out vec4 frag;     \n\
void main() {      \n\
  frag = vec4(uv, 1.0, 1.0); \n\
}", gl.FRAGMENT_SHADER);

    s_vert = new glshader("\
#version 300 es    \n\
in  vec3 pos;      \n\
out vec2 uv;       \n\
uniform mat4 smat; \n\
void main() {      \n\
  gl_Position = smat * vec4(pos, 1.0); \n\
  uv = pos.xy;                         \n\
}", gl.VERTEX_SHADER);

    p_main = new glprogram([s_vert, s_frag]);
    p_main.use();

    gello.initSprites(p_main);

    spr = gello.addSprite({x:0,y:0,w:20,h:20},{x:0,y:0,w:1,h:1});
    gello.addSprite({x:10,y:50,w:30,h:30},{x:0,y:0,w:1,h:1});

/*    vao.bind();
    
    gl.enableVertexAttribArray(0);
    b_vertex.bind();
    gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);
    b_index.bind();
    gl.drawElements(gl.TRIANGLES, 3, gl.UNSIGNED_INT, 0);*/
    
    requestAnimationFrame(loop);
}

var frame = 0;

function loop() {
    gl.clear(gl.COLOR_BUFFER_BIT);
/*    vao.bind();
      gl.drawElements(gl.TRIANGLES, 3, gl.UNSIGNED_INT, 0);*/
    gello.drawSprites();
    spr.rect({x:Math.cos(frame/15.0)*300, y:Math.sin(frame/15.0)*300, w:20, h:20});
    frame+=1;
    requestAnimationFrame(loop);
}
