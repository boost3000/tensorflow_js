const sharp = require('sharp');
const tf = require('@tensorflow/tfjs-node');
const fs = require('fs');

const MOBILE_NET_INPUT_WIDTH = 224;
const MOBILE_NET_INPUT_HEIGHT = 224;
let mobilenet = undefined;


(async () => {
    try {
        const image_paths_webp = fs.readdirSync('./').filter(el => el.endsWith('.webp'));
        for (const image_path_webp of image_paths_webp) {
            await convertWebPToJPEG(image_path_webp);
        }
        const image_paths_jpeg = image_paths_webp.map(el => el.replaceAll('.webp', '.jpeg'));
        await loadMobileNet();

        for (const image_path_jpeg of image_paths_jpeg) {
            const image_uint8_array = await getImageUint8Array(image_path_jpeg);
            tf.tidy(() => {
                const image_tensor = tf.node.decodeImage(image_uint8_array);
                const image_tensor_resized = tf.image.resizeBilinear(image_tensor, [MOBILE_NET_INPUT_WIDTH, MOBILE_NET_INPUT_HEIGHT], true);
                const answer = mobilenet.predict(image_tensor_resized.expandDims());
                console.log(answer.shape);
                console.log(answer.arraySync());
            });
        }
    } catch (e) {
        console.log(e);
    } finally {
        process.exit();
    }
})();

async function getImageUint8Array(imagePath) {
    // Read the image using sharp
    const imageBuffer = await sharp(imagePath).toBuffer();
    // Convert the image buffer to a Uint8Array
    const imageUint8Array = new Uint8Array(imageBuffer);
    return imageUint8Array;
}

async function convertWebPToJPEG(inputPath) {
    try {
        // Read the WebP image and convert it to JPEG
        await sharp(inputPath)
            .toFormat('jpeg')
            .toFile(inputPath.replaceAll('.webp', '.jpeg'));
        console.log('Image converted successfully');
    } catch (err) {
        console.error('Error converting image:', err);
    }
}

async function loadMobileNet() {
    const URL = 'https://tfhub.dev/google/tfjs-model/imagenet/mobilenet_v3_small_100_224/feature_vector/5/default/1';
    console.log('loading model');
    mobilenet = await tf.loadGraphModel(URL, {fromTFHub: true});
    console.log('MobileNet v3 loaded successfully!');
}
