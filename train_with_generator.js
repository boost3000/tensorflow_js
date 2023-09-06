const tf = require('@tensorflow/tfjs-node');

(async () => {
    try {
        // Create a simple model.
        const model = tf.sequential();
        model.add(tf.layers.dense({units: 1, inputShape: [1]}));

        // Prepare the model for training: Specify the loss and the optimizer.
        model.compile({loss: 'meanSquaredError', optimizer: 'sgd'});

        // Generate some synthetic data for training. (y = 2x - 1)
        // const xs = tf.tensor2d([-1, 0, 1, 2, 3, 4], [6, 1]);
        // const ys = tf.tensor2d([-3, -1, 1, 3, 5, 7], [6, 1]);
        const xs = tf.data.generator(data);
        const ys = tf.data.generator(labels);
        // We zip the data and labels together, shuffle and batch 32 samples at a time.
        const ds = tf.data.zip({xs, ys});


        // Train the model using the data.
        // await model.fit(xs, ys, {epochs: 250});
        await model.fitDataset(ds, {epochs: 250});

        // Use the model to do inference on a data point the model hasn't seen.
        // Should print approximately 39.
        for (const question of [-3, 0.5, 5, 6]) {
            const answer = await model.predict(tf.tensor([question])).data();
            console.log({question, answer});
        }
    } catch (e) {
        console.log(e);
    } finally {
        process.exit();
    }
})();


function* data() {
    for (let i = -1; i < 5; i++) {
        // Generate one sample at a time.
        yield 2 * i - 1;
    }
}

function* labels() {
    for (let i = -1; i < 5; i++) {
        // Generate one sample at a time.
        yield i;
    }
}

