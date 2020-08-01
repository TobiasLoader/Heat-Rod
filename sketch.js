

//////////////////////////////////////////////////////////     TYPE INTEGERS 1,2,3,4,5,6,7,8,9,0

var play;

var rod;
var rodEx;
var cumTemp;
var creatingRod;
var TempEx;
var avgTemp;
var rodType;
var rodSampleD;

var heatChange = [];
var rodTypeOptions;

function setup() {
	W = window.innerWidth;
  	H = window.innerHeight;
  	canvas = createCanvas(W, H);
  
	textFont('AvenirNext-Ultralight');
	textAlign(CENTER,CENTER);
	angleMode(DEGREES);
	
	play = 0;
	
	rod = [];
	rodEx = [W/5,4*W/5];
	TempEx = [0,0]
	cumTemp = 0;
	creatingRod = false;
	rodTypeOptions = ['Bar','Loop','Fixed'];
	rodType = 'Loop'; // either Bar, or Loop, or Fixed
	rodSampleD = 5;
}

function activateCreateRod(){
	if (mouseX<rodEx[0] && mouseIsPressed && !rod.length){
		creatingRod = true;
	}
}

function createRod(){
	if (mouseIsPressed){
		if (mouseX>rodEx[0] && mouseX<rodEx[1]){
			if (!rod.length || mouseX>rod[rod.length-1][0]+rodSampleD){
				rod.push([mouseX,mouseY]);
				cumTemp += mouseY;
				if (TempEx[0]>mouseY || !rod.length){
					TempEx[0]=mouseY;
				} if (TempEx[1]<mouseY || !rod.length){
					TempEx[1]=mouseY;
				}
			}
		}
				
		if (mouseX>rodEx[1]){
			creatingRod = false;
		}
	}
}

function drawRod(){
	noFill();
// 	beginShape();
	avgTemp = cumTemp/rod.length;
	
	strokeWeight(2);
	if (rod.length){
		stroke(50,200);
		rect(rod[0][0],cumTemp/rod.length-3,rod[rod.length-1][0]-rod[0][0],6);
	}
	
	strokeWeight(4);
	for (var i=0; i<rod.length-1; i+=1){
		stroke(127 + 100*(rod[i][1]-avgTemp)/(TempEx[0]-avgTemp),0,127 + 100*(rod[i][1]-avgTemp)/(TempEx[1]-avgTemp));
		line(rod[i][0],rod[i][1],rod[i+1][0],rod[i+1][1]);
	}
// 	endShape();




}

function drawSideBars(){
	cursor('default');
	strokeWeight(1);
	if (!creatingRod && !play && rod.length){
		noStroke();
		
		textSize(27);
		fill(48, 75, 84);
		text('PAUSED',rodEx[0]/2,H/2);
		textSize(25);
		fill(48, 75, 84);
		text('PRESS\nSPACE',(W+rodEx[1])/2,H/2);
		
		fill(119, 196, 224,80);
		rect(0,0,rodEx[0],H);
		rect(rodEx[1],0,W-rodEx[1],H);
		
		stroke(80,200);
		line(rodEx[1],0,rodEx[1],H);
		line(rodEx[0],0,rodEx[0],H);
	}
	if (!rod.length || creatingRod){
				
		noStroke();
		fill(100,230,120,80);
		rect(0,0,rodEx[0],H);
		fill(200,100,100,40);
		rect(rodEx[1],0,W-rodEx[1],H);
		
		if (mouseX<rodEx[0]){
			noStroke();
			fill(100,220,130,60);
			rect(0,0,rodEx[0],H);
		}
		
		if (mouseX>rodEx[1]){
			noStroke();
			fill(200,100,100,20);
			rect(rodEx[1],0,W-rodEx[1],H);
		}
		
		noStroke();
		textSize(75);
		fill(50,110,65,50);
		push();
		translate(rodEx[0]/2,H/2);
		rotate(-90);
		text('S T    R T',0,0);
		pop();
		fill(50,110,65,200);
		textSize(35);
		text('START',rodEx[0]/2,H/2);
		fill(100,50,50,50);
		textSize(75);
		push();
		translate((W+rodEx[1])/2,H/2);
		rotate(-90);
		text(' E    D',0,0);
		pop();
		textSize(35);
		fill(100,50,50,200);
		text('END',(W+rodEx[1])/2,H/2);
		
		if (!rod.length){
			noStroke();
			fill(255);
			rect(rodEx[0],0,rodEx[1]-rodEx[0],3*H/10);
			fill(50,50,50);
			textSize(35);
			text('~ HEAT ROD ~',W/2,1*H/10);
			textSize(20);
			text('Define the heat map of a rod and watch it reach temperature equilibrium.',W/4,2*H/10,W/2);
			stroke(50,50,50,200);
			line(rodEx[0],3*H/10,rodEx[1],3*H/10);
			noStroke();
			textSize(25);
			fill(50,50,50,200);
			text('ROD TYPE',W/2,3.8*H/10);
			text('INSTRUCTIONS',W/2,6.5*H/10);
			fill(255);
			rectMode(CENTER);
			for (var i=0; i<rodTypeOptions.length; i+=1){
				if (rodType===rodTypeOptions[i]){
					stroke(100);
				} else {
					stroke(200);
				}
				rect(W/2+(i-1)*W/8,5.1*H/10,70,70);
				if (mouseX>W/2+(i-1)*W/8-35 && mouseX<W/2+(i-1)*W/8+35 && mouseY>5.1*H/10-35 && mouseY<5.1*H/10+35){
					cursor('pointer');
				}
			}
			rectMode(CORNER);
			textSize(20);
			stroke(100,100,100,100);
			fill(0);
			for (var i=0; i<rodTypeOptions.length; i+=1){
				text(rodTypeOptions[i],W/2+(i-1)*W/8,5.1*H/10+2);
			}
			textSize(12);
			text('•  Choose the ROD TYPE above, then hover over the START sidebar on the left hand side of the screen.\n\n•  Click and drag the mouse until reaching the END sidebar on the right hand side of the screen. As you drag to the other side, move the cursor up and down as this defines the heat map of the rod. The higher the cursor goes, the warmer that portion of the rod. The lower the cursor goes, the cooler that portion of the rod.\n\n•  Once you have reached the END sidebar, press the SPACE key to play the animation, and SPACE again if you wish to pause the animation.',W/4,7.2*H/10,W/2);
		}
	}
}

