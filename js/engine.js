/* Engine.js
 * This file provides the game loop functionality (update entities and render),
 * draws the initial game board on the screen, and then calls the update and
 * render methods on your player and enemy objects (defined in your app.js).
 *
 * A game engine works by drawing the entire game screen over and over, kind of
 * like a flipbook you may have created as a kid. When your player moves across
 * the screen, it may look like just that image/character is moving or being
 * drawn but that is not the case. What's really happening is the entire "scene"
 * is being drawn over and over, presenting the illusion of animation.
 *
 * This engine is available globally via the Engine variable and it also makes
 * the canvas' context (ctx) object globally available to make writing app.js
 * a little simpler to work with.
 */

var collisionCounter = null;  // to count number of collisions between player and enemies

var Engine = (function(global) {
    /* Predefine the variables we'll be using within this scope,
     * create the canvas element, grab the 2D context for that canvas
     * set the canvas elements height/width and add it to the DOM.
     */

var doc = global.document,
        win = global.window,
        canvas = doc.createElement('canvas'),
        ctx = canvas.getContext('2d'),
        state = "start",                // set game state
        playerSprite = '',
        lastTime;
    canvas.width = 505;             //grid width
    canvas.height = 606;            //gird height
    doc.body.appendChild(canvas);   
    
    // check high score 
    
    if (localStorage.highscore) {
        localStorage.highscore = 0;
    }
    /* This function serves as the kickoff point for the game loop itself
     * and handles properly calling the update and render methods.
     */

    function main() {
                /* Get our time delta information which is required if your game
         * requires smooth animation. Because everyone's computer processes
         * instructions at different speeds we need a constant value that
         * would be the same for everyone (regardless of how fast their
         * computer is) - hurray time!
         */

        var now = Date.now(),
            dt = (now - lastTime) / 1000.0;
        /* Call our update/render functions, pass along the time delta to
         * our update function since it may be used for smooth animation.
         */

        update(dt);
        render();
        /* Set our lastTime variable which is used to determine the time delta
         * for the next time this function is called.
         */

        lastTime = now;
        /* Use the browser's requestAnimationFrame function to call this
         * function again as soon as the browser is able to draw another frame.
         */

        win.requestAnimationFrame(main);
    }
    /* This function does some initial setup that should only occur once,
     * particularly setting the lastTime variable that is required for the
     * game loop.
     */

    function init() {
        reset();
        lastTime = Date.now();
        main();
    }
    /* This function is called by main (our game loop) and itself calls all
     * of the functions which may need to update entity's data. Based on how
     * you implement your collision detection (when two entities occupy the
     * same space, for instance when your character should die), you may find
     * the need to add an additional function call here. For now, we've left
     * it commented out - you may or may not want to implement this
     * functionality this way (you could just implement collision detection
     * on the entities themselves within your app.js file).
     */

    function update(dt) {
        if (state == "play") {          // check game state
            updateEntities(dt);
            checkCollisions();
        } else {
            selector.update();
        }
        
    }

    // to check collision 
    
    function checkCollisions() {
        allEnemies.forEach(function (enemy) {
            if ((enemy.y === player.y) && (player.x >= (enemy.x - 50)) && (player.x <= (enemy.x + 80))) {
                localStorage.highscore = Math.max(player.score, localStorage.highscore);
                
                // if collision happens , reset player x , y position to original position
                
                player.x = 202;                  
                player.y = 404;                 
                collisionCounter = collisionCounter + 1;      // increase collisionCounter by one 
                player.lives = (player.lives - 1);          // decrease player lives by one
                
                // check collisionCounter 
                
                if (collisionCounter === 4){            // if collisionCounter = 4 then game will end
                    state = "gameover";
                }
            } else if (player.score > 1000){            // if player score reaches to max score (1000) , player wins 
                state = "wingame"
                player.score = 0;                    // reset player score
                localStorage.highscore =0;          // reset high score
            }
        });
        //  check if player collects more bouns then increases player score 
        
        if (bonus) {
            if (bonus.y === player.y && bonus.x === player.x) {
                player.score += bonus.multiplier;
                bonus = null;
            }; 
        }
        
    }
    
    // win game function to write win message and its font and color style
    
    function winGame () {
        ctx.fillStyle = "#FFFF00";   
        ctx.font = "24px Cornerstone";
        ctx.textAlign = "center";
        ctx.textBaseline = "top";
        ctx.fillText("Wow!!!! You reached to max score", 250, 400);             // win message
        ctx.fillText('Press "Enter" to play again', 250, 435);                  // win message
        ctx.fillText('Press "Space" to select a new character', 250, 470);    // win message
        ctx.fillText("Score: " + player.score, 80, 64);                     // show player final score
        ctx.fillText("High Score: " + localStorage.highscore, 400, 64);     // show player final high score

    }
    /* This is called by the update function and loops through all of the
     * objects within your allEnemies array as defined in app.js and calls
     * their update() methods. It will then call the update function for your
     * player object. These update methods should focus purely on updating
     * the data/properties related to the object. Do your drawing in your
     * render methods.
     */

    function updateEntities(dt) {
        allEnemies.forEach(function(enemy) {
            enemy.update(dt);
        });
        player.update();
    }
    /* This function initially draws the "game level", it will then call
     * the renderEntities function. Remember, this function is called every
     * game tick (or loop of the game engine) because that's how games work -
     * they are flipbooks creating the illusion of animation but in reality
     * they are just drawing the entire screen over and over.
     */

    function render() {
                /* This array holds the relative URL to the image used
         * for that particular row of the game level.
         */

        var rowImages = [
                'images/water-block.png',   // Top row is water
                'images/stone-block.png',   // Row 1 of 3 of stone
                'images/stone-block.png',   // Row 2 of 3 of stone
                'images/stone-block.png',   // Row 3 of 3 of stone
                'images/grass-block.png',   // Row 1 of 2 of grass
                'images/grass-block.png'    // Row 2 of 2 of grass
            ],
            numRows = 6,
            numCols = 5,
            row, col;
        /* Loop through the number of rows and columns we've defined above
         * and, using the rowImages array, draw the correct image for that
         * portion of the "grid"
         */

        for (row = 0; row < numRows; row++) {
            for (col = 0; col < numCols; col++) {
                                /* The drawImage function of the canvas' context element
                 * requires 3 parameters: the image to draw, the x coordinate
                 * to start drawing and the y coordinate to start drawing.
                 * We're using our Resources helpers to refer to our images
                 * so that we get the benefits of caching these images, since
                 * we're using them over and over.
                 */

                ctx.drawImage(Resources.get(rowImages[row]), col * 101, row * 83);
            }
        }

        if (state == "start") {
            renderPlayerSelect();
        } else if (state =="wingame"){
            winGame();
        } else if (state == "gameover") {
            renderGameOver();
        } else {
            renderEntities();
        }
    }
        /* This function is called by the render function and is called on each game
     * tick. Its purpose is to then call the render functions you have defined
     * on your enemy and player entities within app.js
     */
  
    function renderEntities() {
        /* Loop through all of the objects within the allEnemies array and call
         * the render function you have defined.
         */

        if(bonus) {
            bonus.render();
        }

        allEnemies.forEach(function(enemy) {
            enemy.render();
        });

        player.render();
        
        // show player Score during game
        
        ctx.fillStyle = "rgb(250, 250, 250)";
        ctx.font = "24px Helvetica";
        ctx.textAlign = "left";
        ctx.textBaseline = "top";
        ctx.fillText("Score: " + player.score, 32, 64);
        ctx.fillText("High Score: " + localStorage.highscore, 320, 64);
        
        //show player moves during game
        
        ctx.fillStyle = "rgb(250, 250, 250)";
        ctx.font = "26px Cornerstone";
        ctx.textAlign = "center";
        ctx.textBaseline = "top";
        ctx.fillText("Moves: " + player.moves, 220, 64);
        
        //show player lives during game
        
        ctx.fillStyle = "rgb(250, 250, 250)";
        ctx.font = "26px Cornerstone";
        ctx.textAlign = "center";
        ctx.textBaseline = "top";
        ctx.fillText("Life: " + player.lives, 250, 100);


    }
    
    // renderPlayerSelect() function to select new player
    
    function renderPlayerSelect() {
        var options = [
            [0, 'images/char-cat-girl.png'],
            [101, 'images/char-horn-girl.png'],
            [202, 'images/char-pink-girl.png'],
            [303, 'images/char-boy.png'],
            [404, 'images/char-princess-girl.png']
        ];

        selector.render();

        for (i = 0; i < options.length; i++) {
            ctx.drawImage(Resources.get(options[i][1]), options[i][0], 303);

            if (options[i][0] === selector.x) {
                playerSprite = options[i][1];
            }
        }

        ctx.fillStyle = "rgb(250, 250, 250)";
        ctx.font = "32px Cornerstone ";
        ctx.textAlign = "center";
        ctx.textBaseline = "top";
        ctx.fillText("Select your player", 250, 475);
        ctx.fillText("High Score: " + localStorage.highscore, 250, 64);
    }
        
    
    
    function renderGameOver() {
        ctx.fillStyle = "rgb(250, 250, 250)";
        ctx.font = "26px Cornerstone";
        ctx.textAlign = "center";
        ctx.textBaseline = "top";
        ctx.fillText("oh noooooo , game over", 250, 400);
        ctx.fillText('Press "Enter" to play again', 250, 435);
        ctx.fillText('Press "Space" to select a new character', 250, 470);
        ctx.fillText("Score: " + player.score, 80, 64);
        ctx.fillText("High Score: " + localStorage.highscore, 400, 64);
    }
    
    //reset game function to reset states.

    function reset() {
        allEnemies = [];
        for (i = 0; i < 3; i++) {
            allEnemies[i] = new Enemy();
        }
        bonus = new Bonus();
        player = new Player(playerSprite);
        collisionCounter = null;
    }
    
    // event listener to select new character if user press space or play again if user press enter     
    
    document.addEventListener('keyup', function(e) {
        if (state == "start"  && (e.keyCode < 37 || e.keyCode > 40)) {
            reset();
            state = "play";            
        } else if (state == "wingame") {
            if (e.keyCode == 13) {          //  press enter to play again
                reset();
                state = "play";
            }
            if (e.keyCode == 32) {          //  press space to select a new character
                state = "start";
            }
        } else if (state == "gameover") {
            if (e.keyCode == 13) {          //  press enter to play again
                reset();
                state = "play";
            }
            if (e.keyCode == 32) {          //  press space to select a new character
                state = "start";
            }
        }
    });
    /* Go ahead and load all of the images we know we're going to need to
     * draw our game level. Then set init as the callback method, so that when
     * all of these images are properly loaded our game will start.
     */

    Resources.load([
        'images/stone-block.png',
        'images/water-block.png',
        'images/grass-block.png',
        'images/enemy-bug.png',
        'images/char-boy.png',
        'images/char-cat-girl.png',
        'images/char-horn-girl.png',
        'images/char-pink-girl.png',
        'images/char-princess-girl.png',
        'images/Gem Blue.png',
        'images/Gem Green.png',
        'images/Gem Orange.png',
        'images/Star.png',
        'images/Selector.png',
        'images/Heart.png',
        'images/Key.png',
        'images/Rock.png',
        'images/Star.png'
     
    ]);
    Resources.onReady(init);
    /* Assign the canvas' context object to the global variable (the window
     * object when run in a browser) so that developers can use it more easily
     * from within their app.js files.
     */

    global.ctx = ctx;

})(this);
