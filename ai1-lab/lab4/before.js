const WeatherApp = class {
    constructor(apiKey, resultsBlockSelector) {
        this.apiKey = apiKey;
        this.currentWeatherLink = "https://api.openweathermap.org/data/2.5/weather?q={query}&appid={apiKey}&units=metric&lang=pl";
        this.forecastLink = "https://api.openweathermap.org/data/2.5/forecast?q={query}&appid={apiKey}&units=metric&lang=pl";
        this.iconLink = "https://openweathermap.org/img/wn/{iconName}@2x.png";

        this.currentWeatherLink = this.currentWeatherLink.replace("{apiKey}", this.apiKey);
        this.forecastLink = this.forecastLink.replace("{apiKey}", this.apiKey);

        this.currentWeather = null;
        this.forecast = null;

        this.resultsBlock = document.querySelector(resultsBlockSelector);
    }

    getCurrentWeather(query) {
        let url = this.currentWeatherLink.replace("{query}", query);
        let req = new XMLHttpRequest();
        req.open("GET", url, true);
        req.addEventListener("load", () => {
            this.currentWeather = JSON.parse(req.responseText);
            console.log(this.currentWeather);
            this.drawWeather();
        });
        req.send();
    }

    getForecast(query) {
        let url = this.forecastLink.replace("{query}", query);
        fetch(url).then((response) => {
            return response.json();
        }).then((data) => {
            this.forecast = data.list;
            console.log(data);
            this.drawWeather();
        });
    }

    getWeather(query) {
        this.getCurrentWeather(query);
        this.getForecast(query);
    }

    drawWeather() {
        // Clear previous blocks
        this.resultsBlock.innerHTML = '';

        // Add current weather block
        if (this.currentWeather) {
            const date = new Date(this.currentWeather.dt * 1000);
            const dateTimeString = `${date.toLocaleDateString("pl-PL")} ${date.toLocaleTimeString("pl-PL")}`;

            const temperature = this.currentWeather.main.temp;
            const feelsLikeTemperature = this.currentWeather.main.feels_like;
            const iconName = this.currentWeather.weather[0].icon;
            const description = this.currentWeather.weather[0].description;

            const currentWeatherBlock = this.createCurrentWeatherBlock(dateTimeString, temperature, feelsLikeTemperature, iconName, description);
            this.resultsBlock.appendChild(currentWeatherBlock);
        }

        // Add forecast weather blocks grouped by date
        if (this.forecast && this.forecast.length > 0) {
            const groupedForecast = this.groupForecastByDate();

            for (const [date, weatherList] of Object.entries(groupedForecast)) {
                const column = document.createElement("div");
                column.className = "weather-column";

                const dateHeader = document.createElement("h3");
                dateHeader.className = "weather-date-header";
                dateHeader.innerText = date;
                column.appendChild(dateHeader);

                weatherList.forEach(weather => {
                    const dateTimeString = `${new Date(weather.dt * 1000).toLocaleTimeString("pl-PL")}`;
                    const temperature = weather.main.temp;
                    const feelsLikeTemperature = weather.main.feels_like;
                    const iconName = weather.weather[0].icon;
                    const description = weather.weather[0].description;

                    const weatherBlock = this.createWeatherBlock(dateTimeString, temperature, feelsLikeTemperature, iconName, description);
                    column.appendChild(weatherBlock);
                });

                this.resultsBlock.appendChild(column);
            }
        }
    }

    groupForecastByDate() {
        const grouped = {};
        this.forecast.forEach(weather => {
            const date = new Date(weather.dt * 1000).toLocaleDateString("pl-PL");
            if (!grouped[date]) {
                grouped[date] = [];
            }
            grouped[date].push(weather);
        });
        return grouped;
    }

    createCurrentWeatherBlock(dateString, temperature, feelsLikeTemperature, iconName, description) {
        let weatherBlock = document.createElement("div");
        weatherBlock.className = "current-weather-block";

        let dateBlock = document.createElement("div");
        dateBlock.className = "current-weather-date";
        dateBlock.innerText = `Data: ${dateString}`;
        weatherBlock.appendChild(dateBlock);

        let temperatureBlock = document.createElement("div");
        temperatureBlock.className = "current-weather-temp";
        temperatureBlock.innerHTML = `Temperatura: ${temperature} &deg;C`;
        weatherBlock.appendChild(temperatureBlock);

        let feelsLikeBlock = document.createElement("div");
        feelsLikeBlock.className = "current-weather-extra";
        feelsLikeBlock.innerHTML = `Odczuwalna: ${feelsLikeTemperature} &deg;C`;
        weatherBlock.appendChild(feelsLikeBlock);

        let weatherIcon = document.createElement("img");
        weatherIcon.className = "weather-icon";
        weatherIcon.src = this.iconLink.replace("{iconName}", iconName);
        weatherBlock.appendChild(weatherIcon);

        let weatherDescription = document.createElement("div");
        weatherDescription.className = "current-weather-description";
        weatherDescription.innerText = `Opis: ${description}`;
        weatherBlock.appendChild(weatherDescription);

        return weatherBlock;
    }

    createWeatherBlock(dateString, temperature, feelsLikeTemperature, iconName, description) {
        let weatherBlock = document.createElement("div");
        weatherBlock.className = "weather-block";

        // Data i czas
        let dateBlock = document.createElement("div");
        dateBlock.className = "weather-date";
        dateBlock.innerText = dateString;
        weatherBlock.appendChild(dateBlock);

        // Temperatura
        let temperatureBlock = document.createElement("div");
        temperatureBlock.className = "weather-temperature";
        temperatureBlock.innerHTML = `${temperature} &deg;C`;
        weatherBlock.appendChild(temperatureBlock);

        // Temperatura odczuwalna
        let feelsLikeBlock = document.createElement("div");
        feelsLikeBlock.className = "weather-temperature-feels-like";
        feelsLikeBlock.innerHTML = `Odczuwalna: ${feelsLikeTemperature} &deg;C`;
        weatherBlock.appendChild(feelsLikeBlock);

        // Ikona pogody
        let weatherIcon = document.createElement("img");
        weatherIcon.className = "weather-icon";
        weatherIcon.src = this.iconLink.replace("{iconName}", iconName);
        weatherBlock.appendChild(weatherIcon);

        // Opis pogody (wewnątrz tego samego bloku)
        let weatherDescription = document.createElement("div");
        weatherDescription.className = "weather-description";
        weatherDescription.innerText = description;
        weatherBlock.appendChild(weatherDescription);

        return weatherBlock;
    }

}

document.weatherApp = new WeatherApp("4908abaadeaa9cc8d8825b79b7bf0df7", "#weather-results-container");

document.querySelector("#checkButton").addEventListener("click", function () {
    const query = document.querySelector("#locationInput").value;
    document.weatherApp.getWeather(query);
});
