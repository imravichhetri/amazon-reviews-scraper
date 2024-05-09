// import { IReview } from './types'

// import * as XLSX from 'xlsx'

// /* load 'fs' for readFile and writeFile support */
// import * as fs from 'fs'

// XLSX.set_fs(fs)
// // Sample JSON data

// const createSheet = async (jsonData: IReview[], filename: string = 'data.xlsx') => {
//   // Convert JSON to worksheet
//   const worksheet = XLSX.utils.json_to_sheet<IReview>(jsonData)

//   // Create a workbook and add the worksheet
//   const workbook = XLSX.utils.book_new()
//   XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1')

//   // Write the workbook to a file
//   const filePath = filename
//   XLSX.writeFile(workbook, filePath, { bookType: 'xlsx', type: 'file' })
// }

// export { createSheet }

import { IReview } from './types'

const XLSX = require('xlsx')

// Sample JSON data

const createSheet = async (jsonData?: IReview[], filename: string = 'data.xlsx') => {
  if (!jsonData) throw new Error('Error Occured. No reviews found')
  // Convert JSON to worksheet
  const worksheet = XLSX.utils.json_to_sheet(jsonData)

  // Create a workbook and add the worksheet
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1')

  // Write the workbook to a file
  const filePath = filename
  XLSX.writeFile(workbook, filePath, { bookType: 'xlsx', type: 'file' }, (err: Error) => {
    if (err) {
      console.error('Error writing file:', err)
    } else {
      console.log(`File "${filePath}" created successfully.`)
    }
  })
}

export { createSheet }
