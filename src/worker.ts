import { Hono } from 'hono';
import { cors } from 'hono/cors';

interface Env {
  OPENWEATHER_API_KEY: string;
}

const app = new Hono<{ Bindings: Env }>();

app.use('*', cors());

app.get('/api/weather', async (c) => {
  const { lat, lon } = c.req.query();
  
  if (!lat || !lon) {
    return c.json({ error: 'Latitude and longitude are required' }, 400);
  }

  const apiKey = c.env.OPENWEATHER_API_KEY;
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
  );

  if (!response.ok) {
    return c.json({ error: 'Failed to fetch weather data' }, response.status);
  }

  const data = await response.json();
  
  // Process the 5-day forecast
  const processedData = data.list.reduce((acc: any[], item: any) => {
    const date = new Date(item.dt * 1000).toLocaleDateString();
    if (!acc.find((day) => day.date === date) && acc.length < 5) {
      acc.push({
        date,
        temp: Math.round(item.main.temp),
        feels_like: Math.round(item.main.feels_like),
        humidity: item.main.humidity,
        description: item.weather[0].description,
        icon: item.weather[0].icon,
        wind_speed: item.wind.speed
      });
    }
    return acc;
  }, []);

  return c.json(processedData);
});

export default app;