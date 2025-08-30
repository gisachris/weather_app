// Weather Dashboard Application - Functional Approach
// Educational demo for coding bootcamp

// BEGINNER LEVEL: Global state variables
let weatherData = [];
let favorites = [];
let filteredData = [];

// BEGINNER LEVEL: DOM element references
let weatherGrid;
let favoritesList;
let searchInput;
let eventFilter;
let loadingState;
let errorState;
let modal;
let modalBody;

// BEGINNER LEVEL: Initialize the application
async function init() {
    // Get DOM elements
    weatherGrid = document.getElementById('weatherGrid');
    favoritesList = document.getElementById('favoritesList');
    searchInput = document.getElementById('searchInput');
    eventFilter = document.getElementById('eventFilter');
    loadingState = document.getElementById('loadingState');
    errorState = document.getElementById('errorState');
    modal = document.getElementById('detailModal');
    modalBody = document.getElementById('modalBody');

    // BEGINNER LEVEL: Setup event listeners
    setupEventListeners();

    // INTERMEDIATE LEVEL: Load data
    await loadInitialData();
}

// BEGINNER LEVEL: Event listener setup
function setupEventListeners() {
    // Search functionality
    searchInput.addEventListener('input', (e) => {
        filterWeatherData(e.target.value, eventFilter.value);
    });

    // Filter functionality
    eventFilter.addEventListener('change', (e) => {
        filterWeatherData(searchInput.value, e.target.value);
    });

    // Modal close functionality
    const closeBtn = document.querySelector('.close-btn');
    closeBtn.addEventListener('click', closeModal);

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // ESC key to close modal
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
            closeModal();
        }
    });
}

// INTERMEDIATE LEVEL: Load all initial data
async function loadInitialData() {
    try {
        await loadWeatherData();
        await loadFavorites();
        renderWeatherCards();
        renderFavorites();
    } catch (error) {
        console.error('Error during initialization:', error);
        showError();
    }
}

// INTERMEDIATE LEVEL: Async API calls with error handling
async function loadWeatherData() {
    try {
        showLoading();

        const response = await fetch('/api/weather');
        if (!response.ok) {
            throw new Error('Failed to fetch weather data');
        }

        const data = await response.json();
        weatherData = data.weathers || [];
        filteredData = [...weatherData];

        hideLoading();
    } catch (error) {
        console.error('Error loading weather data:', error);
        showError();
    }
}

// INTERMEDIATE LEVEL: Load favorites data
async function loadFavorites() {
    try {
        const response = await fetch('/api/favorites');
        if (!response.ok) {
            throw new Error('Failed to fetch favorites');
        }

        const data = await response.json();
        favorites = data.favorites || [];
    } catch (error) {
        console.error('Error loading favorites:', error);
        // Don't show error for favorites - it's not critical
    }
}

// ADVANCED LEVEL: Data filtering with array methods
function filterWeatherData(searchTerm = '', eventFilter = 'all') {
    filteredData = weatherData.filter(weather => {
        // Search by area name (case insensitive)
        const matchesSearch = weather.area.toLowerCase().includes(searchTerm.toLowerCase());

        // Filter by event recommendation
        const matchesEvent = eventFilter === 'all' || weather.eventRecommendation === eventFilter;

        return matchesSearch && matchesEvent;
    });

    renderWeatherCards();
}

// ADVANCED LEVEL: Dynamic DOM manipulation with template literals
function renderWeatherCards() {
    if (filteredData.length === 0) {
        weatherGrid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 2rem; color: #333;">
                <h3>No weather data found</h3>
                <p>Try adjusting your search or filter criteria</p>
            </div>
        `;
        return;
    }

    // ADVANCED: Using map and template literals for dynamic content
    weatherGrid.innerHTML = filteredData.map(weather => {
        const isFavorited = favorites.some(fav => fav.weatherId === weather.id);
        const cardClass = `weather-card ${weather.eventRecommendation}`;

        return `
            <div class="${cardClass}" data-weather-id="${weather.id}">
                <div class="card-header">
                    <h3 class="area-name">${weather.area}</h3>
                    <button class="favorite-btn ${isFavorited ? 'favorited' : ''}" 
                            data-weather-id="${weather.id}"
                            title="${isFavorited ? 'Remove from favorites' : 'Add to favorites'}">
                        ${isFavorited ? '❤️' : '🤍'}
                    </button>
                </div>
                
                <div class="weather-info">
                    <div>
                        <div class="temperature">${weather.temperature}°C</div>
                        <div class="condition">${weather.condition}</div>
                    </div>
                    <div class="weather-details">
                        <span>💧 ${weather.humidity}%</span>
                        <span>💨 ${weather.windSpeed} km/h</span>
                    </div>
                </div>
                
                <div class="event-recommendation recommendation-${weather.eventRecommendation}">
                    ${weather.eventRecommendation.toUpperCase()}
                </div>
            </div>
        `;
    }).join('');

    // INTERMEDIATE: Event delegation for dynamic content
    attachCardListeners();
}

// INTERMEDIATE: Event delegation pattern
function attachCardListeners() {
    // Remove existing listeners to prevent duplicates
    weatherGrid.removeEventListener('click', handleWeatherCardClick);
    weatherGrid.addEventListener('click', handleWeatherCardClick);
}

// INTERMEDIATE: Handle weather card clicks
async function handleWeatherCardClick(e) {
    const weatherCard = e.target.closest('.weather-card');
    const favoriteBtn = e.target.closest('.favorite-btn');

    if (favoriteBtn) {
        // Handle favorite button click
        e.stopPropagation();
        const weatherId = favoriteBtn.dataset.weatherId;
        await toggleFavorite(weatherId);
    } else if (weatherCard) {
        // Handle card click for details
        const weatherId = weatherCard.dataset.weatherId;
        showWeatherDetails(weatherId);
    }
}

// ADVANCED: Async operations with error handling
async function toggleFavorite(weatherId) {
    try {
        const isFavorited = favorites.some(fav => fav.weatherId === weatherId);

        if (isFavorited) {
            // Remove from favorites
            const favorite = favorites.find(fav => fav.weatherId === weatherId);
            const response = await fetch(`/api/favorites/${favorite.id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                favorites = favorites.filter(fav => fav.weatherId !== weatherId);
            }
        } else {
            // Add to favorites
            const weather = weatherData.find(w => w.id === weatherId);
            const response = await fetch('/api/favorites', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    weatherId: weatherId,
                    areaName: weather.area
                })
            });

            if (response.ok) {
                const newFavorite = await response.json();
                favorites.push(newFavorite.favorite);
            }
        }

        // Re-render both sections
        renderWeatherCards();
        renderFavorites();

    } catch (error) {
        console.error('Error toggling favorite:', error);
        alert('Failed to update favorites. Please try again.');
    }
}

