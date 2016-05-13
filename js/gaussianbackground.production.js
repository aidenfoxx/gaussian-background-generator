/** 
 * Gaussian Background Generator 
 * 
 * @version    0.5.1
 * @author     Aiden Foxx
 * @license    MIT License 
 * @copyright  2015 Aiden Foxx
 * @link       http://github.com/aidenfoxx
 * @twitter    @furiousfoxx
 */ 

'use strict';

/**
 * @constructor
 */
function GaussianBackground(element, layers, options)
{
    if (!(this instanceof GaussianBackground))
        return new GaussianBackground(element, layers, options);

    this.context = null;

    this.animationFrame = null;
    this.timestep = 0;
    this.lastCallTime = Date.now();

    this.layers = {};
    this.layersBackup = {};

    this.options = {
        blur: true,
        blurRadius: 50,
        blurMethod: 'stackblur',
        blurIterations: 1,
        animation: true,
        fpsCap: 20,
        renderWidth: 320,
        renderHeight: 130
    };

    if (!(this.context = element.getContext('2d')))
    {
        console.log('ERROR: Could not load canvas');
        return false;
    }

    this.updateOptions(options);
    this.updateLayers(layers);

    this.context.canvas.width = this.options.renderWidth;
    this.context.canvas.height = this.options.renderHeight;

    this.animationFrame = window.requestAnimationFrame(this.displayLoop.bind(this));
}

GaussianBackground.prototype.generateLayer = function(orbs, radius, maxVelocity, color, columns, rows)
{
    var canvas = document.createElement('canvas');

    canvas.width = this.options.renderWidth;
    canvas.height = this.options.renderHeight;

    var layer = {
        orbs: {},
        color: color,
        context: canvas.getContext('2d')
    };

    var columnCount = columns || 0;
    var rowCount = rows || 0;
    var columnIndex = 0;
    var rowIndex = 0;

    for (var i = 0; i < orbs; i++)
    {
        // Default boundaries
        var minX = 0;
        var maxX = this.options.renderWidth;
        var minY = 0;
        var maxY = this.options.renderHeight;

        // Custom boundaries
        if (columnCount)
        {
            minX = (this.options.renderWidth / columnCount) * columnIndex;
            maxX = (this.options.renderWidth / columnCount) * (columnIndex + 1);

            columnIndex++;
        }
        if (rowCount)
        {
            minY = (this.options.renderHeight / rowCount) * rowIndex;
            maxY = (this.options.renderHeight / rowCount) * (rowIndex + 1);
        }

        // Custom boundary tracking
        if (columnIndex === columnCount)
        {
            columnIndex = 0;
            rowIndex++;
        }
        if (rowIndex === rowCount)
        {
            rowIndex = 0;
        }

        layer.orbs[i] = {
            radius: radius,
            posX: (Math.random() * maxX) + minX,
            posY:  (Math.random() * maxY) + minY,
            // Give is a random velocity to make the animation a bit more interesting
            velX: Math.round(Math.random()) ? Math.random() * maxVelocity : -(Math.random() * maxVelocity), 
            velY: Math.round(Math.random()) ? Math.random() * maxVelocity : -(Math.random() * maxVelocity),
            // Custom boundaries can be used to create more consistent backgrounds
            minX: minX,
            maxX: maxX,
            minY: minY,
            maxY: maxY
        };
    }
    return layer;
}

GaussianBackground.prototype.displayLoop = function()
{
    // Keep going if the user wants animation
    if (this.options.animation)
       this.animationFrame = window.requestAnimationFrame(this.displayLoop.bind(this));

    var currentTime = Date.now();
    var delta = currentTime - this.lastCallTime;

    // Ignore timesteping code if there is no animation
    if (delta > this.timestep || !this.options.animation)
    {
        this.lastCallTime = currentTime - (delta % this.timestep);

        this.drawBackground();

        if (this.options.blur)
            this.drawBlur();
    }
}

GaussianBackground.prototype.drawBackground = function()
{
    for (var i = Object.keys(this.layers).length - 1; i >= 0; i--)
    {
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

            // Collision detection and correction
            if (layerOrbs[x].posX >= layerOrbs[x].maxX)
            {
                layerOrbs[x].posX = layerOrbs[x].maxX;
                layerOrbs[x].velX = -layerOrbs[x].velX;
            }
            else if (layerOrbs[x].posX <= layerOrbs[x].minX)
            {
                layerOrbs[x].posX = layerOrbs[x].minX;
                layerOrbs[x].velX = -layerOrbs[x].velX;
            }
            
            if (layerOrbs[x].posY >= layerOrbs[x].maxY)
            {
                layerOrbs[x].posY = layerOrbs[x].maxY;
                layerOrbs[x].velY = -layerOrbs[x].velY;
            }
            else if (layerOrbs[x].posY <= layerOrbs[x].minY)
            {
                layerOrbs[x].posY = layerOrbs[x].minY;
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
        this.context.drawImage(layerContext.canvas, 0, 0);
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

GaussianBackground.prototype.refreshLayers = function()
{
    this.updateLayers(this.layersBackup);
}

GaussianBackground.prototype.updateLayers = function(layers)
{
    // Empty previous layers
    this.layers = { };
    this.layersBackup = JSON.parse(JSON.stringify(layers));

    for (var i = Object.keys(layers).length - 1; i >= 0; i--)
        this.layers[i] = this.generateLayer(layers[i].orbs, layers[i].radius, layers[i].maxVelocity, layers[i].color, layers[i].columns, layers[i].rows)
}

GaussianBackground.prototype.updateOptions = function(options)
{
    for (var key in options)
        this.options[key] = options[key];

    // Update rendering options
    this.timestep = 1000.00 / parseFloat(this.options.fpsCap);

    this.context.canvas.width = this.options.renderWidth;
    this.context.canvas.height = this.options.renderHeight;

    this.refreshLayers();

    // May need a restart if animation was changed
    this.play();
}

GaussianBackground.prototype.pause = function()
{
    window.cancelAnimationFrame(this.animationFrame);
}

GaussianBackground.prototype.play = function()
{
    window.cancelAnimationFrame(this.animationFrame);
    this.animationFrame = window.requestAnimationFrame(this.displayLoop.bind(this));
}