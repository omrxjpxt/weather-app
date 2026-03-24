import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, Droplets, Wind, AlertCircle, Sun, Moon, CloudSun, CloudMoon, Cloud, CloudFog, CloudDrizzle, CloudRain, CloudHail, CloudSnow, CloudLightning, Loader2 } from 'lucide-react';
import { useWeather } from './hooks/useWeather';
import { useDebounce } from './hooks/useDebounce';

const iconMap = { Sun, Moon, CloudSun, CloudMoon, Cloud, CloudFog, CloudDrizzle, CloudRain, CloudHail, CloudSnow, CloudLightning };

const WeatherIcon = ({ name, size = 24, className }) => {
  const IconComponent = iconMap[name] || Sun;
  return <IconComponent size={size} className={className} strokeWidth={1.2} />;
};

function App() {
  const [searchInput, setSearchInput] = useState('');
  const [query, setQuery] = useState('New York'); // Default location
  const [isMetric, setIsMetric] = useState(true);

  const debouncedSearch = useDebounce(searchInput, 500);

  useEffect(() => {
    if (debouncedSearch.trim()) {
      setQuery(debouncedSearch);
    }
  }, [debouncedSearch]);

  const { data, loading, error } = useWeather(query);

  const handleGeolocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          setSearchInput('');
          setQuery(`${lat},${lon}`);
        },
        (err) => {
          alert("Unable to retrieve your location. Please check your permissions.");
        }
      );
    } else {
      alert("Geolocation is not supported by your browser");
    }
  };

  const theme = data?.theme || { bg: 'bg-gradient-to-br from-slate-200 to-slate-400', text: 'text-slate-800', pulse: false };

  const formatDate = (dateString, epoch) => {
    const date = new Date(epoch * 1000);
    return new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(date);
  };

  const currentTemp = data ? (isMetric ? Math.round(data.current.temp_c) : Math.round(data.current.temp_f)) : null;
  const tempUnit = isMetric ? '°C' : '°F';

  return (
    <motion.div 
      className={`min-h-screen w-full flex items-center justify-center p-4 sm:p-8 transition-all duration-1000 ease-in-out ${theme.bg} ${theme.text}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      {/* Background Pulse Effect for Intense Weather */}
      {theme.pulse && (
        <div className="fixed inset-0 z-0 bg-black/5 animate-[pulse_4s_ease-in-out_infinite] pointer-events-none mix-blend-overlay"></div>
      )}

      {/* Main Glassmorphic Card */}
      <div className="z-10 w-full max-w-[420px] bg-white/10 backdrop-blur-2xl border border-white/20 p-6 sm:p-8 rounded-[2.5rem] shadow-2xl flex flex-col gap-6 relative overflow-visible">
        
        {/* Header & Controls */}
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold tracking-tight opacity-90">Weather</h1>
          <div className="flex flex-row items-center gap-2">
            <button 
              onClick={handleGeolocation}
              className="p-2 hover:bg-black/10 rounded-full transition-colors group relative"
              aria-label="Use Current Location"
            >
              <MapPin size={20} className="opacity-80" strokeWidth={2} />
              <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[10px] font-medium bg-black/80 text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 shadow-lg">
                Locate Me
              </span>
            </button>
            <div className="flex bg-black/10 rounded-full p-1 backdrop-blur-sm border border-white/5">
              <button 
                onClick={() => setIsMetric(true)}
                className={`px-3 py-1 text-xs font-semibold tracking-wider rounded-full transition-all duration-300 ${isMetric ? 'bg-white text-slate-900 shadow-md' : 'opacity-60 hover:opacity-100'}`}
              >
                °C
              </button>
              <button 
                onClick={() => setIsMetric(false)}
                className={`px-3 py-1 text-xs font-semibold tracking-wider rounded-full transition-all duration-300 ${!isMetric ? 'bg-white text-slate-900 shadow-md' : 'opacity-60 hover:opacity-100'}`}
              >
                °F
              </button>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative group z-20">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Search size={18} className="opacity-60" strokeWidth={2} />
          </div>
          <input 
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search city..."
            className="w-full bg-black/5 backdrop-blur-md border border-white/20 placeholder:text-inherit placeholder:opacity-60 focus:bg-white/10 focus:border-white/40 focus:ring-4 focus:ring-white/10 rounded-2xl py-3.5 pl-11 pr-4 outline-none transition-all shadow-inner font-medium text-sm"
          />
        </div>

        {/* Error Toast */}
        <AnimatePresence>
          {error && (
            <motion.div 
              initial={{ opacity: 0, height: 0, marginBottom: 0 }}
              animate={{ opacity: 1, height: 'auto', marginBottom: 8 }}
              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
              className="bg-red-500/90 backdrop-blur-xl text-white px-4 py-3 rounded-2xl flex items-center gap-3 shadow-xl border border-red-400/50 overflow-hidden z-10"
            >
              <AlertCircle size={18} className="shrink-0 drop-shadow-sm" strokeWidth={2.5} />
              <p className="font-medium text-sm drop-shadow-sm leading-tight">{error}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Loading Skeleton */}
        {loading && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
            className="space-y-6 flex flex-col items-center justify-center py-8"
          >
            <Loader2 className="animate-spin opacity-50 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" size={48} strokeWidth={1} />
            <div className="bg-white/5 border border-white/10 w-full rounded-3xl animate-pulse h-60 shadow-inner"></div>
            <div className="grid grid-cols-3 gap-3 w-full">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-white/5 border border-white/10 h-32 rounded-2xl animate-pulse"></div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Weather Content */}
        <AnimatePresence mode="wait">
          {!loading && data && (
            <motion.div 
              key={data.location.name}
              initial={{ opacity: 0, filter: 'blur(10px)', scale: 0.95 }}
              animate={{ opacity: 1, filter: 'blur(0px)', scale: 1 }}
              exit={{ opacity: 0, filter: 'blur(10px)', scale: 0.95 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="flex flex-col gap-8"
            >
              {/* Current Weather Display */}
              <div className="flex flex-col items-center">
                <div className="text-center mb-6">
                  <h2 className="text-4xl font-bold tracking-tight drop-shadow-sm mb-1">
                    {data.location.name}
                  </h2>
                  <p className="text-xs font-medium uppercase tracking-widest opacity-70">
                    {data.location.region}{data.location.country ? `, ${data.location.country}` : ''}
                  </p>
                </div>
                
                <div className="flex flex-col items-center justify-center mb-2">
                  <WeatherIcon name={data.current.condition.icon} className="drop-shadow-2xl mb-2" size={100} />
                  <div className="flex items-start drop-shadow-xl mt-2">
                    <span className="text-7xl leading-none font-bold tracking-tighter">
                      {currentTemp}
                    </span>
                    <span className="text-3xl mt-1 font-medium opacity-70">{tempUnit}</span>
                  </div>
                </div>
                
                <p className="text-xl font-medium mb-8 drop-shadow-md tracking-wide text-center opacity-90">
                  {data.current.condition.text}
                </p>

                {/* Micro Details */}
                <div className="grid grid-cols-2 w-full gap-3">
                  <div className="bg-black/5 rounded-2xl p-3.5 flex items-center justify-center gap-3 backdrop-blur-md border border-white/10 shadow-inner hover:bg-black/10 transition-colors cursor-default">
                    <Droplets className="opacity-60" size={20} strokeWidth={2} />
                    <div className="flex flex-col">
                      <p className="text-[10px] opacity-70 uppercase tracking-widest font-bold mb-0.5">Humidity</p>
                      <p className="font-semibold text-base leading-none">{data.current.humidity}%</p>
                    </div>
                  </div>
                  <div className="bg-black/5 rounded-2xl p-3.5 flex items-center justify-center gap-3 backdrop-blur-md border border-white/10 shadow-inner hover:bg-black/10 transition-colors cursor-default">
                    <Wind className="opacity-60" size={20} strokeWidth={2} />
                    <div className="flex flex-col">
                      <p className="text-[10px] opacity-70 uppercase tracking-widest font-bold mb-0.5">Wind</p>
                      <p className="font-semibold text-base leading-none whitespace-nowrap">
                        {isMetric ? `${Math.round(data.current.wind_kph)} km/h` : `${Math.round(data.current.wind_mph)} mph`}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Forecast Grid */}
              <div className="grid grid-cols-3 gap-3">
                {data.forecast.forecastday.map((day, idx) => (
                  <motion.div 
                    key={day.date_epoch}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 + 0.3, ease: "easeOut" }}
                    className="bg-black/5 backdrop-blur-md border border-white/10 py-4 px-2 rounded-2xl flex flex-col items-center justify-center text-center shadow-inner hover:bg-black/10 transition-colors"
                  >
                    <p className="text-[10px] font-bold uppercase tracking-widest opacity-70 mb-3 drop-shadow-sm">
                      {idx === 0 ? 'Today' : formatDate(day.date, day.date_epoch)}
                    </p>
                    <WeatherIcon name={day.day.condition.icon} size={32} className="drop-shadow-md mb-3 opacity-90" />
                    <div className="flex gap-1.5 text-sm font-bold tracking-tight">
                      <span>{isMetric ? Math.round(day.day.maxtemp_c) : Math.round(day.day.maxtemp_f)}°</span>
                      <span className="opacity-50 font-medium">{isMetric ? Math.round(day.day.mintemp_c) : Math.round(day.day.mintemp_f)}°</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export default App;
