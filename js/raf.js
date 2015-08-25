/** 
 * RequestAnimationFrame Shiv
 * 
 * @version    1.0
 * @author     Aiden Foxx
 * @license    MIT License 
 * @copyright  2015 Aiden Foxx
 * @link       http://github.com/aidenfoxx
 * @twitter    @furiousfoxx
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