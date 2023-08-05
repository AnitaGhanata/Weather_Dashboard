const apiKey = '2b5396a2685046049aa4b50b3666700f';
const weatherCardsContainer = document.getElementById('weatherCards');
const cityInput = document.getElementById('cityInput');
const addCityBtn = document.getElementById('addCityBtn');

let cities = [];

addCityBtn.addEventListener('click', () => {
    const city = cityInput.value.trim();

    if (!city) {
        alert('Please enter a valid city name.');
        return;
    }

    if (cities.includes(city)) {
        alert('City already added.');
        return;
    }

    fetchWeatherData(city);
});

function fetchWeatherData(city) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('City not found. Please enter a valid city name.');
            }
            return response.json();
        })
        .then(data => {
            
            const { name, main, weather } = data;
            const weatherCard = createWeatherCard(name, main.temp, main.temp_min, main.temp_max, weather[0].main, data.sys.country);
            cities.push(name);
            cities.sort((cityA, cityB) => {
                const weatherA = getWeatherDataForCity(cityA);
                const weatherB = getWeatherDataForCity(cityB);
                return weatherA.temp - weatherB.temp;
            });
            displayWeatherCards();
        })
        .catch(error => {
            alert(error.message);
            console.error(error);
        });
}

function createWeatherCard(city, temp, minTemp, maxTemp, weatherCondition, country) {
    const weatherCard = document.createElement('div');
    weatherCard.classList.add('weather-card');

    const temperature = document.createElement('h3');
    temperature.textContent = `${temp}°C`;
    
    weatherCard.appendChild(temperature);

    const weatherIcon = document.createElement('img');
    weatherIcon.src = getWeatherIconUrl(weatherCondition);
    weatherIcon.alt = weatherCondition; 
    weatherCard.appendChild(weatherIcon);

    const weatherDesc = document.createElement('p');
    weatherDesc.textContent = weatherCondition;
    weatherCard.appendChild(weatherDesc);

    const weatherMinMax = document.createElement('p');
    weatherMinMax.textContent = `H: ${maxTemp}°C L: ${minTemp}°C`;
    weatherCard.appendChild(weatherMinMax);

    const cityCountry = document.createElement('p');
    cityCountry.textContent = `${city}, ${country}`;
    weatherCard.appendChild(cityCountry);

    weatherCardsContainer.appendChild(weatherCard);

    return weatherCard;
}

function getWeatherIconUrl(weatherCondition) {
    
    const weatherIcons = {
        rainy:"images/Big/moon cloud angled rain.png",
        sunny: 'images/Big/Sun cloud angled rain.png', 
        cloudy: 'images/Big/Tornado.png',
      Windy: 'images/Big/Moon cloud fast wind.png',
    };

    const defaultIconUrl = 'images/Big/Moon cloud fast wind.png'; 

    return weatherIcons[weatherCondition] || defaultIconUrl;
}

function displayWeatherCards() {
    weatherCardsContainer.innerHTML = '';
    cities.forEach(city => {
        const cityWeather = getWeatherDataForCity(city);
        cityWeather.then(data => {
            createWeatherCard( data.temp, data.minTemp, data.maxTemp, data.weatherCondition,data.city, data.country);
        });
    });
}

function getWeatherDataForCity(city) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    return fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('City not found. Please enter a valid city name.');
            }
            return response.json();
        })
        .then(data => {
            const { name, main, weather, sys } = data;
            return {
                
                temp: main.temp,
                minTemp: main.temp_min,
                maxTemp: main.temp_max,
                weatherCondition: weather[0].main,
                city: name,
                country: sys.country,
            };
        })
        .catch(error => {
            console.error(error);
        });
}