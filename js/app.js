// Enemies our player must avoid

var Enemy = function() {
    this.sprite = 'images/enemy-bug.png';                   //enemies image
    this.x = -101;                                          // enemies horizontal x position start 
    this.y = 62 + (85.5 * (Math.floor(Math.random() * 3))); //enemies vertical y position start
    this.speed = (Math.random() * 800) + 100;               //enemies random speed
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    if (this.x >= 505) {
        this.x = -101;
        this.y = 62 + (85.5 * (Math.floor(Math.random() * 3)));
        this.speed = (Math.random() * 512) + 100;
    } else {
        this.x += dt * this.speed;
    };
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

//  player 

var Player = function (URL, x, y) {
    this.sprite = URL || '';    
    this.x = x || 202;              // player start x position
    this.y = y || 404;              // player start y position
    this.score = 0;               // player start score
    this.moves = 0;              // number of player start moves 
    this.lives = 4;             // player lives 
};

// player update() method 

Player.prototype.update = function () {
    /*If player has reach the water, reset his location to the origin and increment score counter by one 
    */
    if (this.y <= 0) {           
        this.score += 1;                //check if player reaches the water,player score will increase by one      
        this.y = 404;                   // reset player y position
        bonus = new Bonus();            // create new bouns object from Bouns construction function
    };

    //Prevent the player from moving outside of the gride
    
    if (this.x < 0) {       
        this.x = 0;                         // reset player x position if player reaches to max end left position of grid (0)
        this.moves = this.moves -1;         // stop player moves if player x position < 0
    }
    if (this.x > 404) {                      
        this.x = 404;                           // reset player x position if player reaches to max end right position of grid (404)
        this.moves = this.moves -1;            // stop player moves if player x position > 404
    }
    if (this.y > 404) {
        this.y = 404;                        // reset player y position 
        this.moves = this.moves -1;
    };
};

// player render() method to Draw the player on the screen 

Player.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// a handleInput() method

Player.prototype.handleInput = function(key) {
    var direction = {
        'left': [-101, 0],
        'up': [0, -85.5],
        'right': [101, 0],
        'down': [0, 85.5],
        'enter': [0,0]
    };
        this.x += direction[key][0];
        this.y += direction[key][1];
        this.moves += 1;
};

// list of all bouns images 

var Bonus = function () {
    var sprites = [
        'images/Gem Blue.png',
        'images/Gem Green.png',
        'images/Gem Orange.png',
        'images/Heart.png',
        'images/Key.png',
        'images/Rock.png',
        'images/Star.png'
    ];

    this.value = Math.floor(Math.random() * 7)  // 7 different random bouns will appear
    this.sprite = sprites[this.value];
    this.multiplier = 5 * (this.value + 1);
    
    //bouns x,y position
    
    this.x = 0 + (101 * Math.floor(Math.random() * 5));
    this.y = 62 + (85.5 * (Math.floor(Math.random() * 3)));
}

// bouns render() method to Draw the bouns images on the screen

Bonus.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// selector method to select starting player

var Selector = function () {
    this.sprite = 'images/Selector.png';
    this.x = 0;
    this.y = 202;
    
}

//selector render() method to Draw the selector images on the screen

Selector.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

//selector update method 

Selector.prototype.update = function() {
    if (this.x <= 0) {
        this.x = 0;        
    }
    if (this.x >= 404) {
        this.x = 404;
    }
    if (this.y >= 404) {
        this.y = 404;
    };
}

// selector handleInput method

Selector.prototype.handleInput = function(key) {
    var direction = {
        'left': [-101, 0],
        'up': [0, -85.5],
        'right': [101, 0],
        'down': [0, 85.5],
        'enter': [0,0],
    };

    this.x += direction[key][0];
}

//create new selector object using selector construction function

var selector = new Selector();

// This listens for key presses and sends the keys to your
// Player.handleInput() method and selector handleinput.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        13: 'enter',
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
    selector.handleInput(allowedKeys[e.keyCode]);
});
