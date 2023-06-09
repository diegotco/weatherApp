/*
Based on the following information:
a) https://www.youtube.com/watch?v=C1m-pZGwwD4
b) https://openweathermap.org/current
c) https://api.openweathermap.org/data/2.5/weather?q=cuenca&appid=YOUR_API_KEY
*/

const cron = require('node-cron');
require('dotenv').config();
const axios = require('axios');

const API_KEY = process.env.API_KEY;
const CITY = 'cuenca'; // Cuenca, Ecuador.
const UNITS = 'metric';

async function fetchWeatherData() {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${CITY}&appid=${API_KEY}&units=${UNITS}`;

  const response = await axios.get(url);
  const data = response.data;
  const dateEvent = data.dt
  const weather = data.weather[0].description; // https://openweathermap.org/weather-conditions#:~:text=800-,Clear,-clear%20sky
  const temp = data.main.temp;

  return {
    dateEvent,
    weather,
    temp,
  };
}

const job = cron.schedule(
  '*/2 * * * *',
  async () => {
    const weatherData = await fetchWeatherData();
    module.exports.dateEvent = weatherData.weather;
    module.exports.weather = weatherData.weather;
    module.exports.temp = weatherData.temp;
  },
  {
    scheduled: true,
    timezone: 'America/Guayaquil',
  }
);

module.exports = fetchWeatherData; // Export the function fetchWeatherData
