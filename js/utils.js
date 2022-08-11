function rectangularCollision({rectangle1, rectangle2}) {
    return(
    rectangle1.attackBox.position.x + rectangle1.attackBox.width >= rectangle2.position.x
    && rectangle1.attackBox.position.x <= rectangle2.position.x + rectangle2.width
    && rectangle1.attackBox.position.y + rectangle1.attackBox.height >= rectangle2.position.y
    && rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height
    );
}

function determineWinner({player, enemy, timerID}){
    clearTimeout(timerID);
    document.querySelector("#gameState").style.visibility = "visible";

    if(player.health === enemy.health)
        document.querySelector("#gameState").innerHTML = "Tie"; 

    else if(player.health > enemy.health)
        document.querySelector("#gameState").innerHTML = "Left Side Wins";

    else if(player.health < enemy.health)
        document.querySelector("#gameState").innerHTML = "Right Side Wins";
}

let timer = 25;
let timerID = 0;
function decreaseTimer(){
    timerID = setTimeout(decreaseTimer, 1000);
    if(timer > 0){
        timer -= 1;
        document.querySelector("#timer").innerHTML = timer;
    } else{
        determineWinner({player, enemy});
    }    
}