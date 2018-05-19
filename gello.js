var gl = null;

class glc {
    constructor(canv) {
	var canvas = canv;

	// Check if canv is a string, if it is find an object by its name.
	// if it is not a string, it is already set to the 'canvas' variable.
	this.log("Getting canvas instance and context");
	
	if(canv instanceof String) {
	    canvas = document.getElementById(canv);
	}
	
	if(!canvas) {
	    this.error("Canvas is null! (possibly incorrect name)");
	    return null;
	}

	// Find a valid WebGL2 context, GL2 is needed as it supports large buffers (uint32's).
	// WebGL1 could work with possible modification, but it would be way too slow.
	var context = canvas.getContext("webgl2");
	if(!context) {
	    this.error("Failed to initialize WebGL2 Context!");
	    return null;
	}
	
	this.ctx = {
	    canvas  : canvas,
	    context : context
	};

	this.log("Configuring the screen");

	// Set up the screen by doing an initial resize and event hook
	this.screen = {
	    size : new size(0, 0)
	};
	
	this.onViewportResized();
	ut.hookEvent(ut.EVENT_RESIZED, this, this.onViewportResized);
    }

    //
    // Debugging functions
    //
    
    log(msg) {
	console.log("[GELLO::GLC] " + msg);
    }

    error(msg) {
	console.error("[GELLO::GLC] " + msg);
    }

    checkCanvas() {
	// Check if the canvas is valid and initialized. //
	/// This is to make debugging a little easier.  ///
	
	if(!this.ctx || !this.ctx.canvas || !this.ctx.context) {
	    var errorString = "Unknown Error";

	    // Ugly if/else block.
	    // Not using anything fancy since this is rarely called.
	    if(!this.ctx) {
		errorString = "Base initialization failed (this.ctx null or undefined)"
	    } else if(!this.ctx.canvas) {
		errorString = "Could not find canvas object (this.ctx.canvas null)";
	    } else if(!this.ctx.context) {
		errorString = "Context missing (this.ctx.context null)";
	    }
	    
	    this.error("Canvas check error!\nError : " + errorString);
	    return false;
	}
	return true;
    }

    checkScreen() {
	// Check if the screen is valid. //

	if(!this.screen || !this.screen.size) {
	    var errorString = "Unknown Error";

	    if(!this.screen) {
		errorString = "Screen object uninitialized (this.screen null or undefined)";
	    } else if(!this.screen.size) {
		errorString = "Could not find screen size object (this.screen.size null)";
	    }

	    this.error("Screen check error!\n Error : " + errorString);
	    return false;
	}
	return true;
    }

    //
    // Functions
    //

    onViewportResized() {
	if(!this.checkCanvas())
	    return false;

	this.log("Resizing viewport to fit real screen");

	this.resize(ut.getRealSize(this.ctx.canvas));
	return true;
    }

    resize(sz) {
	if(!this.checkCanvas() || !this.checkScreen())
	    return false;

	// Set the size of the screen and resize the canvas + GL Viewport.

	this.screen.size       = new size(sz.width, sz.height);
	this.ctx.canvas.width  = sz.width;
	this.ctx.canvas.height = sz.height;
	this.ctx.context.viewport(0, 0, sz.width, sz.height);

	this.log("Canvas resized to [" + sz.width + "," + sz.height + "]");
    }

    setCurrent() {
	if(!this.checkCanvas())
	    return false;

	// Set this as the current WebGL Context
	gl = this.ctx.context;
    }
};

// Classes //

class globject {
    constructor() {
	this.glid=0;
    }
}

class glvao extends globject {
    constructor() {
	super();
	
	this.create();
    }

    bind() {
	gl.bindVertexArray(this.glid);
    }

    create() {
	this.glid = gl.createVertexArray();
    }

    destroy() {
	if(!this.glid)
	    return;

	gl.deleteVertexArray(this.glid);
	this.glid = 0;
    }
}

class glbuffer extends globject {
    constructor(data,type,draw) {
	super();
	if(arguments.length>0) {
	    this.create(data, type, draw);
	}
    }
    
    bind() {
	gl.bindBuffer(this.type, this.glid);
    }

    bufferData(data) {
	gl.bufferData(this.type, data, this.draw);
    }
    
    create(data,type,draw) {
	this.destroy();
	
	this.type=type;
	this.draw=draw;
	
	this.glid=gl.createBuffer();
	this.bind();
	this.bufferData(data);
    }
    
