import React, { useState, useEffect } from "react";
import { Search, MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getWeatherData } from "./services/weather";
import { Forecast } from "./components/Forecast";
import { ShareWeather } from "./components/ShareWeather";
import WeatherAlert from "./components/WeatherAlert";
import type { WeatherData } from "./types/weather";

const WeatherApp = () => {
    const [city, setCity] = useState("");
    const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const fetchWeatherData = async (query: string) => {
        setLoading(true);
        setError("");
        try {
            const data = await getWeatherData(query);
            setWeatherData(data);
            setCity(data.cidade);
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Erro ao buscar dados meteorológicos"
            );
        } finally {
            setLoading(false);
        }
    };

    const getLocation = () => {
        if (!navigator.geolocation) {
            setError("Geolocalização não é suportada pelo seu navegador");
            return;
        }

        setLoading(true);
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                await fetchWeatherData(`${latitude},${longitude}`);
            },
            (error) => {
                setError(
                    "Erro ao obter sua localização. Por favor, permita o acesso à localização."
                );
                setLoading(false);
            }
        );
    };

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!city.trim()) return;
        await fetchWeatherData(city);
    };

    useEffect(() => {
        getLocation();
    }, []);

    return (
        <div className="min-h-screen bg-gray-100 p-4">
            <div className="max-w-4xl mx-auto space-y-4">
                <h1 className="text-3xl font-bold text-center text-gray-800">
                    Previsão do Tempo
                </h1>

                <Card>
                    <CardHeader>
                        <CardTitle>Buscar Cidade</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex gap-2">
                            <Input
                                type="text"
                                placeholder="Digite o nome da cidade..."
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                                className="flex-1"
                            />
                            <Button
                                type="button"
                                variant="outline"
                                onClick={getLocation}
                                disabled={loading}
                            >
                                <MapPin className="w-4 h-4" />
                            </Button>
                            <Button
                                onClick={handleSearch}
                                disabled={loading || !city.trim()}
                            >
                                <Search className="w-4 h-4 mr-2" />
                                Buscar
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                        {error}
                    </div>
                )}

                {loading && (
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto" />
                    </div>
                )}

                {weatherData && (
                    <>
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="flex items-center gap-4 mb-2">
                                            <CardTitle>
                                                {weatherData.cidade} -{" "}
                                                {weatherData.estado}
                                            </CardTitle>
                                            <ShareWeather
                                                weatherData={weatherData}
                                            />
                                        </div>
                                        <p className="text-sm text-gray-500">
                                            {weatherData.pais}
                                        </p>
                                        <p className="text-xs text-gray-400">
                                            Atualizado em:{" "}
                                            {weatherData.atualizadoEm}
                                        </p>
                                    </div>
                                    <img
                                        src={`https:${weatherData.iconUrl}`}
                                        alt={weatherData.condicao}
                                        className="w-16 h-16"
                                    />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 bg-blue-50 rounded-lg">
                                        <p className="text-sm text-gray-600">
                                            Temperatura
                                        </p>
                                        <p className="text-2xl font-bold">
                                            {weatherData.temperatura.atual}°C
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            Sensação térmica:{" "}
                                            {weatherData.temperatura.sensacao}°C
                                        </p>
                                    </div>
                                    <div className="p-4 bg-blue-50 rounded-lg">
                                        <p className="text-sm text-gray-600">
                                            Umidade
                                        </p>
                                        <p className="text-2xl font-bold">
                                            {weatherData.umidade}%
                                        </p>
                                    </div>
                                    <div className="p-4 bg-blue-50 rounded-lg">
                                        <p className="text-sm text-gray-600">
                                            Velocidade do Vento
                                        </p>
                                        <p className="text-2xl font-bold">
                                            {weatherData.velocidadeVento} km/h
                                        </p>
                                    </div>
                                    <div className="p-4 bg-blue-50 rounded-lg">
                                        <p className="text-sm text-gray-600">
                                            Condição
                                        </p>
                                        <p className="text-2xl font-bold">
                                            {weatherData.condicao}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <WeatherAlert weatherData={weatherData} />

                        <Forecast
                            previsao={weatherData.previsao}
                            nasceDoSol={weatherData.nasceDoSol}
                            porDoSol={weatherData.porDoSol}
                        />
                    </>
                )}
            </div>
        </div>
    );
};

export default WeatherApp;
