const tf = require('@tensorflow/tfjs-node');
const fs = require('fs');


(async () => {
    try {

        //1. Load and Preprocess Data:
        const inputPath = './data.txt';
        const text = fs.readFileSync(inputPath, 'utf-8');
        const uniqueChars = [...new Set(text)];
        // console.log(uniqueChars);
        const numUniqueChars = uniqueChars.length;


        //2. Create Character Mapping:
        const charIndexMap = new Map();
        const indexCharMap = new Map();
        uniqueChars.forEach((char, index) => {
            charIndexMap.set(char, index);
            indexCharMap.set(index, char);
        });
        console.log('asd');
        // console.log({charIndexMap, indexCharMap});


        //3. Generate Training Data:
        const seqLength = 100; // Length of input sequences
        const stepSize = 3; // Step size for sliding window

        const sequences = [];
        const nextChars = [];

        for (let i = 0; i < text.length - seqLength; i += stepSize) {
            const seq = text.substring(i, i + seqLength);
            const nextChar = text[i + seqLength];
            sequences.push(seq);
            nextChars.push(nextChar);
        }


        //4. Create Training Data Tensors:
        const xs = sequences.map(seq => {
            const indices = seq.split('').map(char => charIndexMap.get(char));
            return indices; // Just the indices for each character in the sequence
        });
        // console.log(xs);
        const xsTensor = tf.tensor(xs).expandDims(-1); // Correct input shape

        const ys = nextChars.map(char => charIndexMap.get(char));
        const ysTensor = tf.oneHot(ys, numUniqueChars);


        //5. Build and Train the RNN Model:
        const model = tf.sequential();
        model.add(tf.layers.lstm({ units: 128, inputShape: [seqLength, 1] }));
        model.add(tf.layers.dense({ units: numUniqueChars, activation: 'softmax' }));
        model.compile({ optimizer: tf.train.adam(0.01), loss: 'categoricalCrossentropy' });

        await model.fit(xsTensor, ysTensor, { epochs: 5, batchSize: 64 });

        //6. Generate Text
        const seed = 'This is a'; // Starting seed text
        let generatedText = seed;

        for (let i = 0; i < 400; i++) {
            const inputSeq = generatedText.slice(-seqLength);
            const inputIndices = inputSeq.split('').map(char => charIndexMap.get(char));
            const inputTensor = tf.tensor2d(inputIndices, [1, seqLength]);
            const predictions = model.predict(inputTensor);
            const predictedIndex = tf.multinomial(predictions, 1).dataSync()[0];
            const predictedChar = indexCharMap.get(predictedIndex);
            generatedText += predictedChar;
        }

        console.log(generatedText);


    } catch (e) {
        console.log(e);
    } finally {
        process.exit();
    }
})();
