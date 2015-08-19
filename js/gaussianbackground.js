/** 
 * Gaussian Background Generator 
 * 
 * @version    0.4.1
 * @author     Aiden Foxx
 * @license    MIT License 
 * @copyright  2015 Aiden Foxx
 * @link       http://github.com/aidenfoxx
 * @twitter    @furiousfoxx
 */ 

'use strict';

/**
 * RAF SHIV
 */
(function() {
    var requestAnimationFrame = window.requestAnimationFrame || 
                                window.webkitRequestAnimationFrame ||
                                window.mozRequestAnimationFrame;                                
    var cancelAnimationFrame  = window.cancelAnimationFrame || 
                                window.webkitCancelAnimationFrame ||
                                window.webkitCancelRequestAnimationFrame ||
                                window.mozCancelAnimationFrame;

    // Fallback if RAF is not supported
    if (!requestAnimationFrame || !cancelAnimationFrame)
    {
        requestAnimationFrame = function(callback) { return window.setTimeout(function() { callback(); }, 1); }
        cancelAnimationFrame = function(id) { window.clearTimeout(id); }
    }

    window.requestAnimationFrame = requestAnimationFrame;
    window.cancelAnimationFrame = cancelAnimationFrame;
})();

/**
 * CONSTRUCTOR
 */
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
    this.layersBackup = {};

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

    window.cancelAnimationFrame(this.animationFrame);
    this.animationFrame = window.requestAnimationFrame(this.displayLoop.bind(this));
}

/**
 * PUBLIC METHODS
 */
GaussianBackground.prototype.generateLayer = function(orbs, radius, maxVelocity, color, columns, rows)
{
    var canvas = document.createElement('canvas');

    canvas.width = this.options.renderWidth;
    canvas.height = this.options.renderHeight;

    var layer = {
        orbs : {},
        color : color,
        context : canvas.getContext('2d')
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

        // Orb position tracking
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
            radius : radius,
            posX : (Math.random() * maxX) + minX,
            posY : (Math.random() * maxY) + minY,
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
       this.animationFrame = window.requestAnimationFrame(this.displayLoop.bind(this));
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

GaussianBackground.prototype.debug = function()
{
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
    this.debugLayerBoundaries();

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
        var layerColorHash = parseInt(Object.keys(layerOrbs).length + '' + (i + 1)) / 100;

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
    {
        this.layers[i] = this.generateLayer(layers[i].orbs, layers[i].radius, layers[i].maxVelocity, layers[i].color, layers[i].columns, layers[i].rows)
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