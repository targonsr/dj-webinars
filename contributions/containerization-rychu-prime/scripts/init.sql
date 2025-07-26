-- Enable PostGIS extension
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS postgis_topology;

-- Create locations table with spatial index
CREATE TABLE locations (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    address TEXT,
    geom GEOGRAPHY(POINT, 4326) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Create spatial index for fast radius queries
CREATE INDEX locations_geom_idx ON locations USING GIST(geom);

-- Create geocoding cache table
CREATE TABLE geocoding_cache (
    address_hash VARCHAR(64) PRIMARY KEY,
    address TEXT NOT NULL,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    cached_at TIMESTAMP DEFAULT NOW()
);

-- Create index on cache for cleanup
CREATE INDEX geocoding_cache_cached_at_idx ON geocoding_cache(cached_at);

-- Insert sample Warsaw locations with accurate coordinates
INSERT INTO locations (name, description, address, geom) VALUES 
('Palace of Culture and Science', 'Iconic Warsaw landmark and cultural center', 'Plac Defilad 1, 00-901 Warszawa', ST_SetSRID(ST_MakePoint(21.006577, 52.231958), 4326)),
('Warsaw Old Town', 'Historic city center and UNESCO World Heritage Site', 'Rynek Starego Miasta, 00-272 Warszawa', ST_SetSRID(ST_MakePoint(21.012229, 52.249649), 4326)),
('Royal Castle', 'Former royal residence and museum', 'Plac Zamkowy 4, 00-277 Warszawa', ST_SetSRID(ST_MakePoint(21.011848, 52.247776), 4326)),
('Lazienki Park', 'Beautiful park with palaces and monuments', 'Agrykola 1, 00-460 Warszawa', ST_SetSRID(ST_MakePoint(21.035702, 52.215933), 4326)),
('Warsaw Uprising Museum', 'Museum dedicated to the 1944 Warsaw Uprising', 'Grzybowska 79, 00-844 Warszawa', ST_SetSRID(ST_MakePoint(20.980411, 52.232872), 4326)),
('National Stadium', 'Modern sports and events venue', 'Poniatowskiego 1, 03-901 Warszawa', ST_SetSRID(ST_MakePoint(21.046234, 52.239227), 4326)),
('Copernicus Science Centre', 'Interactive science museum', 'Wybrzeże Kościuszkowskie 20, 00-390 Warszawa', ST_SetSRID(ST_MakePoint(21.028011, 52.241447), 4326)),
('Wilanów Palace', 'Baroque royal residence', 'Stanisława Kostki Potockiego 10/16, 02-958 Warszawa', ST_SetSRID(ST_MakePoint(21.091156, 52.165394), 4326));
