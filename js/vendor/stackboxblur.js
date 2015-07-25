/*

StackBoxBlur - a fast almost Box Blur For Canvas

Version:    0.3
Author:     Mario Klingemann
Contact:    mario@quasimondo.com
Website:    http://www.quasimondo.com/
Twitter:    @quasimondo

In case you find this class useful - especially in commercial projects -
I am not totally unhappy for a small donation to my PayPal account
mario@quasimondo.de

Copyright (c) 2010 Mario Klingemann

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.
*/
/*
var mul_table = [ 1,57,41,21,203,34,97,73,227,91,149,62,105,45,39,137,241,107,3,173,39,71,65,238,219,101,187,87,81,151,141,133,249,117,221,209,197,187,177,169,5,153,73,139,133,127,243,233,223,107,103,99,191,23,177,171,165,159,77,149,9,139,135,131,253,245,119,231,224,109,211,103,25,195,189,23,45,175,171,83,81,79,155,151,147,9,141,137,67,131,129,251,123,30,235,115,113,221,217,53,13,51,50,49,193,189,185,91,179,175,43,169,83,163,5,79,155,19,75,147,145,143,35,69,17,67,33,65,255,251,247,243,239,59,29,229,113,111,219,27,213,105,207,51,201,199,49,193,191,47,93,183,181,179,11,87,43,85,167,165,163,161,159,157,155,77,19,75,37,73,145,143,141,35,138,137,135,67,33,131,129,255,63,250,247,61,121,239,237,117,29,229,227,225,111,55,109,216,213,211,209,207,205,203,201,199,197,195,193,48,190,47,93,185,183,181,179,178,176,175,173,171,85,21,167,165,41,163,161,5,79,157,78,154,153,19,75,149,74,147,73,144,143,71,141,140,139,137,17,135,134,133,66,131,65,129,1];
        
   
var shg_table = [0,9,10,10,14,12,14,14,16,15,16,15,16,15,15,17,18,17,12,18,16,17,17,19,19,18,19,18,18,19,19,19,20,19,20,20,20,20,20,20,15,20,19,20,20,20,21,21,21,20,20,20,21,18,21,21,21,21,20,21,17,21,21,21,22,22,21,22,22,21,22,21,19,22,22,19,20,22,22,21,21,21,22,22,22,18,22,22,21,22,22,23,22,20,23,22,22,23,23,21,19,21,21,21,23,23,23,22,23,23,21,23,22,23,18,22,23,20,22,23,23,23,21,22,20,22,21,22,24,24,24,24,24,22,21,24,23,23,24,21,24,23,24,22,24,24,22,24,24,22,23,24,24,24,20,23,22,23,24,24,24,24,24,24,24,23,21,23,22,23,24,24,24,22,24,24,24,23,22,24,24,25,23,25,25,23,24,25,25,24,22,25,25,25,24,23,24,25,25,25,25,25,25,25,25,25,25,25,25,23,25,23,24,25,25,25,25,25,25,25,25,25,24,22,25,25,23,25,25,20,24,25,24,25,25,22,24,25,24,25,24,25,25,24,25,25,25,25,22,25,25,25,24,25,24,25,18];
*/

var mul_table = [ 1,171,205,293,57,373,79,137,241,27,391,357,41,19,283,265,497,469,443,421,25,191,365,349,335,161,155,149,9,278,269,261,505,245,475,231,449,437,213,415,405,395,193,377,369,361,353,345,169,331,325,319,313,307,301,37,145,285,281,69,271,267,263,259,509,501,493,243,479,118,465,459,113,446,55,435,429,423,209,413,51,403,199,393,97,3,379,375,371,367,363,359,355,351,347,43,85,337,333,165,327,323,5,317,157,311,77,305,303,75,297,294,73,289,287,71,141,279,277,275,68,135,67,133,33,262,260,129,511,507,503,499,495,491,61,121,481,477,237,235,467,232,115,457,227,451,7,445,221,439,218,433,215,427,425,211,419,417,207,411,409,203,202,401,399,396,197,49,389,387,385,383,95,189,47,187,93,185,23,183,91,181,45,179,89,177,11,175,87,173,345,343,341,339,337,21,167,83,331,329,327,163,81,323,321,319,159,79,315,313,39,155,309,307,153,305,303,151,75,299,149,37,295,147,73,291,145,289,287,143,285,71,141,281,35,279,139,69,275,137,273,17,271,135,269,267,133,265,33,263,131,261,130,259,129,257,1];
        
   
var shg_table = [0,9,10,11,9,12,10,11,12,9,13,13,10,9,13,13,14,14,14,14,10,13,14,14,14,13,13,13,9,14,14,14,15,14,15,14,15,15,14,15,15,15,14,15,15,15,15,15,14,15,15,15,15,15,15,12,14,15,15,13,15,15,15,15,16,16,16,15,16,14,16,16,14,16,13,16,16,16,15,16,13,16,15,16,14,9,16,16,16,16,16,16,16,16,16,13,14,16,16,15,16,16,10,16,15,16,14,16,16,14,16,16,14,16,16,14,15,16,16,16,14,15,14,15,13,16,16,15,17,17,17,17,17,17,14,15,17,17,16,16,17,16,15,17,16,17,11,17,16,17,16,17,16,17,17,16,17,17,16,17,17,16,16,17,17,17,16,14,17,17,17,17,15,16,14,16,15,16,13,16,15,16,14,16,15,16,12,16,15,16,17,17,17,17,17,13,16,15,17,17,17,16,15,17,17,17,16,15,17,17,14,16,17,17,16,17,17,16,15,17,16,14,17,16,15,17,16,17,17,16,17,15,16,17,14,17,16,15,17,16,17,13,17,16,17,17,16,17,14,17,16,17,16,17,16,17,9
];

