// src/components/WeatherDashboard.tsx
// Componente principal do dashboard de previsão do tempo
import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { MapPin, Search, Star, Trash2 } from 'lucide-react';
import { getWeatherData } from '../services';
import type { WeatherData, WeatherError } from '../types/weather';


// Interface para as cidades favoritas
interface FavoriteCity {
  nome: string;
  estado: string;
  query: string;
}

const WeatherDashboard = () => {
  // Estados
  const [searchQuery, setSearchQuery] = useState('');
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [favorites, setFavorites] = useState<FavoriteCity[]>(() => {
    const savedFavorites = localStorage.getItem('favoritesCities');
    if (savedFavorites) {
      try {
        return JSON.parse(savedFavorites);
      } catch (error) {
        console.error('Erro ao carregar favoritos:', error);
        return [];
      }
    }
    return [];
  });

  // Salvar favoritos no localStorage quando mudar
  useEffect(() => {
    localStorage.setItem('favoritesCities', JSON.stringify(favorites));
  }, [favorites]);

  // Verificar se uma cidade está nos favoritos
  const isFavorite = (cidade: string, estado: string) => {
    return favorites.some(fav => fav.nome === cidade && fav.estado === estado);
  };

  // Alternar cidade nos favoritos
  const toggleFavorite = () => {
    if (!weatherData) return;

    console.log('Weather data atual:', weatherData);
    const newFavorite = {
      nome: weatherData.cidade,
      estado: weatherData.estado,
      query: `${weatherData.cidade},${weatherData.estado}`
    };
    console.log('Novo favorito:', newFavorite);

    if (isFavorite(weatherData.cidade, weatherData.estado)) {
      console.log('Removendo dos favoritos');
      setFavorites(favorites.filter(
        fav => !(fav.nome === weatherData.cidade && fav.estado === weatherData.estado)
      ));
    } else {
      console.log('Adicionando aos favoritos');
      setFavorites([...favorites, newFavorite]);
    }
  };

  // Buscar dados do clima
  const fetchWeatherData = async (query: string) => {
    console.log('Buscando dados para:', query);
    setLoading(true);
    setError('');
    try {
      const data = await getWeatherData(query);
      console.log('Dados recebidos:', data);
      setWeatherData(data);
    } catch (err) {
      console.error('Erro na busca:', err);
      const weatherError = err as WeatherError;
      setError(weatherError.message || 'Erro ao buscar dados meteorológicos');
    } finally {
      setLoading(false);
    }
  };

  // Obter localização do usuário
  const getLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocalização não é suportada pelo seu navegador');
      return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        await fetchWeatherData(`${latitude},${longitude}`);
      },
      (_positionError) => {
        setError('Erro ao obter sua localização. Por favor, permita o acesso à localização.');
        setLoading(false);
      }
    );
  };

  // Manipular busca
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    await fetchWeatherData(searchQuery);
  };

  // Manipular clique em favorito
  const handleFavoriteClick = async (query: string) => {
    console.log('Clicou no favorito:', query);
    await fetchWeatherData(query);
  };

  // Remover favorito
  const removeFavorite = (cidade: string, estado: string) => {
    console.log('Removendo favorito:', cidade, estado);
    setFavorites(favorites.filter(fav => !(fav.nome === cidade && fav.estado === estado)));
  };

  // Carregar localização inicial
  useEffect(() => {
    getLocation();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold text-center mb-8">Previsão do Tempo</h1>

      {/* Lista de Favoritos */}
      {favorites.length > 0 && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Cidades Favoritas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {favorites.map((favorite) => (
                <div 
                  key={`${favorite.nome}-${favorite.estado}`}
                  className="p-4 bg-slate-50 rounded-lg flex justify-between items-center"
                >
                  <button
                    onClick={() => handleFavoriteClick(favorite.query)}
                    className="text-left flex-1"
                  >
                    <p className="font-medium">{favorite.nome}</p>
                    <p className="text-sm text-muted-foreground">{favorite.estado}</p>
                  </button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeFavorite(favorite.nome, favorite.estado)}
                    className="ml-2"
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Barra de Pesquisa */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <form onSubmit={handleSearch}>
            <div className="flex gap-2">
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Digite o nome da cidade..."
                className="flex-1"
              />
              <Button 
                type="button"
                variant="outline"
                onClick={getLocation}
                disabled={loading}
              >
                <MapPin className="h-4 w-4" />
              </Button>
              <Button 
                type="submit"
                disabled={loading || !searchQuery.trim()}
              >
                <Search className="h-4 w-4 mr-2" />
                Buscar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Mensagem de Erro */}
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex justify-center mb-6">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
        </div>
      )}

      {/* Dados do Clima */}
      {weatherData && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="flex items-center gap-2">
                  {weatherData.cidade} - {weatherData.estado}
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={toggleFavorite}
                  >
                    <Star 
                      className={`h-4 w-4 ${
                        isFavorite(weatherData.cidade, weatherData.estado)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-400'
                      }`}
                    />
                  </Button>
                </CardTitle>
                <p className="text-sm text-slate-500">{weatherData.pais}</p>
                <p className="text-xs text-slate-500">
                  Atualizado em: {weatherData.atualizadoEm}
                </p>
              </div>
              <img 
                src={weatherData.iconUrl} 
                alt={weatherData.condicao}
                className="w-16 h-16"
              />
            </div>
          </CardHeader>
          <CardContent>
            {/* Dados principais */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="text-center p-4 bg-slate-50 rounded-lg">
                <p className="text-sm font-medium">Temperatura</p>
                <p className="text-3xl font-bold">{weatherData.temperatura.atual}°C</p>
                <p className="text-sm">Sensação {weatherData.temperatura.sensacao}°C</p>
              </div>
              <div className="text-center p-4 bg-slate-50 rounded-lg">
                <p className="text-sm font-medium">Umidade</p>
                <p className="text-3xl font-bold">{weatherData.umidade}%</p>
              </div>
              <div className="text-center p-4 bg-slate-50 rounded-lg">
                <p className="text-sm font-medium">Vento</p>
                <p className="text-3xl font-bold">{weatherData.velocidadeVento} km/h</p>
              </div>
              <div className="text-center p-4 bg-slate-50 rounded-lg">
                <p className="text-sm font-medium">Condição</p>
                <p className="text-xl font-bold">{weatherData.condicao}</p>
              </div>
            </div>

            {/* Dados do sol */}
            <div className="flex justify-between p-4 bg-slate-50 rounded-lg">
              <div className="text-center">
                <p className="text-sm font-medium">Nascer do Sol</p>
                <p className="text-lg">{weatherData.nasceDoSol}</p>
              </div>
              <div className="text-center">
                <p className="text-sm font-medium">Pôr do Sol</p>
                <p className="text-lg">{weatherData.porDoSol}</p>
              </div>
            </div>

            {/* Previsão para os próximos dias */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-4">Próximos Dias</h3>
              <div className="space-y-4">
                {weatherData.previsao.map((dia) => (
                  <div key={dia.data} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <div className="flex items-center gap-4">
                      <img 
                        src={dia.iconUrl} 
                        alt={dia.condicao}
                        className="w-10 h-10"
                      />
                      <div>
                        <p className="font-medium">{dia.data}</p>
                        <p className="text-sm text-slate-500">{dia.condicao}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{dia.maxima}°C / {dia.minima}°C</p>
                      <p className="text-sm text-slate-500">
                        Chuva: {dia.chanceDeChova}% | Umidade: {dia.umidade}%
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default WeatherDashboard;