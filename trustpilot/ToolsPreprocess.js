module.exports = {
    shuffleArray,
    sanitizeText,
};


function shuffleArray(array) {
    //Fisher-Yates Shuffle
    const array_copy = [...array];
    for (let i = array_copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array_copy[i];
        array_copy[i] = array_copy[j];
        array_copy[j] = temp;
    }
    return array_copy;
}


function sanitizeText(text) {
    return text.toLowerCase()
        .replaceAll('ä', 'ae')
        .replaceAll('ö', 'oe')
        .replaceAll('ü', 'ue')
        .replaceAll('ß', 'ss');
}
