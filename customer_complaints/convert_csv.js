const csvtojsonV2 = require("csvtojson/v2");


(async () => {
    try {
        const jsonArray = await csvtojsonV2().fromFile('./consumer_complaints.csv');
        // console.log(jsonArray);
        const products = {};
        const companies = {};
        const jsonArrayFiltered = jsonArray.map(el => {
            products[el['Product']] = (products[el['Product']] || 0) + 1;
            companies[el['Company']] = (companies[el['Company']] || 0) + 1;
            return {product: el['Product'], company: el['Company'], complaint: el['Consumer complaint narrative']};
        });
        console.log(jsonArrayFiltered);
        console.log(products);
        console.log(companies);
    } catch (e) {
        console.log(e);
    } finally {
        process.exit();
    }
})();
