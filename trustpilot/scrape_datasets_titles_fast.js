const puppeteer = require('puppeteer');
const fs = require('fs');
const all_ratings = [];


(async () => {
    try {
        const ratings_good = await scrapeRatings('good');
        const ratings_bad = await scrapeRatings('bad');
        all_ratings.push(...ratings_good);
        all_ratings.push(...ratings_bad);
        // fs.writeFileSync(`./datasets/ratings.json`, JSON.stringify(all_ratings, null, 2));
    } catch (e) {
        console.error(e);
    } finally {
        process.exit();
    }
})();


async function wait(ms) {
    return new Promise(r => setTimeout(r, ms));
}

async function scrapeRatings(sentiment) {
    const debug = true;
    const ratings = [];

    const browser = await puppeteer.launch({
        args: debug ? ['--start-maximized'] : ['--no-sandbox', '--window-size=1920,1080'],
        defaultViewport: null,
        headless: !debug
    });
    try {
        const second = 1000;
        let page = (await browser.pages())[0];
        const url = "https://de.trustpilot.com/review/heizungsdiscount24.de";
        console.log(`opening url: ${url}`);

        await page.goto(url);
        await wait(second);

        const cookies_decline = await page.waitForSelector('#onetrust-reject-all-handler');
        await cookies_decline.click();
        await wait(second);

        if (sentiment === 'good') {
            const five_stars = await page.waitForSelector('#star-filter-page-filter-five');
            await five_stars.click();
            while(ratings.length <= 500) {
                await wait(second * 5);
                const acc_ratings = await page.$$eval('div > div > main > div  section  article  h2', els => els.map(el => el['textContent']));
                for (const rating of acc_ratings) {
                    ratings.push({source: 'trustpilot', text: rating, label: 1});
                }
                const next_page = await page.waitForXPath(`//span[text()='Nächste Seite']`);
                await next_page.click();
            }
        }

        if (sentiment === 'bad') {
            const one_stars = await page.waitForSelector('#star-filter-page-filter-one');
            await one_stars.click();
            while(ratings.length <= 500) {
                await wait(second * 5);
                const acc_ratings = await page.$$eval('div > div > main > div  section  article  h2', els => els.map(el => el['textContent']));
                for (const rating of acc_ratings) {
                    ratings.push({source: 'trustpilot', text: rating, label: 0});
                }
                const next_page = await page.waitForXPath(`//span[text()='Nächste Seite']`);
                await next_page.click();
            }
        }
        return ratings;
    } catch (e) {
        console.log(e);
        return ratings;
    } finally {
        await browser.close();
    }
}
