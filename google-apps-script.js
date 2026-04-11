// Doddy.in newsletter — Google Apps Script Web App
// =====================================================
// SETUP STEPS:
// 1) Create a new Google Sheet. Name it "Doddy Newsletter".
// 2) In row 1, add headers: Timestamp | Name | Email | Phone | Source
// 3) Extensions → Apps Script. Delete the placeholder code.
// 4) Paste THIS entire file in.
// 5) Click Deploy → New deployment → Type: Web app.
//    - Description: Doddy newsletter
//    - Execute as: Me
//    - Who has access: Anyone
// 6) Click Deploy. Authorize when prompted.
// 7) Copy the Web app URL. It will look like:
//    https://script.google.com/macros/s/AKfycby.../exec
// 8) Paste that URL into your Vercel env var NEXT_PUBLIC_SHEETS_URL
//    (or into .env.local for local dev).
// 9) Redeploy your Vercel project so the env var takes effect.
//
// To test: submit the newsletter form on your site, then open the
// Google Sheet — you should see a new row appear within a second.

function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const p = e.parameter || {};
    sheet.appendRow([
      new Date(),
      p.name || '',
      p.email || '',
      p.phone || '',
      p.source || 'doddy.in'
    ]);
    return ContentService.createTextOutput(JSON.stringify({ok: true}))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ok: false, error: String(err)}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet() {
  return ContentService.createTextOutput('Doddy newsletter endpoint is live.');
}
