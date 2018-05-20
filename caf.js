class caf {
    constructor() {

    }

    log(msg) {
	console.log("[CAF] " + msg);
    }

    error(msg) {
	console.error("[CAF] " + msg);
    }

    load(fname) {
	var file = new XMLHttpRequest();
	file.open("GET", fname, false);
	file.overrideMimeType("text\/plain; charset=x-user-defined");
	file.send(null);

	if(file.status != 200) {
	    this.error("Failed loading file '" + fname + "'\nStatus : " + file.status);
	    return;
	}

	var buff = file.response;

	this.log("Buffer info : " + buff.length);

	/*for(var i = 0; i < file.responseText.length; ++i) {
	    buff.push(file.responseText[i].charCodeAt(0) & 0xFF);
	}*/

	function a_copy(a_a, a_off, a_b, b_off, num) {
	    for(var i = 0; i < num; ++i) {
		a_a[i + a_off] = a_b[b_off + num];
	    }
	}

	function a_tostring(a_a) {
	    var str = "";

	    var i = 0;
	    while(a_a[i] != 0) {
		str += String.fromCharCode(a_a[i]);
		i++;
	    }

	    return str;
	}

	var sane = new Array(4);
	a_copy(sane, 0, buff, 0, 3);
	sane[3] = 0;
	this.log("chars : " + a_tostring(sane));
	if(strcmp(sane, [0x43, 0x41, 0x46, 0x00]) != 0) {
	    this.error("Invalid CAF Header for file '" + fname + "'\nGot '" + getstr(sane) + "' Instead");
	    return false;
	}

	return true;
    }
}
