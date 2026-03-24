import { useState, useEffect } from 'react';
import axios from 'axios';

// Helps map WMO weather codes to human-friendly text, high-quality icons, and premium gradients.
function getWmoDetails(code, isDay) {
  let text = "Unknown";
  let icon = "Sun";
  let bg = isDay ? "from-blue-400 to-indigo-500" : "from-slate-900 to-indigo-900";
  let textMode = "text-white";
  let pulse = false;

  const codes = {
    0: { txt: "Sunny", nTxt: "Clear", ic: "Sun", nIc: "Moon", bgDay: "from-orange-400 to-amber-500", bgNight: "from-indigo-900 to-slate-900", tm: "text-white" },
    1: { txt: "Mostly Sunny", nTxt: "Mostly Clear", ic: "CloudSun", nIc: "CloudMoon", bgDay: "from-blue-400 to-blue-300", bgNight: "from-slate-800 to-slate-900", tm: "text-white" },
    2: { txt: "Partly Cloudy", nTxt: "Partly Cloudy", ic: "CloudSun", nIc: "CloudMoon", bgDay: "from-blue-300 to-blue-200", bgNight: "from-slate-700 to-slate-800", tm: "text-slate-900" },
    3: { txt: "Cloudy", nTxt: "Cloudy", ic: "Cloud", nIc: "Cloud", bgDay: "from-slate-300 to-gray-400", bgNight: "from-slate-600 to-slate-800", tm: "text-slate-900" },
    45: { txt: "Foggy", nTxt: "Foggy", ic: "CloudFog", nIc: "CloudFog", bgDay: "from-gray-300 to-gray-400", bgNight: "from-gray-700 to-gray-900", tm: "text-gray-900" },
    48: { txt: "Rime Fog", nTxt: "Rime Fog", ic: "CloudFog", nIc: "CloudFog", bgDay: "from-gray-300 to-gray-400", bgNight: "from-gray-700 to-gray-900", tm: "text-gray-900" },
    51: { txt: "Light Drizzle", nTxt: "Light Drizzle", ic: "CloudDrizzle", nIc: "CloudDrizzle", bgDay: "from-slate-400 to-slate-500", bgNight: "from-slate-800 to-slate-900", tm: "text-white" },
    53: { txt: "Drizzle", nTxt: "Drizzle", ic: "CloudDrizzle", nIc: "CloudDrizzle", bgDay: "from-slate-400 to-slate-500", bgNight: "from-slate-800 to-slate-900", tm: "text-white" },
    55: { txt: "Heavy Drizzle", nTxt: "Heavy Drizzle", ic: "CloudDrizzle", nIc: "CloudDrizzle", bgDay: "from-slate-500 to-slate-600", bgNight: "from-slate-800 to-slate-900", tm: "text-white" },
    56: { txt: "Freezing Drizzle", nTxt: "Freezing Drizzle", ic: "CloudHail", nIc: "CloudHail", bgDay: "from-slate-400 to-slate-500", bgNight: "from-slate-800 to-slate-900", tm: "text-white" },
    57: { txt: "Freezing Drizzle", nTxt: "Freezing Drizzle", ic: "CloudHail", nIc: "CloudHail", bgDay: "from-slate-400 to-slate-500", bgNight: "from-slate-800 to-slate-900", tm: "text-white" },
    61: { txt: "Light Rain", nTxt: "Light Rain", ic: "CloudRain", nIc: "CloudRain", bgDay: "from-slate-600 to-slate-700", bgNight: "from-slate-800 to-blue-900", tm: "text-white", p: true },
    63: { txt: "Rainy", nTxt: "Rainy", ic: "CloudRain", nIc: "CloudRain", bgDay: "from-slate-600 to-slate-700", bgNight: "from-slate-800 to-blue-900", tm: "text-white", p: true },
    65: { txt: "Heavy Rain", nTxt: "Heavy Rain", ic: "CloudRain", nIc: "CloudRain", bgDay: "from-slate-700 to-slate-800", bgNight: "from-slate-900 to-blue-900", tm: "text-white", p: true },
    66: { txt: "Freezing Rain", nTxt: "Freezing Rain", ic: "CloudHail", nIc: "CloudHail", bgDay: "from-slate-600 to-slate-700", bgNight: "from-slate-800 to-slate-900", tm: "text-white", p: true },
    67: { txt: "Heavy Freezing Rain", nTxt: "Heavy Freezing Rain", ic: "CloudHail", nIc: "CloudHail", bgDay: "from-slate-700 to-slate-800", bgNight: "from-slate-900 to-slate-900", tm: "text-white", p: true },
    71: { txt: "Light Snow", nTxt: "Light Snow", ic: "CloudSnow", nIc: "CloudSnow", bgDay: "from-blue-200 to-blue-300", bgNight: "from-blue-800 to-blue-900", tm: "text-slate-800" },
    73: { txt: "Snowy", nTxt: "Snowy", ic: "CloudSnow", nIc: "CloudSnow", bgDay: "from-blue-200 to-blue-300", bgNight: "from-blue-800 to-blue-900", tm: "text-slate-800" },
    75: { txt: "Heavy Snow", nTxt: "Heavy Snow", ic: "CloudSnow", nIc: "CloudSnow", bgDay: "from-blue-300 to-gray-300", bgNight: "from-blue-900 to-slate-900", tm: "text-slate-800" },
    77: { txt: "Snow Grains", nTxt: "Snow Grains", ic: "CloudSnow", nIc: "CloudSnow", bgDay: "from-blue-200 to-blue-300", bgNight: "from-blue-800 to-blue-900", tm: "text-slate-800" },
    80: { txt: "Light Showers", nTxt: "Light Showers", ic: "CloudRain", nIc: "CloudRain", bgDay: "from-slate-500 to-slate-600", bgNight: "from-slate-800 to-slate-900", tm: "text-white", p: true },
    81: { txt: "Showers", nTxt: "Showers", ic: "CloudRain", nIc: "CloudRain", bgDay: "from-slate-600 to-slate-700", bgNight: "from-slate-800 to-slate-900", tm: "text-white", p: true },
    82: { txt: "Heavy Showers", nTxt: "Heavy Showers", ic: "CloudRain", nIc: "CloudRain", bgDay: "from-slate-700 to-slate-800", bgNight: "from-slate-900 to-slate-900", tm: "text-white", p: true },
    85: { txt: "Snow Showers", nTxt: "Snow Showers", ic: "CloudSnow", nIc: "CloudSnow", bgDay: "from-blue-300 to-gray-300", bgNight: "from-blue-900 to-slate-900", tm: "text-slate-800" },
    86: { txt: "Heavy Snow Showers", nTxt: "Heavy Snow Showers", ic: "CloudSnow", nIc: "CloudSnow", bgDay: "from-blue-300 to-gray-400", bgNight: "from-blue-900 to-slate-900", tm: "text-slate-800" },
    95: { txt: "Thunderstorm", nTxt: "Thunderstorm", ic: "CloudLightning", nIc: "CloudLightning", bgDay: "from-slate-700 to-purple-900", bgNight: "from-slate-900 to-purple-900", tm: "text-white", p: true },
    96: { txt: "Thunderstorm, Hail", nTxt: "Thunderstorm, Hail", ic: "CloudLightning", nIc: "CloudLightning", bgDay: "from-slate-800 to-purple-900", bgNight: "from-slate-900 to-purple-950", tm: "text-white", p: true },
    99: { txt: "Severe Thunderstorm", nTxt: "Severe Thunderstorm", ic: "CloudLightning", nIc: "CloudLightning", bgDay: "from-slate-900 to-purple-950", bgNight: "from-slate-950 to-purple-950", tm: "text-white", p: true }
  };

  const match = codes[code];
  if (match) {
    text = isDay ? match.txt : match.nTxt;
    icon = isDay ? match.ic : match.nIc;
    bg = isDay ? match.bgDay : match.bgNight;
    textMode = match.tm;
    pulse = match.p || false;
  }

  return { text, icon, bg, textMode, pulse };
}

