import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sunrise, Sunset } from "lucide-react";
import type { PrevisaoDia } from "../../types/weather";

interface ForecastProps {
    previsao: PrevisaoDia[];
    nasceDoSol: string;
    porDoSol: string;
}

export function Forecast({ previsao, nasceDoSol, porDoSol }: ForecastProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Próximos Dias</CardTitle>
                <div className="flex justify-between items-center mt-2 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                        <Sunrise className="w-4 h-4" />
                        <span>{nasceDoSol}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Sunset className="w-4 h-4" />
                        <span>{porDoSol}</span>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="grid gap-4">
                    {previsao.map((dia) => (
                        <div
                            key={dia.data}
                            className="flex items-center justify-between p-3 bg-blue-50 rounded-lg"
                        >
                            <div className="flex items-center gap-3">
                                <img
                                    src={`https:${dia.iconUrl}`}
                                    alt={dia.condicao}
                                    className="w-10 h-10"
                                />
                                <div>
                                    <p className="font-medium">{dia.data}</p>
                                    <p className="text-sm text-gray-600">
                                        {dia.condicao}
                                    </p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="font-bold">
                                    {dia.maxima}°C / {dia.minima}°C
                                </p>
                                <p className="text-sm text-gray-600">
                                    Chuva: {dia.chanceDeChova}% | Umidade:{" "}
                                    {dia.umidade}%
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
