const sharp = require('sharp');
const tf = require('@tensorflow/tfjs-node');
const fs = require('fs');

const coco = require('@tensorflow-models/coco-ssd');


(async () => {
    try {
        const image_paths_webp = fs.readdirSync('./images').filter(el => el.endsWith('.webp')).map(el => `./images/${el}`);
        // console.log(image_paths_webp);
        for (const image_path_webp of image_paths_webp) {
            await convertWebPToJPEG(image_path_webp);
        }
        const image_paths_jpeg = fs.readdirSync('./images').filter(el => el.endsWith('.jpeg') || el.endsWith('.jpg')).map(el => `./images/${el}`);
        // console.log(image_paths_jpeg);
        // process.exit();

        const model = await coco.load({base: 'lite_mobilenet_v2'});

        for (const image_path_jpeg of image_paths_jpeg) {
            const image_uint8_array = await getImageUint8Array(image_path_jpeg);
            const image_tensor = tf.node.decodeImage(image_uint8_array);
            // const image_tensor_resized = tf.image.resizeBilinear(image_tensor, [MOBILE_NET_INPUT_WIDTH, MOBILE_NET_INPUT_HEIGHT], true);
            const answer = await model.detect(image_tensor);
            console.log(answer);

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
