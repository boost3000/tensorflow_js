const tf = require('@tensorflow/tfjs-node');
const ToolsImageMulti = require('./ToolsImageMulti.js');

(async () => {
    try {
        const image_size = 32;

        const model = createConvModel(image_size);


        const data = [];
        const labels = [];
        for (let i = 0; i < 1000; ++i) {
            const {shapes, image_data} = ToolsImageMulti.createRandomShapesMulti(image_size);
            const label_vector = ToolsImageMulti.createCorrectAnswerVector(shapes);
            data.push(image_data);
            labels.push(label_vector);
        }
        const xs = tf.tensor(data).expandDims(- 1);
        const ys = tf.tensor(labels);
        await model.fit(xs, ys, {
            epochs: 100,
            callbacks: tf.callbacks.earlyStopping({monitor: 'acc', patience: 50}),
        });
        // // await model.save('file://my-model-shape');
        // const model = await tf.loadLayersModel('file://my-model-shape/model.json');

        const ct_tests = 2000;
        let ct_correct = 0;
        for (let i = 0; i < ct_tests; ++i) {
            const {shapes, image_data} = ToolsImageMulti.createRandomShapesMulti(image_size);
            const inputImage = tf.tensor([image_data]).expandDims(-1);
            const prediction = (await model.predict(inputImage).array())[0];
            const prediction_fixed = prediction.map(el => el > 0.5 ? 1 : 0);
            const correct_answer = ToolsImageMulti.createCorrectAnswerVector(shapes);
            if (JSON.stringify(prediction_fixed) === JSON.stringify(correct_answer)) {
                ++ct_correct;
            }
        }
        console.log();
        console.log(`accuracy: ${ct_correct} / ${ct_tests} (${(ct_correct / ct_tests * 100).toFixed(2)}%)`);
    } catch (e) {
        console.log(e);
    } finally {
        process.exit();
    }
})();


function createConvModel(image_size) {
    const model = tf.sequential();
    model.add(tf.layers.conv2d({
        inputShape: [image_size, image_size * 3, 1],
        filters: 16,
        kernelSize: 3,
        activation: 'relu',
    }));
    model.add(tf.layers.maxPooling2d({poolSize: 2, strides: 2}));
    model.add(tf.layers.conv2d({kernelSize: 3, filters: 32, activation: 'relu'}));
    model.add(tf.layers.maxPooling2d({poolSize: 2, strides: 2}));
    model.add(tf.layers.conv2d({kernelSize: 3, filters: 32, activation: 'relu'}));
    model.add(tf.layers.flatten({}));
    model.add(tf.layers.dense({units: 64, activation: 'relu'}));
    model.add(tf.layers.dense({units: 3, activation: 'sigmoid'}));
    model.compile({optimizer: 'adam', loss: 'binaryCrossentropy', metrics: ['accuracy']});
    return model;
}
