// src/utils/chatTools.js

export async function handleLocalTools(prompt) {
  const lower = prompt.toLowerCase();

  // --- Time ---
  if (lower.includes("time")) {
    return `The current time is ${new Date().toLocaleTimeString()}`;
  }

  // --- Date ---
  if (lower.includes("date")) {
    return `Today is ${new Date().toLocaleDateString()}`;
  }

  // --- Battery ---
  if (lower.includes("battery")) {
    try {
      const battery = await navigator.getBattery();
      return `Battery level: ${Math.round(battery.level * 100)}% (${battery.charging ? "charging" : "not charging"})`;
    } catch {
      return "Sorry, I can't access battery info on this device.";
    }
  }

  // --- Weather (WeatherAPI) ---
  if (lower.includes("weather")) {
    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, { enableHighAccuracy: true });
      });

      const { latitude, longitude } = position.coords;
      const apiKey = "7188ba27711541f189f185937251509"; // 🔑 Replace with your real key

      const res = await fetch(
        `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${latitude},${longitude}&aqi=no`
      );
      const data = await res.json();

      return `Weather in ${data.location.name}, ${data.location.country}: ${data.current.condition.text}, ${data.current.temp_c}°C (feels like ${data.current.feelslike_c}°C)`;
    } catch (err) {
      return "Sorry, I couldn't fetch the weather. Make sure location services are enabled.";
    }
  }

  // --- If nothing matched ---
  return null;
}
