// Print command-line arguments

import puppeteer from 'puppeteer'
import * as cheerio from 'cheerio'
import { last } from 'cheerio/lib/api/traversing'

const getReviews = async (url: string) => {
  // The first two elements of process.argv are the Node.js executable path and the path to the script file
  // The actual command-line arguments start from index 2
  // const url: string = args.slice(2)
  console.log('Command-line arguments:', url)
  try {
    const browser = await puppeteer.launch({ headless: false })
    const page = await browser.newPage()

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

    // Wait for some time to ensure that the page content is updated
    await page.waitForSelector('#cm_cr-review_list') // Adjust wait time as needed

    // Extract data from the DOM
    let isNextButtonDisabled
    let nextButton
    let reviewDivList = []
    const htmlContent = await page.content()
    // nextButton = await page.$('.a-last')
    // isNextButtonDisabled = await page.$eval('.a-last', (button) =>
    //   button.classList.contains('a-disabled')
    // )
    isNextButtonDisabled = (await page.$('.a-last > a:first-child')) === null
    console.log(isNextButtonDisabled, 'isNextButtonDisabled')
    while (!isNextButtonDisabled) {
      console.info(isNextButtonDisabled, 'isNextButtonDisabled')
      const reviewDivs = await page.$$('[data-hook="review"]')
      reviewDivList.push(...reviewDivs)
      // nextButton = await page.$('.a-last>a:first-child')
      // const nextButtonHTML = await page.evaluate((link) => {
      //   // const element = document.querySelector('li.a-last.a-disabled') // Replace '.your-selector' with your desired CSS selector
      //   return link?.outerHTML
      // }, nextButton)
      // isNextButtonDisabled = await page.$('link.a-disabled')
      // isNextButtonDisabled = await page.evaluate(() =>
      //   document.querySelector('link.a-disabled')
      // )
      // const htmlContent = await page.evaluate(() => {
      //   const element = document.querySelector('.a-last>a:first-child') // Replace '.your-selector' with your desired CSS selector
      //   return element?.outerHTML
      // })
      // const nextButton = await page.$eval('.a-last', (button: Element) => {
      //   console.log(button, 'button')
      //   isNextButtonDisabled = button.classList.contains('a-disabled')
      //   return isNextButtonDisabled
      // })
      // await page.click('li.a-last')

      // if (!isNextButtonDisabled) {
      //   console.info('clicked')
      //   await page.click('li.a-last')
      // }
      // nextButton?.click()
      await page.click('.a-last>a:first-child')
      await page.waitForSelector('#cm_cr-review_list') // Adjust wait time as needed
      isNextButtonDisabled = (await page.$('.a-last > a:first-child')) === null
      console.log(reviewDivList.length, isNextButtonDisabled, 'nextButton')
    }

    console.info(reviewDivList, reviewDivList.length, 'reviewDivList')
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
  } catch (error) {
    console.error(error)
  }
}

export { getReviews }
