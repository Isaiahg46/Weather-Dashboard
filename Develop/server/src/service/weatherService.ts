
import dotenv from 'dotenv';
dotenv.config();

// TODO: Define an interface for the Coordinates object
interface Coordinates {
  lat: number;
  lon: number;
}
// TODO: Define a class for the Weather object
class Weather {
  city: string;
  date: string;
  description: string;
  temp: number;
  humidity: number;
  wind: number;
  uvIndex: number;
  icon: string;
  constructor(
    city: string,
    date: string,
    description: string,
    temp: number,
    humidity: number,
    wind: number,
    uvIndex: number,
    icon: string
  ) {
    this.city = city;
    this.date = date;
    this.description = description;
    this.temp = temp;
    this.humidity = humidity;
    this.wind = wind;
    this.uvIndex = uvIndex;
    this.icon = icon;
  }
}

// TODO: Complete the WeatherService class
class WeatherService {
  // TODO: Define the baseURL, API key, and city name properties
  private baseURL?: string;
  private apiKey?: string;
  private cityName: string;
  constructor() {
    this.baseURL = process.env.API_BASE_URL || '';
    this.apiKey = process.env.API_KEY || '';
    this.cityName = 'defaultCity';
  }

  // TODO: Create fetchLocationData method
private async fetchLocationData(cityName: string) {
  const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${this.apiKey}`);
  const data = await response.json();
  return data; // This returns the full data object
}
  /*private async fetchLocationData(city: string) {
    try {
    const response = await fetch(
      `${this.baseURL}/geo/1.0/direct?q=${city}&limit=1&appid=${this.apiKey}`
    );
  
    const locationData = await response.json();

    return locationData.results;
    } catch (err) {
      console.log('Error:', err);
      return err;
    }
  }*/
  // TODO: Create destructureLocationData method
  private destructureLocationData(locationData: { lat: number; lon: number }): Coordinates {
    const { lat, lon } = locationData;
    return {
      lat: lat,
      lon: lon
    };
  }
  // TODO: Create buildGeocodeQuery method
  private buildGeocodeQuery(): string {
    return `${this.baseURL}/geocode?apikey=${this.apiKey}&q=${this.cityName}`;
  }
  // TODO: Create buildWeatherQuery method
  private buildWeatherQuery(coordinates: Coordinates): string {
    return `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${this.apiKey}`;

  //private buildWeatherQuery(coordinates: Coordinates): string {
  //  return `${this.baseURL}/weather?apikey=${this.apiKey}&lat=${coordinates.lat}&lon=${coordinates.lon}`;
  }
  // TODO: Create fetchAndDestructureLocationData method
  private async fetchAndDestructureLocationData() {
    const locationData = await this.fetchLocationData(this.buildGeocodeQuery());
    return this.destructureLocationData(locationData);
  }
  // TODO: Create fetchWeatherData method
  private async fetchWeatherData(coordinates: Coordinates) {
    const response = await fetch(this.buildWeatherQuery(coordinates));
    const data = await response.json();
    return data;
    console.log(data);
  }
  // TODO: Build parseCurrentWeather method
  private parseCurrentWeather(response: any) {
    return new Weather(
      this.cityName,
      response.current.dt,
      response.current.weather[0].description,
      response.current.temp,
      response.current.humidity,
      response.current.wind_speed,
      response.current.uvi,
      response.current.weather[0].icon
    );
  }
  // TODO: Complete buildForecastArray method
  private buildForecastArray(currentWeather: Weather, weatherData: any) {
    const forecastArray = [];
    forecastArray.push(currentWeather);
    for (let i = 1; i < 6; i++) {
      const forecast = new Weather(
        this.cityName = '',
        weatherData.daily[i].dt,
        weatherData.daily[i].weather[0].description,
        weatherData.daily[i].temp.day,
        weatherData.daily[i].humidity,
        weatherData.daily[i].wind_speed,
        weatherData.daily[i].uvi,
        weatherData.daily[i].weather[0].icon
      );
      forecastArray.push(forecast);
    }
    return forecastArray;
  }
  // TODO: Complete getWeatherForCity method
  async getWeatherForCity(city: string): Promise<Weather[]> {
    try {
      this.cityName = city;
      await this.fetchAndDestructureLocationData();
      const coordinates = await this.fetchAndDestructureLocationData();
      const weatherData = await this.fetchWeatherData(coordinates);
      const currentWeather = this.parseCurrentWeather(weatherData);
      return this.buildForecastArray(currentWeather, weatherData);
    }
    catch (error) {
      console.error(error);
      return [];
    }
  }
}

export default new WeatherService();