function rodFunctions(){
	if (creatingRod){ 
		createRod();
	} else {
		if (play && rod.length){
			heatTransfer();
		} else if (!play && !rod.length) {
			activateCreateRod();
		}
	}
	drawRod();
}

function heatTransfer(){
	avgTemp = cumTemp/rod.length;
	heatChange = [];
	switch (rodType){
		case 'Bar': heatChange.push(2*sqrt(rod.length)/50*(rod[1][1]-rod[0][1])); break;
		case 'Loop': heatChange.push(2*sqrt(rod.length)/50*(rod[1][1]-2*rod[0][1]+rod[rod.length-1][1])); break;
		case 'Fixed': heatChange.push(0); break;
	}
	for (var i=1; i<rod.length-1; i+=1){
		heatChange.push(sqrt(rod.length)/50*(rod[i+1][1]-2*rod[i][1]+rod[i-1][1]));
	}
	switch (rodType){
		case 'Bar': heatChange.push(2*sqrt(rod.length)/50*(rod[rod.length-2][1]-rod[rod.length-1][1])); break;
		case 'Loop': heatChange.push(2*sqrt(rod.length)/50*(rod[rod.length-2][1]-2*rod[rod.length-1][1]+rod[0][1])); break;
		case 'Fixed': heatChange.push(0); break;
	}
	
	stroke(50);
	strokeWeight(2);
	for (var i=0; i<heatChange.length; i+=1){
		point(rod[i][0],100*heatChange[i]+avgTemp);
	}
	for (var i=0; i<rod.length; i+=1){
			rod[i][1] += (heatChange[i]);
	}
// 	heatChange.push(0.1*(rod[rod.length-1][1]-rod[0][1]));
// 	for (var i=0; i<round(rod.length/2); i+=1){
/*
		if (rod[i][1]>avgTemp){
			rod[i][1] += heatChange[i];
		} else {
			rod[i][1] -= heatChange[i];
		}
*/
// 		rod[i][1] += heatChange[i];
// 	}
// 	for (var i=round(rod.length/2); i<rod.length; i+=1){
/*
		if (rod[i][1]>avgTemp){
			rod[i][1] += heatChange[i];
		} else {
			rod[i][1] -= heatChange[i];
		}
*/
		
}

function draw(){
	background(250);
	drawSideBars();
	rodFunctions();
}

window.onresize = function() {
  resizeCanvas(windowWidth, windowHeight);
  W = windowWidth;
  H = windowHeight
};

function mouseClicked(){
	if (!rod.length){
		for (var i=0; i<rodTypeOptions.length; i+=1){
			if (mouseX>W/2+(i-1)*W/8-35 && mouseX<W/2+(i-1)*W/8+35 && mouseY>5.1*H/10-35 && mouseY<5.1*H/10+35){
				rodType = rodTypeOptions[i];
			}
		}
	}
}

function applyKeyFunc(val){
	if (val){
		if (keyCode === 32){
			play = 1-play;
		}
	}
}

function keyPressed(){
    applyKeyFunc(true);
}
function keyReleased(){
    applyKeyFunc(false);
}

