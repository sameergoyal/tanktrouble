var arena = null;
var pixelWidth = 800;
var pixelHeight = 600;
var borderStyle = "thick solid";
var player = {width:40,height:20,angle:0};
var tank;
var constants = {LEFT:37,UP:38,RIGHT:39,DOWN:40,DEGRAD:(Math.PI/180)};
var speed = 2;
var angularSpeed = 2;
var playerTank;
var fwd = false;
var lft = false;
var bck = false;
var rgt = false;
var nfwd = false;
var nlft = false;
var nbck = false;
var nrgt = false;

var horGrid;
var verGrid;
var hLines;
var vLines;
var boundingRect;
var maxWidth=8;
var maxHeight=8;
var width_per_rectangle;
var height_per_rectangle;

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

function isOk () {
      if(tank.x <= 0 || tank.x >= boundingRect.width) return false;
      if(tank.y <= 0 || tank.y >= boundingRect.height ) return false;
      
      var j1 = Math.floor(tank.x / width_per_rectangle);
      var j2 = Math.ceil(tank.x / width_per_rectangle);

      var i1 =  Math.floor(tank.y / height_per_rectangle);
      var i2 = Math.ceil(tank.y / height_per_rectangle);
	  
      if(horGrid[i1][j1] && playerTank.bounds.intersects(hLines[i1][j1].bounds))
	  {  
	  		if(player.angle>180)
				nfwd = true;
			else
				nbck = true;
			if(player.angle<90 || (player.angle>180 && player.angle<270))
				nrgt = true;
			else
				nlft = true;
			return;
      }
      if(horGrid[i2][j1] && playerTank.bounds.intersects(hLines[i2][j1].bounds))
	  {
			if(player.angle>180)
				nbck = true;
			else
				nfwd = true;
			if(player.angle<90 || (player.angle>180 && player.angle<270))
				nrgt = true;
			else
				nlft = true;
			return;
	  }
      if(verGrid[i1][j1] && playerTank.bounds.intersects(vLines[i1][j1].bounds))
	  {
			if(player.angle>90 && player.angle<270)
				nfwd = true;
			else
				nbck = true;
			if(player.angle>270 || (player.angle>90 && player.angle<180))
				nrgt = true;
			else
				nlft = true;
			return;
      }
      if(verGrid[i1][j2] && playerTank.bounds.intersects(vLines[i1][j2].bounds))
	  {
			if(player.angle>90 && player.angle<270)
				nbck = true;
			else
				nfwd = true;
			if(player.angle>270 || (player.angle>90 && player.angle<180))
				nrgt = true;
			else
				nlft = true;
			return;
      }
}

function draw()
{
	nfwd = false;
	nbck = false;
	nlft = false;
	nrgt = false;
	isOk();
	if(!nfwd && fwd)
	{
		tank.x+=speed*Math.cos(player.angle*constants.DEGRAD);
		tank.y+=speed*Math.sin(player.angle*constants.DEGRAD);
	}
	else if(!nbck && bck)
	{
		tank.x-=speed*Math.cos(player.angle*constants.DEGRAD);
		tank.y-=speed*Math.sin(player.angle*constants.DEGRAD);
	}
	if(!nrgt && rgt)
	{
		player.angle+=angularSpeed;
		if(player.angle>360)
			player.angle-=360;
		playerTank.rotate(angularSpeed);
	}
	else if(!nlft && lft)
	{
		player.angle-=angularSpeed;
		if(player.angle<0)
			player.angle+=360;
		playerTank.rotate(-angularSpeed);
	}
	playerTank.position = tank;
//	document.getElementById('status').innerHTML = player.angle;
}

function myGridLines( ) {

    width_per_rectangle = boundingRect.width / maxWidth;
    height_per_rectangle = boundingRect.height / maxHeight;
    for(var i = 0 ; i <= maxHeight  ; i++)
    {
    	for(var j = 0 ; j<= maxWidth ; j++)
    	{    	
    		if(horGrid[i][j] == true) // draw a horizontal line from jth to j+1th column of the ith row.
    		{
     			var yPos = boundingRect.top + i * height_per_rectangle;
    			var leftPoint = new Point(boundingRect.left + j*width_per_rectangle, yPos);
    			var rightPoint = new Point(boundingRect.left + (j+1)*width_per_rectangle, yPos);
    			
        		hLines[i][j] = new Path.Line(leftPoint, rightPoint);
        		hLines[i][j].strokeColor = 'black';
//        		hLines[i][j].strokeWidth = 10;
    		}
    		if(verGrid[i][j] == true) // draw a vertical line from ith to i+1th row of the jth column.
    		{
    			var xPos = boundingRect.left + j* width_per_rectangle;
      			var topPoint = new Point(xPos, boundingRect.top + i*height_per_rectangle);
        		var bottomPoint = new Point(xPos, boundingRect.top + (i+1)*height_per_rectangle);
        		
        		vLines[i][j] = new Path.Line(topPoint, bottomPoint);
        		vLines[i][j].strokeColor = 'black';
//        		vLines[i][j].strokeWidth = 10;
    		}
    	}
    }
}


function createRandomBoolGrids()
{
	horGrid = new Array(maxHeight+1);
	verGrid = new Array(maxHeight+1);
	hLines = new Array(maxHeight+1);
	vLines = new Array(maxHeight+1);
	for (var i = 0; i < horGrid.length; i++) { 
			horGrid[i] = new Array(maxWidth+1);
			verGrid[i] = new Array(maxWidth+1);
			vLines[i] = new Array(maxWidth+1);
			hLines[i] = new Array(maxWidth+1);
		};		
	for(var i = 0 ; i < horGrid.length; i++)
	{
		for(var j= 0 ; j < verGrid.length ; j++)
		{
			if(i==0 || i==horGrid.length-1)
				horGrid[i][j] = true;
			else
				horGrid[i][j] = getRandomBool();	
			if(j==0 || j==horGrid.length-1)
				verGrid[i][j] = true;
			else
				verGrid[i][j] = getRandomBool();
		}
	};
}

function newGame()
{
	tank = new Point(30,20);
	playerTank = new Path.Rectangle([tank.x,tank.y], [player.width, player.height]);
	playerTank.strokeColor = 'black';
    playerTank.fillColor = 'red';

	createRandomBoolGrids();
	boundingRect = paper.view.bounds;
	myGridLines();
	
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
	arena.width = pixelWidth;
	arena.height = pixelHeight;
	arena.style.border = borderStyle;
	newGame();
}