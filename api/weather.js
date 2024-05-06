import axios from 'axios';
// import { apiKey } from '../constants';
import {API_KEY} from '@env';

const forecastEndpoint = params => `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${params.cityName}&days=${params.days}`;
const locationsEndpoint = params => `https://api.weatherapi.com/v1/search.json?key=${API_KEY}&q=${params.cityName}`;

const apiCall = async (endpoint) =>{
const options = {
    method: "GET",
    url: endpoint
}
    try{
        const response = await axios.request(options)
        return response.data;
    } catch(err) {
        console.log('error', err);
        return null;
        
    }
}

export const fetchWeatherForecast = async params => apiCall(forecastEndpoint(params));
export const fetchLocations = async params => apiCall(locationsEndpoint(params));