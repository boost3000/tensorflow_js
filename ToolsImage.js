module.exports = {
    createRandomShape,
    createRandomShape2d,
    createShape,
    createShape2d,
    plotShape,
    plotShape2d,
    createCorrectAnswerVector,
    getShapeFromAnswer,
};


// console.log(getShapeFromAnswer( [ 0.006891091465950012, 0.032398109324276447, 0.3076511025428772 ]));
// const data = createRandomShape(32);
// console.log(data);
// console.log(plotShape(data['image_data'], 32));
// console.log(JSON.stringify(createShape(32, 'square'), null, 2));
// console.log(createShape2d(32, 'square'));
// console.log(createShape(32, 'triangle'));
const circle = createShape(32, 'circle');
console.log(plotShape(circle, 32));


function createRandomShape(image_size) {
    const shapes = ['square', 'triangle', 'circle'];
    const shape = shapes[Math.floor(Math.random() * shapes.length)];
    return {shape, image_data: createShape(image_size, shape)};
}

function createRandomShape2d(image_size) {
    const shapes = ['square', 'triangle', 'circle'];
    const shape = shapes[Math.floor(Math.random() * shapes.length)];
    return {shape, image_data: createShape2d(image_size, shape)};
}

function createCorrectAnswerVector(shape) {
    switch (shape) {
        case 'square':
            return [1, 0, 0];
        case 'triangle':
            return [0, 1, 0];
        case 'circle':
            return [0, 0, 1];
    }
}

function getShapeFromAnswer(answer_array) {
    let max_i = 0;
    let max_val = 0;
    for (const [i, val] of answer_array.entries()) {
        if (val > max_val) {
            max_val = val;
            max_i = i;
        }
    }
    return ['square', 'triangle', 'circle'][max_i];
}

function randomOffset(image_size) {
    const limit = image_size / 4 - 1;
    return Math.floor(Math.random() * (2 * limit + 1) - limit);
}
function createShape(image_size, shape) {
    const offset_x = randomOffset(image_size);
    const offset_y = randomOffset(image_size);
    const data = [];
    switch (shape) {
        case 'square': {
            for (let y = 0; y < image_size; ++y) {
                for (let x = 0; x < image_size; ++x) {
                    if ((x - offset_x) >= image_size / 4 && (x - offset_x) < image_size * 3 / 4 && (y - offset_y) >= image_size / 4 && (y - offset_y) < image_size * 3 / 4) {
                        data.push(1);
                    } else {
                        data.push(0);
                    }
                }
            }
            break;
        }
        case 'triangle': {
            for (let y = 0; y < image_size; ++y) {
                for (let x = 0; x < image_size; ++x) {
                    if ((x - offset_x) >= image_size / 4 && (x - offset_x) < image_size * 3 / 4 && (y - offset_y) >= image_size / 4 && (y - offset_y) < image_size * 3 / 4 && (x - offset_x) + (y - offset_y) < image_size) {
                        data.push(1);
                    } else {
                        data.push(0);
                    }
                }
            }
            break;
        }
        case 'circle': {
            for (let y = 0; y < image_size; ++y) {
                for (let x = 0; x < image_size; ++x) {
                    const center = image_size / 2 - 0.5;
                    if (Math.sqrt((x - offset_x - center) ** 2 + (y - offset_y - center) ** 2) < image_size / 4) {
                        data.push(1);
                    } else {
                        data.push(0);
                    }
                }
            }
            break;
        }
        default: {
            throw 'illegal shape';
        }
    }
    return data;
}

function createShape2d(image_size, shape, force_offset_x = null, force_offset_y = null) {
    const offset_x = force_offset_x === null ? randomOffset(image_size) : force_offset_x;
    const offset_y = force_offset_x === null ? randomOffset(image_size) : force_offset_y;
    const data = [];
    switch (shape) {
        case 'square': {
            for (let y = 0; y < image_size; ++y) {
                const line = [];
                for (let x = 0; x < image_size; ++x) {
                    if ((x - offset_x) >= image_size / 4 && (x - offset_x) < image_size * 3 / 4 && (y - offset_y) >= image_size / 4 && (y - offset_y) < image_size * 3 / 4) {
                        line.push(1);
                    } else {
                        line.push(0);
                    }
                }
                data.push(line);
            }
            break;
        }
        case 'triangle': {
            for (let y = 0; y < image_size; ++y) {
                const line = [];
                for (let x = 0; x < image_size; ++x) {
                    if ((x - offset_x) >= image_size / 4 && (x - offset_x) < image_size * 3 / 4 && (y - offset_y) >= image_size / 4 && (y - offset_y) < image_size * 3 / 4 && (x - offset_x) + (y - offset_y) < image_size) {
                        line.push(1);
                    } else {
                        line.push(0);
                    }
                }
                data.push(line);
            }
            break;
        }
        case 'circle': {
            for (let y = 0; y < image_size; ++y) {
                const line = [];
                for (let x = 0; x < image_size; ++x) {
                    const center = image_size / 2 - 0.5;
                    if (Math.sqrt((x - offset_x - center) ** 2 + (y - offset_y - center) ** 2) < image_size / 4) {
                        line.push(1);
                    } else {
                        line.push(0);
                    }
                }
                data.push(line);
            }
            break;
        }
        default: {
            throw 'illegal shape';
        }
    }
    return data;
}

function plotShape(image_data, image_size) {
    let image = '';
    const data_length = image_data.length;
    for (let i = 0; i < data_length; i += image_size) {
        const line = image_data.slice(i, i + image_size);
        for (const pixel of line) {
            image += pixel ? 'X' : '-';
        }
        image += '\n';
    }
    return image;
}

function plotShape2d(image_data) {
    let image = '';
    for (const line of image_data) {
        for (const pixel of line) {
            image += pixel ? 'X' : '-';
        }
        image += '\n';
    }
    return image;
}



