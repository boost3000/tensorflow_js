const fs = require('fs');
const path = require('path');

(async () => {
    try {
        const image_paths = getAllShipmentImagePaths();
        console.log(image_paths);
    } catch (e) {
        console.log(e);
    } finally {
        process.exit();
    }
})();



