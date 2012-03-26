/* File Created: February 7, 2012 */

/*var x = 5; //Starting Location - left
var y = 5; //Starting Location - top
var dest_x = 300;  //Ending Location - left
var dest_y = 300;  //Ending Location - top
var interval = 10; //Move 10px every initialization

function moveImage() {
    //Keep on moving the image till the target is achieved
    if (x < dest_x) x = x + interval;
    if (y < dest_y) y = y + interval;

    //Move the image to the new location
    document.getElementById("ufo").style.top = y + 'px';
    document.getElementById("ufo").style.left = x + 'px';

    if ((x + interval < dest_x) && (y + interval < dest_y)) {
        //Keep on calling this function every 100 microsecond 
        //	till the target location is reached
        window.setTimeout('moveImage()', 100);
    }
}
*/
//high limit = 630 bottom limit = 570


var expanded = false;
var exptarget = 570;
var rettarget = 630;
function move() {
    if (!expanded) {
        exptarget = 570;
        expand();
        expanded = true;
		document.getElementById("infoButton").value = "Hide";
    }
    else {
        rettarget = 630;
        retract();
        expanded = false;
		document.getElementById("infoButton").value = "Info";
    }
    document.getElementById("btn").value = "infoo";    
}


function expand() {
    exptarget+=2;
    document.getElementById("info").style.top = exptarget + 'px';
    if (exptarget <= 630)        
        window.setTimeout('expand()', 5);
}

function retract() {
    rettarget-=2;
    document.getElementById("info").style.top = rettarget + 'px';
    if (rettarget >= 570)
        window.setTimeout('retract()', 5);
}