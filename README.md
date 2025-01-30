# 🌦️ Whether.io

## 📌 Overview
This project is a **Weather Comparison App** that allows users to search for a location and compare the weather for the same day of the week across two consecutive weeks. It provides a user-friendly interface with responsive design and seamless weather data retrieval.

## 🚀 Features
- **Location Search**: Users can enter a location to fetch its weather forecast.
- **Day Selector**: Allows selection of a specific day of the week to compare across two weeks.
- **Mobile & Desktop Support**:
  - **Mobile**: Displays one week's weather at a time with navigation arrows.
  - **Desktop**: Displays both weeks side by side.
- **Weather Suggestion System**: Suggests the better day based on key weather conditions.
- **Local Storage Support**: Saves the last searched location for convenience.

## 📸 Screenshots
### Desktop
<img width="800" alt="Screenshot 2025-01-30 at 10 20 27 AM" src="https://github.com/user-attachments/assets/6e4c3d8f-68b9-4530-ae2d-e3c6010c5ae1" />

### Mobile
<img width="300" alt="Screenshot 2025-01-30 at 10 24 48 AM" src="https://github.com/user-attachments/assets/e1aa7659-290e-4767-943b-0f667aa3df39" />
<img width="300" alt="Screenshot 2025-01-30 at 10 21 05 AM" src="https://github.com/user-attachments/assets/705a7d89-df85-49ca-ab93-f1ff10d93d48" />


---

## ⚙️ Tech Stack
- **Frontend:** React, TypeScript, Tailwind CSS, ShadCN
- **State Management:** Apollo Client (GraphQL)
- **Backend:** Node.js, Express, GraphQL
- **Database:** N/A
- **API:** Visual Crossing Weather API, Google Places API

---

## 📦 Installation & Setup
### 1️⃣ Clone the Repository
```bash
git clone https://github.com/PrinceCarter/weather-comparison-app.git
cd weather-comparison-app
```

### 2️⃣ Install Dependencies
```bash
npm install  # or yarn install
```

### 3️⃣ Set Up Environment Variables
Create a `.env` file in the root directory and add:
```env
VISUAL_CROSSING_API_KEY=your_api_key_here
GOOGLE_MAPS_API_KEY=your_api_key_here
```

### 4️⃣ Start the Development Server
```bash
npm run dev  # or yarn dev
```
The app will be available at `http://localhost:5173`

---

## 📜 Usage Guide
1. **Enter a location** using the search bar.
2. **Select a day of the week** to compare the weather.
3. **View weather details** for this week and the next.
4. **On mobile**, use the arrows to switch between weeks.
5. **Check the weather suggestion** to decide the better day.

---

## 🛠️ API Endpoints
### **GraphQL Queries**
#### **Get Weather**
```graphql
query GetWeather($lat: Float!, $lon: Float!, $selectedDay: String!) {
  getWeather(lat: $lat, lon: $lon, selectedDay: $selectedDay) {
    date
    dayOfWeek
    temperature
    windSpeed
    humidity
    precipitation
    precipitationProbability
    description
    hourlyData {
      time
      temperature
      windSpeed
      humidity
      precipitation
      precipitationProbability
    }
  }
}
```

#### **Get Location Suggestions**
```graphql
query GetLocationSuggestions($input: String!) {
  getLocationSuggestions(input: $input) {
    description
    placeId
  }
}
```

#### **Get Location Details**
```graphql
query GetLocationDetails($placeId: String!) {
  getLocationDetails(placeId: $placeId) {
    lat
    lon
    address
  }
}
```

---

## 🐛 Known Issues & Fixes
- **Resizing bug** ✅ Now properly resets layout when switching between desktop and mobile.

---

## 📌 Future Enhancements
- 🌤️ **Dynamic Weather Updates** – Enhance the charts to update weather statistics dynamically alongside the time of day for a more immersive experience.
- 🔥 **Hourly Weather Breakdown**: View detailed hourly weather comparisons.
- 🌍 **Multi-Language Support**: Add translations for global users.
- 🎨 **Dark Mode**: Theme toggle for better readability.
- 🗺️ **Interactive Map Search**: Users can select locations on a map.

---

## 📄 License
This project is licensed under the **MIT License**.

---

## 🧑‍💻 Author
Built with ❤️ by Prince Carter

