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
