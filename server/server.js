// MirageJS Setup for Weather Dashboard Demo
// This simulates a real weather API for educational purposes

import { createServer, Model } from "https://cdn.jsdelivr.net/npm/miragejs@0.1.48/+esm";

// Sample weather data for Kigali areas
const weatherData = [
    {
        id: "1",
        area: "Nyarugenge",
        temperature: 24,
        condition: "partly cloudy",
        humidity: 65,
        windSpeed: 12,
        eventRecommendation: "suitable",
        timeWeather: {
            morning: { temp: 20, condition: "clear", humidity: 70, wind: 8 },
            afternoon: {
                temp: 28, condition: "partly cloudy", humidity: 60, wind: 15
            },
            night: { temp: 22, condition: "clear", humidity: 75, wind: 10 }
        }
    },
    {
        id: "2",
        area: "Gasabo",
        temperature: 26,
        condition: "sunny",
        humidity: 58,
        windSpeed: 15,
        eventRecommendation: "suitable",
        timeWeather: {
            morning: { temp: 22, condition: "clear", humidity: 65, wind: 12 },
            afternoon: { temp: 30, condition: "sunny", humidity: 50, wind: 18 },
            night: { temp: 24, condition: "clear", humidity: 70, wind: 12 }
        }
    },
    {
        id: "3",
        area: "Kicukiro",
        temperature: 23,
        condition: "overcast",
        humidity: 72,
        windSpeed: 8,
        eventRecommendation: "caution",
        timeWeather: {
            morning: { temp: 19, condition: "cloudy", humidity: 80, wind: 6 },
            afternoon: { temp: 27, condition: "overcast", humidity: 65, wind: 10 },
            night: { temp: 21, condition: "cloudy", humidity: 78, wind: 8 }
        }
    },
    {
        id: "4",
        area: "Kimironko",
        temperature: 21,
        condition: "light rain",
        humidity: 85,
        windSpeed: 20,
        eventRecommendation: "unsuitable",
        timeWeather: {
            morning: { temp: 18, condition: "drizzle", humidity: 90, wind: 15 },
            afternoon: { temp: 24, condition: "light rain", humidity: 80, wind: 25 },
            night: { temp: 19, condition: "rain", humidity: 88, wind: 18 }
        }
    },
    {
        id: "5",
        area: "Remera",
        temperature: 25,
        condition: "partly sunny",
        humidity: 60,
        windSpeed: 14,
        eventRecommendation: "suitable",
        timeWeather: {
            morning: { temp: 21, condition: "cloudy", humidity: 68, wind: 10 },
            afternoon: { temp: 29, condition: "partly sunny", humidity: 52, wind: 18 },
            night: { temp: 23, condition: "clear", humidity: 65, wind: 12 }
        }
    },
    {
        id: "6",
        area: "Gikondo",
        temperature: 22,
        condition: "cloudy",
        humidity: 68,
        windSpeed: 10,
        eventRecommendation: "caution",
        timeWeather: {
            morning: { temp: 19, condition: "overcast", humidity: 75, wind: 8 },
            afternoon: { temp: 25, condition: "cloudy", humidity: 62, wind: 12 },
            night: { temp: 20, condition: "cloudy", humidity: 72, wind: 9 }
        }
    },
    {
        id: "7",
        area: "Nyamirambo",
        temperature: 27,
        condition: "sunny",
        humidity: 55,
        windSpeed: 16,
        eventRecommendation: "suitable",
        timeWeather: {
            morning: { temp: 23, condition: "clear", humidity: 62, wind: 12 },
            afternoon: { temp: 31, condition: "sunny", humidity: 48, wind: 20 },
            night: { temp: 25, condition: "clear", humidity: 60, wind: 14 }
        }
    },
    {
        id: "8",
        area: "Kacyiru",
        temperature: 20,
        condition: "heavy rain",
        humidity: 92,
        windSpeed: 25,
        eventRecommendation: "unsuitable",
        timeWeather: {
            morning: { temp: 17, condition: "rain", humidity: 95, wind: 20 },
            afternoon: { temp: 23, condition: "heavy rain", humidity: 90, wind: 30 },
            night: { temp: 18, condition: "rain", humidity: 93, wind: 22 }
        }
    }
];

// Create MirageJS Server
createServer({
    models: {
        weather: Model,
        favorite: Model,
    },

    seeds(server) {
        // Seed weather data
        weatherData.forEach(weather => {
            server.create('weather', weather);
        });
    },

    routes() {
        this.namespace = 'api';

        // Add delay to simulate real API
        this.timing = 800;

        // GET /api/weather - Get all weather data
        this.get('/weather', (schema) => {
            return schema.weathers.all();
        });

        // GET /api/weather/:id - Get specific area weather
        this.get('/weather/:id', (schema, request) => {
            const id = request.params.id;
            return schema.weathers.find(id);
        });

        // GET /api/favorites - Get user's favorite areas
        this.get('/favorites', (schema) => {
            return schema.favorites.all();
        });

        // POST /api/favorites - Add area to favorites
        this.post('/favorites', (schema, request) => {
            const attrs = JSON.parse(request.requestBody);

            // Check if already favorited
            const existing = schema.favorites.findBy({ weatherId: attrs.weatherId });
            if (existing) {
                return { error: 'Already in favorites' };
            }

            return schema.favorites.create(attrs);
        });

        // DELETE /api/favorites/:id - Remove from favorites
        this.delete('/favorites/:id', (schema, request) => {
            const id = request.params.id;
            const favorite = schema.favorites.find(id);
            if (favorite) {
                favorite.destroy();
                return { success: true };
            }
            return { error: 'Favorite not found' };
        });
    },
});

console.log('MirageJS server initialized with weather data for Kigali areas');