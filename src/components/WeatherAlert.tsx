import { AlertTriangle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import type { WeatherData } from "../types/weather";

interface WeatherAlertProps {
    weatherData: WeatherData;
}

// Mudando para export default
export default function WeatherAlert({ weatherData }: WeatherAlertProps) {
    const getAlerts = () => {
        const alerts = [];

        if (weatherData.temperatura.atual > 35) {
            alerts.push({
                title: "Calor Extremo",
                description:
                    "Temperatura muito alta. Mantenha-se hidratado e evite exposição prolongada ao sol.",
            });
        } else if (weatherData.temperatura.atual < 10) {
            alerts.push({
                title: "Temperatura Baixa",
                description:
                    "Temperatura muito baixa. Mantenha-se aquecido e protegido.",
            });
        }

        // Alertas de chuva
        const proximasChuvas = weatherData.previsao.filter(
            (day) => day.chanceDeChova > 80
        );
        if (proximasChuvas.length > 0) {
            alerts.push({
                title: "Alerta de Chuva",
                description: `Alta probabilidade de chuva nos próximos dias: ${proximasChuvas
                    .map((d) => d.data)
                    .join(", ")}`,
            });
        }

        // Alertas de umidade
        if (weatherData.umidade > 90) {
            alerts.push({
                title: "Umidade Elevada",
                description:
                    "Níveis de umidade muito altos. Cuidado com mofo e problemas respiratórios.",
            });
        } else if (weatherData.umidade < 30) {
            alerts.push({
                title: "Umidade Baixa",
                description:
                    "Níveis de umidade muito baixos. Mantenha-se hidratado e use umidificador se possível.",
            });
        }

        // Alertas de vento
        if (weatherData.velocidadeVento > 50) {
            alerts.push({
                title: "Ventos Fortes",
                description:
                    "Velocidade do vento elevada. Evite atividades ao ar livre e fique atento a objetos soltos.",
            });
        }

        return alerts;
    };

    const alerts = getAlerts();

    if (alerts.length === 0) return null;

    return (
        <div className="space-y-2">
            {alerts.map((alert, index) => (
                <Alert variant="destructive" key={index}>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>{alert.title}</AlertTitle>
                    <AlertDescription>{alert.description}</AlertDescription>
                </Alert>
            ))}
        </div>
    );
}
