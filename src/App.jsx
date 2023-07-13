import { useState, useCallback } from 'react'
import './App.css'
import DragDropExcel from './Components/DragDropExcel';
import axios from "axios";
import qs from "qs";
import { load } from "cheerio";
import * as XLSX from "xlsx"

function App() {
  const [uploadedFileJSON, setUploadedFileJSON] = useState(null)
  const [worksheet, setWorksheet] = useState(null)
  
  let newWorkbook;

  async function makeRequest() {

    for (let i = 0; i < uploadedFileJSON.length; i++) {
      const min = 3000;
      const max = 7000;
      const randomDelay = Math.floor(Math.random() * (max - min + 1)) + min;

      let customerFirstName = uploadedFileJSON[i].CustomerFirstName
      let customerLastName = uploadedFileJSON[i].CustomerLastName
      let customerDOB = uploadedFileJSON[i].CustomerDOB
      let customerIDNumber = uploadedFileJSON[i].CustomerIDNumber
      if (customerIDNumber.toString().length === 8) {
        customerIDNumber = '0' + customerIDNumber
      }
    
      let data = qs.stringify({
        'CustomerFirstName': customerFirstName,
        'CustomerLastName': customerLastName,
        'CustomerDOB': customerDOB,
        'CustomerIDNumber': customerIDNumber,
        'submitButton': 'Continue' 
      });
    
      let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'http://localhost:3001/proxy/Compliance/Individual',
        headers: { 
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: data
      };  
    
      await axios.request(config)
      .then((response) => {
        const html = response.data;
        const $ = load(html);
        let textNoIssues = $('.GroupRoundCorderDIV table tr td .instructionBold span').text();
        if (textNoIssues.length > 0) {
          textNoIssues = 'Good'
        }
        const textWithIssues = $('.instructionBold p').text()
        console.log(customerFirstName + ' ' + customerLastName + ': ' + textNoIssues + textWithIssues)
        let added = i + 2;
        let cellRef = 'E' + added.toString()
        if (!worksheet[cellRef]) {
          worksheet[cellRef] = {};
        }
        worksheet[cellRef].v = textNoIssues + textWithIssues
      })
      .catch((error) => {
        console.log(error);
      });
      await new Promise(resolve => setTimeout(resolve, randomDelay));
    }
    newWorkbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(newWorkbook, worksheet, "Sheet1")
    
    console.log("All [" + uploadedFileJSON.length + "] people were checked for issues in CT.")
  }

  const downloadWorkbook = () => {
    // Generate XLSX file from workbook object
    const wbout = XLSX.write(newWorkbook, { bookType: 'xlsx', bookSST: true, type: 'binary' });
  
    // Create a Blob object from the binary string data
    const blob = new Blob([s2ab(wbout)], { type: 'application/octet-stream' });
  
    // Create a download link and click it
    let url = window.URL.createObjectURL(blob);
    let a = document.createElement('a');
    a.href = url;
    a.download = 'IssueCheckCompleted.xlsx';
    a.click();
  };
  
  // Utility function to convert a string to an array buffer
  function s2ab(s) {
    const buf = new ArrayBuffer(s.length);
    const view = new Uint8Array(buf);
    for (let i = 0; i !== s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
    return buf;
  }


  function handleClick() {
    uploadedFileJSON ? makeRequest() : ''
  }

  return (
    <>
      <div className='flex flex-col items-center space-y-6 bg-color5 h-screen'>
        <h1 className='text-5xl mt-16 title text-color1'>CHECK FOR COMPLIANCE ISSUES</h1>
        <DragDropExcel 
          setWorksheet={setWorksheet}
          setUploadedFileJSON={setUploadedFileJSON}
        />
        <button className='border border-color2 rounded-md py-2 px-4 hover:bg-color4 focus:outline-none focus:ring-2 focus:ring-gray-300' onClick={handleClick}>Check for Issues</button>
        <button className='border border-color2 rounded-md py-2 px-4 hover:bg-color4 focus:outline-none focus:ring-2 focus:ring-gray-300' onClick={downloadWorkbook}>Download Workbook</button>
      </div>
    </>
  )
}

export default App
