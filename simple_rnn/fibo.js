const tf = require('@tensorflow/tfjs-node');


(async () => {
    try {

        const model = createRnn();

        // Generate example training data
        const sequenceLength = 5;
        const numExamples = 1000;

        const [inputTensor, outputTensor] = createTrainingData(sequenceLength, numExamples);

        // Train the model
        await model.fit(inputTensor, outputTensor, {
            batchSize: 20,
            epochs: 100,
        });
        inputTensor.dispose();
        outputTensor.dispose();
        // console.log(tf.memory());


        // const inputSequence = [0.5, 0.8, 1.3, 2.1, 3.4];
        const inputSequence = [1, 1, 1, 1, 1];
        const sequence = inputSequence.map(num => [num]);
        const sequenceTensor = tf.tensor3d([sequence]);
        const prediction = model.predict(sequenceTensor);
        sequenceTensor.dispose();
        const predictedNumber = prediction.dataSync()[0];
        prediction.dispose();

        console.log('Predicted next number:', predictedNumber);
    }catch (e) {
        console.log(e);
    } finally {
        process.exit();
    }
})();


function createTrainingData(sequenceLength, numExamples) {
    const input = [];
    const output = [];
    for (let i = 0; i < numExamples; i++) {
        const sequence = generateSequence(sequenceLength + 1);
        const inputSequence = sequence.slice(0, sequence.length - 1);
        const target = sequence[sequence.length - 1];

        input.push(inputSequence.map(num => [num])); // Wrap each number in an array
        output.push([target]);
    }
    // console.dir({input}, {depth: null});
    // console.dir({output}, {depth: null});

    const inputTensor = tf.tensor3d(input);
    const outputTensor = tf.tensor2d(output);
    return [inputTensor, outputTensor];
}


function generateSequence(length) {
    const sequence = [Math.random(), Math.random()];
    for (let i = 2; i < length; i++) {
        sequence.push(sequence[i - 1] + sequence[i - 2]); // Next number is the sum of the previous two
    }
    return sequence;
}


function createRnn() {
    // Define the RNN model architecture
    const model = tf.sequential();
    model.add(tf.layers.simpleRNN({
        units: 10,          // Number of recurrent units (hidden neurons)
        inputShape: [5, 1], // Input shape: sequence length of 5, each with 1 feature
        activation: 'relu'
    }));
    model.add(tf.layers.dense({
        units: 1,           // Output 1 number for prediction
        activation: 'linear'
    }));
    // Compile the model
    model.compile({
        optimizer: 'adam',
        loss: 'meanSquaredError'
    });
    return model;
}

