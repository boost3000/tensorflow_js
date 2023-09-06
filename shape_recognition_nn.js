const tf = require('@tensorflow/tfjs-node');
const ToolsImage = require('./ToolsImage.js');

(async () => {
    try {
        const image_size = 32;

        const model = createPerceptron();

        const data = [];
        const labels = [];
        for (let i = 0; i < 100; ++i) {
            const {shape, image_data} = ToolsImage.createRandomShape(image_size);
            const label_vector = ToolsImage.createCorrectAnswerVector(shape);
            data.push(image_data);
            labels.push(label_vector);
        }
        const xs = tf.tensor(data);
        const ys = tf.tensor(labels);

        // await model.fit(xs, ys, {
        //     epochs: 1000,
        //     callbacks: tf.callbacks.earlyStopping({monitor: 'acc', patience: 50}),
        // });

        const ct_tests = 2000;
        let ct_correct = 0;
        for (let i = 0; i < ct_tests; ++i) {
            const {shape, image_data} = ToolsImage.createRandomShape(image_size);
            // console.log(tf.tensor([image_data]));
            // process.exit();
            const answer_array = (await model.predict(tf.tensor([image_data])).array())[0];
            console.log(answer_array);
            process.exit();
            const answer = ToolsImage.getShapeFromAnswer(answer_array);
            if (shape === answer) {
                ++ct_correct;
            } else {
                // console.log(answer_array);
                // console.log(ToolsImage.plotShape(image_data, image_size));
            }
        }
        console.log(`${ct_correct} / ${ct_tests}`);
    } catch (e) {
        console.log(e);
    } finally {
        process.exit();
    }
})();


function createPerceptron() {
    const input = tf.input({shape: [1024]});
    const dense1 = tf.layers.dense({units: 8, activation: 'relu'}).apply(input);
    const dense2 = tf.layers.dense({units: 8, activation: 'relu'}).apply(dense1);
    const dense3 = tf.layers.dense({units: 3, activation: 'softmax'}).apply(dense2);
    const model = tf.model({inputs: input, outputs: dense3});
    model.compile({optimizer: 'rmsprop', loss: 'categoricalCrossentropy', metrics: ['accuracy']});
    return model;
}