// Convert °C to °F
const toF = (c) => (c * 9/5) + 32;

export function useWeather(query) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // 1. Log when useEffect triggers
    console.log(`[useWeather] Hook triggered for query: "${query}"`);

    if (!query) {
      console.log("[useWeather] Query is empty. Resetting state.");
      setData(null);
      setError(null);
      return;
    }

    const abortController = new AbortController();

    const fetchWeather = async () => {
      console.log("[useWeather] fetchWeather started.");
      setLoading(true);
      setError(null);
      
      try {
        let lat, lon, locName, locRegion, locCountry;

        // 1. Check if the query is a coordinate (from geolocation)
        if (query.includes(',')) {
          const parts = query.split(',');
          if (!isNaN(parts[0]) && !isNaN(parts[1])) {
            lat = parseFloat(parts[0]);
            lon = parseFloat(parts[1]);
            locName = "Your Location";
            locRegion = "Local Area";
            locCountry = "";
            console.log(`[useWeather] Parsed coordinates from query: lat=${lat}, lon=${lon}`);
          }
        } 
        
        if (lat === undefined || lon === undefined) {
          console.log(`[useWeather] Calling Geocoding API for city: "${query}"`);
          const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=1&language=en&format=json`;
          
          const geoResponse = await axios.get(geoUrl, { 
            signal: abortController.signal,
            timeout: 10000 // 10 second timeout
          });
          
          console.log("[useWeather] Geocoding API response received:", geoResponse.data);

          if (!geoResponse.data.results || geoResponse.data.results.length === 0) {
             console.error("[useWeather] Geocoding error: No results found.");
             throw new Error(`Location "${query}" not found. Please try another search.`);
          }
          
          const hit = geoResponse.data.results[0];
          
          if (hit.latitude === undefined || hit.longitude === undefined) {
             console.error("[useWeather] Geocoding error: Response missing lat/lon.");
             throw new Error("Invalid location data received.");
          }

          lat = hit.latitude;
          lon = hit.longitude;
          locName = hit.name;
          locRegion = hit.admin1 || "";
          locCountry = hit.country || "";
          console.log(`[useWeather] Geocoding successful: ${locName} (${lat}, ${lon})`);
        }

        console.log(`[useWeather] Calling Weather API for coordinates: lat=${lat}, lon=${lon}`);
        const meteoUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,is_day,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=3`;
        
        const response = await axios.get(meteoUrl, { 
          signal: abortController.signal,
          timeout: 15000 // 15 second timeout for weather payload
        });
        
        console.log("[useWeather] Weather API response received:", response.data);
        const md = response.data;
        
        const isDay = md.current.is_day;
        const currentContext = getWmoDetails(md.current.weather_code, isDay);
        
        console.log("[useWeather] Mapping data to UI format...");
        const mappedData = {
          location: {
            name: locName,
            region: locRegion,
            country: locCountry
          },
          theme: {
            bg: `bg-gradient-to-br ${currentContext.bg}`,
            text: currentContext.textMode,
            pulse: currentContext.pulse
          },
          current: {
            temp_c: md.current.temperature_2m,
            temp_f: toF(md.current.temperature_2m),
            is_day: isDay,
            condition: currentContext,
            wind_kph: md.current.wind_speed_10m,
            wind_mph: md.current.wind_speed_10m / 1.609,
            humidity: md.current.relative_humidity_2m
          },
          forecast: {
            forecastday: md.daily.time.map((timeStr, idx) => {
              const dateObj = new Date(timeStr);
              dateObj.setHours(12);
              const dateEpoch = dateObj.getTime() / 1000;
              return {
                date: timeStr,
                date_epoch: dateEpoch,
                day: {
                  maxtemp_c: md.daily.temperature_2m_max[idx],
                  maxtemp_f: toF(md.daily.temperature_2m_max[idx]),
                  mintemp_c: md.daily.temperature_2m_min[idx],
                  mintemp_f: toF(md.daily.temperature_2m_min[idx]),
                  condition: getWmoDetails(md.daily.weather_code[idx], 1) // Daily uses Day icons
                }
              };
            })
          }
        };
        
        console.log("[useWeather] Setting data state with mapped payload.");
        setData(mappedData);

      } catch (err) {
        if (axios.isCancel(err)) {
          console.log("[useWeather] Request canceled because component unmounted or query changed.");
          // We don't set error/loading to stop state updates on unmounted/stale requests.
          return;
        }

        console.error("[useWeather] Error during fetchWeather:", err);
        
        // Handle Axios specific errors vs standard errors
        let errorMessage = "Failed to fetch weather data. Please try again.";
        
        if (!navigator.onLine || err.message === 'Network Error') {
          errorMessage = "Network offline. Please check your internet connection.";
        } else if (err.code === 'ECONNABORTED' || err.message.includes('timeout')) {
          errorMessage = "Request timed out. The server took too long to respond.";
        } else if (err.response) {
          // Server responded with an error (e.g. 400, 500)
          errorMessage = `Server Error: ${err.response.status} - ${err.response.data?.reason || err.response.statusText}`;
        } else if (err.message) {
          errorMessage = err.message;
        }
        
        console.log(`[useWeather] Setting error state: "${errorMessage}"`);
        setError(errorMessage);
        setData(null);
      } finally {
        console.log("[useWeather] fetchWeather finally block executed. Setting loading to false.");
        setLoading(false);
      }
    };

    fetchWeather();

    // Cleanup function: abort the fetch if the query changes or component unmounts
    return () => {
      console.log(`[useWeather] Cleanup triggered for query: "${query}". Aborting any pending requests.`);
      abortController.abort();
    };
  }, [query]);

  return { data, loading, error };
}