function stackBoxBlurImage( imageID, canvasID, radius, blurAlphaChannel, iterations )
{
            
    var img = document.getElementById( imageID );
    var w = img.naturalWidth;
    var h = img.naturalHeight;
       
    var canvas = document.getElementById( canvasID );
      
    canvas.style.width  = w + "px";
    canvas.style.height = h + "px";
    canvas.width = w;
    canvas.height = h;
    
    var context = canvas.getContext("2d");
    context.clearRect( 0, 0, w, h );
    context.drawImage( img, 0, 0 );

    if ( isNaN(radius) || radius < 1 ) return;
    
    if ( blurAlphaChannel )
        stackBoxBlurCanvasRGBA( canvasID, 0, 0, w, h, radius, iterations );
    else 
        stackBoxBlurCanvasRGB( canvasID, 0, 0, w, h, radius, iterations );
}


function stackBoxBlurCanvasRGBA( id, top_x, top_y, width, height, radius, iterations )
{
    if ( isNaN(radius) || radius < 1 ) return;
    radius |= 0;
    
    if ( isNaN(iterations) ) iterations = 1;
    iterations |= 0;
    if ( iterations > 3 ) iterations = 3;
    if ( iterations < 1 ) iterations = 1;
    
    var canvas  = document.getElementById( id );
    var context = canvas.getContext("2d");
    var imageData;
    
    try {
      try {
        imageData = context.getImageData( top_x, top_y, width, height );
      } catch(e) {
      
        // NOTE: this part is supposedly only needed if you want to work with local files
        // so it might be okay to remove the whole try/catch block and just use
        // imageData = context.getImageData( top_x, top_y, width, height );
        try {
            netscape.security.PrivilegeManager.enablePrivilege("UniversalBrowserRead");
            imageData = context.getImageData( top_x, top_y, width, height );
        } catch(e) {
            alert("Cannot access local image");
            throw new Error("unable to access local image data: " + e);
            return;
        }
      }
    } catch(e) {
      alert("Cannot access image");
      throw new Error("unable to access image data: " + e);
    }
            
    var pixels = imageData.data;
            
    var x, y, i, p, yp, yi, yw, r_sum, g_sum, b_sum, a_sum, 
    r_out_sum, g_out_sum, b_out_sum, a_out_sum,
    r_in_sum, g_in_sum, b_in_sum, a_in_sum, 
    pr, pg, pb, pa, rbs;
            
    var div = radius + radius + 1;
    var w4 = width << 2;
    var widthMinus1  = width - 1;
    var heightMinus1 = height - 1;
    var radiusPlus1  = radius + 1;
    
    var stackStart = new BlurStack();
    
    var stack = stackStart;
    for ( i = 1; i < div; i++ )
    {
        stack = stack.next = new BlurStack();
        if ( i == radiusPlus1 ) var stackEnd = stack;
    }
    stack.next = stackStart;
    var stackIn = null;
    
    
    
    var mul_sum = mul_table[radius];
    var shg_sum = shg_table[radius];
    while ( iterations-- > 0 ) {
        yw = yi = 0;
        for ( y = height; --y > -1; )
        {
            r_sum = radiusPlus1 * ( pr = pixels[yi] );
            g_sum = radiusPlus1 * ( pg = pixels[yi+1] );
            b_sum = radiusPlus1 * ( pb = pixels[yi+2] );
            a_sum = radiusPlus1 * ( pa = pixels[yi+3] );
            
            stack = stackStart;
            
            for( i = radiusPlus1; --i > -1; )
            {
                stack.r = pr;
                stack.g = pg;
                stack.b = pb;
                stack.a = pa;
                stack = stack.next;
            }
            
            for( i = 1; i < radiusPlus1; i++ )
            {
                p = yi + (( widthMinus1 < i ? widthMinus1 : i ) << 2 );
                r_sum += ( stack.r = pixels[p]);
                g_sum += ( stack.g = pixels[p+1]);
                b_sum += ( stack.b = pixels[p+2]);
                a_sum += ( stack.a = pixels[p+3]);
                
                stack = stack.next;
            }
            
            stackIn = stackStart;
            for ( x = 0; x < width; x++ )
            {
                pixels[yi++] = (r_sum * mul_sum) >>> shg_sum;
                pixels[yi++] = (g_sum * mul_sum) >>> shg_sum;
                pixels[yi++] = (b_sum * mul_sum) >>> shg_sum;
                pixels[yi++] = (a_sum * mul_sum) >>> shg_sum;
                
                p =  ( yw + ( ( p = x + radius + 1 ) < widthMinus1 ? p : widthMinus1 ) ) << 2;
                
                r_sum -= stackIn.r - ( stackIn.r = pixels[p]);
                g_sum -= stackIn.g - ( stackIn.g = pixels[p+1]);
                b_sum -= stackIn.b - ( stackIn.b = pixels[p+2]);
                a_sum -= stackIn.a - ( stackIn.a = pixels[p+3]);
                
                stackIn = stackIn.next;
                
            }
            yw += width;
        }

        
        for ( x = 0; x < width; x++ )
        {
            yi = x << 2;
            
            r_sum = radiusPlus1 * ( pr = pixels[yi]);
            g_sum = radiusPlus1 * ( pg = pixels[yi+1]);
            b_sum = radiusPlus1 * ( pb = pixels[yi+2]);
            a_sum = radiusPlus1 * ( pa = pixels[yi+3]);
            
            stack = stackStart;
            
            for( i = 0; i < radiusPlus1; i++ )
            {
                stack.r = pr;
                stack.g = pg;
                stack.b = pb;
                stack.a = pa;
                stack = stack.next;
            }
            
            yp = width;
            
            for( i = 1; i <= radius; i++ )
            {
                yi = ( yp + x ) << 2;
                
                r_sum += ( stack.r = pixels[yi]);
                g_sum += ( stack.g = pixels[yi+1]);
                b_sum += ( stack.b = pixels[yi+2]);
                a_sum += ( stack.a = pixels[yi+3]);
               
                stack = stack.next;
            
                if( i < heightMinus1 )
                {
                    yp += width;
                }
            }
            
            yi = x;
            stackIn = stackStart;
            for ( y = 0; y < height; y++ )
            {
                p = yi << 2;
                pixels[p+3] = pa =(a_sum * mul_sum) >>> shg_sum;
                if ( pa > 0 )
                {
                    pa = 255 / pa;
                    pixels[p]   = ((r_sum * mul_sum) >>> shg_sum ) * pa; 
                    pixels[p+1] = ((g_sum * mul_sum) >>> shg_sum ) * pa;
                    pixels[p+2] = ((b_sum * mul_sum) >>> shg_sum ) * pa;
                } else {
                    pixels[p] = pixels[p+1] = pixels[p+2] = 0
                }
                
                p = ( x + (( ( p = y + radiusPlus1) < heightMinus1 ? p : heightMinus1 ) * width )) << 2;
                
                r_sum -= stackIn.r - ( stackIn.r = pixels[p]);
                g_sum -= stackIn.g - ( stackIn.g = pixels[p+1]);
                b_sum -= stackIn.b - ( stackIn.b = pixels[p+2]);
                a_sum -= stackIn.a - ( stackIn.a = pixels[p+3]);
               
                stackIn = stackIn.next;
                
                yi += width;
            }
        }
    }
    context.putImageData( imageData, top_x, top_y );
    
}


