/*
Based on the following information:
a) https://www.youtube.com/watch?v=fxGeppjO0Mg
b) https://medium.com/@sakkeerhussainp/google-sheet-as-your-database-for-node-js-backend-a79fc5a6edd9
c) https://developers.google.com/sheets/api/reference/rest/v4/spreadsheets.values/append#query-parameters
*/

const {google} = require('googleapis');
const fetchWeatherData = require('./cron');
const currentDay = require('./cityTime');

const serviceAccountKeyFile = "./vocal-byte-388813-4497ec45100d.json";
const sheetId = '1Sa_p_FpEK4ZWFNI7UO2TybIZxx_d4hWhuPHzpLPVrcM'
const tabName = 'Sheet1'
const range = 'A:E'

main().then(() => {
  console.log('Completed')
})

async function main() {
    while (true) {
        // Generating google sheet client
        const googleSheetClient = await _getGoogleSheetClient();
        
        const weatherData = await fetchWeatherData();
        const dateValue = await currentDay();
        
        const weather = weatherData.weather;
        const temp = weatherData.temp;
        const year = dateValue.dateOnly
        const hour = dateValue.timeOnly

        // Adding a new row to Google Sheet
        const dataToBeInserted = [
        [year, hour, temp, weather],
        ]
        await new Promise(resolve => setTimeout(resolve, 120000)); // Delay for 2 minutes
        await _writeGoogleSheet(googleSheetClient, sheetId, tabName, range, dataToBeInserted);
    }
}

async function _getGoogleSheetClient() {
    const auth = new google.auth.GoogleAuth({
      keyFile: serviceAccountKeyFile,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
    const authClient = await auth.getClient();
    return google.sheets({
      version: 'v4',
      auth: authClient,
    });
}

async function _writeGoogleSheet(googleSheetClient, sheetId, tabName, range, data) {
  await googleSheetClient.spreadsheets.values.append({
    spreadsheetId: sheetId,
    range: `${tabName}!${range}`,
    valueInputOption: 'USER_ENTERED',
    insertDataOption: 'INSERT_ROWS',
    resource: {
      "majorDimension": "ROWS",
      "values": data
    },
  })
}