export interface WeatherData {
    cidade: string;
    estado: string;
    pais: string;
    temperatura: {
        atual: number;
        sensacao: number;
    };
    umidade: number;
    velocidadeVento: number;
    condicao: string;
    iconUrl: string;
    atualizadoEm: string;
    nasceDoSol: string;
    porDoSol: string;
    previsao: Array<{
        data: string;
        maxima: number;
        minima: number;
        condicao: string;
        iconUrl: string;
        chanceDeChova: number;
        umidade: number;
    }>;
}

export interface WeatherError {
    message: string;
}

export interface PrevisaoDia {
    data: string;
    iconUrl: string;
    condicao: string;
    maxima: number;
    minima: number;
    chanceDeChova: number;
    umidade: number;
}