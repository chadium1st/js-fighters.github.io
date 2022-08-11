
const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;

c.fillRect(0, 0, canvas.width, canvas.height);

const gravity = .7;
const background = new Sprite({
    position:{
        x: 0,
        y: 0,
    },
    imageSrc: "./oak_woods_v1.0/background/background.png",
});

const shop = new Sprite({
    position:{
        x: 600,
        y: 128,
    },
    imageSrc: "./oak_woods_v1.0/decorations/shop_anim.png",
    scale: 2.75,
    framesMax: 6,
});

const player = new Fighter({
    position: {
        x: 0,
        y: 0,
    },

    velocity: {
        x:0,
        y:0,
    },
    offset: {
        x: 0,
        y: 0,
    },
    imageSrc: "./Martial Hero/Sprites/Idle.png",
    framesMax: 8,
    scale: 2.5,
    offset: {
        x: 215,
        y: 157,
    },
    sprites: {
        idle: {
            imageSrc: "./Martial Hero/Sprites/Idle.png",
            framesMax: 8,
        },
        run: {
            imageSrc: "./Martial Hero/Sprites/Run.png",
            framesMax: 8,
        },
        jump: {
            imageSrc: "./Martial Hero/Sprites/Jump.png",
            framesMax: 2,
        },
        fall: {
            imageSrc: "./Martial Hero/Sprites/Fall.png",
            framesMax: 2,
        },
        attack1: {
            imageSrc: "./Martial Hero/Sprites/Attack1.png",
            framesMax: 6,
        },
        attack2: {
            imageSrc: "./Martial Hero/Sprites/Attack2.png",
            framesMax: 6,
        },
        takeHit: {
            imageSrc: "./Martial Hero/Sprites/Take Hit.png",
            framesMax: 4,
        },
        death: {
            imageSrc: "./Martial Hero/Sprites/Death.png",
            framesMax: 6,
        }  
    },
    attackBox: {
        offset: {
            x: 30,
            y: 0,
        },
        width: 215,
        height: 50,
    }
});

const enemy = new Fighter({
    position: {
        x: 400,
        y: 100,
    },

    velocity: {
        x:0,
        y:0,
    },
    offset: {
        x: 215,
        y: 167,
    },
    imageSrc: "./Martial Hero 2/Sprites/Idle.png",
    framesMax: 4,
    scale: 2.5,
    sprites: {
        idle: {
            imageSrc: "./Martial Hero 2/Sprites/Idle.png",
            framesMax: 4,
        },
        run: {
            imageSrc: "./Martial Hero 2/Sprites/Run.png",
            framesMax: 8,
        },
        jump: {
            imageSrc: "./Martial Hero 2/Sprites/Jump.png",
            framesMax: 2,
        },
        fall: {
            imageSrc: "./Martial Hero 2/Sprites/Fall.png",
            framesMax: 2,
        },
        attack1: {
            imageSrc: "./Martial Hero 2/Sprites/Attack1.png",
            framesMax: 4,
        },
        attack2: {
            imageSrc: "./Martial Hero 2/Sprites/Attack2.png",
            framesMax: 4,
        },
        takeHit: {
            imageSrc: "./Martial Hero 2/Sprites/Take hit.png",
            framesMax: 3,
        },
        death: {
            imageSrc: "./Martial Hero 2/Sprites/Death.png",
            framesMax: 7,
        }
    },
    attackBox: {
        offset: {
            x: -170,
            y: 0,
        },
        width: 215,
        height: 50,
    }
});

const keys = {
    a:{
        pressed: false,
    },
    d:{
        pressed: false,
    },
    w:{
        pressed: false,
    },
    ArrowUp:{
        pressed: false,
    },
    ArrowLeft:{
        pressed: false,
    },
    ArrowRight:{
        pressed: false,
    }
}

decreaseTimer();

