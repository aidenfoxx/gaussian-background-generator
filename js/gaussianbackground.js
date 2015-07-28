/*

Gaussian Background Generator

Version:    0.1
Author:     Aiden Foxx
Contact:    admin@foxx.io
Website:    http://foxx.io/gaussian
Twitter:    @furiousfoxx

*/

'use strict';

function GaussianBackground(id, layers, options)
{
	this.canvas;
	this.context;

	this.animationFrame;
	this.timestep = 0;
	this.firstCallTime = 0;
	this.lastCallTime = 0;
	this.timeElapsed = 0;

	this.fpsAverage = 0;
	this.fpsTotal = 0;

	this.layers = {};

	this.options = {
	    canvasID : null,
	    debug : false,
	    blur : true,
	    blurRadius : 50,
	    blurMethod : 'stackblur',
	    blurIterations : 0,
	    animation : true,
	    fpsCap : 20,
	    renderWidth : 320,
	    renderHeight : 130
	};

    if (!(this.canvas = document.getElementById(id)) || !(this.context = this.canvas.getContext('2d')))
    {
        console.log('ERROR: Could not load canvas');
        return false;
    }

    this.updateOptions(options);
    this.updateLayers(layers);

    this.canvas.width = this.options.renderWidth;
    this.canvas.height = this.options.renderHeight;

    this.firstCallTime = Date.now();
    this.lastCallTime = this.firstCallTime;

    cancelAnimationFrame(this.animationFrame);
    this.animationFrame = requestAnimationFrame(this.displayLoop.bind(this));
}

/**
 * PUBLIC METHODS
 */
GaussianBackground.prototype.generateLayer = function(orbs, radius, maxVelocity, color)
{
    var canvas = document.createElement('canvas');

    canvas.width = this.options.renderWidth;
    canvas.height = this.options.renderHeight;

    var layer = {
        orbs : {},
        color : color,
        canvas : canvas,
        context : canvas.getContext('2d')
    };

    for (var i = orbs - 1; i >= 0; i--)
    {
        layer.orbs[i] = {
            radius : radius,
            posX : Math.round(Math.random() * this.options.renderWidth),
            posY : Math.round(Math.random() * this.options.renderHeight),
            // Give is a random velocity to make the animation a bit more interesting
            velX : Math.round(Math.random()) ? Math.random() * maxVelocity : -(Math.random() * maxVelocity), 
            velY : Math.round(Math.random()) ? Math.random() * maxVelocity : -(Math.random() * maxVelocity)
        };
    }

    return layer;
}

GaussianBackground.prototype.displayLoop = function()
{
    // Keep going if the user wants animation
    if (this.options.animation)
    {
       this.animationFrame = requestAnimationFrame(this.displayLoop.bind(this));
    }

    var currentTime = Date.now();
    var delta = currentTime - this.lastCallTime;

    // Ignore timesteping code if there is no animation
    if (delta > this.timestep || !this.options.animation)
    {
        this.lastCallTime = currentTime - (delta % this.timestep);
        this.timeElapsed = this.lastCallTime - this.firstCallTime;

        this.fpsTotal++;
        this.fpsAverage = this.fpsTotal / (this.timeElapsed / 1000);
        
        this.drawBackground();

        if (this.options.blur)
        {
            this.drawBlur();
        }
        
        if (this.options.debug)
        {
            this.debug();
        }
    }
}

GaussianBackground.prototype.drawBackground = function()
{
    for (var i = Object.keys(this.layers).length - 1; i >= 0; i--)
    {
        var layerCanvas = this.layers[i].canvas;
        var layerContext = this.layers[i].context;
        var layerOrbs = this.layers[i].orbs;

        // Draw background
        layerContext.fillStyle = this.layers[i].color;
        layerContext.fillRect(0, 0, this.options.renderWidth, this.options.renderHeight);

        // Draw animated layer elements
        for (var x = Object.keys(layerOrbs).length - 1; x >= 0; x--)
        {
            // Animate the movement
            layerOrbs[x].posX += layerOrbs[x].velX;
            layerOrbs[x].posY += layerOrbs[x].velY;

            // If the orb is leaving the viweport reverse it
            if (layerOrbs[x].posX >= this.options.renderWidth || layerOrbs[x].posX <= 0)
                layerOrbs[x].velX = -layerOrbs[x].velX;
            if (layerOrbs[x].posY >= this.options.renderHeight || layerOrbs[x].posY <= 0)
                layerOrbs[x].velY = -layerOrbs[x].velY;

            layerContext.save();
            layerContext.globalCompositeOperation = 'destination-out';
            layerContext.beginPath();
            layerContext.arc(layerOrbs[x].posX, layerOrbs[x].posY, layerOrbs[x].radius, 0, 2 * Math.PI, false);
            layerContext.fill();
            layerContext.restore();
        }

        // Draw the virtual canvas layer onto the main canvas
        this.context.drawImage(layerCanvas, 0, 0);
    }
}

