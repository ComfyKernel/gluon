class size {
    constructor(width, height) {
	this.width  = width;
	this.height = height;
    }

    add(sz1, sz2) {
	return new size(sz1.width + sz2.width, sz1.height + sz2.height);
    }

    addEq(sz1, sz2) {
	sz1.width  = sz1.width  + sz2.width;
	sz1.height = sz1.height + sz2.height;
    }

    sub(sz1, sz2) {
	return new size(sz1.width - sz2.width, sz1.height - sz2.height);
    }

    subEq(sz1, sz2) {
	sz1.width  = sz1.width  - sz2.width;
	sz1.height = sz1.height - sz2.height;
    }

    mul(sz1, sz2) {
	return new size(sz1.width * sz2.width, sz1.height * sz2.height);
    }

    mulEq(sz1, sz2) {
	sz1.width  = sz1.width  * sz2.width;
	sz1.height = sz1.height * sz2.height;
    }

    div(sz1, sz2) {
	return new size(sz1.width / sz2.width, sz1.height / sz2.height);
    }

    divEq(sz1, sz2) {
	sz1.width  = sz1.width  / sz2.width;
	sz1.height = sz1.height / sz2.height;
    }
};

var ut = {
    // "Enums" //

    EVENT_RESIZED   : 1,
    EVENT_MOUSEDOWN : 2,
    EVENT_MOUSEUP   : 4,
    EVENT_KEYDOWN   : 8,
    EVENT_KEYUP     : 16,
    EVENT_MOUSEMOVE : 32,

    // Functions //
    
    log(msg) {
	console.log("[UTILS] " + msg);
    },

    error(msg) {
	console.error("[UTILS] " + msg);
    },
    
    getRealSize(node) {
	return new size(node.clientWidth, node.clientHeight);
    },

    initializeEvents() {
	this.log("Initializing the Events system");
	
	this.events = {
	    ev_resize : new Array(),
	    ev_moused : new Array(),
	    ev_mouseu : new Array(),
	    ev_keyd   : new Array(),
	    ev_keyu   : new Array(),
	    ev_mmove  : new Array()
	};

	this.events.elist = [
	    { event : ut.EVENT_RESIZED  , array : ut.events.ev_resize , str : "resized"   },
	    { event : ut.EVENT_MOUSEDOWN, array : ut.events.ev_moused , str : "mousedown" },
	    { event : ut.EVENT_MOUSEUP  , array : ut.events.ev_mouseu , str : "mouseup"   },
	    { event : ut.EVENT_KEYDOWN  , array : ut.events.ev_keyd   , str : "keydown"   },
	    { event : ut.EVENT_KEYUP    , array : ut.events.ev_keyu   , str : "keyup"     },
	    { event : ut.EVENT_MOUSEMOVE, array : ut.events.ev_mmove  , str : "mousemove" }
	];

	// 'The Poor Mans Macro' //
	function mac_evcall(LIST, DATA) {
	    return ''+
		'for(var i=0; i<ut.events.' + LIST + '.length; ++i) {' +
		'    var ev = ut.events.' + LIST + '[i];' +
		'    ev.func.call(ev.owner, ' + DATA + ');' +
		'}';
	}
	
	window.addEventListener  ("resize"   , new Function('event', mac_evcall('ev_resize', 'event')));
	document.addEventListener("mousedown", new Function('event', mac_evcall('ev_moused', 'event')));
	document.addEventListener("mouseup"  , new Function('event', mac_evcall('ev_mouseu', 'event')));
	document.addEventListener("keydown"  , new Function('event', mac_evcall('ev_keyd'  , 'event')));
	document.addEventListener("keyup"    , new Function('event', mac_evcall('ev_keyu'  , 'event')));
	document.addEventListener("mousemove", new Function('event', mac_evcall('ev_mmove' , 'event')));
	
	this.eventsInitialized = true;
    },

    hookEvent(event, parent, funct) {
	if(!this.eventsInitialized)
	    this.initializeEvents();

	for(var i = 0; i < this.events.elist.length; ++i) {
	    var e = this.events.elist[i];
	    if(e.event & event) {
		this.log("Hooking event '" + e.str + "'");
		e.array.push({owner : parent, func : funct});
		return true;
	    }
	}

	this.error("Event not found '" + event + "'");

	return false;
    }
};
