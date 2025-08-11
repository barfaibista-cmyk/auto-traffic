const { test, expect } = require('@playwright/test');

const config = {
    targetUrl: 'https://minyakatsiri1405.blogspot.com/',
    clickSelector: ['.post-title a[href]','a.read-more'],
};

test('should navigate to targetUrl and click a link', async ({ page }) => {

	await page.goto(config.targetUrl);
	await expect(page).toHaveTitle(/Lembaran Kertas/);

	let elementFoundAndClicked = false;
    let clickedHref = '';

    for (const selector of config.clickSelector) {
        console.log(`Mencoba mencari selector: ${selector}`);
        const elements = await page.$$(selector);

        if (elements.length > 0) {
            console.log(`Elemen ditemukan dengan selector: ${selector}`);
            const randomElement = elements[Math.floor(Math.random() * elements.length)];

            clickedHref = await randomElement.evaluate(el => el.getAttribute('href'));

            await randomElement.click();
            elementFoundAndClicked = true;
            break;
        } else {
            console.log(`Tidak ada elemen yang cocok dengan selector: ${selector}`);
        }
    }

    expect(elementFoundAndClicked).toBeTruthy();

	const expectedUrl = new URL(clickedHref, config.targetUrl).href;
    await expect(page).toHaveURL(expectedUrl);
});
