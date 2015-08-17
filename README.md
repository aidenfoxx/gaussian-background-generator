# Gausian Background Generator (Version 0.3)
A script which creates a gaussian blur effect background using a canvas element. The effect is similar to that seen in various gaussian background images, however, this script generates the effect dynamically and includes a plesant animation.

Script example (http://foxx.io/gaussian/).

## How it Works
The script works by cutting circles from multiple stacked canvas layers and then applying a blur effect to result. This can be easily understood when the blur effect is removed (http://foxx.io/gaussiannoblur/).

## Requirements
If blur is enabled, the script relies on Mario Klingemanns StackBlur, FastBlur, IntegralBlur or StackBoxBlur plugin (http://www.quasimondo.com/StackBlurForCanvas/StackBlurDemo.html).

## Usage
The script accepts a number of parameters:

```javascript
var background = GaussianBackground(elementID, layers, options);
```
### Layers

The layers parameter requires an array/object of display layers using the following syntax:

```javascript
var layers = [
    { orbs : 2, radius : 130, maxVelocity : 1, color : '#333333', splitX : 0, splitY : 0 },
    { color : '#000000' }
];

OR

var layers = {
    0 : { orbs : 2, radius : 130, maxVelocity : 1, color : '#333333', splitX : 0, splitY : 0 },
    1 : { color : '#000000' }
};
```
The parameters 'splitX' and 'splitY' can be used to split the layer into columns and rows to encourage more consistent background generation.

### Options

All avalible options are:

```javascript
var options = {
    debug : false,
    blur : true,
    blurRadius : 50,
    blurMethod : '(stackblur|fastblur|integralblur|stackboxblur)',
    blurIterations : 0,
    animation : true,
    fpsCap : 20,
    renderWidth : 320,
    renderHeight : 130
};
```

### Object Methods

The created object has a number of public methods:

```javascript
var background = GaussianBackground(elementID, layers, options);

// Pauses the animation
background.pause();

// Play the animation
background.play();

// Update the display layers of the object
background.updateLayers(layers);

// Update the options of the object
background.updateOptions(options);
```

### Notes:
- Layers will be rendered with the first layer at the front and the last at the back.
- Blur iterations are only compatible with the render methods 'fastblur', 'integralblur' and 'stackboxblur'.
- It is better to use a lower render width/height due to performance. Because of the bluring the quality will appear almost identical once scaled up.

## Outstanding Issues
- Possibly add a some sort of performance scaling if FPS drops below the FPS cap
- Profile and improve performance
- Ensure browser compatibility

## License
All code is free to use and distribute under MIT License unless otherwise specified.

Special thanks to Mario Klingemann for creating the exceptional StackBlur plugin used in this project.
