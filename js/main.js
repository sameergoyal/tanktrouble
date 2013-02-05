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

paper.install(window);

//var array2d = new Boolean [,];



function getRandomBool()
{
	return Math.random() >= 0.5;
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


function drawGridLines(num_rectangles_wide, num_rectangles_tall, boundingRect ) {
    var width_per_rectangle = boundingRect.width / num_rectangles_wide;
    var height_per_rectangle = boundingRect.height / num_rectangles_tall;
    for (var i = 0; i <= num_rectangles_wide; i++) {
        var xPos = boundingRect.left + i * width_per_rectangle;
        var topPoint = new paper.Point(xPos, boundingRect.top);
        var bottomPoint = new paper.Point(xPos, boundingRect.bottom);
        var aLine = new paper.Path.Line(topPoint, bottomPoint);
        aLine.strokeColor = 'black';
    }
    for (var i = 0; i <= num_rectangles_tall; i++) {
        var yPos = boundingRect.top + i * height_per_rectangle;
        var leftPoint = new paper.Point(boundingRect.left, yPos);
        var rightPoint = new paper.Point(boundingRect.right, yPos);
        var aLine = new paper.Path.Line(leftPoint, rightPoint);
        aLine.strokeColor = 'black';
    }
}

var drawGridRects = function(num_rectangles_wide, num_rectangles_tall, boundingRect) {
    var width_per_rectangle = boundingRect.width / num_rectangles_wide;
    var height_per_rectangle = boundingRect.height / num_rectangles_tall;
    for (var i = 0; i < num_rectangles_wide; i++) {
        for (var j = 0; j < num_rectangles_tall; j++) {
            var aRect = new paper.Path.Rectangle(boundingRect.left + i * width_per_rectangle, boundingRect.top + j * height_per_rectangle, width_per_rectangle, height_per_rectangle);
            aRect.strokeColor = 'white';
            aRect.fillColor = 'black';
        }
    }
}

function newGame()
{
	//TODO generate a grid & initial position of for now only 1 player.

	//drawGridRects(8 , 8 , paper.view.bounds);
	playerTank = new Path.Rectangle([player.x-(tank.width/2) + 1, player.y-(tank.height/2)], [tank.width, tank.height]);

	playerTank = new Path.Rectangle([player.x-(tank.width/2), player.y-(tank.height/2)], [tank.width, tank.height]);

    playerTank.strokeColor = 'black';
    playerTank.fillColor = 'red';
	document.addEventListener("keydown", press);
	document.addEventListener("keyup", release);
	view.onFrame = draw;

	var horGrid = new Array(8);
	var verGrid = new Array(8);
	for (var i = horGrid.length - 1; i >= 0; i--) { 
			horGrid[i] = new Array(8);
			verGrid[i] = new Array(8);
		};		

	// fill with random values;
	
	for(var i = 0 ; i < horGrid.length ; i++)
	{
		for(var j= 0 ; j < horGrid.length ; j++)
		{
			horGrid[i][j] = getRandomBool();
			verGrid[i][j] = getRandomBool();
		}
	}



	drawGridLines(7, 7, paper.view.bounds);

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