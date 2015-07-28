/*

Gaussian Background Generator

Version:    0.1
Author:     Aiden Foxx
Contact:    admin@foxx.io
Website:    http://foxx.io/gaussian
Twitter:    @furiousfoxx

*/

'use strict';

function GaussianBackground(id, initLayers, initOptions)
{
    if (!(this instanceof GaussianBackground))
    {
        return new GaussianBackground(id, layers, customOptions);
    }

    /**
     * PRIVATE VARIABLES
     */
    var self = this;

    var canvas;
    var context;

    var animationFrame;
    var timestep = 1000.00 / 20.00;
    var firstCallTime = 0;
    var lastCallTime = 0;
    var timeElapsed = 0;

    var fpsAverage = 0;
    var fpsTotal = 0;

    var layers = { };

    var options = {
        canvasID : null,
        debug : false,
        blur : true,
        blurRadius : 50,
        blurMethod : 'stackblur',
        blurIterations : 0,
        animation : true,
        renderWidth : 320,
        renderHeight : 130
    };

    /**
     * PRIVATE METHODS
     */
    function __constructor(id, initLayers, initOptions)
    {
        if (!(canvas = document.getElementById(id)) || !(context = canvas.getContext('2d')))
        {
            console.log('ERROR: Could not load canvas');
            return false;
        }

        self.updateOptions(initOptions);
        self.updateLayers(initLayers);

        canvas.width = options.renderWidth;
        canvas.height = options.renderHeight;

        firstCallTime = Date.now();
        lastCallTime = firstCallTime;

        cancelAnimationFrame(animationFrame);
        animationFrame = requestAnimationFrame(displayLoop);
    }

    var generateLayer = function(orbs, radius, maxVelocity, color)
    {
        var canvas = document.createElement('canvas');

        canvas.width = options.renderWidth;
        canvas.height = options.renderHeight;

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
                posX : Math.round(Math.random() * options.renderWidth),
                posY : Math.round(Math.random() * options.renderHeight),
                // Give is a random velocity to make the animation a bit more interesting
                velX : Math.round(Math.random()) ? Math.random() * maxVelocity : -(Math.random() * maxVelocity), 
                velY : Math.round(Math.random()) ? Math.random() * maxVelocity : -(Math.random() * maxVelocity)
            };
        }

        return layer;
    }

    var displayLoop = function()
    {
        // Keep going if the user wants animation
        if (options.animation)
        {
           animationFrame = requestAnimationFrame(displayLoop);
        }

        var currentTime = Date.now();
        var delta = currentTime - lastCallTime;

        // Ignore timesteping code if there is no animation
        if (delta > timestep || !options.animation)
        {
            lastCallTime = currentTime - (delta % timestep);
            timeElapsed = lastCallTime - firstCallTime;

            fpsTotal++;
            fpsAverage = fpsTotal / (timeElapsed / 1000);
            
            drawBackground();

            if (options.blur)
            {
                drawBlur();
            }
            
            if (options.debug)
            {
                debug();
            }
        }
    }

    var drawBackground = function()
    {
        for (var i = Object.keys(layers).length - 1; i >= 0; i--)
        {
            var layerCanvas = layers[i].canvas;
            var layerContext = layers[i].context;
            var layerOrbs = layers[i].orbs;

            // Draw background
            layerContext.fillStyle = layers[i].color;
            layerContext.fillRect(0, 0, options.renderWidth, options.renderHeight);

            // Draw animated layer elements
            for (var x = Object.keys(layerOrbs).length - 1; x >= 0; x--)
            {
                // Animate the movement
                layerOrbs[x].posX += layerOrbs[x].velX;
                layerOrbs[x].posY += layerOrbs[x].velY;

                // If the orb is leaving the viweport reverse it
                if (layerOrbs[x].posX >= options.renderWidth || layerOrbs[x].posX <= 0)
                    layerOrbs[x].velX = -layerOrbs[x].velX;
                if (layerOrbs[x].posY >= options.renderHeight || layerOrbs[x].posY <= 0)
                    layerOrbs[x].velY = -layerOrbs[x].velY;

                layerContext.save();
                layerContext.globalCompositeOperation = 'destination-out';
                layerContext.beginPath();
                layerContext.arc(layerOrbs[x].posX, layerOrbs[x].posY, layerOrbs[x].radius, 0, 2 * Math.PI, false);
                layerContext.fill();
                layerContext.restore();
            }

            // Draw the virtual canvas layer onto the main canvas
            context.drawImage(layerCanvas, 0, 0);
        }
    }

    var drawBlur = function()
    {
        switch (options.blurMethod)
        {
            case 'stackblur':
                stackBlurCanvasRGB(canvas.id, 0, 0, options.renderWidth, options.renderHeight, options.blurRadius);
                break;

            case 'fastblur':
                boxBlurCanvasRGB(canvas.id, 0, 0, options.renderWidth, options.renderHeight, options.blurRadius, options.blurIterations);
                break;

            case 'integralblur':
                integralBlurCanvasRGB(canvas.id, 0, 0, options.renderWidth, options.renderHeight, options.blurRadius, options.blurIterations);
                break;

            case 'stackboxblur':
                stackBoxBlurCanvasRGB(canvas.id, 0, 0, options.renderWidth, options.renderHeight, options.blurRadius, options.blurIterations);
                break;
        }
    }

    var debug = function()
    {
        if (!document.getElementById(canvas.id + 'DebugDisplay'))
        {                   
            var debugDisplay = document.createElement('div');
            debugDisplay.id = canvas.id + 'DebugDisplay';
            debugDisplay.style.position = 'fixed';
            debugDisplay.style.bottom = '10px';
            debugDisplay.style.left = '10px';
            debugDisplay.style.color = '#00ff00';
            debugDisplay.style.fontFamily = 'sans-serif';

            document.getElementsByTagName('body')[0].appendChild(debugDisplay);
        }

        var data = options;

        data['fpsAverage'] = fpsAverage;
        data['fpsTotal'] = fpsTotal;
        data['timeElapsed'] = timeElapsed;
        data['layers'] = layers;

        document.getElementById(canvas.id + 'DebugDisplay').innerHTML = self.debugDisplay(data);
    }

    /**
     * PUBLIC METHODS
     */
    GaussianBackground.prototype.updateLayers = function(updateLayers)
    {
        // Empty previous layers
        layers = {};

        for (var i = Object.keys(updateLayers).length - 1; i >= 0; i--)
        {
            layers[i] = generateLayer(updateLayers[i].orbs, updateLayers[i].radius, updateLayers[i].maxVelocity, updateLayers[i].color)
        }
    }

    GaussianBackground.prototype.updateOptions = function(updateOptions)
    {
        for (var key in updateOptions)
        {
            options[key] = updateOptions[key];
        }

        /**
         * UPDATE RENDER OPTIONS
         */
        canvas.width = options['renderWidth'];
        canvas.height = options['renderHeight'];

        for (var i = Object.keys(layers).length - 1; i >= 0; i--)
        {
            layers[i].canvas.width = options['renderWidth'];
            layers[i].canvas.height = options['renderHeight'];
        }

        // May need a restart if animation was changed
        this.play();
    }

    GaussianBackground.prototype.pause = function()
    {
        cancelAnimationFrame(animationFrame);
    }

    GaussianBackground.prototype.play = function()
    {
        cancelAnimationFrame(animationFrame);
        animationFrame = requestAnimationFrame(displayLoop);
    }

    __constructor(id, initLayers, initOptions);
}

/**
 * OVERRIDABLE PUBLIC METHODS
 */
GaussianBackground.prototype.debugDisplay = function(data)
{
    return (data.animation ? 'Average FPS: ' + Math.round(data.fpsAverage) : '') + 
           '<br />Render Width: ' + data.renderWidth + 'px' +
           '<br />Render Height: ' + data.renderHeight + 'px' + 
           '<br />Layers: ' + Object.keys(data.layers).length + 
           '<br />Animation: ' + (data.animation ? 'Yes' : 'No') + 
           (data.blur ? '<br />Blur Algorithm: ' + data.blurMethod : '') +
           (data.blur ? '<br />Blur Radius: ' + data.blurRadius : '') +
           (data.blur ? '<br />Blur Iterations: ' + data.blurIterations : '');
}