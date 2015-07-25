/*

Gaussian Background Generator

Version:    0.1
Author:     Aiden Foxx
Contact:    admin@foxx.io
Website:    http://foxx.io/gaussian
Twitter:    @furiousfoxx

*/

'use strict';

var gaussianBackground = {

    animationFrame : null,
    timestep : 1000.00 / 20.00,
    firstCalledTime : null,
    lastCalledTime : null,
    timeElapsed : 0,
    deltaTimer : 0,

    fpsAverage : 0,
    fpsTotal : 0,

    canvas : null,
    context : null,

    layers : {

    },

    settings : {
        canvasID : null,
        debug : false,
        blur : true,
        blurRadius : 50,
        blurMethod : 'stackblur',
        blurIterations : 0,
        animation : true,
        renderWidth : 320,
        renderHeight : 130,
        layers : {

        }
    },

    init : function(settings)
    {
        // Load user settings into the framework
        for (var key in settings)
            gaussianBackground.settings[key] = settings[key];

        try
        {
            gaussianBackground.canvas = document.getElementById(gaussianBackground.settings.canvasID);
            gaussianBackground.context = gaussianBackground.canvas.getContext('2d');
        }
        catch (e)
        {
            console.log('ERROR: Could not load canvas');
            return false;
        }

        gaussianBackground.canvas.width = gaussianBackground.settings.renderWidth;
        gaussianBackground.canvas.height = gaussianBackground.settings.renderHeight;

        gaussianBackground.defineLayers(gaussianBackground.settings.layers);

        // Stuff for timestep
        gaussianBackground.lastCalledTime = Date.now();
        gaussianBackground.firstCalledTime = gaussianBackground.lastCalledTime;
        
        cancelAnimationFrame(gaussianBackground.animationFrame);
        gaussianBackground.animationFrame = requestAnimationFrame(gaussianBackground.displayLoop);
    },

    defineLayers : function(layers)
    {
        for (var i = Object.keys(layers).length - 1; i >= 0; i--)
        {
            gaussianBackground.layers[i] = gaussianBackground.generateLayer(
                layers[i].circles, 
                layers[i].radius, 
                layers[i].maxVelocity, 
                layers[i].color
            );
        }
    },

    generateLayer : function(length, radius, maxVelocity, color)
    {
        var canvas = document.createElement('canvas');

        canvas.width = gaussianBackground.settings.renderWidth;
        canvas.height = gaussianBackground.settings.renderHeight;

        var layer = {
            animation : {},
            color : color,
            canvas : canvas,
            context : canvas.getContext('2d')
        };

        for (var i = length - 1; i >= 0; i--)
        {
            layer.animation[i] = {
                radius : radius,
                posX : Math.round(Math.random() * gaussianBackground.settings.renderWidth),
                posY : Math.round(Math.random() * gaussianBackground.settings.renderHeight),
                // Give is a random velocity to make the animation a bit more interesting
                velX : Math.round(Math.random()) ? Math.random() * maxVelocity : -(Math.random() * maxVelocity), 
                velY : Math.round(Math.random()) ? Math.random() * maxVelocity : -(Math.random() * maxVelocity)
            };
        }

        return layer;
    },

    updateLayerColor : function(index, color)
    {
        gaussianBackground.layers[index].color = color;
    },

    displayLoop : function()
    {
        // Keep going if the user wants animation
        if (gaussianBackground.settings.animation)
            gaussianBackground.animationFrame = requestAnimationFrame(gaussianBackground.displayLoop);

        var currentTime = Date.now();
        var delta = currentTime - gaussianBackground.lastCalledTime;

        // Ignore timesteping code if there is no animation
        if (delta > gaussianBackground.timestep || !gaussianBackground.settings.animation)
        {
            gaussianBackground.lastCalledTime = currentTime - (delta % gaussianBackground.timestep);
            gaussianBackground.timeElapsed = gaussianBackground.lastCalledTime - gaussianBackground.firstCalledTime;
            gaussianBackground.deltaTimer += delta;

            // Calculate the FPS
            gaussianBackground.fpsTotal++;
            gaussianBackground.fpsAverage = gaussianBackground.fpsTotal / (gaussianBackground.timeElapsed / 1000);
            
            // Draw the main image
            gaussianBackground.drawBackground();

            // Blur the canvas
            if (gaussianBackground.settings.blur)
                gaussianBackground.drawBlur();
            
            // Display debug info
            if (gaussianBackground.settings.debug && gaussianBackground.deltaTimer > 1000 || !gaussianBackground.settings.animation)
                gaussianBackground.debug();

            // A one second timer
            if (gaussianBackground.deltaTimer > 1000)
                gaussianBackground.deltaTimer = 0;
        }
    },

    drawBackground : function()
    {
        var renderWidth = gaussianBackground.settings.renderWidth;
        var renderHeight = gaussianBackground.settings.renderHeight;

        for (var i = Object.keys(gaussianBackground.layers).length - 1; i >= 0; i--)
        {
            var canvas = gaussianBackground.layers[i].canvas;
            var context = gaussianBackground.layers[i].context;
            var animation = gaussianBackground.layers[i].animation;

            // Draw background
            context.fillStyle = gaussianBackground.layers[i].color;
            context.fillRect(0, 0, renderWidth, renderHeight);

            // Draw animated layer elements
            for (var x = Object.keys(animation).length - 1; x >= 0; x--)
            {
                // Animate the movement
                animation[x].posX += animation[x].velX;
                animation[x].posY += animation[x].velY;

                // If the animation is leaving the viweport reverse it
                if (animation[x].posX >= renderWidth || animation[x].posX <= 0)
                    animation[x].velX = -animation[x].velX;
                if (animation[x].posY >= renderHeight || animation[x].posY <= 0)
                    animation[x].velY = -animation[x].velY;

                context.save();
                context.globalCompositeOperation = 'destination-out';
                context.beginPath();
                context.arc(animation[x].posX, animation[x].posY, animation[x].radius, 0, 2 * Math.PI, false);
                context.fill();
                context.restore();
            }

            // Draw the virtual canvas layer onto the main canvas
            gaussianBackground.context.drawImage(canvas, 0, 0);
        }
    },

    drawBlur : function()
    {
        var canvasID = gaussianBackground.settings.canvasID;
        var renderWidth = gaussianBackground.settings.renderWidth;
        var renderHeight = gaussianBackground.settings.renderHeight;
        var blurRadius = gaussianBackground.settings.blurRadius;
        var blurIterations = gaussianBackground.settings.blurIterations;

        switch (gaussianBackground.settings.blurMethod)
        {
            case 'stackblur':
                stackBlurCanvasRGB(canvasID, 0, 0, renderWidth, renderHeight, blurRadius);
                break;

            case 'fastblur':
                boxBlurCanvasRGB(canvasID, 0, 0, renderWidth, renderHeight, blurRadius, blurIterations);
                break;

            case 'integralblur':
                integralBlurCanvasRGB(canvasID, 0, 0, renderWidth, renderHeight, blurRadius, blurIterations);
                break;

            case 'stackboxblur':
                stackBoxBlurCanvasRGB(canvasID, 0, 0, renderWidth, renderHeight, blurRadius, blurIterations);
                break;
        }
    },

    debug : function()
    {
        if (!document.getElementById('fpsTotal'))
        {                   
            var fpsTotal = document.createElement('div');
            fpsTotal.id = 'fpsTotal';
            fpsTotal.style.position = 'fixed';
            fpsTotal.style.bottom = '10px';
            fpsTotal.style.left = '10px';
            fpsTotal.style.color = '#00ff00';
            fpsTotal.style.fontFamily = 'sans-serif';
            fpsTotal.innerHTML = gaussianBackground.generateDebugDisplay();

            document.getElementsByTagName('body')[0].appendChild(fpsTotal);
        }

        document.getElementById('fpsTotal').innerHTML = gaussianBackground.generateDebugDisplay();
    },

    generateDebugDisplay : function()
    {
        return (gaussianBackground.settings.animation ? 'Average FPS: ' + Math.round(gaussianBackground.fpsAverage) : '') + 
               '<br />Render Width: ' + gaussianBackground.settings.renderWidth + 'px' +
               '<br />Render Height: ' + gaussianBackground.settings.renderHeight + 'px' + 
               '<br />Layers: ' + Object.keys(gaussianBackground.settings.layers).length + 
               '<br />Animation: ' + (gaussianBackground.settings.animation ? 'Yes' : 'No') + 
               (gaussianBackground.settings.blur ? '<br />Blur Algorithm: ' + gaussianBackground.settings.blurMethod : '') +
               (gaussianBackground.settings.blur ? '<br />Blur Radius: ' + gaussianBackground.settings.blurRadius : '') +
               (gaussianBackground.settings.blur ? '<br />Blur Iterations: ' + gaussianBackground.settings.blurIterations : '');
    }
};