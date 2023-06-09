const fetchWeatherData = require('./cron');

async function currentDay() {
    while (true) {
        const weatherData = await fetchWeatherData();
        const dateEvent = weatherData.dateEvent;

        const timestamp = parseInt(dateEvent, 10); // Convert the string to a number using parseInt
        const date = new Date(timestamp * 1000); // Multiply by 1000 to convert from seconds to milliseconds

        const options = {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: 'numeric',
            minute: 'numeric',
            timeZone: 'America/Guayaquil',
        };

        const dateValue = date.toLocaleString('es-EC', options);

        const [datePart, timePart] = dateValue.split(','); // Split the date and time using the comma as separator

        const dateOnly = datePart.trim(); // Remove any leading or trailing whitespace
        const timeOnly = timePart.trim(); // Remove any leading or trailing whitespace

        return {
            dateOnly,
            timeOnly,
        };
    
        
    }
}

currentDay();

module.exports = currentDay