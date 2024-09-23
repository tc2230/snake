class Game {
  constructor(canvas, interval) {
    // get canvas
    this.canvas = canvas;
    this.ctx = this.canvas.getContext('2d');
    this.lastChangeDirection = Date.now();
    this.currentScoreBox = document.getElementById('current-score');
    this.bestScoreBox = document.getElementById('best-score');

    // get score element

    // basic setting
    this.unit = 20;
    this.row = this.canvas.height / this.unit;
    this.column = this.canvas.width / this.unit;
    this.interval = interval;

    // init directions
    this.directionKeyMap = {
      ArrowUp: [0, -1],
      ArrowDown: [0, 1],
      ArrowLeft: [-1, 0],
      ArrowRight: [1, 0],
    };

    // bind event listener
    window.addEventListener('keydown', this.changeDirection.bind(this));

    this.init();
  }

  init() {
    // init frame
    this.emptyFrame();

    // init score
    this.currentScore = 0;
    let storedScore = localStorage.getItem('bestScore');
    this.bestScore = storedScore == null ? 0 : storedScore;
    this.updateScore();

    // init a snake
    let head = { x: 40, y: 0 };
    let direction = [1, 0];
    let snakeLength = 3;
    this.snake = new Snake(this, head, snakeLength, direction);

    // init fruit
    this.fruit = new Fruit(this);

    // draw
    this.snake.draw();
    this.fruit.draw();
  }

  start() {
    this.init();
    alert('開始囉~');
    this.main = setInterval(this.updateFrame.bind(this), this.interval);
  }

  end() {
    window.clearInterval(this.main);
    localStorage.bestScore = this.bestScore;
  }

  emptyFrame() {
    // fill canvas with background-color
    this.ctx.fillStyle = this.canvas.style.backgroundColor;
    this.ctx.fillRect(
      0,
      0,
      this.canvas.getAttribute('width'),
      this.canvas.getAttribute('height'),
    );
  }

  shouldGrowth() {
    // return if snake body should grow
    return Object.keys(this.snake.head).every(
      (key) => this.snake.head[key] == this.fruit.location[key],
    );
  }

  shouldEnd() {
    return this.snake.length == this.row * this.column;
  }

  updateScore() {
    this.currentScoreBox.innerHTML = 'Current: ' + this.currentScore;
    this.bestScoreBox.innerHTML = 'Best: ' + this.bestScore;
  }

  // function: draw body & update canvas
  updateFrame() {
    // move snake forward
    this.snake.forward();

    // correct body location if out of border
    this.snake.fixBody();

    // check if fruit is eaten yet
    if (this.shouldGrowth()) {
      // keep tail and update fruit location
      this.fruit.updateLocation();
      this.currentScore += 1;
      if (this.currentScore > this.bestScore) {
        this.bestScore = this.currentScore;
      }
      this.updateScore();
    } else {
      // drop tail if should not grow
      this.snake.dropTail();
    }

    if (this.shouldEnd()) {
      console.log(this.snake.length);
    }

    // check if the head and snake overlap (collision)
    if (this.snake.overlap()) {
      alert('出車禍了ㄛ');
      window.clearInterval(this.main);
      this.end();
      return;
    }

    // empty frame
    this.emptyFrame();

    // draw fruit
    this.fruit.draw();

    // draw body
    this.snake.draw();

    // check if current game should end
    if (this.shouldEnd()) {
      console.log('12345789');
      alert('你真行');
      this.end();
    }
  }

  changeDirection(event) {
    // let now = Date.now();
    // if (now - this.lastChangeDirection < 100) {
    //   return;
    // }
    console.log(event);
    if (event.key == 'ArrowUp' && this.snake.direction[1] != 1) {
      this.snake.nextDirection = [0, -1];
    } else if (event.key == 'ArrowDown' && this.snake.direction[1] != -1) {
      this.snake.nextDirection = [0, 1];
    } else if (event.key == 'ArrowLeft' && this.snake.direction[0] != 1) {
      this.snake.nextDirection = [-1, 0];
    } else if (event.key == 'ArrowRight' && this.snake.direction[0] != -1) {
      this.snake.nextDirection = [1, 0];
    }
    // this.lastChangeDirection = now;
  }
}