GaussianBackground.prototype.drawBlur = function()
{
    switch (this.options.blurMethod)
    {
        case 'stackblur':
            stackBlurCanvasRGB(this.canvas.id, 0, 0, this.options.renderWidth, this.options.renderHeight, this.options.blurRadius);
            break;

        case 'fastblur':
            boxBlurCanvasRGB(this.canvas.id, 0, 0, this.options.renderWidth, this.options.renderHeight, this.options.blurRadius, this.options.blurIterations);
            break;

        case 'integralblur':
            integralBlurCanvasRGB(this.canvas.id, 0, 0, this.options.renderWidth, this.options.renderHeight, this.options.blurRadius, this.options.blurIterations);
            break;

        case 'stackboxblur':
            stackBoxBlurCanvasRGB(this.canvas.id, 0, 0, this.options.renderWidth, this.options.renderHeight, this.options.blurRadius, this.options.blurIterations);
            break;
    }
}

GaussianBackground.prototype.debug = function()
{
    if (!document.getElementById(this.canvas.id + 'DebugDisplay'))
    {                   
        var debugDisplay = document.createElement('div');
        debugDisplay.id = this.canvas.id + 'DebugDisplay';
        debugDisplay.style.position = 'fixed';
        debugDisplay.style.bottom = '10px';
        debugDisplay.style.left = '10px';
        debugDisplay.style.color = '#00ff00';
        debugDisplay.style.fontFamily = 'sans-serif';

        document.getElementsByTagName('body')[0].appendChild(debugDisplay);
    }
    document.getElementById(this.canvas.id + 'DebugDisplay').innerHTML = this.debugDisplay();
}

GaussianBackground.prototype.debugDisplay = function()
{
    return (this.options.animation ? 'FPS Average: ' + Math.round(this.fpsAverage) : '') + 
           (this.options.animation ? '<br />FPS Cap: ' + Math.round(this.options.fpsCap) : '') + 
           '<br />Render Width: ' + this.options.renderWidth + 'px' +
           '<br />Render Height: ' + this.options.renderHeight + 'px' + 
           '<br />Layers: ' + Object.keys(this.layers).length + 
           '<br />Animation: ' + (this.options.animation ? 'Yes' : 'No') + 
           (this.options.blur ? '<br />Blur Algorithm: ' + this.options.blurMethod : '') +
           (this.options.blur ? '<br />Blur Radius: ' + this.options.blurRadius : '') +
           (this.options.blur ? '<br />Blur Iterations: ' + this.options.blurIterations : '');
}

GaussianBackground.prototype.updateLayers = function(layers)
{
    // Empty previous layers
    this.layers = {};

    for (var i = Object.keys(layers).length - 1; i >= 0; i--)
    {
        this.layers[i] = this.generateLayer(layers[i].orbs, layers[i].radius, layers[i].maxVelocity, layers[i].color)
    }
}

GaussianBackground.prototype.updateOptions = function(options)
{
    for (var key in options)
    {
        this.options[key] = options[key];
    }

    /**
     * UPDATE RENDER OPTIONS
     */
    this.timestep = 1000.00 / parseFloat(this.options.fpsCap);

    this.canvas.width = this.options.renderWidth;
    this.canvas.height = this.options.renderHeight;

    for (var i = Object.keys(this.layers).length - 1; i >= 0; i--)
    {
        this.layers[i].canvas.width = this.options.renderWidth;
        this.layers[i].canvas.height = this.options.renderHeight;
    }

    // May need a restart if animation was changed
    this.play();
}

GaussianBackground.prototype.pause = function()
{
    cancelAnimationFrame(this.animationFrame);
}

GaussianBackground.prototype.play = function()
{
    cancelAnimationFrame(this.animationFrame);
    this.animationFrame = requestAnimationFrame(this.displayLoop.bind(this));
}