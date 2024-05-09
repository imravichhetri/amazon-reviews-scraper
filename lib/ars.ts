#!/usr/bin/env node

import { getReviews } from '../src/scrapper'
import { createSheet } from '../src/scrapper/xlsx'

const args = process.argv

console.info('Application started')
if (args.length < 2) {
  console.error('URL expected as second argument')
  process.exit(1)
}
if (args.length < 3) {
  console.info('Expected path, exporting as data.xlsx')
}
const url: string = args[2]

getReviews(url).then((json) => {
  createSheet(json, 'data.xlsx')
})
