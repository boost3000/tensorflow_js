const tf = require('@tensorflow/tfjs-node');
// const ratings = require('./datasets/ratings_titles_preprocessed.json');
const ratings = require('./datasets/ratings_texts_preprocessed.json');
const natural = require("natural");


(async () => {
    try {
        const texts = ratings.map(item => item.text);
        const labels = ratings.map(item => item.label);

        // Tokenize and preprocess the text data
        const tokenizer = new natural.WordTokenizer();
        const tokenizedTexts = texts.map(text => tokenizer.tokenize(text));
        // console.log({tokenizedTexts});

        // Create a vocabulary from the tokenized texts
        const vocabulary = [];
        // Add a special token for padding
        const PAD_TOKEN = '<PAD>';
        vocabulary.push(PAD_TOKEN);
        for (const tokens of tokenizedTexts) {
            for (const token of tokens) {
                if (!vocabulary.includes(token)) {
                    vocabulary.push(token);
                }
            }
        }
        // Convert text to sequences of token indices
        const sequences = tokenizedTexts.map(tokens => tokens.map(token => vocabulary.indexOf(token)));
        // Pad sequences to a fixed length
        const maxSequenceLength = Math.max(...sequences.map(seq => seq.length));
        const paddedSequences = sequences.map(seq => {
            const paddingLength = maxSequenceLength - seq.length;
            return seq.concat(new Array(paddingLength).fill(vocabulary.indexOf(PAD_TOKEN)));
        });


        // Build the model
        const model = createModel(vocabulary.length, maxSequenceLength);

        // Train the model
        const xs = tf.tensor(paddedSequences);
        const ys = tf.tensor(labels);
        await model.fit(xs, ys, {
            batchSize: 100,
            epochs: 100,
            shuffle: true,
        });
        xs.dispose();
        ys.dispose();

        // await model.save('file://my-model-trustpilot-titles');
        await model.save('file://my-model-trustpilot-texts');
    } catch (e) {
        console.log(e);
    } finally {
        process.exit();
    }
})();


function createModel(inputDim, inputLength) {
    const model = tf.sequential();
    model.add(tf.layers.embedding({inputDim, outputDim: 16, inputLength}));
    model.add(tf.layers.flatten());
    model.add(tf.layers.dense({ units: 1, activation: 'sigmoid' }));
    model.compile({optimizer: 'adam', loss: 'binaryCrossentropy', metrics: ['accuracy']});
    return model;
}