class Snake {
  static allSnake = [];

  constructor(
    game,
    head,
    length,
    direction,
    headStyle = '#F75C2F',
    fillStyle = '#FFFFFB',
    strokeStyle = '#BDC0BA',
  ) {
    this.game = game;
    this.headStyle = headStyle;
    this.fillStyle = fillStyle;
    this.strokeStyle = strokeStyle;

    this.direction = direction;
    this.nextDirection = direction;
    this.body = Array.from({ length: length }, (value, index) => ({
      x: head.x + direction[0] * -1 * this.game.unit * index,
      y: head.y + direction[1] * -1 * this.game.unit * index,
    }));
  }

  get length() {
    return this.body.length;
  }

  get head() {
    return this.body[0];
  }

  forward() {
    // move snake head forward
    this.body.unshift({
      x: this.body[0].x + this.nextDirection[0] * this.game.unit * 1,
      y: this.body[0].y + this.nextDirection[1] * this.game.unit * 1,
    });
    this.direction = this.nextDirection;
  }

  dropTail() {
    this.body.pop();
  }

  fixBody() {
    // if out of border
    this.body.forEach((value, index, array) => {
      if (value.x < 0) {
        array[index].x = this.game.canvas.width - this.game.unit;
      }
      if (value.x >= this.game.canvas.width) {
        array[index].x = value.x - this.game.canvas.width;
      }
      if (value.y < 0) {
        array[index].y = this.game.canvas.height - this.game.unit;
      }
      if (value.y >= this.game.canvas.height) {
        array[index].y = value.y - this.game.canvas.height;
      }
    });
  }

  overlap() {
    // check collision
    let head = this.body[0];
    for (let i = 1; i < this.body.length; i++) {
      if (head.x == this.body[i].x && head.y == this.body[i].y) {
        return true;
      }
    }
    return false;
  }

  draw() {
    let ctx = this.game.ctx;
    let unit = this.game.unit;
    for (let i = 0; i < this.body.length; i++) {
      if (i == 0) {
        // filling color
        ctx.fillStyle = '#F75C2F';
      } else {
        ctx.fillStyle = '#FFFFFB';
      }
      // border color
      ctx.strokeStyle = '#BDC0BA';

      ctx.fillRect(this.body[i].x, this.body[i].y, unit, unit);
      ctx.strokeRect(this.body[i].x, this.body[i].y, unit, unit);
    }
  }
}

// class: Fruit
class Fruit {
  static allFruit = [];

  constructor(game) {
    this.game = game;
    this.updateLocation();
    this.fillStyle = '#FFB11B';
    this.strokeStyle = '#FFFFFB';
  }

  draw() {
    this.game.ctx.fillStyle = this.fillStyle;
    this.game.ctx.strokeStyle = this.strokeStyle;
    this.game.ctx.fillRect(this.x, this.y, this.game.unit, this.game.unit);
    this.game.ctx.strokeRect(this.x, this.y, this.game.unit, this.game.unit);
  }

  checkOverlap(x, y) {
    return this.game.snake.body.some((part) => part.x == x && part.y == y);
  }

  updateLocation() {
    let x;
    let y;
    let overlapped;
    do {
      x = Math.floor(Math.random() * this.game.column) * this.game.unit;
      y = Math.floor(Math.random() * this.game.row) * this.game.unit;
      overlapped = this.checkOverlap(x, y);
    } while (overlapped);

    this.x = x;
    this.y = y;
    this.location = { x: x, y: y };
  }
}

let canvas = document.getElementById('canvas-box');
const mainGame = new Game(canvas, 60);
// mainGame.start();
