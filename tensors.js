const tf = require('@tensorflow/tfjs-node');

{
    // Create a rank-2 tensor (matrix) matrix tensor from a multidimensional array.
    const a = tf.tensor([[1, 2], [3, 4]]);
    console.log('shape:', a.shape);
    a.print();
}

{
    // Or you can create a tensor from a flat array and specify a shape.
    const shape = [2, 2];
    const b = tf.tensor([1, 2, 3, 4], shape);
    console.log('shape:', b.shape);
    b.print();
}

{
    const a = tf.tensor([[1, 2], [3, 4]], [2, 2], 'int32');
    console.log('shape:', a.shape);
    console.log('dtype', a.dtype);
    a.print();
}

