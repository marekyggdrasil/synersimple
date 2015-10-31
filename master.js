/* load configuration */

var conf = require('./conf.json');

/* dependencies */

var robot = require('robotjs');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var inputevent = require('input-event');
var xinput = require('xinput');

/* pointer position variables */

var last_pos = robot.getMousePos();
var diff_pos = {x: 0, y: 0};

/* client variables */

var slave_left = undefined;
var slave_right = undefined;
var control = undefined;

/* hardware */

var k = new inputevent(conf.keyboard); /* keyboard */
var m = new inputevent(conf.mouse); /* mouse */

/* keyboard events */

k.on('keypress', function( ev ) {
	//console.log('press ' + ev.keyId)
	if( control != undefined ) {
		control.emit('key', ev.keyId, 'down');
	}
});
k.on('keyup', function( ev ) {
	//console.log('up ' + ev.keyId)
	if( control != undefined ) {
		control.emit('key', ev.keyId, 'up');
	}
});

/* mouse move or wheel events */

m.on('rel', function(ev) {
	if( ev.axis == 'REL_WHEEL' ) {
		if( control != undefined ) {
			dir = '';
			if( ev.value > 0 ) {
				dir = 'up';
			}
			else {
				dir = 'down';
			} 
			control.emit('scroll', Math.abs( ev.value ), dir);
		}
	}
	else if( ev.axis == 'REL_Y' ) {
		diff_pos.y += ev.value;
	}
	else if( ev.axis == 'REL_X' ) {
		diff_pos.x += ev.value;
	}
});

/* mouse button events */

m.on('keyup', function(ev) {
	if( ev.keyId == 'BTN_LEFT' ) {
		if( control != undefined ) {
			control.emit('toggle', 'up', 'left');
		}
	}
	else if( ev.keyId == 'BTN_RIGHT' ) {
		if( control != undefined ) {
			control.emit('toggle', 'up', 'right');
		}
	}
});
m.on('keypress', function(ev) {
	if( ev.keyId == 'BTN_LEFT' ) {
		if( control != undefined ) {
			control.emit('toggle', 'down', 'left');
		}
	}
	else if( ev.keyId == 'BTN_RIGHT' ) {
		if( control != undefined ) {
			control.emit('toggle', 'down', 'right');
		}
	}
});

/* turn mouse ON/OFF */

function setMouseEnabled( enabled ) {
	if( enabled ) {
		xinput.setProp(conf.xinput, 'Device Enabled', '1', function(err){
			if(err) {
  				console.log(err); // => true
			}
		});
	}
	else {
		xinput.setProp(conf.xinput, 'Device Enabled', '0', function(err){
			if(err) {
				console.log(err); // => true
			}
		});
	}
}

/* server stop event */

process.on('SIGINT', function() {
	console.log('. stopping the synersimple server');
	/* make sure mouse will be on after server stops */
	setMouseEnabled( true );
	process.exit();
});

/* handle mouse moves every 10ms */

setInterval(function() {
	last_pos = robot.getMousePos();
	/* only if change in position occured */
	if( diff_pos.x != 0 || diff_pos.y != 0 ) {
		if( control != undefined ) {
			/* broadcast */
			control.emit('move mouse', diff_pos.x, diff_pos.y);
		}
		else {
			/* switch to other screen */	
			if( last_pos.x == 0 ) {
				/* switch to left screen if left machine
				 * is connected */
				if( slave_left != undefined ) {
					setMouseEnabled( false );
					control = slave_left;
				}
			}
			else if( last_pos.x == conf.resx - 1 ) {
				/* switch to right screen if right machine
				 * is connected */
				if( slave_right != undefined ) {
					setMouseEnabled( false );
					control = slave_right;
				}
			}
		}
	}
	/* to detect change, difference variable
	 * must be reset */
	diff_pos = {x: 0, y: 0};
}, 10);

/* socket communication events */

io.on('connection', function(socket) {
	/* slave machine connected event */
	socket.on('init', function(name) {
		/* verify if this machine is added to 
		 * config as left or as right screen */
		var rgt = conf.network.right.hostname;
		var lft = conf.network.left.hostname;
		console.log(name);
		if( rgt == name ) {
			console.log('. right screen connected : ' + name);
			slave_right = socket;
		}
		else if( lft == name ) {
			console.log('. left screen connected : ' + name);
			slave_left = socket;
		}
	});
	/* control returns to master screen */
	socket.on('return', function() {
		setMouseEnabled(true);
		control = undefined;
	});
});

/* start listening */

http.listen(conf.port, '0.0.0.0', function(){
	console.log('. synersimple server listening on port :' + conf.port);
});

