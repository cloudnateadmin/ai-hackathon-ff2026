/**
 * AI Hackathon (powered by Cloudnate) — registration receiver.
 * Paste into Extensions → Apps Script of your Google Sheet, then
 * Deploy → New deployment → Web app (Execute as: Me, Access: Anyone).
 * Put the /exec URL into site/config.js → SHEET_ENDPOINT.
 */
const SHEET_NAME = "Registrations";
const NOTIFY_EMAIL = ""; // optional: e.g. "events@cloudnate.com" — emails the team on every signup

// Column order in the sheet. New fields posted by the site that aren't listed are appended automatically.
const COLUMNS = [
  "submittedAt", "reference", "role", "fullName", "email", "phone", "company", "businessType", "details",
  "jobTitle", "country", "teamName", "teamSize", "needs", "consent", "newsletter", "source", "page"
];

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    const p = (e && e.parameter) || {};
    if (p.website_hp) return json({ ok: false }); // honeypot
    if (!p.email || !p.fullName) return json({ ok: false, error: "missing fields" });

    const sheet = getSheet_();
    let headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    Object.keys(p).forEach((k) => {
      if (k !== "website_hp" && headers.indexOf(k) === -1) {
        headers.push(k);
        sheet.getRange(1, headers.length).setValue(k);
      }
    });
    // Prefix "'" so values like "+971…" or "=…" are stored as text, never formulas.
    const row = headers.map((h) => (p[h] === undefined ? "" : "'" + String(p[h]).slice(0, 5000)));
    sheet.appendRow(row);

    if (NOTIFY_EMAIL) {
      MailApp.sendEmail(NOTIFY_EMAIL,
        "New AI Hackathon registration: " + p.fullName + " — " + (p.company || ""),
        headers.map((h, i) => h + ": " + String(row[i]).replace(/^'/, "")).join("\n"));
    }
    return json({ ok: true });
  } catch (err) {
    return json({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

function doGet() {
  return json({ ok: true, service: "cloudnate-hackathon-registration" });
}

function getSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(SHEET_NAME);
  if (!sh) sh = ss.insertSheet(SHEET_NAME);
  if (sh.getLastRow() === 0) {
    sh.appendRow(COLUMNS);
    sh.setFrozenRows(1);
    sh.getRange(1, 1, 1, COLUMNS.length).setFontWeight("bold").setBackground("#06133a").setFontColor("#27e1ff");
  }
  return sh;
}

function json(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}