    destroy() {
	if(!this.glid)
	    return;
	
	gl.deleteBuffer(this.glid);
	this.glid=0;
    }
}

class glshader extends globject {
    constructor(dat,type) {
	super();
	if(arguments.length>0) {
	    this.create(dat,type);
	}
    }

    error(msg) {
	console.error("[GELLO::GLSHADER] " + msg);
    }

    source(data) {
	gl.shaderSource(this.glid, data);
    }

    compile() {
	gl.compileShader(this.glid);
	var stat=gl.getShaderParameter(this.glid,gl.COMPILE_STATUS);

	if(stat)
	    return true;

	this.error("Failed to compile shader!\nInfo : "+
		   gl.getShaderInfoLog(this.glid)+"\n");
	return false;
    }

    create(dat,type) {
	this.destroy();

	this.glid=gl.createShader(type);
	this.source(dat);

	if(this.compile())
	    return true;

	this.destroy();
	return false;
    }

    destroy() {
	if(!this.glid)
	    return;

	gl.deleteShader(this.glid);
    }
}

class glprogram extends globject {
    constructor(shaders) {
	super();
	if(arguments.length>0) {
	    this.create(shaders);
	}
    }

    log(msg) {
	console.log("[GELLO::GLPROGRAM] " + msg);
    }

    error(msg) {
	console.error("[GELLO::GLPROGRAM] " + msg);
    }

    warn(msg) {
	console.warn("[GELLO::GLPROGRAM] " + msg);
    }

    use() {
	if(!this.glid) {
	    this.error("Cannot use an inactive program!");
	    return false;
	}
	
	gl.useProgram(this.glid);
	return true;
    }

    attach(shader) {
	this.log("Attaching shader");
	if(!(shader instanceof glshader)) {
	    gl.attachShader(this.glid, shader);
	    return true;
	}

	gl.attachShader(this.glid, shader.glid);
	return true;
    }

    detach(shader) {
	this.log("Detaching shader");
	if(!(shader instanceof glshader)) {
	    gl.detachShader(this.glid, shader);
	    return true;
	}

	gl.detachShader(this.glid, shader.glid);
	return true;
    }

    link() {
	this.log("Linking program");
	gl.linkProgram(this.glid);

	var stat=gl.getProgramParameter(this.glid,gl.LINK_STATUS);
	if(stat)
	    return true;

	this.error("Failed to link program!\nInfo : "+
		   gl.getProgramInfoLog(this.glid));
	return false;
    }

    create(shaders) {
	this.destroy();
	this.glid = gl.createProgram();

	for(var i=0; i<shaders.length; ++i) {
	    if(!this.attach(shaders[i])) {
		this.error("Can't attach a NULL shader!");
		return false;
	    }
	}

	if(this.link())
	    return true;
	
	this.destroy();
	return false;
    }

    destroy() {
	if(!this.glid)
	    return;

	gl.deleteProgram(this.glid);
	this.glid=0;
    }
}

class gltexture extends globject {
    constructor() {
        super();

        this.width=0;
        this.height=0;
    }

    log(msg) {
	console.log("[GELLO::GLTEXTURE]" + msg);
    }

    error(msg) {
	console.error("[GELLO::GLTEXTURE] " + msg);
    }

    bind() {
	gl.bindTexture(gl.TEXTURE_2D, this.glid);
    }

    create() {
        this.destroy();
        this.glid=gl.createTexture();
    }

    fromColor(r,g,b,a) {
        this.create();

        gl.bindTexture(gl.TEXTURE_2D,this.glid);
        gl.texImage2D (gl.TEXTURE_2D,0,gl.RGBA,1,1,0,
                       gl.RGBA,gl.UNSIGNED_BYTE,
                       new Uint8Array([r,g,b,a]));
    }

    fromImage(url) {
        this.fromColor(255,0,255,255);

        var img=new Image();

        img.onload = (function() {
            this.log("Successfully loaded image '"+url+"'!\n");
            this.bind();

	    if(this.onload) {
		this.onload();
	    }

            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
        }).call(this);

	img.onerror = (function() {
            this.error("Failed loading image '"+url+"'!\n");
        }).call(this);

	img.src = url;
    }

    destroy() {
        if(!this.glid)
	    return;

        gl.deleteTexture(this.glid);
        this.glid=0;
    }
}
