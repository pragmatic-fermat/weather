import React, { useEffect, useState } from 'react';
import { Cloud, CloudRain, CloudSnow, CloudSun, Loader2, MapPin, Sun, Wind } from 'lucide-react';

interface WeatherData {
  date: string;
  temp: number;
  feels_like: number;
  humidity: number;
  description: string;
  icon: string;
  wind_speed: number;
}

function getWeatherIcon(iconCode: string) {
  switch (iconCode.slice(0, 2)) {
    case '01': return <Sun className="w-12 h-12 text-yellow-500" />;
    case '02': return <CloudSun className="w-12 h-12 text-gray-500" />;
    case '03':
    case '04': return <Cloud className="w-12 h-12 text-gray-500" />;
    case '09':
    case '10': return <CloudRain className="w-12 h-12 text-blue-500" />;
    case '13': return <CloudSnow className="w-12 h-12 text-blue-300" />;
    default: return <Cloud className="w-12 h-12 text-gray-500" />;
  }
}

function App() {
  const [weatherData, setWeatherData] = useState<WeatherData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeather = async (position: GeolocationPosition) => {
      try {
        const response = await fetch(
          `/api/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}`
        );
        if (!response.ok) throw new Error('Failed to fetch weather data');
        const data = await response.json();
        setWeatherData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch weather data');
      } finally {
        setLoading(false);
      }
    };

    navigator.geolocation.getCurrentPosition(
      fetchWeather,
      (err) => {
        setError('Please enable location services to see your weather forecast');
        setLoading(false);
      }
    );
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-white animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-xl">
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-center mb-8">
          <MapPin className="w-6 h-6 text-white mr-2" />
          <h1 className="text-3xl font-bold text-white">5-Day Weather Forecast</h1>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {weatherData.map((day) => (
            <div key={day.date} className="bg-white/90 backdrop-blur-sm rounded-lg p-6 shadow-lg">
              <div className="text-center">
                <p className="font-semibold text-gray-600">{day.date}</p>
                <div className="my-4 flex justify-center">
                  {getWeatherIcon(day.icon)}
                </div>
                <p className="text-4xl font-bold text-gray-800 mb-2">{day.temp}°C</p>
                <p className="text-gray-600 capitalize">{day.description}</p>
                
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                    <span>Feels like:</span>
                    <span>{day.feels_like}°C</span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                    <span>Humidity:</span>
                    <span>{day.humidity}%</span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>Wind:</span>
                    <span>{day.wind_speed} m/s</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;