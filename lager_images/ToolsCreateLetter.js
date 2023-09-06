const fs = require('fs');
const {createCanvas} = require('canvas');
const PngJS = require('png-js');

module.exports = {
};

// createLettersPNG('a');
// const answer = createCorrectAnswerSingleLetter('z');
// console.log(answer);

// PngJS.decode('test.png', pixels => console.log(JSON.stringify(pixels)));



function createCorrectAnswerSingleLetter(letter) {
    const alphabet = 'abcdefghijklmnopqrstuvwxyz';
    const answer = new Array(alphabet.length).fill(0);
    const pos = alphabet.indexOf(letter);
    answer[pos] = 1;
    return answer;
}

function createLettersPNG(word) {
    const width = 32 * word.length;
    const height = 32;

    const canvas = createCanvas(width, height);
    const context = canvas.getContext('2d');

    context.fillStyle = '#fff';
    context.fillRect(0, 0, width, height);

    context.font = 'bold 16pt Menlo';
    context.textAlign = 'center';
    context.textBaseline = 'top';
    context.fillStyle = '#000';

    context.fillText(word.toUpperCase(), width / 2, 0);

    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync('./test.png', buffer);
}


