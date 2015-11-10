
/* dependencies */

var robot = require('robotjs'); 
var conf = require('./conf.json');
var socket = require('socket.io-client')('http://'+conf.address+':'+conf.port);
var copypaste = require('copy-paste');
var xrandr = require('xrandr-parse');
var exec = require('child_process').exec;

/* auto detect screen resolution */

var resx;
var rexy;

exec('xrandr', function(err, stdout) {
	var query = xrandr(stdout);
	for(var key in query) {
		if( query.hasOwnProperty( key ) ) {
			if( query[ key ].connected ) {
				resx = query[ key ].current.width;
				resy = query[ key ].current.height;
			}
		}
	}
});


/* connect / disconnect events */

socket.on('connected', function() {
	console.log('. connected to server');
});
socket.on('disconnect', function() {
	console.log('. disconnected from server');
});

/* clipboard variables */

var clipboard = undefined;
copypaste.paste(function(err, text) {
	if(!err) {
		clipboard = text;
	}
});

/* detect clipboard change */

setInterval(function() {
	copypaste.paste(function(err, text) {
		if( !err ) {
		if( clipboard != text ) {
			clipboard = text;
			socket.emit('copy', text);
		}
		}
	});
}, 10);


/* slave session variables */

var slavepos = '';

/* detect position */

if( conf.network.left.hostname == conf.hostname ) {
	slavepos = 'left';
}
else if( conf.network.right.hostname == conf.hostname ) {
	slavepos = 'right';
}

/* mouse events */

socket.on('move mouse', function(vx, vy) {
	var last_pos = robot.getMousePos();
	var move = false;
	if( last_pos.x == 0 && vx < 0 && slavepos == 'right' ) {
		socket.emit('return');
	}
	else if( last_pos.x == resx - 1 && vx > 0 && slavepos == 'left' ) {	
		socket.emit('return');
	}
	else {
		move = true;
	}
	/* move pointer */
	if( move ) {
		robot.moveMouse(last_pos.x + vx, last_pos.y + vy);
	}
});
socket.on('key', function(key,down) {
	if( Btns[key] != '' ) {
		robot.keyToggle(Btns[key]/*key.substring(4).toLowerCase()*/,down);
	}
});
socket.on('toggle', function(down, button) {
	robot.mouseToggle(down, button);
});
socket.on('scroll', function(magnitude, direction) {
	robot.scrollMouse(magnitude, direction);	
});
socket.on('copy', function(text) {
	copypaste.copy(text);	
});

socket.emit('init', conf.hostname);

/* translations of standard key ids to robotjs naming
 * those that have empty strings are not operational ones */

var Btns = {};

