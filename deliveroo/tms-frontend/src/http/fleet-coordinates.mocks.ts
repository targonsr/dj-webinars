const countries = [
  {
    name: "Germany",
    latMin: 47.27, latMax: 55.05,
    lonMin: 5.87,  lonMax: 15.03
  },
  {
    name: "Poland",
    latMin: 49.00, latMax: 54.84,
    lonMin: 14.12, lonMax: 24.14
  },
  {
    name: "Belarus",
    latMin: 51.27, latMax: 56.17,
    lonMin: 23.18, lonMax: 32.78
  },
  {
    name: "Ukraine",
    latMin: 44.00, latMax: 52.37,
    lonMin: 22.00, lonMax: 41.00
  },
  {
    name: "Czech",
    latMin: 48.55, latMax: 51.06,
    lonMin: 12.09, lonMax: 18.85
  },
  {
    name: "Slovakia",
    latMin: 47.74, latMax: 49.60,
    lonMin: 16.85, lonMax: 22.57
  }
];

export function randomCoordinateCentralEurope() {
  // 50% chance for Poland, 50% for others
  let country: typeof countries[number];
  if (Math.random() < 0.5) {
    country = countries.find(c => c.name === "Poland");
  } else {
    // Exclude Poland for the other half
    const others = countries.filter(c => c.name !== "Poland");
    country = others[Math.floor(Math.random() * others.length)];
  }

  // Generate random latitude and longitude within the bounds
  const latitude = country.latMin + Math.random() * (country.latMax - country.latMin);
  const longitude = country.lonMin + Math.random() * (country.lonMax - country.lonMin);

  return { latitude, longitude };
}
