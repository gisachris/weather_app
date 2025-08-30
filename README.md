
# 🌦️ Kigali Weather Dashboard

An interactive weather dashboard for Kigali, Rwanda, featuring real-time-like weather data simulation using MirageJS. Easily explore weather conditions by area, manage your favorite locations, and experience a modern, responsive UI.

---

## 🚀 Getting Started

1. **Clone the repository:**
	```sh
	git clone <repo-url>
	cd weather app
	```
2. **Open `index.html` in your browser.**
	- No build step required! All dependencies are loaded via CDN.

---

## 🧩 About MirageJS

[MirageJS](https://miragejs.com/) is a client-side API mocking library that intercepts HTTP requests in your browser and returns mock data. This project uses MirageJS to simulate a real weather API, so you can develop and test the app without a backend server.

**Note:** API endpoints only work when accessed programmatically (e.g., via `fetch` in your app), not by entering the URL directly in your browser's address bar.

---

## 📚 API Endpoints

| Method | Endpoint                | Description                      |
|--------|-------------------------|----------------------------------|
| GET    | `/api/weather`          | Get all weather data             |
| GET    | `/api/weather/:id`      | Get weather for a specific area  |
| GET    | `/api/favorites`        | Get user's favorite areas        |
| POST   | `/api/favorites`        | Add area to favorites            |
| DELETE | `/api/favorites/:id`    | Remove area from favorites       |

---

## 📝 License

MIT License. See [LICENSE](LICENSE) for details.