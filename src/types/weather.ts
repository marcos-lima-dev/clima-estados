export interface PrevisaoDia {
    data: string;
    maxima: number;
    minima: number;
    condicao: string;
    iconUrl: string;
    chanceDeChova: number;
    umidade: number;
}

export interface WeatherData {
    temperatura: {
        atual: number;
        sensacao: number;
    };
    umidade: number;
    velocidadeVento: number;
    condicao: string;
    iconUrl: string;
    atualizadoEm: string;
    cidade: string;
    estado: string;
    pais: string;
    nasceDoSol: string;
    porDoSol: string;
    previsao: PrevisaoDia[];
}

export interface WeatherError {
    message: string;
    code?: string;
}
