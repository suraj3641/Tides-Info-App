# 🌊 Tides Info App

A React + Vite + Leaflet based web app to view upcoming **High & Low Tides** for any location.  
The app uses **WorldTides API** to fetch tide timings and shows them on an interactive map.  

---

## 🚀 Features
- 🌍 Auto-detect current location (GPS)
- 📍 Manual Latitude/Longitude input
- 🗺️ Interactive map with marker (Leaflet)
- ⏰ Live clock + countdown to next tide
- 💾 Location saved in local storage
- 🌑 Displays tide height (when available)
- Responsive dark UI

---

## 🛠️ Installation & Setup

1. Clone this repo:
   ```bash
   git clone https://github.com/your-username/tides-info-app.git
   cd tides-info-app

## Install dependencies:
npm install

## Add your WorldTides API key in App.jsx:
const API_KEY = "YOUR_API_KEY_HERE"

## Run the app:
npm run dev



🧪 Example Coordinates (for testing)
City	Latitude	Longitude
Mumbai	19.0760	72.8777
Goa	15.2993	74.1240
Chennai	13.0827	80.2707
Kolkata	22.5726	88.3639
Kochi	9.9312	76.2673
Vizag	17.6868	83.2185

⚠️ Inland cities (e.g., Lucknow, Delhi) will show No tide data available.

LIVE DEMO= https://tides-info-app.vercel.app/