var arena = null;
var context;
var pixelWidth = 800;
var pixelHeight = 600;
var borderStyle = "thick solid";
var player = {x:30,y:30,angle:0};
var tank = {width:40,height:20};
var constants = {LEFT:37,UP:38,RIGHT:39,DOWN:40,DEGRAD:(Math.PI/180)};
var speed = 2;
var angularSpeed = 2;
var playerTank;
var fwd = false;
var lft = false;
var bck = false;
var rgt = false;

var horGrid;
var verGrid;
paper.install(window);


function getRandomBool()
{
	return Math.random() >= 0.55;
}


function press(e)
{
	switch(e.keyCode)
	{
		case constants.UP:
		if(!bck)
			fwd = true;
		break;
		case constants.DOWN:
		if(!fwd)
			bck = true;
		break;
		case constants.RIGHT:
		if(!lft)
			rgt = true;
		break;
		case constants.LEFT:
		if(!rgt)
			lft = true;
		break;
	}
}

function release(e)
{
	switch(e.keyCode)
	{
		case constants.UP:
		fwd = false;
		break;
		case constants.DOWN:
		bck = false;
		break;
		case constants.RIGHT:
		rgt = false;
		break;
		case constants.LEFT:
		lft = false;
		break;
	}
}

function draw()
{
	if(fwd)
	{
		player.x+=speed*Math.cos(player.angle*constants.DEGRAD);
		player.y+=speed*Math.sin(player.angle*constants.DEGRAD);
	}
	else if(bck)
	{
		player.x-=speed*Math.cos(player.angle*constants.DEGRAD);
		player.y-=speed*Math.sin(player.angle*constants.DEGRAD);
	}
	if(rgt)
	{
		player.angle+=angularSpeed;
		playerTank.rotate(angularSpeed);
	}
	else if(lft)
	{
		player.angle-=angularSpeed;
		playerTank.rotate(-angularSpeed);
	}
	playerTank.position = new Point(player.x,player.y);
}




function myGridLines(num_rectangles_wide, num_rectangles_tall, boundingRect ) {

    var width_per_rectangle = boundingRect.width / num_rectangles_wide;
    var height_per_rectangle = boundingRect.height / num_rectangles_tall;


    for(var i = 0 ;i!=0 && i!=num_rectangles_tall -1 && i < num_rectangles_tall ; i++)
    {
    	for(var j = 0 ;j!=0 && j!=num_rectangles_wide -1j < num_rectangles_wide ; j++)
    	{
    	
    		if(horGrid[i][j] == true) // draw a horizontal line from jth to j+1th column of the ith row.
    		{
    	
     			var yPos = boundingRect.top + i * height_per_rectangle;
    			var leftPoint = new paper.Point(boundingRect.left + j*width_per_rectangle, yPos);
    			var rightPoint = new paper.Point(boundingRect.left + (j+1)*width_per_rectangle, yPos);
    			var aLine = new paper.Path.Line(leftPoint, rightPoint);
    			aLine.strokeColor = 'black';
        		aLine.strokeWidth = 10;
        		aLine.smooth();


    		}
    		if(verGrid[i][j] == true) // draw a vertical line from ith to i+1th row of the jth column.
    		{
    	
    			var xPos = boundingRect.left + j* width_per_rectangle;
      			var topPoint = new paper.Point(xPos, boundingRect.top + i*height_per_rectangle);
        		var bottomPoint = new paper.Point(xPos, boundingRect.top + (i+1)*height_per_rectangle);
        		var aLine = new paper.Path.Line(topPoint, bottomPoint);
        		aLine.strokeColor = 'black';
        		aLine.strokeWidth = 10;
        		aLine.smooth();


    		}

    	}
    }

}


function createRandomGrids()
{
	horGrid = new Array(8);
	verGrid = new Array(8);

	for (var i = 0; i < horGrid.length; i++) { 
			horGrid[i] = new Array(8);
			verGrid[i] = new Array(8);
		};		


	for(var i = 0 ; i < horGrid.length; i++)
	{
		for(var j= 0 ; j < horGrid.length ; j++)
		{
			horGrid[i][j] = getRandomBool();
			verGrid[i][j] = getRandomBool();
		}
	};

}



function newGame()
{
	
	createRandomBoolGrids();
	
	myGridLines(8 , 8 , paper.view.bounds);
	
	playerTank = new Path.Rectangle([player.x-(tank.width/2) + 1, player.y-(tank.height/2)], [tank.width, tank.height]);
	playerTank.strokeColor = 'black';
    playerTank.fillColor = 'red';

	document.addEventListener("keydown", press);
	document.addEventListener("keyup", release);
	view.onFrame = draw;

}

window.onload = function initGame()
{
	if(!arena)
	{
		arena = document.getElementById('arena');
	}
	paper.setup(arena);
	context = arena.getContext("2d");
	arena.width = pixelWidth;
	arena.height = pixelHeight;
	arena.style.border = borderStyle;
	newGame();
}