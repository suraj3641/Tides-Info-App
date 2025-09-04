import { useEffect, useState, useRef } from "react";
import { DateTime } from "luxon";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./App.css";

const API_KEY = "2bc7ac89-06a6-403a-9ca5-7fc188088d39";

function App() {
  const [tides, setTides] = useState([]);
  const [coords, setCoords] = useState(null);
  const [manualLat, setManualLat] = useState("");
  const [manualLng, setManualLng] = useState("");
  const [currentTime, setCurrentTime] = useState(DateTime.local());
  const mapRef = useRef(null);

  // fetch tide data
  const fetchTideData = async (lat, lng) => {
    try {
      const url = `https://www.worldtides.info/api/v3?extremes&lat=${lat}&lon=${lng}&key=${API_KEY}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data && data.extremes) {
        setTides(data.extremes.slice(0, 2));
      } else {
        setTides([]);
      }
    } catch (err) {
      console.error("Tide fetch error:", err);
    }
  };

  // initialize map
  const initMap = (lat, lng) => {
    if (!mapRef.current) {
      mapRef.current = L.map("map").setView([lat, lng], 10);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors",
      }).addTo(mapRef.current);
    }
    L.marker([lat, lng])
      .addTo(mapRef.current)
      .bindPopup("Nearest Coast / Station")
      .openPopup();
  };

  // manual search handler
  const handleManualSearch = () => {
    if (!manualLat || !manualLng) return;
    const lat = parseFloat(manualLat);
    const lng = parseFloat(manualLng);
    setCoords({ lat, lng });
    localStorage.setItem("location", JSON.stringify({ lat, lng }));
    initMap(lat, lng);
    fetchTideData(lat, lng);
  };

  const clearLocation = () => {
    localStorage.removeItem("location");
    window.location.reload();
  };

  // live clock
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(DateTime.local());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // auto location detect
  useEffect(() => {
    const saved = localStorage.getItem("location");
    if (saved) {
      const parsed = JSON.parse(saved);
      setCoords(parsed);
      initMap(parsed.lat, parsed.lng);
      fetchTideData(parsed.lat, parsed.lng);
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        const { latitude, longitude } = pos.coords;
        setCoords({ lat: latitude, lng: longitude });
        localStorage.setItem("location", JSON.stringify({ lat: latitude, lng: longitude }));
        initMap(latitude, longitude);
        fetchTideData(latitude, longitude);
      });
    }
  }, []);

  // countdown
  const getCountdown = (time) => {
    const diff = DateTime.fromISO(time).diff(currentTime, ["hours", "minutes"]).toObject();
    if (diff.hours < 0 || diff.minutes < 0) return "Passed";
    return `${Math.floor(diff.hours)}h ${Math.floor(diff.minutes)}m left`;
  };

  return (
    <div className="App">
      <header>
        <h1>Tides Info 🌊</h1>
        <button onClick={clearLocation}>Clear Location</button>
      </header>

      <main>
        {/* Manual Input Fields */}
        <div className="manual-input">
          <input
            type="number"
            step="0.0001"
            placeholder="Latitude"
            value={manualLat}
            onChange={(e) => setManualLat(e.target.value)}
          />
          <input
            type="number"
            step="0.0001"
            placeholder="Longitude"
            value={manualLng}
            onChange={(e) => setManualLng(e.target.value)}
          />
          <button onClick={handleManualSearch}>Search</button>
        </div>

        {/* Current Time */}
        <div className="clock">⏰ {currentTime.toFormat("ccc, dd LLL • hh:mm:ss a")}</div>

        {/* Map */}
        <div id="map"></div>

        {/* Tide Info */}
        <div className="card">
          <h2>
            Tides{" "}
            {coords && (
              <span className="location">
                
              </span>
            )}
          </h2>
          <ul>
            {tides.length === 0 && <li>No tide data available</li>}
            {tides.map((tide, index) => {
              const localTime = DateTime.fromISO(tide.date, { zone: "utc" }).setZone(
                Intl.DateTimeFormat().resolvedOptions().timeZone
              );
              return (
                <li key={index}>
                  <span className={`tag ${tide.type.toLowerCase()}`}>{tide.type}</span>
                  {localTime.toFormat("ccc, dd LLL • hh:mm a")}
                  <span className="countdown"> ({getCountdown(tide.date)})</span>
                  <span className="height"> | Height: {tide.height?.toFixed(2) ?? "N/A"} m</span>
                </li>
              );
            })}
          </ul>
        </div>
      </main>
    </div>
  );
}

export default App;
