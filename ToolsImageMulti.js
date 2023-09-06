const ToolsImage = require('./ToolsImage.js');

module.exports = {
    createCorrectAnswerVector,
    createRandomShapesMulti,
};

// const {shape: shape1, image_data: image_data1} = ToolsImage.createRandomShape2d(32);
// const image_data2 = createEmptyImage(32);
// const {shape: shape3, image_data: image_data3} = ToolsImage.createRandomShape2d(32);
// const merged = merge3Images2d(image_data1, image_data2, image_data3);
// console.log(ToolsImage.plotShape2d(merged));

// const a = [1, 2, 3, 4, 5];
// console.log(shuffleArray(a));
// console.log(a);


// const mergedShape = createMergedShapes(32, ['circle', 'empty', 'triangle']);
// console.log(ToolsImage.plotShape2d(mergedShape));
// console.log(createCorrectAnswerVector(['circle', 'empty', 'empty']));

// const {shapes, image_data} = createRandomShapesMulti(32);
// console.log(shapes);
// console.log(ToolsImage.plotShape2d(image_data));

// console.log(calcNumImagesPossible());

function createRandomShapesMulti(image_size) {
    const shapes = shuffleArray(['square', 'triangle', 'circle', 'empty', 'empty', 'empty']).slice(0, 3);
    return {shapes, image_data: createMergedShapes(image_size, shapes)};
}

function createCorrectAnswerVector(shapes) {
    return [
        shapes.includes('square') ? 1 : 0,
        shapes.includes('triangle') ? 1 : 0,
        shapes.includes('circle') ? 1 : 0,
    ];
}

function createMergedShapes(image_size, shapes) {
    const images = [];
    for (const shape of shapes) {
        if (shape === 'empty') {
            images.push(createEmptyImage(image_size));
        } else {
            images.push(ToolsImage.createShape2d(image_size, shape));
        }
    }
    return merge3Images2d(...images);
}


function shuffleArray(arr) {
    return [...arr].sort(() => Math.random() - 0.5);
}

function merge3Images2d(image_data_1, image_data_2, image_data_3) {
    const data = [];
    for (let i = 0; i < image_data_1.length; ++i) {
        data.push([...image_data_1[i], ...image_data_2[i], ...image_data_3[i]]);
    }
    return data;
}

function createEmptyImage(image_size) {
    const data = [];
    for (let y = 0; y < image_size; ++y) {
        const line = [];
        for (let x = 0; x < image_size; ++x) {
            line.push(0);
        }
        data.push(line);
    }
    return data;
}

function calcNumImagesPossible() {
    const offsets = (7 * 2 + 1);
    const ct_zero_empty = 3 * 2 * (offsets ** 3);
    const ct_one_empty = 3 * 3 * 2 * (offsets ** 2);
    const ct_two_empty = 3 * 3 * (offsets ** 1);
    const ct_three_empty = 1;
    return ct_zero_empty + ct_one_empty + ct_two_empty + ct_three_empty;
}
