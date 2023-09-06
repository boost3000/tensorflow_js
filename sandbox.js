const tf = require('@tensorflow/tfjs-node');

(async () => {
    await tf.setBackend('tensorflow')
    const backend = tf.getBackend();
    console.log(backend);
})();

