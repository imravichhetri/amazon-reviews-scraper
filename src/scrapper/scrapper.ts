// Print command-line arguments
import * as cheerio from 'cheerio'
import { puppeteer } from './puppeteer'

const getReviews = async (url: string) => {
  // The first two elements of process.argv are the Node.js executable path and the path to the script file
  // The actual command-line arguments start from index 2
  // const url: string = args.slice(2)
  console.log('Command-line arguments:', url)
  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox'],
    })
    let page = await browser.newPage()
    // const [page] = await browser.pages()

    // Navigate to a web page
    await page.goto(url)
    // await page.waitForNetworkIdle()
    await page.waitForSelector('#sp-cc-rejectall-link', { visible: true })
    await page.click('#sp-cc-rejectall-link')
    console.info('Clicked on the "Reject all" button')
    // Wait for some time to ensure that the page content is updated) // Adjust wait time as needed
    // Click on a button
    await page.waitForSelector('[data-hook="see-all-reviews-link-foot"]') // Adjust wait time as needed
    await page.click('[data-hook="see-all-reviews-link-foot"]')
    await page.waitForSelector('#cm_cr-review_list') // Adjust wait time as needed

    // Wait for some time to ensure that the page content is updated

    // Extract data from the DOM
    let isNextButtonDisabled
    let reviewList = []
    // nextButton = await page.$('.a-last')
    // isNextButtonDisabled = await page.$eval('.a-last', (button) =>
    //   button.classList.contains('a-disabled')
    // )
    isNextButtonDisabled = (await page.$('.a-last > a:first-child')) === null
    while (!isNextButtonDisabled) {
      await page.waitForSelector('.reviews-loading', { hidden: true })
      const result = await page.content()
      const $ = cheerio.load(result)

      // const reviewHTML = await page.$$eval(
      //   '[data-hook="review"] div.a-profile-content',
      //   (elems) => elems.map((elem) => elem.innerHTML)
      // )

      const reviews = $('[data-hook="review"]')
        .map((index, element) => {
          const countryRegex = /Reviewed in (.+?) on/
          const countryStr = $(element).find('[data-hook="review-date"]').text()

          const ratingRegex = /(.+?) out of 5 stars/
          const ratingStr = $(element)
            .find('i.review-rating .a-icon-alt')
            .text()
          return {
            name: $(element).find('.a-profile-name').text(),
            rating: ratingRegex.exec(ratingStr)?.[1],
            review_title: $(element)
              .find('[data-hook="review-title"] .cr-original-review-content')
              .text(),
            date: $(element)
              .find('[data-hook="review-date"]')
              .text()
              .split('on')?.[1]
              ?.trim(),
            country: countryRegex.exec(countryStr)?.[1],
            verified: $(element).find('[data-hook="avp-badge"]').text(),
            description: $(element)
              .find('[data-hook="review-body"] span:first-child')
              .text(),
          }
        })
        .get()

      reviewList.push(...reviews)
      console.log(reviews.length, 'reviews length')
      try {
        isNextButtonDisabled =
          (await page.$('.a-last > a:first-child')) === null
      } catch (error) {
        isNextButtonDisabled = true
      }

      // await page.screenshot({ path: 'screenshot.png' })

      if (!isNextButtonDisabled) {
        // await Promise.all([
        await page.click('.a-last>a:first-child')
        console.log(isNextButtonDisabled, 'isNextButtonDisabled')

        await page.waitForFunction(
          () => {
            const loadingElements = document.querySelector(
              'div.reviews-loading'
            )
            return loadingElements !== null
          },
          { timeout: 10000 }
        )
        // page.waitForSelector('[data-hook="review"] .a-profile-name'),
        // await page.waitForSelector('[data-hook="review"] div.a-profile-content') // Adjust wait time as needed
        // ])
      }
    }

    console.info(`Total ${reviewList.length} reviews fetched`)
    // Parse the HTML using Cheerio
    // const $ = cheerio.load(htmlContent)
    // console.info($.html(), '$')

    // Extract information from the updated DOM
    // const data = $('#someElement').text()

    // Output the extracted data
    // console.log(data)
    // console.log(data)

    // Close the browser
    await browser.close()

    return reviewList
  } catch (error) {
    console.error(error)
  }
}

export { getReviews }
