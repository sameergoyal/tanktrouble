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
var lines;
var boundingRect;
var maxWidth;
var maxHeight;


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
	// body...
	  var width_per_rectangle = boundingRect.width / maxWidth;
      var height_per_rectangle = boundingRect.height / maxHeight;

      if(player.x < 0 || player.x > boundingRect.height) return false;
      if(player.y <0 || player.y > boundingRect.width ) return false;
      
      var i1 = Math.floor(player.x / width_per_rectangle);
      var i2 = Math.ceil(player.x / width_per_rectangle);

      var j1 =  Math.floor(player.y / height_per_rectangle);
      var j2 = Math.floor(player.y / height_per_rectangle);

      //alert(i1);
      //alert(i2);

      if(horGrid[i1][j1])
      {
      	if(playerTank.bounds.intersects(lines[i1][j1].bounds)) return false;

      }
       if(horGrid[i1][j2])
      {
      	if(playerTank.bounds.intersects(lines[i1][j2].bounds)) return false;

      }
      if(horGrid[i2][j1])
      {
      	if(playerTank.bounds.intersects(lines[i2][j1].bounds)) return false;

      }
      if(horGrid[i2][j2])
      {
      	if(playerTank.bounds.intersects(lines[i2][j2]).bounds) return false;

      }


      if(verGrid[i1][j1])
      {
      	if(playerTank.bounds.intersects(lines[i1][j1]).bounds) return false;

      }
       if(verGrid[i1][j2])
      {
      	if(playerTank.bounds.intersects(lines[i1][j2]).bounds) return false;

      }
      if(verGrid[i2][j1])
      {
      	if(playerTank.bounds.intersects(lines[i2][j1]).bounds) return false;

      }
      if(verGrid[i2][j2])
      {
      	if(playerTank.bounds.intersects(lines[i2][j2]).bounds) return false;

      }

      return true;

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
	if(!isOk()) {
		alert("Dead");
		return;
	}

	playerTank.position = new Point(player.x,player.y);

}




function myGridLines( ) {

    var width_per_rectangle = boundingRect.width / maxWidth;
    var height_per_rectangle = boundingRect.height / maxHeight;


    for(var i = 1 ; i < maxHeight  ; i++)
    {
    	for(var j = 0 ; j< maxWidth ; j++)
    	{
    	
    		if(horGrid[i][j] == true) // draw a horizontal line from jth to j+1th column of the ith row.
    		{
    	
     			var yPos = boundingRect.top + i * height_per_rectangle;
    			var leftPoint = new paper.Point(boundingRect.left + j*width_per_rectangle, yPos);
    			var rightPoint = new paper.Point(boundingRect.left + (j+1)*width_per_rectangle, yPos);
    			
        		lines[i][j] = new paper.Path.Line(leftPoint, rightPoint);
        		lines[i][j].strokeColor = 'black';
        		lines[i][j].strokeWidth = 10;
        		lines[i][j].smooth();


    		}
    		if(verGrid[i][j] == true) // draw a vertical line from ith to i+1th row of the jth column.
    		{
    	
    			var xPos = boundingRect.left + j* width_per_rectangle;
      			var topPoint = new paper.Point(xPos, boundingRect.top + i*height_per_rectangle);
        		var bottomPoint = new paper.Point(xPos, boundingRect.top + (i+1)*height_per_rectangle);
        		

        		lines[i][j] = new paper.Path.Line(topPoint, bottomPoint);
        		lines[i][j].strokeColor = 'black';
        		lines[i][j].strokeWidth = 10;
        		lines[i][j].smooth();


    		}

    	}
    }

}


function createRandomBoolGrids()
{
	horGrid = new Array(8);
	verGrid = new Array(8);
	lines = new Array(8);
	for (var i = 0; i < horGrid.length; i++) { 
			horGrid[i] = new Array(8);
			verGrid[i] = new Array(8);
			lines[i] = new Array(8);
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
	boundingRect = paper.view.bounds;
	maxWidth = 8;
	maxHeight = 8;
	myGridLines();
	
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