import React from "react";
import { Share2, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { WeatherData } from "../types/weather";

interface ShareWeatherProps {
    weatherData: WeatherData;
}

export function ShareWeather({ weatherData }: ShareWeatherProps) {
    const [copied, setCopied] = React.useState(false);

    const createShareText = () => {
        return `Previsão do tempo em ${weatherData.cidade} - ${weatherData.estado}:
🌡️ Temperatura: ${weatherData.temperatura.atual}°C
💧 Umidade: ${weatherData.umidade}%
💨 Vento: ${weatherData.velocidadeVento} km/h
🌥️ Condição: ${weatherData.condicao}
Fonte: Weather App`;
    };

    const handleShare = async () => {
        const shareText = createShareText();

        if (navigator.share) {
            try {
                await navigator.share({
                    title: "Previsão do Tempo",
                    text: shareText,
                });
            } catch (err) {
                if (err instanceof Error && err.name !== "AbortError") {
                    console.error("Erro ao compartilhar:", err);
                }
            }
        } else {
            // Fallback: Copiar para área de transferência
            try {
                await navigator.clipboard.writeText(shareText);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            } catch (err) {
                console.error("Erro ao copiar:", err);
            }
        }
    };

    return (
        <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={handleShare}
        >
            {copied ? (
                <>
                    <Check className="w-4 h-4" />
                    Copiado!
                </>
            ) : (
                <>
                    {navigator.share ? (
                        <Share2 className="w-4 h-4" />
                    ) : (
                        <Copy className="w-4 h-4" />
                    )}
                    Compartilhar
                </>
            )}
        </Button>
    );
}
