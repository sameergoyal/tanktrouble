(function() {
    
    var constants = {
        FPS: 60,
        PI: Math.PI,
        worldScale: 1,
        posIter: 10,
        velIter: 10,
        tankX: 100,
        tankY: 100,
        tankWidth: 40,
        tankHeight: 20,
        worldAlpha: 1,
        lineThickness: 1,
        tankDensity: 1,
        tankFriction: 0,
        tankRestitution: 1,
        LEFT: 37,
        UP: 38,
        RIGHT: 39,
        DOWN: 40,
        isDebug: true,
    };

    var b2Vec2 = Box2D.Common.Math.b2Vec2;
    var b2AABB = Box2D.Collision.b2AABB;
    var b2BodyDef = Box2D.Dynamics.b2BodyDef;
    var b2Body = Box2D.Dynamics.b2Body;
    var b2FixtureDef = Box2D.Dynamics.b2FixtureDef;
    var b2Fixture = Box2D.Dynamics.b2Fixture;
    var b2World = Box2D.Dynamics.b2World;
    var b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape;
    var b2DebugDraw = Box2D.Dynamics.b2DebugDraw;    
    var world;
    var lastTime = 0;
    var fwd, bck, rgt, lft;
    var tank;

    function press(e)
    {
        switch(e.keyCode)
        {
            case constants.UP:
            if(!bck) {
                fwd = true;
                tank.SetAwake(true);
                tank.SetLinearVelocity(new b2Vec2(1,0));
            }
            break;
            case constants.DOWN:
            if(!fwd) {
                bck = true;
                tank.SetAwake(true);
                tank.SetLinearVelocity(new b2Vec2(-1,0));
            }
            break;
            case constants.RIGHT:
            if(!lft) {
                rgt = true;
                tank.SetAwake(true);
                tank.SetAngularVelocity(0.01);
            }
            break;
            case constants.LEFT:
            if(!rgt) {
                lft = true;
                tank.SetAwake(true);
                tank.SetAngularVelocity(-0.01);
            }
            break;
        }
    }
     
    function release(e)
    {
            switch(e.keyCode)
            {
                    case constants.UP:
                    fwd = false;
                    tank.SetAwake(true);
                    tank.SetLinearVelocity(new b2Vec2(0,0));
                    break;
                    case constants.DOWN:
                    bck = false;
                    tank.SetAwake(true);
                    tank.SetLinearVelocity(new b2Vec2(0,0));
                    break;
                    case constants.RIGHT:
                    rgt = false;
                    tank.SetAwake(true);
                    tank.SetAngularVelocity(0);
                    break;
                    case constants.LEFT:
                    lft = false;
                    tank.SetAwake(true);
                    tank.SetAngularVelocity(0);
                    break;
            }
    }

    function update() {
        requestAnimationFrame(update);
        var now = new Date().getTime();
        var dt = now - (lastTime !== 0 ? lastTime : now);
        world.Step(dt,constants.velIter,constants.posIter);
        world.DrawDebugData();
        world.ClearForces();
        lastTime = now;
    };

    function debugDraw() {
        var debugDraw = new b2DebugDraw();
        debugDraw.SetSprite(document.getElementById("arena").getContext("2d"));
        debugDraw.SetDrawScale(constants.worldScale);
        debugDraw.SetFillAlpha(constants.worldAlpha);
        debugDraw.SetLineThickness(constants.lineThickness);
        debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
        world.SetDebugDraw(debugDraw);
    }

    function init() {

        world = new b2World(new b2Vec2(0, 0),true);

        debugDraw();
        
        document.addEventListener("keydown", press);
        document.addEventListener("keyup", release);

        if (!window.requestAnimationFrame) {
            window.requestAnimationFrame = function(callback) {
                var currTime = new Date().getTime();
                var timeToCall = Math.max(0, 16 - (currTime - lastTime));
                var id = window.setTimeout(function() { callback(currTime + timeToCall); },
                  timeToCall);
                lastTime = currTime + timeToCall;
                return id;
            };
        }

        requestAnimationFrame(update);
    }

    function newTank() {
        var bodyDef = new b2BodyDef;
        bodyDef.type = b2Body.b2_dynamicBody;
        bodyDef.position.Set(constants.tankX/constants.worldScale,constants.tankY/constants.worldScale);
        var polygonShape = new b2PolygonShape;
        polygonShape.SetAsBox(constants.tankWidth/2/constants.worldScale,constants.tankHeight/2/constants.worldScale);
        var fixtureDef = new b2FixtureDef;
        fixtureDef.density = constants.tankDensity;
        fixtureDef.friction = constants.tankFriction;
        fixtureDef.restitution = constants.tankRestitution;
        fixtureDef.shape = polygonShape;
        var body=world.CreateBody(bodyDef);
        body.CreateFixture(fixtureDef);
        return body;
    }

    window.onload = function() {
        init();
        tank = newTank();
        if(constants.isDebug) {
            window.tank = tank;
        }
    };
})();