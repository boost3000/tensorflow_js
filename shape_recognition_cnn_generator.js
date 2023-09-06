const tf = require('@tensorflow/tfjs-node');
const ToolsImage = require('./ToolsImage.js');
const IMAGE_SIZE = 32;

(async () => {
    try {
        const load_model = false;

        let model;
        if (load_model) {
            model = await tf.loadLayersModel('file://my-model-shape/model.json');
        } else {
            model = createConvModel();

            const data_pairs = tf.data.generator(dataPairs);
            const ds = data_pairs.shuffle(10).batch(10);

            await model.fitDataset(ds, {
                batchesPerEpoch: 5,
                epochs: 10,
            });
        }


        let ct_total = 0;
        let ct_correct = 0;
        for (const shape of ['square', 'triangle', 'circle']) {
            for (let force_offset_x = -7; force_offset_x <= 7; ++force_offset_x) {
                for (let force_offset_y = -7; force_offset_y <= 7; ++force_offset_y) {
                    const image_data = ToolsImage.createShape2d(IMAGE_SIZE, shape, force_offset_x, force_offset_y);
                    const inputImage = tf.tensor([image_data]).expandDims(-1);
                    const answer_array = (await model.predict(inputImage).array())[0];
                    const answer = ToolsImage.getShapeFromAnswer(answer_array);
                    ++ct_total;
                    if (shape === answer) {
                        ++ct_correct;
                    }
                }
            }
        }
        if (ct_correct === ct_total) {
            await model.save('file://my-model-shape');
        }
        console.log();
        console.log(`accuracy: ${ct_correct} / ${ct_total} (${(ct_correct / ct_total * 100).toFixed(2)}%)`);
    } catch (e) {
        console.log(e);
    } finally {
        process.exit();
    }
})();



async function* dataPairs() {
    for (let i = 0; i < 500; ++i) {
        const {shape, image_data} = ToolsImage.createRandomShape2d(IMAGE_SIZE);
        const label_vector = ToolsImage.createCorrectAnswerVector(shape);
        yield {xs: tf.tensor(image_data).expandDims(-1), ys: tf.tensor(label_vector)};
    }
}


function createConvModel() {
    const model = tf.sequential();
    model.add(tf.layers.conv2d({
        inputShape: [IMAGE_SIZE, IMAGE_SIZE, 1],
        filters: 16,
        kernelSize: 3,
        activation: 'relu',
    }));
    model.add(tf.layers.dropout({rate: 0.25}));
    model.add(tf.layers.maxPooling2d({poolSize: 2, strides: 2}));
    model.add(tf.layers.conv2d({kernelSize: 3, filters: 32, activation: 'relu'}));
    model.add(tf.layers.dropout({rate: 0.25}));
    model.add(tf.layers.maxPooling2d({poolSize: 2, strides: 2}));
    model.add(tf.layers.conv2d({kernelSize: 3, filters: 32, activation: 'relu'}));
    model.add(tf.layers.dropout({rate: 0.25}));
    model.add(tf.layers.flatten({}));
    model.add(tf.layers.dense({units: 64, activation: 'relu'}));
    model.add(tf.layers.dropout({rate: 0.25}));
    model.add(tf.layers.dense({units: 3, activation: 'softmax'}));
    model.compile({optimizer: 'adam', loss: 'categoricalCrossentropy', metrics: ['accuracy']});
    return model;
}
