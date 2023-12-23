const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const score = document.querySelector('.score--value');
const finalScore = document.querySelector('.final-score > span');
const menu = document.querySelector('.menu-screen');
const buttonPlay = document.querySelector('.btn-play');
const btnLeft = document.querySelector('.btn-left');
const btnRight = document.querySelector('.btn-right');
const btnUp = document.querySelector('.btn-up');
const btnDown = document.querySelector('.btn-down');

const audio = new Audio('../audio/eat-cobra.mp3');

const size = 30;// declaramos e tamanho do nosso quadrado para a cobra.

const initialPosition = { x: 270, y: 240 }

let snake = [//usamos uma array para especificar o tamanho e posição da nossa cobra.
    initialPosition
]

const incrementScore = () => {
    score.innerText = +score.innerText + 10
}

const randomNumber = (min, max) => {
    return Math.round(Math.random() * (max - min) + min)
}

const randomPosition = () => {
    const number = randomNumber(0, canvas.width - size);
    return Math.round(number / 30) * 30;
}

const randomColor = () => {
    const red = randomNumber(0, 255);
    const green = randomNumber(0, 255);
    const blue = randomNumber(0, 255);

    return `rgb(${red}, ${green}, ${blue})`;
}

const food = {
    x: randomPosition(),
    y: randomPosition(),
    color: randomColor()
}

let direction, loopId;

const drawFood = () => {

    const { x, y, color } = food;
    ctx.shadowColor = color;
    ctx.shadowBlur = 7;
    ctx.fillStyle = color;
    ctx.fillRect(x, y, size, size);
    ctx.shadowBlur = 0;
}

const drawSnake = () => {//criamos uma função para adicionar cor e posição da cobra.
    ctx.fillStyle = "#ddd";//aqui declaramos a cor de cada posição da cobra

    snake.forEach((position, index) => {//criamos outra função para percorrer nossa array e trazer a posição de elemento da array. Usamos o index para diferencia nossa principal posição.
        if (index === snake.length - 1) {//criamos uma condição para percorrer nossa array e pegar a ultoma posição da array.
            ctx.fillStyle = "gray";
        }
        ctx.fillRect(position.x, position.y, size, size)//declaramos a posição da array e tamanho dessas posiçoes.
    });
}

const moveSnake = () => {

    if (!direction) return
    const head = snake[snake.length - 1];//snake.at(-1);//pegamos o ultimo elemento usando a at(-1)


    if (direction == 'right') {
        snake.push({ x: head.x + size, y: head.y });//esse metodo push adiciona um item a array.
    }
    if (direction == 'left') {
        snake.push({ x: head.x - size, y: head.y });//esse metodo push adiciona um item a array.
    }
    if (direction == 'down') {
        snake.push({ x: head.x, y: head.y + size });//esse metodo push adiciona um item a array.
    }
    if (direction == 'up') {
        snake.push({ x: head.x, y: head.y - size });//esse metodo push adiciona um item a array.
    }

    snake.shift()//essa metodo remove o primeiro elemento de uma array.
};

const moveSnakeMobile = () => {
    if (!direction) return
    const head = snake[snake.length - 1];
}


const drawGrid = () => {
    ctx.lineWidth = 1;
    ctx.strokeStyle = "#191913"

    for (let i = 30; i < canvas.width; i += 30) {
        ctx.beginPath()
        ctx.lineTo(i, 0)
        ctx.lineTo(i, 600)
        ctx.stroke()

        ctx.beginPath()
        ctx.lineTo(0, i)
        ctx.lineTo(600, i)
        ctx.stroke()
    }
}

const checkEat = () => {
    const head = snake[snake.length - 1];

    if (head.x == food.x && head.y == food.y) {
        incrementScore()
        snake.push(head)
        audio.play()

        let x = randomPosition();
        let y = randomPosition();

        while (snake.find((position) => position.x == x && position.y == y)) {
            x = randomPosition();
            y = randomPosition();
        }

        food.x = x;
        food.y = y;
        food.color = randomColor();
    }
}

const checkCollision = () => {
    const head = snake[snake.length - 1];
    const canvasLimit = canvas.width - size;
    const neckIndex = snake.length - 2;

    const wallCollision = (head.x < 0 || head.x > canvasLimit || head.y < 0 || head.y > canvasLimit);

    const selfCollision = snake.find((position, index) => {
        return index < neckIndex && position.x == head.x && position.y == head.y
    })

    if (wallCollision || selfCollision) {
        gameOver();
    }
}

const gameOver = () => {
    direction = undefined;

    menu.style.display = "flex"
    finalScore.innerText = score.innerText
    canvas.style.filter = 'blur(2px)'
}

const gameLoop = () => {
    clearInterval(loopId)

    ctx.clearRect(0, 0, 600, 600);//funcao para limpar todos os quadrados criados.
    drawGrid();
    drawFood();
    moveSnake();
    drawSnake();
    checkEat();
    checkCollision();
    moveSnakeMobile();


    loopId = setTimeout(() => {
        gameLoop()
    }, 300)
}

gameLoop();

document.addEventListener('keydown', ({ key }) => {
    if (key == "ArrowRight" && direction != "left") {
        direction = 'right';
    }

    if (key == "ArrowLeft" && direction != "right") {
        direction = 'left';
    }

    if (key == "ArrowDown" && direction != "up") {
        direction = 'down';
    }

    if (key == "ArrowUp" && direction != "down") {
        direction = 'up';
    }
});


btnLeft.addEventListener('click', () => {
    if (direction != "rigth") {
        direction = 'left';
    }
});
btnRight.addEventListener('click', () => {
    if (direction != "left") {
        direction = 'right';
    }
});
btnDown.addEventListener('click', () => {
    if (direction != "up") {
        direction = 'down';
    }
});
btnUp.addEventListener('click', () => {
    if (direction != "down") {
        direction = 'up';
    }
});




buttonPlay.addEventListener('click', () => {
    score.innerText = '00'
    menu.style.display = "none";
    canvas.style.filter = 'none';

    snake = [initialPosition]

})


