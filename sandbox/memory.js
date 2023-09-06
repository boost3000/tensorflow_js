const tf = require('@tensorflow/tfjs-node');

(async () => {
    try {
        const tensor1 = tf.tensor([1, 2, 3]);
        const tensor2 = tf.tensor([1, 2, 3]);
        const data = [tensor1, tensor2];
        const stack = tf.stack(data);
        console.log(stack);
        console.log(tf.memory());
    } catch (e) {
        console.log(e);
    } finally {
        process.exit();
    }
})();
