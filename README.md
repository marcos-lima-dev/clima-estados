# Weather App

Aplicativo de previsão do tempo desenvolvido com React, TypeScript e Vite.

## Funcionalidades

-   🔍 Busca de cidades
-   📍 Geolocalização automática
-   🌡️ Dados meteorológicos em tempo real
-   📅 Previsão para 7 dias
-   🔔 Sistema de alertas climáticos
-   📤 Compartilhamento de previsões
-   🌅 Horários de nascer e pôr do sol

## Tecnologias

-   React
-   TypeScript
-   Vite
-   Tailwind CSS
-   Shadcn/ui
-   WeatherAPI

## Instalação

1. Clone o repositório:

```bash
git clone https://github.com/seu-usuario/weather-app.git
```

2. Instale as dependências:

```bash
cd weather-app
npm install
```

3. Configure as variáveis de ambiente:

```bash
cp .env.example .env
```

Adicione sua API key da WeatherAPI no arquivo .env

4. Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

## Configuração da API

1. Crie uma conta em [WeatherAPI](https://www.weatherapi.com/)
2. Copie sua API key
3. Adicione a key no arquivo .env:

```
VITE_WEATHER_API_KEY=sua_api_key_aqui
```

## Estrutura do Projeto

```
src/
├── components/
│   ├── ui/
│   │   ├── alert.tsx
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   └── input.tsx
│   ├── Forecast.tsx
│   ├── ShareWeather.tsx
│   └── WeatherAlert.tsx
├── services/
│   └── weather.ts
├── types/
│   └── weather.ts
├── App.tsx
└── main.tsx
```

## Contribuição

1. Faça um Fork do projeto
2. Crie uma Branch para sua Feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a Branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.
