import * as XLSX from 'xlsx'
import { IReview } from './types'

// Sample JSON data

const createSheet = async (jsonData?: IReview[], filename: string = 'data.xlsx') => {
  console.log(jsonData, 'jsonData-')
  if (!jsonData) throw new Error('Error Occured. No reviews found')
  // Convert JSON to worksheet
  const worksheet = XLSX.utils.json_to_sheet<IReview>(jsonData)

  // Create a workbook and add the worksheet
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1')

  // Write the workbook to a file
  const filePath = filename
  XLSX.writeFileAsync(filePath, workbook, { bookType: 'xlsx', type: 'file' }, () => {
    console.log(`File "${filePath}" created successfully.`)
  })
}

export { createSheet }