// INTERMEDIATE: Render favorites list
function renderFavorites() {
    if (favorites.length === 0) {
        favoritesList.innerHTML = '<p class="no-favorites">No favorites added yet</p>';
        return;
    }

    // INTERMEDIATE: Array manipulation and template literals
    favoritesList.innerHTML = favorites.map(favorite => {
        return `
            <div class="favorite-item">
                <span class="favorite-name">${favorite.areaName}</span>
                <button class="remove-favorite" data-favorite-id="${favorite.id}">
                    Remove
                </button>
            </div>
        `;
    }).join('');

    // INTERMEDIATE: Event delegation for favorites
    attachFavoriteListeners();
}

// INTERMEDIATE: Attach favorite list event listeners
function attachFavoriteListeners() {
    favoritesList.removeEventListener('click', handleFavoriteClick);
    favoritesList.addEventListener('click', handleFavoriteClick);
}

// INTERMEDIATE: Handle favorite item clicks
async function handleFavoriteClick(e) {
    if (e.target.classList.contains('remove-favorite')) {
        const favoriteId = e.target.dataset.favoriteId;
        await removeFavorite(favoriteId);
    }
}

// INTERMEDIATE: Remove favorite functionality
async function removeFavorite(favoriteId) {
    try {
        const response = await fetch(`/api/favorites/${favoriteId}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            favorites = favorites.filter(fav => fav.id !== favoriteId);
            renderFavorites();
            renderWeatherCards(); // Update heart icons
        }
    } catch (error) {
        console.error('Error removing favorite:', error);
        alert('Failed to remove favorite. Please try again.');
    }
}

// INTERMEDIATE: Data lookup and modal display
function showWeatherDetails(weatherId) {
    // INTERMEDIATE: Array find method
    const weather = weatherData.find(w => w.id === weatherId);
    if (!weather) return;

    // ADVANCED: Dynamic HTML generation with destructuring
    const { timeWeather } = weather;

    modalBody.innerHTML = `
        <h2 class="modal-title">${weather.area} - Detailed Weather</h2>
        <div class="time-periods">
            ${Object.entries(timeWeather).map(([period, data]) => `
                <div class="time-period">
                    <h4>${period}</h4>
                    <div class="period-details">
                        <div><strong>Temperature:</strong> ${data.temp}°C</div>
                        <div><strong>Condition:</strong> ${data.condition}</div>
                        <div><strong>Humidity:</strong> ${data.humidity}%</div>
                        <div><strong>Wind:</strong> ${data.wind} km/h</div>
                    </div>
                </div>
            `).join('')}
        </div>
    `;

    modal.classList.remove('hidden');
}

// BEGINNER: Modal close functionality
function closeModal() {
    modal.classList.add('hidden');
}

// BEGINNER: Simple state management functions
function showLoading() {
    loadingState.classList.remove('hidden');
    errorState.classList.add('hidden');
    weatherGrid.classList.add('hidden');
}

function hideLoading() {
    loadingState.classList.add('hidden');
    weatherGrid.classList.remove('hidden');
}

function showError() {
    loadingState.classList.add('hidden');
    errorState.classList.remove('hidden');
    weatherGrid.classList.add('hidden');
}

// BEGINNER: Initialize the application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Wait a moment for MirageJS to initialize
    setTimeout(() => {
        init();
    }, 100);
});

/*
EDUCATIONAL NOTES FOR BOOTCAMP COACHES:

BEGINNER SKILLS DEMONSTRATED:
- Basic DOM manipulation (getElementById, addEventListener)
- Simple event handling (click, input, change events)
- CSS class manipulation (add/remove)
- Basic function declarations and calls
- Global variables for state management

INTERMEDIATE SKILLS DEMONSTRATED:
- Async/await for API calls
- Fetch API usage with error handling
- Event delegation pattern
- Array methods (filter, find, some, map)
- Template literals for HTML generation
- Object destructuring

ADVANCED SKILLS DEMONSTRATED:
- Complex state management across multiple functions
- Dynamic HTML generation with data binding
- Error boundaries and user feedback
- Responsive design considerations
- Modern JavaScript patterns (arrow functions, spreading, etc.)
- RESTful API simulation and CRUD operations

FUNCTIONAL VS CLASS-BASED APPROACH:
- Functional approach is easier for beginners to understand
- Global state is more explicit and visible
- Each function has a single responsibility
- Easier to debug and test individual functions
- More straightforward for bootcamp progression

TEACHING PROGRESSION:
1. Start with static HTML/CSS (beginners work on structure and styling)
2. Add basic interactivity (intermediate students add search and filters)
3. Implement API integration (advanced students handle async operations)
4. Add favorites system (advanced students implement full CRUD functionality)
*/