var game = new Phaser.Game(800, 400, Phaser.CANVAS, 'canvas', { preload: preload, create: create, update: update });

function preload() {

    game.load.image('sky', '../images/dark.png');
    game.load.image('ground', '../images/wall.png');
    game.load.image('letter', '../images/A.png');
    game.load.spritesheet('dude', '../images/dude.png', 32, 48);

}

var player;
var platforms;
var cursors;
var letters;
var score = 0;
var scoreText;

function create() {

    //  We're going to be using physics, so enable the Arcade Physics system
    game.physics.startSystem(Phaser.Physics.ARCADE);

    //  A simple background for our game
    game.add.sprite(0, 0, 'sky');

    //  The platforms group contains the ground and the 2 ledges we can jump on
    platforms = game.add.group();

    //  We will enable physics for any object that is created in this group
    platforms.enableBody = true;

    // Here we create the ground.
    var ground = platforms.create(0, game.world.height - 64, 'ground');

    //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
    ground.scale.setTo(2, 2);

    //  This stops it from falling away when you jump on it
    ground.body.immovable = true;

    //  Now let's create two ledges
    var ledge = platforms.create(400, 100, 'ground');
    ledge.body.immovable = true;

    ledge = platforms.create(-150, 200, 'ground');
    ledge.body.immovable = true;

    // The player and its settings
    player = game.add.sprite(32, game.world.height - 150, 'dude');

    //  We need to enable physics on the player
    game.physics.arcade.enable(player);

    //  Player physics properties. Give the little guy a slight bounce.
    player.body.bounce.y = 0.2;
    player.body.gravity.y = 300;
    player.body.collideWorldBounds = true;

    //  Our two animations, walking left and right.
    player.animations.add('left', [0, 1, 2, 3], 10, true);
    player.animations.add('right', [5, 6, 7, 8], 10, true);

    //  Finally some letters to collect
    letters = game.add.group();

    //  We will enable physics for any letter that is created in this group
    letters.enableBody = true;

    //  Here we'll create 12 of them evenly spaced apart
    for (var i = 0; i < 12; i++)
    {
        //  Create a letter inside of the 'letters' group
        var letter = letters.create(i * 70, 0, 'letter');

        //  Let gravity do its thing
        letter.body.gravity.y = 300;

        //  This just gives each letter a slightly random bounce value
        letter.body.bounce.y = 0.7 + Math.random() * 0.2;
    }

    //  The score
    scoreText = game.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#fff' });

    //  Our controls.
    cursors = game.input.keyboard.createCursorKeys();

    // Stretch to fill
    game.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;

    // Keep original size
    // game.scale.fullScreenScaleMode = Phaser.ScaleManager.NO_SCALE;

    // Maintain aspect ratio
    // game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;

    game.input.onDown.add(gofull, this);

}
function gofull() {

    if (game.scale.isFullScreen)
    {
        game.scale.stopFullScreen();
    }
    else
    {
        game.scale.startFullScreen(false);
    }

}
function render () {

    // game.debug.text('Click / Tap to go fullscreen', 270, 16);
    // game.debug.text('Click / Tap to go fullscreen', 0, 16);

    game.debug.inputInfo(32, 32);
    // game.debug.pointer(game.input.activePointer);

}

function update() {

    //  Collide the player and the letters with the platforms
    game.physics.arcade.collide(player, platforms);
    game.physics.arcade.collide(letters, platforms);

    //  Checks to see if the player overlaps with any of the letters, if he does call the collectStar function
    game.physics.arcade.overlap(player, letters, collectLetter, null, this);

    //  Reset the players velocity (movement)
    player.body.velocity.x = 0;

    if (cursors.left.isDown)
    {
        //  Move to the left
        player.body.velocity.x = -150;

        player.animations.play('left');
    }
    else if (cursors.right.isDown)
    {
        //  Move to the right
        player.body.velocity.x = 150;

        player.animations.play('right');
    }
    else
    {
        //  Stand still
        player.animations.stop();

        player.frame = 4;
    }

    //  Allow the player to jump if they are touching the ground.
    if (cursors.up.isDown && player.body.touching.down)
    {
        player.body.velocity.y = -350;
    }

}

function collectLetter (player, letter) {

    // Removes the letter from the screen
    letter.kill();
    //  Add and update the score
    score += 10;
    scoreText.text = 'Score: ' + score;

}

/*function restartGame( score){
  if(score===120){

  }
}
function stopGame( score){

}*/
