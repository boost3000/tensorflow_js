const tf = require('@tensorflow/tfjs-node');
const ratings = require('./datasets/ratings_titles_preprocessed.json');
// const ratings = require('./datasets/ratings_texts_preprocessed.json');
const natural = require("natural");
const ToolsPreprocess = require('./ToolsPreprocess.js');


(async () => {
    try {
        const texts = ratings.map(item => item.text);
        const labels = ratings.map(item => item.label);

        // Tokenize and preprocess the text data
        const tokenizer = new natural.WordTokenizer();
        const tokenizedTexts = texts.map(text => tokenizer.tokenize(text));

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

        const model = await tf.loadLayersModel('file://my-model-trustpilot-titles/model.json');
        // const model = await tf.loadLayersModel('file://my-model-trustpilot-texts/model.json');


        // Predict new data
        console.log();
        const test_sentences = require('./datasets/tests.json');
        const ct_total = test_sentences.length;
        let ct_correct = 0;
        for (const {text, label} of test_sentences) {
            const text_sanitized = ToolsPreprocess.sanitizeText(text);
            const tokenized_sentence = tokenizer.tokenize(text_sanitized);
            const binarized_sentence = tokenized_sentence.map(token => vocabulary.indexOf(token)).map(el => el < 0 ? 0 : el);
            const paddedSequence = binarized_sentence.concat(new Array(maxSequenceLength - binarized_sentence.length).fill(vocabulary.indexOf(PAD_TOKEN)));
            const inputTensor = tf.tensor2d([paddedSequence, paddedSequence]);
            const prediction_tensor = model.predict(inputTensor);
            inputTensor.dispose();
            const prediction_array = await prediction_tensor.array();
            prediction_tensor.dispose();
            const prediction = prediction_array[0][0];
            const prediction_fixed = prediction > 0.5 ? 1 : 0;
            if (prediction_fixed === label) {
                ++ct_correct;
            } else {
                console.log('failed:', text, `(${prediction.toFixed(2)})`);
            }
        }
        console.log(`accuracy: ${ct_correct} / ${ct_total} (${(ct_correct / ct_total * 100).toFixed(2)}%)`);

    } catch (e) {
        console.log(e);
    } finally {
        process.exit();
    }
})();




