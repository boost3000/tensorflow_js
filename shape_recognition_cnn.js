const tf = require('@tensorflow/tfjs-node');
const ToolsImage = require('./ToolsImage.js');

(async () => {
    try {
        const image_size = 32;
        const load_model = false;

        let model;
        if (load_model) {
            model = await tf.loadLayersModel('file://my-model-shape/model.json');
        } else {
            model = createConvModel(image_size);


            const data = [];
            const labels = [];
            for (let i = 0; i < 50; ++i) {
                const {shape, image_data} = ToolsImage.createRandomShape2d(image_size);
                const label_vector = ToolsImage.createCorrectAnswerVector(shape);
                data.push(image_data);
                labels.push(label_vector);
            }
            const xs = tf.tensor(data).expandDims(-1);
            const ys = tf.tensor(labels);
            await model.fit(xs, ys, {
                batchSize: 20,
                epochs: 100,
                callbacks: tf.callbacks.earlyStopping({monitor: 'loss', patience: 50}),
            });
        }


        let ct_total = 0;
        let ct_correct = 0;
        for (const shape of ['square', 'triangle', 'circle']) {
            for (let force_offset_x = -7; force_offset_x <= 7; ++force_offset_x) {
                for (let force_offset_y = -7; force_offset_y <= 7; ++force_offset_y) {
                    const image_data = ToolsImage.createShape2d(image_size, shape, force_offset_x, force_offset_y);
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


function createConvModel(image_size) {
    const model = tf.sequential();
    model.add(tf.layers.conv2d({
        inputShape: [image_size, image_size, 1],
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
