/*

Gaussian Background Generator

Version:    0.3
Author:     Aiden Foxx
Contact:    admin@foxx.io
Website:    http://foxx.io/gaussian
Twitter:    @furiousfoxx

*/

'use strict';

function GaussianBackground(id, layers, options)
{
    if (!(this instanceof GaussianBackground))
    {
        return new GaussianBackground(id, layers, options);
    }

    this.context = null;

    this.animationFrame = null;
    this.timestep = 0;
    this.firstCallTime = 0;
    this.lastCallTime = 0;
    this.timeElapsed = 0;

    this.fpsAverage = 0;
    this.fpsTotal = 0;

    this.layers = {};

    this.options = {
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

    if (!(this.context = document.getElementById(id).getContext('2d')))
    {
        console.log('ERROR: Could not load canvas');
        return false;
    }

    this.updateOptions(options);
    this.updateLayers(layers);

    this.context.canvas.width = this.options.renderWidth;
    this.context.canvas.height = this.options.renderHeight;

    this.firstCallTime = Date.now();
    this.lastCallTime = this.firstCallTime;

    cancelAnimationFrame(this.animationFrame);
    this.animationFrame = requestAnimationFrame(this.displayLoop.bind(this));
}

/**
 * PUBLIC METHODS
 */
GaussianBackground.prototype.generateLayer = function(orbs, radius, maxVelocity, color, splitX, splitY)
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

    var columnIndex = 0;
    var rowIndex = 0;

    for (var i = 0; i < orbs; i++)
    {
        if (splitX)
        {
            var minX = (this.options.renderWidth / splitX) * columnIndex;
            var maxX = (this.options.renderWidth / splitX) * (columnIndex + 1);
            var minY = 0;
            var maxY = this.options.renderHeight;

            columnIndex++;
        }

        if (splitY)
        {
            var minX = minX ? minX : 0;
            var maxX = maxX ? maxX : this.options.renderWidth;
            var minY = (this.options.renderHeight / splitY) * rowIndex;
            var maxY = (this.options.renderHeight / splitY) * (rowIndex + 1);
        }

        if (columnIndex === splitX)
        {
            columnIndex = 0;
            rowIndex++;
        }

        if (rowIndex === splitY)
        {
            rowIndex = 0;
        }

        layer.orbs[i] = {
            radius : radius,
            posX : splitX ? (Math.random() * maxX) + minX : Math.random() * this.options.renderWidth,
            posY : splitY ? (Math.random() * maxY) + minY : Math.random() * this.options.renderHeight,
            // Give is a random velocity to make the animation a bit more interesting
            velX : Math.round(Math.random()) ? Math.random() * maxVelocity : -(Math.random() * maxVelocity), 
            velY : Math.round(Math.random()) ? Math.random() * maxVelocity : -(Math.random() * maxVelocity),
            // Custom boundaries can be used to create more consistent backgrounds
            minX : minX,
            maxX : maxX,
            minY : minY,
            maxY : maxY
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

            // Check if the orb has custom boundaries
            if (layerOrbs[x].maxX && layerOrbs[x].maxY)
            {
                var minX = layerOrbs[x].minX;
                var maxX = layerOrbs[x].maxX;
                
                var minY = layerOrbs[x].minY;
                var maxY = layerOrbs[x].maxY;
            }
            else
            {
                var minX = 0;
                var maxX = this.options.renderWidth;

                var minY = 0;
                var maxY = this.options.renderHeight;
            }

            // Collision detection and correction
            if (layerOrbs[x].posX >= maxX)
            {
                layerOrbs[x].posX = maxX;
                layerOrbs[x].velX = -layerOrbs[x].velX;
            }
            else if (layerOrbs[x].posX <= minX)
            {
                layerOrbs[x].posX = minX;
                layerOrbs[x].velX = -layerOrbs[x].velX;
            }
            
            if (layerOrbs[x].posY >= maxY)
            {
                layerOrbs[x].posY = maxY;
                layerOrbs[x].velY = -layerOrbs[x].velY;
            }
            else if (layerOrbs[x].posY <= minY)
            {
                layerOrbs[x].posY = minY;
                layerOrbs[x].velY = -layerOrbs[x].velY;
            }
  

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
            stackBlurCanvasRGB(this.context.canvas.id, 0, 0, this.options.renderWidth, this.options.renderHeight, this.options.blurRadius);
            break;

        case 'fastblur':
            boxBlurCanvasRGB(this.context.canvas.id, 0, 0, this.options.renderWidth, this.options.renderHeight, this.options.blurRadius, this.options.blurIterations);
            break;

        case 'integralblur':
            integralBlurCanvasRGB(this.context.canvas.id, 0, 0, this.options.renderWidth, this.options.renderHeight, this.options.blurRadius, this.options.blurIterations);
            break;

        case 'stackboxblur':
            stackBoxBlurCanvasRGB(this.context.canvas.id, 0, 0, this.options.renderWidth, this.options.renderHeight, this.options.blurRadius, this.options.blurIterations);
            break;
    }
}

GaussianBackground.prototype.debug = function()
{
    this.debugLayerBoundaries();
    if (!document.getElementById(this.context.canvas.id + 'DebugDisplay'))
    {                   
        var debugDisplay = document.createElement('div');
        debugDisplay.id = this.context.canvas.id + 'DebugDisplay';
        debugDisplay.style.position = 'fixed';
        debugDisplay.style.bottom = '10px';
        debugDisplay.style.left = '10px';
        debugDisplay.style.color = '#00ff00';
        debugDisplay.style.fontFamily = 'sans-serif';

        document.getElementsByTagName('body')[0].appendChild(debugDisplay);
    }
    document.getElementById(this.context.canvas.id + 'DebugDisplay').innerHTML = this.debugDisplay();

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

GaussianBackground.prototype.debugLayerBoundaries = function()
{
    for (var i = Object.keys(this.layers).length - 1; i >= 0; i--)
    {
        var context = this.layers[i].context;
        var layerOrbs = this.layers[i].orbs;
        var layerColorHash = (Object.keys(layerOrbs).length + '' + (i + 1)) / 100;

        for (var x = Object.keys(layerOrbs).length - 1; x >= 0; x--)
        {
            if (layerOrbs[x].maxX && layerOrbs[x].maxY)
            {
                this.context.beginPath();
                this.context.lineWidth = '1';
                this.context.strokeStyle = "#" + (layerColorHash * 0xFFFFFF << 0).toString(16);
                this.context.rect(layerOrbs[x].minX, layerOrbs[x].minY, layerOrbs[x].maxX - layerOrbs[x].minX, layerOrbs[x].maxY - layerOrbs[x].minY); 
                this.context.stroke(); 
            }
        }
    }
}

GaussianBackground.prototype.updateLayers = function(layers)
{
    // Empty previous layers
    this.layers = {};

    for (var i = Object.keys(layers).length - 1; i >= 0; i--)
    {
        this.layers[i] = this.generateLayer(layers[i].orbs, layers[i].radius, layers[i].maxVelocity, layers[i].color, layers[i].splitX, layers[i].splitY)
    }
}

GaussianBackground.prototype.updateOptions = function(options)
{
    for (var key in options)
    {
        this.options[key] = options[key];
    }

    // Destroy possible debug window
    if (document.getElementById(this.context.canvas.id + 'DebugDisplay'))
    {
        var debugDisplay = document.getElementById(this.context.canvas.id + 'DebugDisplay');
        debugDisplay.parentNode.removeChild(debugDisplay);
    }

    // Update rendering options
    this.timestep = 1000.00 / parseFloat(this.options.fpsCap);

    this.context.canvas.width = this.options.renderWidth;
    this.context.canvas.height = this.options.renderHeight;

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