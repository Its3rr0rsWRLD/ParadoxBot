<image src="gallium-js.ico" width="100" height="100" style="display: block; margin-left: auto; margin-right: auto;">

# Why should I use Gallium JS?
Idk. It's just tkinter but for javascript. It's not that good, but it's better than nothing, especially if you don't know html and don't want to use electron.

# Info
***Gallium JS "converts" to python, so if you do not have python installed, it needs to be installed.***
***Please install Gallium JS globally using npm install -g gallium-js***

# Commands
***gallium pack <icon>*** - Pack your app into a .exe file (if on windows. If on any other OS, it will be a executable specific to your OS)

# Functions
```js
const app = require('gallium-js');

app.init(500, 300, 'Example'); // Initialize the app with the width, height, and title

app.resizable(false, false); // Make the app resizable or not

app.button('Close App', 10, 10, 100, 50, "exit"); // Create a button with the text, x, y, width, height, and function (Function still in development, only exit works)

app.loop(); // Loop the app, like mainloop in python tkinter
```
