const sharp = require('sharp');
const fs = require("fs");
const path = require("path");
//03366-1531263
(async () => {
    try {
        const image_paths = getAllShipmentImagePaths();
        // console.log(image_paths);

        for (const image_path of image_paths) {
            const metadata = await sharp(image_path).metadata();
            // console.log(metadata);
            const {width, height} = metadata;
            console.log({width, height});
        }
    } catch (e) {
        console.log(e);
    } finally {
        process.exit();
    }
})();


function getAllShipmentImagePaths() {
    const image_paths = [];
    const base_path = '/home/raleo/documents';
    const base_dir_content = fs.readdirSync(base_path).filter(el => el.startsWith('RA-'));
    // console.log(base_dir_content);
    for (const ordernum of base_dir_content) {
        const order_path = path.join(base_path, ordernum);
        const order_dir_content = fs.readdirSync(order_path).filter(el => el.startsWith('raleo_home-7-'));
        // console.log(order_dir_content);
        for (const dispo of order_dir_content) {
            const dispo_path = path.join(order_path, dispo);
            // console.log(dispo_path);
            const dispo_dir_content = fs.readdirSync(dispo_path);
            // console.log(dispo_dir_content);
            for (const image of dispo_dir_content) {
                if (image.startsWith('shipment_')) {
                    const image_path = path.join(dispo_path, image);
                    image_paths.push(image_path);
                }
            }
        }
    }
    return image_paths;
}