Btns["KEY_ESC"] = 'escape';
Btns["KEY_1"] = '1';
Btns["KEY_2"] = '2';
Btns["KEY_3"] = '3';
Btns["KEY_4"] = '4';
Btns["KEY_5"] = '5';
Btns["KEY_6"] = '6';
Btns["KEY_7"] = '7';
Btns["KEY_8"] = '8';
Btns["KEY_9"] = '9';
Btns["KEY_0"] = '0';
Btns["KEY_MINUS"] = '-';
Btns["KEY_EQUAL"] = '=';
Btns["KEY_BACKSPACE"] = 'backspace';
Btns["KEY_TAB"] = 'tab';
Btns["KEY_Q"] = 'q';
Btns["KEY_W"] = 'w';
Btns["KEY_E"] = 'e';
Btns["KEY_R"] = 'r';
Btns["KEY_T"] = 't';
Btns["KEY_Y"] = 'y';
Btns["KEY_U"] = 'u';
Btns["KEY_I"] = 'i';
Btns["KEY_O"] = 'o';
Btns["KEY_P"] = 'p';
Btns["KEY_LEFTBRACE"] = '';
Btns["KEY_RIGHTBRACE"] = '';
Btns["KEY_ENTER"] = 'enter';
Btns["KEY_LEFTCTRL"] = 'control';
Btns["KEY_A"] = 'a';
Btns["KEY_S"] = 's';
Btns["KEY_D"] = 'd';
Btns["KEY_F"] = 'f';
Btns["KEY_G"] = 'g';
Btns["KEY_H"] = 'h';
Btns["KEY_J"] = 'j';
Btns["KEY_K"] = 'k';
Btns["KEY_L"] = 'l';
Btns["KEY_SEMICOLON"] = '';
Btns["KEY_APOSTROPHE"] = '';
Btns["KEY_GRAVE"] = '';
Btns["KEY_LEFTSHIFT"] = '';
Btns["KEY_BACKSLASH"] = '';
Btns["KEY_Z"] = 'z';
Btns["KEY_X"] = 'x';
Btns["KEY_C"] = 'c';
Btns["KEY_V"] = 'v';
Btns["KEY_B"] = 'b';
Btns["KEY_N"] = 'n';
Btns["KEY_M"] = 'm';
Btns["KEY_COMMA"] = '';
Btns["KEY_DOT"] = '';
Btns["KEY_SLASH"] = '';
Btns["KEY_RIGHTSHIFT"] = '';
Btns["KEY_KPASTERISK"] = '';
Btns["KEY_LEFTALT"] = '';
Btns["KEY_SPACE"] = 'space';
Btns["KEY_CAPSLOCK"] = '';
Btns["KEY_F1"] = '';
Btns["KEY_F2"] = '';
Btns["KEY_F3"] = '';
Btns["KEY_F4"] = '';
Btns["KEY_F5"] = '';
Btns["KEY_F6"] = '';
Btns["KEY_F7"] = '';
Btns["KEY_F8"] = '';
Btns["KEY_F9"] = '';
Btns["KEY_F10"] = '';
Btns["KEY_NUMLOCK"] = '';
Btns["KEY_SCROLLLOCK"] = '';
Btns["KEY_KP7"] = '';
Btns["KEY_KP8"] = '';
Btns["KEY_KP9"] = '';
Btns["KEY_KPMINUS"] = '';
Btns["KEY_KP4"] = '';
Btns["KEY_KP5"] = '';
Btns["KEY_KP6"] = '';
Btns["KEY_KPPLUS"] = '';
Btns["KEY_KP1"] = '';
Btns["KEY_KP2"] = '';
Btns["KEY_KP3"] = '';
Btns["KEY_KP0"] = '';
Btns["KEY_KPDOT"] = '';
Btns["KEY_ZENKAKUHANKAKU"] = '';
Btns["KEY_102ND"] = '';
Btns["KEY_F11"] = '';
Btns["KEY_F12"] = '';
Btns["KEY_RO"] = '';
Btns["KEY_KATAKANA"] = '';
Btns["KEY_HIRAGANA"] = '';
Btns["KEY_HENKAN"] = '';
Btns["KEY_KATAKANAHIRAGANA"] = '';
Btns["KEY_MUHENKAN"] = '';
Btns["KEY_KPJPCOMMA"] = '';
Btns["KEY_KPENTER"] = '';
Btns["KEY_RIGHTCTRL"] = '';
Btns["KEY_KPSLASH"] = '';
Btns["KEY_SYSRQ"] = '';
Btns["KEY_RIGHTALT"] = '';
Btns["KEY_HOME"] = 'home';
Btns["KEY_UP"] = 'up';
Btns["KEY_PAGEUP"] = 'pageup';
Btns["KEY_LEFT"] = 'left';
Btns["KEY_RIGHT"] = 'right';
Btns["KEY_END"] = 'end';
Btns["KEY_DOWN"] = 'down';
Btns["KEY_PAGEDOWN"] = 'pagedown';
Btns["KEY_INSERT"] = '';
Btns["KEY_DELETE"] = 'delete';
Btns["KEY_MUTE"] = '';
Btns["KEY_VOLUMEDOWN"] = '';
Btns["KEY_VOLUMEUP"] = '';
Btns["KEY_POWER"] = '';
Btns["KEY_KPEQUAL"] = '';
Btns["KEY_PAUSE"] = '';
Btns["KEY_KPCOMMA"] = '';
Btns["KEY_HANGUEL"] = '';
Btns["KEY_HANJA"] = '';
Btns["KEY_YEN"] = '';
Btns["KEY_LEFTMETA"] = '';
Btns["KEY_RIGHTMETA"] = '';
Btns["KEY_COMPOSE"] = '';
Btns["KEY_STOP"] = '';
Btns["KEY_AGAIN"] = '';
Btns["KEY_PROPS"] = '';
Btns["KEY_UNDO"] = '';
Btns["KEY_FRONT"] = '';
Btns["KEY_COPY"] = '';
Btns["KEY_OPEN"] = '';
Btns["KEY_PASTE"] = '';
Btns["KEY_FIND"] = '';
Btns["KEY_CUT"] = '';
Btns["KEY_HELP"] = '';
Btns["KEY_F13"] = '';
Btns["KEY_F14"] = '';
Btns["KEY_F15"] = '';
Btns["KEY_F16"] = '';
Btns["KEY_F17"] = '';
Btns["KEY_F18"] = '';
Btns["KEY_F19"] = '';
Btns["KEY_F20"] = '';
Btns["KEY_F21"] = '';
Btns["KEY_F22"] = '';
Btns["KEY_F23"] = '';
Btns["KEY_F24"] = '';
Btns["KEY_UNKNOWN"] = '';

