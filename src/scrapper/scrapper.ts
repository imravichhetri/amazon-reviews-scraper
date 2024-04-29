// Print command-line arguments

import puppeteer from 'puppeteer'
import * as cheerio from 'cheerio'
import fs from 'fs'

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
      await page.waitForSelector('.reviews-loading', { hidden: true })
      // const result = await page.content()
      const reviewDivs = await page.$$('[data-hook="review"]')
      // const profileDivs = await page.$$(
      //   'div.a-profile-content>span.a-profile-name'
      // )
      reviewDivList.push(...reviewDivs)
      // Parse the HTML using Cheerio
      // const $ = cheerio.load(result);
      // const $ = cheerio.load(await page.content())
      //   const $ = cheerio.load(`
      //   <ul>
      //     <li>One</li>
      //     <li>Two</li>
      //     <li class="blue sel">Three</li>
      //     <li class="red">Four</li>
      //   </ul>
      // `)
      //   const data = $.extract({
      //     releases: [
      //       {
      //         // First, we select individual release sections.
      //         selector: 'section',
      //         // Then, we extract the release date, name, and notes from each section.
      //         value: {
      //           // Selectors are executed whitin the context of the selected element.
      //           name: 'h2',
      //           date: {
      //             selector: 'relative-time',
      //             // The actual date of the release is stored in the `datetime` attribute.
      //             value: 'datetime',
      //           },
      //           notes: {
      //             selector: '.markdown-body',
      //             // We are looking for the HTML content of the element.
      //             value: 'innerHTML',
      //           },
      //         },
      //       },
      //     ],
      //   })
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
      await page.screenshot({ path: 'screenshot.png' })

      if (!isNextButtonDisabled) {
        // await Promise.all([
        await page.click('.a-last>a:first-child')
        // const url = await page.evaluate(async () => {
        //   const anchor = document.querySelector('.a-last > a:first-child')
        //   return (anchor as any)?.href
        // })
        // console.log(url, 'url-----')

        // await page.waitForSelector('div.reviews-loading') // Adjust wait time as needed
        // await page.waitForResponse((response) => {
        //   if (response.url().includes('https://www.amazon.de/hz/')) {
        //     console.log(response.url(), '----')
        //   }
        //   return response.url().includes('/reviews-render/ajax/reviews/')
        // })

        await page.waitForFunction(
          () => {
            const loadingElements = document.querySelector(
              'div.reviews-loading'
            )
            console.log(loadingElements, 'loadingElements')
            return loadingElements !== null
          },
          { timeout: 10000 }
        )
        // page.waitForSelector('[data-hook="review"] .a-profile-name'),
        // await page.waitForSelector('[data-hook="review"] div.a-profile-content') // Adjust wait time as needed
        // ])
        const reviewHTML = await page.$eval(
          '[data-hook="review"] div.a-profile-content',
          (elem) => elem.innerHTML
        )

        console.log(reviewHTML, 'after wait')
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
