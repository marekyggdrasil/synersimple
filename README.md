# Introduction

This project is an attempt to create simple equivalent of Synergy project that is easier to install and use, certainly not replace it or not trying to do better.

# Security disclaimer

This software does not implement any kind of encryption (for now).
Socket events can be easily sniffed in local network.
This can be used to store your private and security sensitive data such as credit card number or passwords.

# Wiki links

* [Installation](https://github.com/marekyggdrasil/synersimple/wiki/Installation)
* [Configuration](https://github.com/marekyggdrasil/synersimple/wiki/Configuration)
* [Troubleshooting](https://github.com/marekyggdrasil/synersimple/wiki/Troubleshooting)
* [Contribution](https://github.com/marekyggdrasil/synersimple/wiki/Contribution)


# Usage

Start by launching the server on the master computer.

`nodejs master.js`

Mind that sometimes it may be `node master.js`, also if your user account does not have permissions to read `/dev/input/` devices server will not launch properly. Launching it as root is NOT recommended and if you do so you do it on your own risk. 

Once server is started launch client applications on each of side screen computers using following command.

`nodejs slave.js`

# Licence

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


