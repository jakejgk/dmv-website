import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone';
import * as XLSX from "xlsx";

function DragDropExcel({ setWorksheet, setUploadedFileJSON }) {

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    accept: '.xlsx',
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file) {
        const reader = new FileReader()

        reader.onabort = () => console.log('file reading was aborted')
        reader.onabort = () => console.log('file reading was aborted')
        reader.onload = () => {
          const binaryStr = reader.result;
          const newWorkbook = XLSX.read(binaryStr, { type: 'binary' });

          setWorksheet(newWorkbook.Sheets.Sheet1)
          const jsonData = XLSX.utils.sheet_to_json(newWorkbook.Sheets.Sheet1)
          setUploadedFileJSON(jsonData)
        }
        reader.readAsBinaryString(file)
      }
    }
  });

  return (
    <div
      {...getRootProps()}
      className={`p-4 border-2 border-dashed cursor-pointer ${
        isDragActive ? 'border-blue-500' : 'border-gray-300'
      }`}
    >
      <input {...getInputProps()} />
      {isDragActive ? (
        <p className="text-blue-500">Drop the Excel file here</p>
      ) : (
        <p>Drag and drop an Excel file here, or click to browse</p>
      )}
    </div>
  );
}
 export default DragDropExcel