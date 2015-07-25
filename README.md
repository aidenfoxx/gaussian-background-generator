# Gausian Background Generator - Version 0.1
A script which creates a gaussian blur effect background using a canvas element. The effect is similar to that seen in various gaussian background images, however, this script generates the effect dynamically and includes a plesant animation.

Script example (http://foxx.io/gaussian/).

## How it Works
The script works by cutting circles from multiple stacked canvas layers and then applying a blur effect to result. This can be easily understood when the blur effect is removed (http://foxx.io/gaussiannoblur/).

## Usage
The script has a number of options, several of which are required. A basic example would be:

```javascript
gaussianBackground.init({
    elementID : 'elementID',
    layers : {
        0 : { circles : 1, radius : 50, maxVelocity : 1, color : '#000' }
    }
});
```

All avalible options are:

```javascript
{
    elementID : 'elementID',
    debug : false,
    blur : true,
    blurRadius : 50,
    blurMethod : '(stackblur|fastblur|integralblur|stackboxblur)',
    blurIterations : 0,
    animation : true,
    renderWidth : 320,
    renderHeight : 130,
    layers : {
        0 : { circles : 1, radius : 50, maxVelocity : 1, color : '#000' }
    }   
}
```

### Notes:
- Blur iterations are only compatible with the render methods 'fastblur', 'integralblur' and 'stackboxblur'.
- It is better to use a lower render width/height due to performance. Because of the bluring the quality will appear almost identical once scaled up.

# Requirements
The script relies on Mario Klingemanns StackBlur, FastBlur, IntegralBlur or StackBoxBlur plugin (http://www.quasimondo.com/StackBlurForCanvas/StackBlurDemo.html).

## Outstanding Issues
- Make the script easier implemented. Possibly convert to OOP or a jQuery plugin
- Profile and improve performance
- Ensure browser compatibility

## License
All code is free to use and distribute under MIT License unless otherwise specified.

Special thanks to Mario Klingemann for creating the exceptional StackBlur plugin used in this project.
