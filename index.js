const { chromium, firefox, webkit } = require('playwright');

const colors = {
    reset: "\x1b[0m",
    red: "\x1b[31m",
    green: "\x1b[32m",
    yellow: "\x1b[33m",
    blue: "\x1b[34m",
};

const config = {
    targetUrl: 'https://minyakatsiri1405.blogspot.com/',
    browserType: 'chromium',
    numIterations: 10,
    delayBetweenActionsMs: 20000,
    clickSelector: ['h2.post-title a[href]','a.read-more'],
    headless: true,
    userAgents: [
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.127 Safari/537.36',
		'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.54 Safari/537.36',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36 Edg/119.0.0.0',
		'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.5 Safari/604.1',

    ]
};

async function autoPageViewAndClick() {
    console.log(colors.blue + 'Memulai alat otomatisasi...' + colors.reset);
    let browser;
    let browserInstance;

    try {
        switch (config.browserType) {
            case 'firefox':
                browserInstance = firefox;
                break;
            case 'webkit':
                browserInstance = webkit;
                break;
            case 'chromium':
            default:
                browserInstance = chromium;
                break;
        }

        browser = await browserInstance.launch({
            headless: config.headless,
        });

        for (let i = 0; i < config.numIterations; i++) {
            const page = await browser.newPage();

			const randomUserAgent = config.userAgents[Math.floor(Math.random() * config.userAgents.length)];
            await page.setExtraHTTPHeaders({ 'User-Agent': randomUserAgent });

            console.log(colors.yellow + `\n--- Iterasi ${i + 1}/${config.numIterations} ---` + colors.reset);
            console.log(`Menggunakan User-Agent: ${colors.blue +randomUserAgent+colors.reset}`);
            console.log(`Mengunjungi: ${colors.blue+config.targetUrl+colors.reset}`);

            await page.goto(config.targetUrl, { waitUntil: 'networkidle' });

            console.log(`Halaman ${colors.green+config.targetUrl+colors.reset} berhasil dimuat.`);

            if (config.clickSelector && config.clickSelector.length > 0) {
                const randomSelector = config.clickSelector[Math.floor(Math.random() * config.clickSelector.length)];
                console.log(colors.yellow + `Mencoba mengklik selector acak: ${randomSelector}` + colors.reset);

                await page.waitForSelector(randomSelector, { state: 'visible' });

                const elements = await page.$$(randomSelector);

                if (elements.length > 0) {
                    const randomElement = elements[Math.floor(Math.random() * elements.length)];
                    const tagName = await randomElement.evaluate(el => el.getAttribute('href'));
                    await randomElement.click();

                    console.log(`Klik pada ${colors.green+tagName+colors.reset} secara acak berhasil!`);

                    await page.waitForTimeout(3000);
                } else {
                    console.log(`Tidak ada elemen yang cocok dengan selector: ${colors.reset+randomSelector+colors.reset}`);
                }
            } else {
                console.log(colors.red + 'Array clickSelector kosong atau tidak ada.' + colors.reset);
            }

            const initialUrl = page.url();

            if (config.clickSelector && config.clickSelector.length > 0) {
                const randomSelector = config.clickSelector[Math.floor(Math.random() * config.clickSelector.length)];
                console.log(`Mencoba mengklik selector acak: ${colors.blue+randomSelector+colors.reset}`);

                try {
                    await page.waitForSelector(randomSelector, { state: 'visible', timeout: 5000 });

                    const elements = await page.$$(randomSelector);

                    if (elements.length > 0) {
                        const randomElement = elements[Math.floor(Math.random() * elements.length)];
                    	const tagName = await randomElement.evaluate(el => el.getAttribute('href'));
                        await randomElement.click();

                        console.log(`Klik pada ${colors.green+tagName+colrs.reset} secara acak berhasil!`);
                        await page.waitForTimeout(3000);
                    } else {
                        console.log(colors.red + `Tidak ada elemen yang cocok dengan selector: ${randomSelector}` + colors.reset);
                    }
                } catch (e) {
                    console.log(colors.red + `Gagal mengklik elemen: ${e.message}` + colors.reset);
                }
            }

            if (page.url() !== initialUrl) {
                console.log(`Halaman berpindah. Kembali ke ${colors.blue+initialUrl+colors.reset} (halaman awal) untuk iterasi berikutnya.`);
                await page.goto(initialUrl);
                await page.waitForLoadState('load');
            }

            await page.close();

            if (i < config.numIterations - 1) {
                console.log(`Menunggu ${colors.blue+config.delayBetweenActionsMs / 1000+colors.reset} detik sebelum iterasi berikutnya...`);
                await new Promise(resolve => setTimeout(resolve, config.delayBetweenActionsMs));
            }
        }

    } catch (error) {
        console.error(colors.red + 'Terjadi kesalahan fatal selama eksekusi:', error + colors.reset);
    } finally {
        if (browser) {
            await browser.close();
            console.log(colors.blue + 'Browser ditutup.' + colors.reset);
        }
    }
}

autoPageViewAndClick();
