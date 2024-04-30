import puppeteer from 'puppeteer-extra'
import Stealth from 'puppeteer-extra-plugin-stealth'
import { getReviews } from './scrapper'

puppeteer.use(Stealth())
const args = process.argv

console.info('Application started')

const url: string = args[2]
getReviews(url)

export { puppeteer }