function animate(){
    window.requestAnimationFrame(animate);
    c.fillStyle = 'gray';
    c.fillRect(0, 0, canvas.width, canvas.height);
    background.update();
    shop.update();
    c.fillStyle = "rgba(255, 255, 255, 0.1)";
    c.fillRect(0, 0, canvas.width, canvas.height);
    player.update();
    enemy.update();

    //player movement:
    player.velocity.x = 0;

    if(keys.a.pressed && player.lastKey === "a"){
        player.velocity.x = -5;
        player.switchSprite("run");
    } else if(keys.d.pressed && player.lastKey === "d"){
        player.velocity.x = 5;
        player.switchSprite("run");
    } else {
        player.switchSprite("idle");
    }

    // jumping:
    if(player.velocity.y < 0){
        player.switchSprite("jump");
    } else if(player.velocity.y > 0){
        player.switchSprite("fall");
    }


    // enemy movement:
    enemy.velocity.x = 0;
    if(keys.ArrowLeft.pressed && enemy.lastKey === "ArrowLeft"){
        enemy.switchSprite("run");
        enemy.velocity.x = -5;
    } else if(keys.ArrowRight.pressed && enemy.lastKey === "ArrowRight"){
        enemy.switchSprite("run");
        enemy.velocity.x = 5;
    } else {
        enemy.switchSprite("idle");
    }

    // jumping:
    if(enemy.velocity.y < 0){
        enemy.switchSprite("jump");
    } else if(enemy.velocity.y > 0){
        enemy.switchSprite("fall");
    }

    // detect player's collision:
    // detect enemy hit:
    if(rectangularCollision({
        rectangle1: player,
        rectangle2: enemy,
    })  && player.isAttacking && player.framesCurrent === 3){
        enemy.takeHit();
        player.isAttacking = false;

        gsap.to('#enemyHealth', {
            width: enemy.health + "%",
        })
    }

    // if player misses:
    if(player.isAttacking && player.framesCurrent === 3){
        player.isAttacking= false;
    }

    // detect enemy's collision:
    // detect player hit:
    if(rectangularCollision({
        rectangle1: enemy,
        rectangle2: player,
    })  && enemy.isAttacking && enemy.framesCurrent === 2){
        player.takeHit();
        enemy.isAttacking = false;

        gsap.to('#playerHealth', {
            width: player.health + "%",
        })
    }

    // if enemy misses:
    if(enemy.isAttacking && enemy.framesCurrent === 2)
        enemy.isAttacking= false;

    // if time is remaining and one of the player has lost all their health:
    if(player.health <= 0 || enemy.health <= 0){
        determineWinner({player, enemy, timerID});
    }
}

animate();

window.addEventListener("keydown", (event) =>{
    if(!player.dead){
    switch(event.key){
        case "d": {
            keys.d.pressed = true;
            player.lastKey = "d";
            break;
        }

        case "a": {
            keys.a.pressed = true;
            player.lastKey = "a";
            break;
        }

        case "w": {
            keys.w.pressed = true;
            player.velocity.y = -20;
            break;
        }

        case "s": {
            player.attack();
            break;
        }
    }
}

    if(!enemy.dead){
    switch(event.key){
        // enemy keydowns:
        case "ArrowRight": {
            keys.ArrowRight.pressed = true;
            enemy.lastKey = "ArrowRight";
            break;
        }

        case "ArrowLeft": {
            keys.ArrowLeft.pressed = true;
            enemy.lastKey = "ArrowLeft";
            break;
        }

        case "ArrowUp": {
            keys.ArrowUp.pressed = true;
            enemy.velocity.y = -20;
            break;
        }

        case "ArrowDown": {
            enemy.attack();
            break;
        }
    }
}
})

window.addEventListener("keyup", (event) =>{
    switch(event.key){
        case "d": {
            keys.d.pressed = false;
            break;
        }

        case "a": {
            keys.a.pressed = false;
            break;
        }

        // enemy keyups:
        case "ArrowRight": {
            keys.ArrowRight.pressed = false;            
            break;
        }

        case "ArrowLeft": {
            keys.ArrowLeft.pressed = false;
            break;
        }
    }
})
