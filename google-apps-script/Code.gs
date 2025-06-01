// Configuration
const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID'; // Replace with your Google Sheet ID
const SHEET_NAME = 'RSVP Responses';

// Function to handle form submissions
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_NAME);
    
    // Add timestamp
    const timestamp = new Date();
    
    // Prepare row data
    const rowData = [
      timestamp,
      data.name,
      data.email,
      data.guestCount,
      data.message || '',
      'Pending' // Status column
    ];
    
    // Append data to sheet
    sheet.appendRow(rowData);
    
    // Return success response
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      message: 'RSVP submitted successfully'
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    // Return error response
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

// Function to get all RSVP entries
function doGet() {
  try {
    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_NAME);
    const data = sheet.getDataRange().getValues();
    
    // Skip header row and format data
    const entries = data.slice(1).map(row => ({
      timestamp: row[0],
      name: row[1],
      email: row[2],
      guestCount: row[3],
      message: row[4],
      status: row[5]
    }));
    
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      entries: entries
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

// Function to create the sheet if it doesn't exist
function createSheetIfNotExists() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  let sheet = ss.getSheetByName(SHEET_NAME);
  
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    // Add headers
    sheet.appendRow([
      'Timestamp',
      'Name',
      'Email',
      'Guest Count',
      'Message',
      'Status'
    ]);
    
    // Format header row
    const headerRange = sheet.getRange(1, 1, 1, 6);
    headerRange.setFontWeight('bold');
    headerRange.setBackground('#f3f3f3');
  }
  
  return sheet;
}

// Run this function once to set up the sheet
function setup() {
  createSheetIfNotExists();
} 