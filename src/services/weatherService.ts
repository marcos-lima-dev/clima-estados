// src/services/weatherService.ts
import { WeatherData, WeatherError } from "../types/weather";

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
const API_BASE = "https://api.weatherapi.com/v1";

export const getWeatherData = async (query: string): Promise<WeatherData> => {
   try {
       const response = await fetch(
           `${API_BASE}/forecast.json?key=${API_KEY}&q=${encodeURIComponent(
               query
           )}&days=7&lang=pt&aqi=no`
       );

       if (!response.ok) {
           if (response.status === 404) {
               throw new Error("Localização não encontrada");
           }
           throw new Error("Erro ao buscar dados meteorológicos");
       }

       const data = await response.json();
       
       return {
           temperatura: {
               atual: Math.round(data.current.temp_c),
               sensacao: Math.round(data.current.feelslike_c),
           },
           umidade: data.current.humidity,
           velocidadeVento: Math.round(data.current.wind_kph),
           condicao: data.current.condition.text,
           iconUrl: data.current.condition.icon,
           atualizadoEm: new Date(data.current.last_updated).toLocaleString(),
           cidade: data.location.name,
           estado: data.location.region,
           pais: data.location.country,
           nasceDoSol: data.forecast.forecastday[0].astro.sunrise,
           porDoSol: data.forecast.forecastday[0].astro.sunset,
           previsao: data.forecast.forecastday.map((day: any) => ({
               data: new Date(day.date).toLocaleDateString(),
               maxima: Math.round(day.day.maxtemp_c),
               minima: Math.round(day.day.mintemp_c),
               condicao: day.day.condition.text,
               iconUrl: day.day.condition.icon,
               chanceDeChova: day.day.daily_chance_of_rain,
               umidade: day.day.avghumidity,
           })),
       };
   } catch (error) {
       console.error("Erro completo:", error);
       const errorMessage =
           error instanceof Error
               ? error.message
               : "Erro ao buscar dados meteorológicos";
       throw {
           message: errorMessage,
           code: "WEATHER_API_ERROR",
       } as WeatherError;
   }
};