/**
 * ==============================================================================
 * GOOGLE APPS SCRIPT CODE (FOR GOOGLE SHEETS / JSON BACKEND)
 * ==============================================================================
 * 
 * Instructions to set up your free, permanent Google Sheet database for blessings:
 * 
 * 1. Open Google Sheets (https://sheets.new)
 * 2. Set the sheet headers in Row 1:
 *    [Timestamp] | [Name] | [Message]
 * 3. In the top menu, go to: Extensions > Apps Script
 * 4. Paste the code below into Code.gs
 * 5. Click "Deploy" > "New deployment"
 *    - Select type: "Web app"
 *    - Execute as: "Me"
 *    - Who has access: "Anyone"  <-- (Important so guests can post without login)
 * 6. Click "Deploy", copy your Web App URL, and paste it into `google-sheet-config.js`
 */

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    var doc = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = doc.getActiveSheet();

    var name = 'Anonymous';
    var message = '';

    // Handle both JSON payload and form-urlencoded / parameter payload
    if (e && e.postData && e.postData.contents) {
      try {
        var data = JSON.parse(e.postData.contents);
        name = data.name || name;
        message = data.message || message;
      } catch (jsonErr) {
        // If not JSON, check parameters
        if (e.parameter) {
          name = e.parameter.name || name;
          message = e.parameter.message || message;
        }
      }
    } else if (e && e.parameter) {
      name = e.parameter.name || name;
      message = e.parameter.message || message;
    }

    var timestamp = new Date();

    // Append row: Timestamp, Name, Message
    sheet.appendRow([timestamp, name, message]);

    return ContentService
      .createTextOutput(JSON.stringify({ result: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ result: 'error', error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

function doGet(e) {
  var doc = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = doc.getActiveSheet();
  var rows = sheet.getDataRange().getValues();
  var output = [];

  // Read from row 2 (skip header)
  for (var i = rows.length - 1; i >= 1; i--) {
    if (rows[i][1]) {
      output.push({
        id: i,
        date: rows[i][0] ? Utilities.formatDate(new Date(rows[i][0]), "GMT+5:30", "MMM d") : "Just now",
        name: rows[i][1],
        message: rows[i][2],
        time: "Recent"
      });
    }
  }

  return ContentService
    .createTextOutput(JSON.stringify(output))
    .setMimeType(ContentService.MimeType.JSON);
}
