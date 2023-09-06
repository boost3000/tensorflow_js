const tf = require('@tensorflow/tfjs-node');

(async () => {
    try {
        // const xs = tf.data.generator(data);
        // const ys = tf.data.generator(labels);
        // // We zip the data and labels together, shuffle and batch 32 samples at a time.
        // const ds = tf.data.zip({xs, ys}).shuffle(100 /* bufferSize */).batch(32);

        const data_pairs = tf.data.generator(dataPairs);
        const ds = data_pairs.shuffle(100).batch(32);


        const model = tf.sequential({
            layers: [
                tf.layers.dense({inputShape: [784], units: 32, activation: 'relu'}),
                tf.layers.dense({units: 10, activation: 'softmax'}),
            ]
        });
        model.compile({
            optimizer: 'sgd',
            loss: 'categoricalCrossentropy',
            metrics: ['accuracy']
        });

        await model.fitDataset(ds, {
            epochs: 100,
        });
    } catch (e) {
        console.log(e);
    } finally {
        process.exit();
    }
})();


function* dataPairs() {
    for (let i = 0; i < 100; i++) {
        // Generate one sample at a time.
        yield {xs: tf.randomNormal([784]), ys: tf.randomUniform([10])}
    }
}


function* data() {
    for (let i = 0; i < 100; i++) {
        // Generate one sample at a time.
        yield tf.randomNormal([784]);
    }
}

function* labels() {
    for (let i = 0; i < 100; i++) {
        // Generate one sample at a time.
        yield tf.randomUniform([10]);
    }
}


