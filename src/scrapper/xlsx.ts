const fs = require('fs')
const XLSX = require('xlsx')

// Sample JSON data

const createSheet = async (
  jsonData: unknown,
  filename: string = 'data.xlsx'
) => {
  console.log(jsonData, 'jsonData-')
  // Convert JSON to worksheet
  const worksheet = XLSX.utils.json_to_sheet(jsonData)

  // Create a workbook and add the worksheet
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1')

  // Write the workbook to a file
  const filePath = filename
  XLSX.writeFile(
    workbook,
    filePath,
    { bookType: 'xlsx', type: 'file' },
    (err: Error) => {
      if (err) {
        console.error('Error writing file:', err)
      } else {
        console.log(`File "${filePath}" created successfully.`)
      }
    }
  )
}

export { createSheet }
