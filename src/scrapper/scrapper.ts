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
    let page = await browser.newPage()

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
    let reviewDivList = []
    // nextButton = await page.$('.a-last')
    // isNextButtonDisabled = await page.$eval('.a-last', (button) =>
    //   button.classList.contains('a-disabled')
    // )
    isNextButtonDisabled = (await page.$('.a-last > a:first-child')) === null
    console.log(isNextButtonDisabled, 'isNextButtonDisabled')
    while (!isNextButtonDisabled) {
      console.info(isNextButtonDisabled, 'isNextButtonDisabled')
      const reviewDivs = await page.$$('[data-hook="review"]')
      // const profileDivs = await page.$$(
      //   'div.a-profile-content>span.a-profile-name'
      // )
      reviewDivList.push(...reviewDivs)
      const reviewHTML = await page.$$eval(
        '[data-hook="review"] div.a-profile-content',
        (elems) => elems.map((elem) => elem.innerHTML)
      )
      // const reviewHTML = await Promise.all(
      //   reviewDivs.map(
      //     async (elem) =>
      //       await page.evaluate(
      //         (el) =>
      //           document?.querySelector(
      //             '[data-hook="review"] div.a-profile-content'
      //           )?.innerHTML,
      //         // (el) => el?.querySelector('div.a-profile-content')?.innerHTML,
      //         elem
      //       )
      //   )
      // )
      // const reviewHTML = await page.evaluate(() => {
      //   // const
      //   // return (reviewDiv as any)?.map(
      //   //   (elem: any) => elem?.querySelector('.a-profile-content')?.innerHTML
      //   // )
      //   const innerHTMLs: any[] = []
      //   document
      //     .querySelectorAll('[data-hook="review"] div.a-profile-content')
      //     .forEach((elem: any) => {
      //       innerHTMLs.push(elem.innerHTML)
      //     })
      //   return innerHTMLs
      // })
      try {
        isNextButtonDisabled =
          (await page.$('.a-last > a:first-child')) === null
      } catch (error) {
        isNextButtonDisabled = true
      }

      console.log(
        reviewHTML,
        reviewDivList.length,
        isNextButtonDisabled,
        'nextButton'
      )

      if (!isNextButtonDisabled) {
        await page.click('.a-last>a:first-child')
        const url = await page.evaluate(async () => {
          const anchor = document.querySelector('.a-last > a:first-child')
          return (anchor as any)?.href
        })
        console.log(url, 'url-----')
        await page.waitForResponse((response) => {
          if (response.url().includes('https://www.amazon.de/hz/')) {
            console.log(response.url(), '----')
          }
          return response.url().includes('/reviews-render/ajax/reviews/')
        })
        // await page.waitForSelector('[data-hook="review"] div.a-profile-content') // Adjust wait time as needed
      }
    }

    console.info(reviewDivList.length, 'reviewDivList')
    // Parse the HTML using Cheerio
    // const $ = cheerio.load(htmlContent)
    // console.info($.html(), '$')

    // Extract information from the updated DOM
    // const data = $('#someElement').text()

    // Output the extracted data
    // console.log(data)
    // console.log(data)

    // Close the browser
    // await browser.close()
  } catch (error) {
    console.error(error)
  }
}

export { getReviews }
