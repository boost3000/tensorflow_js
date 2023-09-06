const natural = require("natural");
const snowball = require('node-snowball');
const {removeStopwords, deu} = require('stopword');


module.exports = {
  textTokenizer,
};

console.log(textTokenizer('das ist nicht schwer oder?'));

function textTokenizer(text) {
    const removed_number_text = text.replace(/\d+/g, ' ');
    const wordTokenizer = new natural.WordTokenizer();
    const tokenized_text = wordTokenizer.tokenize(removed_number_text);
    const stopped_text = removeStopwords(tokenized_text, deu);
    const stemmed_text = snowball.stemword(stopped_text, 'german');
    return stemmed_text;
}


