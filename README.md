# introduction

This project is an attempt to create simple equivalent of Synergy project that is easier to install and use, certainly not replace it or not trying to do better.

# security warning

This software does not implement any kind of encryption (for now). Socket events can be easily sniffed in local network. This can be used to store your private and security sensitive data such as credit card number or passwords.

# installation

Basic requirement is *Node.js* and *npm*, if you don't have those programs start by installing them.

1. install dependencies

`npm install`

2. install `input-event` dependency

Library `input-event` does not figure in npm repository, thus it has to be installed manually. Simply download the zip package from [input-event repository](https://github.com/risacher/input-event) , unzip it to `node_modules` directory and rename it from `input-event-master` to `input-event`.

# configuration

Configuration is done in single *conf.json* file. Here we provide an example configuration for single desktop and two laptop computers.

1. check server local ip address

`ifconfig`

It figures under *inet addr*. You also need to choose port, most common choice seems to be 3000, although you can choose anything you prefer that is available.

2. check input devices

You can simply list available input devices using

`ls /dev/input` 

Symbolic links are available in this directory that allow you to browse them by id or by path.

`ls -l /dev/input/by-id` 

Or else

`ls -l /dev/input/by-path` 

If you still don't know which input corresponds to your keyboard and mouse, you can try different options.

3. check screen resolutions

You need to provide screen resolutions for server computer, as well as for side screen computers.

4. define xinput device for your mouse

To list available xinput devices use

`xinput list`

Take the id value of the one that corresponds to your mouse. Without it server will not be able to disable mouse when pointer moves to another screen.

5. choose hostnames

You should name devices with distinct strings for identification purposes.

6. distribute *conf.json* among your computers.

Once you finish your *conf.json* simply copy it to all machines that will act as separate screens. 

7. example *conf.json* file.

Following configuration file represents case of three computers, a desktop that controls two laptops as side screens, machine names as *laptop1* is placed on left side and *laptop2* is placed on right side of desktop screen. Both laptops have resolution of screen 1024x768 while desktop screen is 1280x800.

Keyboard input device is `/dev/input/event3` and mouse is `/dev/input/event7`, xinput id for mouse is 9. Desktop local network IP address is 192.168.2.52 and listening port that has been chosen is 3000.

```
{
	"hostname" : "desktop",
	"address" : "192.168.2.52",
	"port" : 3000,
	"mouse" : "event7",
	"keyboard" : "event3",
	"xinput" : 9,
	"resx" : 1280,
	"resy" : 800,
	"network" :
		{
			"left" :
				{
					"hostname" : "laptop1",
					"resx" : 1024,
					"resy" : 768
				},
			"right" :
				{
					"hostname" : "laptop2",
					"resx" : 1024,
					"resy" : 768
				}
		}
}
```

# launch

Start by launching the server on the master computer.

`nodejs master.js`

Mind that sometimes it may be `node master.js`, also if your user account does not have permissions to read `/dev/input/` devices server will not launch properly. Launching it as root is NOT recommended and if you do so you do it on your own risk. 

Once server is started launch client applications on each of side screen computers using following command.

`nodejs slave.js`

# most important TODOs

1. SSL encryption, for security reasons
2. synchronize clipboard
3. auto detect screen resolution for simpler configuration

# licence

```
The MIT License (MIT)

Copyright (c) 2015 marekyggdrasil

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```