function stackBoxBlurCanvasRGB( id, top_x, top_y, width, height, radius, iterations )
{
    if ( isNaN(radius) || radius < 1 ) return;
    radius |= 0;
    
    if ( isNaN(iterations) ) iterations = 1;
    iterations |= 0;
    if ( iterations > 3 ) iterations = 3;
    if ( iterations < 1 ) iterations = 1;
    
    var canvas  = document.getElementById( id );
    var context = canvas.getContext("2d");
    var imageData;
    
    try {
      try {
        imageData = context.getImageData( top_x, top_y, width, height );
      } catch(e) {
      
        // NOTE: this part is supposedly only needed if you want to work with local files
        // so it might be okay to remove the whole try/catch block and just use
        // imageData = context.getImageData( top_x, top_y, width, height );
        try {
            netscape.security.PrivilegeManager.enablePrivilege("UniversalBrowserRead");
            imageData = context.getImageData( top_x, top_y, width, height );
        } catch(e) {
            alert("Cannot access local image");
            throw new Error("unable to access local image data: " + e);
            return;
        }
      }
    } catch(e) {
      alert("Cannot access image");
      throw new Error("unable to access image data: " + e);
    }
            
    var pixels = imageData.data;
            
    var x, y, i, p, yp, yi, yw, r_sum, g_sum, b_sum,
    r_out_sum, g_out_sum, b_out_sum,
    r_in_sum, g_in_sum, b_in_sum,
    pr, pg, pb, rbs;
            
    var div = radius + radius + 1;
    var w4 = width << 2;
    var widthMinus1  = width - 1;
    var heightMinus1 = height - 1;
    var radiusPlus1  = radius + 1;
    
    var stackStart = new BlurStack();
    var stack = stackStart;
    for ( i = 1; i < div; i++ )
    {
        stack = stack.next = new BlurStack();
        if ( i == radiusPlus1 ) var stackEnd = stack;
    }
    stack.next = stackStart;
    var stackIn = null;
    
    
    
    var mul_sum = mul_table[radius];
    var shg_sum = shg_table[radius];
    
    while ( iterations-- > 0 ) {
        yw = yi = 0;
        
        for ( y = height; --y >-1; )
        {
            r_sum = radiusPlus1 * ( pr = pixels[yi] );
            g_sum = radiusPlus1 * ( pg = pixels[yi+1] );
            b_sum = radiusPlus1 * ( pb = pixels[yi+2] );
            
            stack = stackStart;
            
            for( i = radiusPlus1; --i > -1; )
            {
                stack.r = pr;
                stack.g = pg;
                stack.b = pb;
                stack = stack.next;
            }
            
            for( i = 1; i < radiusPlus1; i++ )
            {
                p = yi + (( widthMinus1 < i ? widthMinus1 : i ) << 2 );
                r_sum += ( stack.r = pixels[p++]);
                g_sum += ( stack.g = pixels[p++]);
                b_sum += ( stack.b = pixels[p]);
                
                stack = stack.next;
            }
            
            stackIn = stackStart;
            for ( x = 0; x < width; x++ )
            {
                pixels[yi++] = (r_sum * mul_sum) >>> shg_sum;
                pixels[yi++] = (g_sum * mul_sum) >>> shg_sum;
                pixels[yi++] = (b_sum * mul_sum) >>> shg_sum;
                yi++;
                
                p =  ( yw + ( ( p = x + radius + 1 ) < widthMinus1 ? p : widthMinus1 ) ) << 2;
                
                r_sum -= stackIn.r - ( stackIn.r = pixels[p++]);
                g_sum -= stackIn.g - ( stackIn.g = pixels[p++]);
                b_sum -= stackIn.b - ( stackIn.b = pixels[p]);
                
                stackIn = stackIn.next;
            }
            yw += width;
        }

        
        for ( x = 0; x < width; x++ )
        {
            yi = x << 2;
            
            r_sum = radiusPlus1 * ( pr = pixels[yi++]);
            g_sum = radiusPlus1 * ( pg = pixels[yi++]);
            b_sum = radiusPlus1 * ( pb = pixels[yi]);
            
            stack = stackStart;
            
            for( i = 0; i < radiusPlus1; i++ )
            {
                stack.r = pr;
                stack.g = pg;
                stack.b = pb;
                stack = stack.next;
            }
            
            yp = width;
            
            for( i = 1; i <= radius; i++ )
            {
                yi = ( yp + x ) << 2;
                
                r_sum += ( stack.r = pixels[yi++]);
                g_sum += ( stack.g = pixels[yi++]);
                b_sum += ( stack.b = pixels[yi]);
                
                stack = stack.next;
            
                if ( i < heightMinus1 ) yp += width;
            }
            
            yi = x;
            stackIn = stackStart;
            for ( y = 0; y < height; y++ )
            {
                p = yi << 2;
                pixels[p]   = (r_sum * mul_sum) >>> shg_sum;
                pixels[p+1] = (g_sum * mul_sum) >>> shg_sum;
                pixels[p+2] = (b_sum * mul_sum) >>> shg_sum;
                
                p = ( x + (( ( p = y + radiusPlus1) < heightMinus1 ? p : heightMinus1 ) * width )) << 2;
                
                r_sum -= stackIn.r - ( stackIn.r = pixels[p]);
                g_sum -= stackIn.g - ( stackIn.g = pixels[p+1]);
                b_sum -= stackIn.b - ( stackIn.b = pixels[p+2]);
                
                stackIn = stackIn.next;
                
                yi += width;
            }
        }
    }
    context.putImageData( imageData, top_x, top_y );
    
}

function BlurStack()
{
    this.r = 0;
    this.g = 0;
    this.b = 0;
    this.a = 0;
    this.next = null;
}
