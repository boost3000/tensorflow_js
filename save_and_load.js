const tf = require('@tensorflow/tfjs-node');

(async () => {
    try {
        // Create a simple model.
        // const model = tf.sequential();
        // model.add(tf.layers.dense({units: 1, inputShape: [1]}));

        // const input = tf.input({shape: [1]});
        // const dense = tf.layers.dense({units: 1}).apply(input);
        // const model = tf.model({inputs: input, outputs: dense});
        //
        // // Prepare the model for training: Specify the loss and the optimizer.
        // model.compile({loss: 'meanSquaredError', optimizer: 'sgd'});
        //
        // // Generate some synthetic data for training. (y = 2x - 1)
        // const xs = tf.tensor2d([-1, 0, 1, 2, 3, 4], [6, 1]);
        // const ys = tf.tensor2d([-3, -1, 1, 3, 5, 7], [6, 1]);
        //
        // // Train the model using the data.
        // await model.fit(xs, ys, {epochs: 1000});

        // Use the model to do inference on a data point the model hasn't seen.
        // Should print approximately 39.
        // await model.save('file://my-model');

        const model = await tf.loadLayersModel('file://my-model/model.json');
        const answer = await model.predict(tf.tensor2d([20], [1, 1])).data();
        console.log(answer);
    } catch (e) {
        console.log(e);
    } finally {
        process.exit();
    }
})();

