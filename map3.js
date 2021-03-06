const boardInit = [
    ['O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O'],
    ['O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O'],
    ['O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O'],
    ['O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O'],
    ['O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O'],
    ['O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O'],
    ['O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O'],
    ['O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O'],
    ['O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O'],
    ['O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O'],
    ['O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O'],
    ['O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O'],
    ['O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O'],
    ['O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O'],
    ['O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O'],
    ['O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O'],
    ['O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O'],
    ['O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O'],
    ['O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O'],
    ['O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O'],
    ['O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O'],
]
// clone array so i don't lose a reference to the original one (for testing more than once)
var board = boardInit.map(function(arr) {
    return arr.slice();
});
/* const board = [
    ['O','O','O','O','O'],
    ['O','O','O','O','O'],
    ['O','O','O','O','O'],
    ['O','O','O','O','O'],
    ['O','O','O','O','O'],
]; */
const maxIndex = board.length - 1;
let movesLeft = 9;
let minimum = movesLeft;
let biggestIndex = 0;

const top = ({x, y}) => ({x: x-1, y});
const right = ({x, y}) => ({x, y: y+1});
const left = ({x, y}) => ({x, y: y-1});
const bottom = ({x, y}) => ({x: x+1, y});

// TODO simple testind for un-odd boards (it's 2 am and i need to sleep)
const center = () => ({x: maxIndex/2, y: maxIndex/2});

const rand = () => Boolean(Math.round(Math.random() * 2));

function valid({x, y}) {
    if(x < 0 || x > maxIndex || y < 0 || y > maxIndex) {
        return false;
    }
    if(board[x][y] !== 'O'){
        return false;
    }
    return {x,y};
}

// random the array to get random initial nodes (it can start in any direction)
function shuffleArray(array) {
    // Durstenfeld shuffle
    // https://en.wikipedia.org/wiki/Fisher–Yates_shuffle#The_modern_algorithm
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}

function getMoves(from, moves) {
    let available = ['TOP', 'RIGHT', 'BOTTOM', 'LEFT'];
    // remove the ability for nodes to trackback
    switch(from) {
        case 'TOP':
            available.splice(2, 1); // remove bottom :(
            break;
        case 'RIGHT':
            available.splice(3, 1); // remove left
            break;
        case 'BOTTOM':
            available.splice(0, 1); // remove up
            break;
        case 'LEFT':
            available.splice(1, 1); // remove right
            break;
    }
    const move = [];
    // run to the number of available moves and set random movements;
    for(let i = 0; i < moves; i++) {
        const randd = Math.floor(Math.random() * available.length);
        move.push(available[randd]);
        // remove selected move so it doesn't repeat and i get more corridors 
        available.splice(randd, 1);
    }
    return shuffleArray(move);
}

let lastFilled = [];

function fill({x, y}, from, index = 0) {
    // id valid, has moves left, line is not bigger than half of the max
    if(valid({x,y}) && movesLeft && index <= minimum){
        //board[x][y] = {TOP: '^', RIGHT: '>', LEFT: '<', BOTTOM: '_', CENTER: 'X'}[from]; // print last move in cell
        board[x][y] = '_'; // print a simple _
        //board[x][y] = from === 'CENTER' ? 'X' : '_'; // print a simple _ except when its the center where it will print a X
        //board[x][y] = index; // print index of the line
        lastFilled.push({x,y, i: index});
        movesLeft--; // remove one from the global max moves
        move = getMoves(from, from === 'CENTER' ? 4 : 1); // all nodes can move one except the center that can create the 4 initial nodes
        move.forEach((m) => {
            switch(m) {
                case 'TOP':
                    fill(top({x,y}), 'TOP', index + 1);
                    break;
                case 'RIGHT':
                    fill(right({x,y}), 'RIGHT', index + 1);
                    break;
                case 'BOTTOM':
                    fill(bottom({x,y}), 'BOTTOM', index + 1);
                    break;
                case 'LEFT':
                    fill(left({x,y}), 'LEFT', index + 1);
                    break;
            }
        });

        //debug
        if(index > biggestIndex) {
            biggestIndex = index;
        }
    }
}

function fillMinimum() {
    lastFilled.reverse();
    for(let node of lastFilled) {
        if(!node){
            return;
        }
        const x = node.x;
        const y = node.y;
        let area = [
            valid(top({x,y})),
            valid(right({x,y})),
            valid(bottom({x,y})),
            valid(left({x,y}))];
        area = shuffleArray(area);
        for(let move of area) {
            if(move) {
                return fill(move, 'CENTER');
            }
        }
    }
}

// test one
/* console.time("runTime");
fill(center(), 'CENTER');
console.timeEnd("runTime");
console.log(`Moves Left: ${movesLeft}\nBiggest Line: ${biggestIndex}`);
console.log(board.map((l) => l.join('|'))); */

// test multiple
for(_ in '_'.repeat(20)) {
    fill(center(), 'CENTER');
    if (movesLeft && movesLeft > minimum) {
        do{
            fillMinimum();
        } while(movesLeft > minimum);
    }
    console.log(`Left: ${movesLeft}\nBiggest Line: ${biggestIndex}`)
    console.log(board.map((l) => l.join('|')));
    var board = boardInit.map(function(arr) {
        return arr.slice();
    });
    movesLeft = 20;
    biggestIndex = 0;
}
