const fs =require('fs');
const ToolsPreprocess = require('./ToolsPreprocess.js');


(async () => {
    try {
        // const ratings = require('./datasets/ratings_titles.json');
        const ratings = require('./datasets/ratings_texts.json');
        const ratings_sanitized = ratings.map(el => ({...el, text: ToolsPreprocess.sanitizeText(el['text'])}));
        const ratings_shuffled = ToolsPreprocess.shuffleArray(ratings_sanitized);
        // fs.writeFileSync('./datasets/ratings_titles_preprocessed.json', JSON.stringify(ratings_shuffled, null, 2));
        fs.writeFileSync('./datasets/ratings_texts_preprocessed.json', JSON.stringify(ratings_shuffled, null, 2));
    } catch (e) {
        console.log(e);
    } finally {
        process.exit();
    }
})();



