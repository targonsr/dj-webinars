import asyncio
import asyncpg
import os

# Warsaw points of interest with real coordinates
WARSAW_LOCATIONS = [
    ("Złote Tarasy", "Modern shopping center", "Złota 59, 00-120 Warszawa", 21.003611, 52.228889),
    ("National Museum", "Main art museum of Poland", "Al. Jerozolimskie 3, 00-495 Warszawa", 21.024722, 52.230833),
    ("Warsaw University", "Historic university campus", "Krakowskie Przedmieście 26/28, 00-927 Warszawa", 21.017500, 52.238889),
    ("Multimedia Fountain Park", "Largest multimedia fountain in Europe", "Jagiellońska 1, 03-301 Warszawa", 21.047222, 52.260278),
    ("POLIN Museum", "Museum of the History of Polish Jews", "Mordechaja Anielewicza 6, 00-157 Warszawa", 20.995556, 52.248889),
    ("Saxon Garden", "Historic public park", "Marszałkowska, 00-001 Warszawa", 21.008611, 52.236389),
    ("Central Railway Station", "Main train station", "Al. Jerozolimskie 54, 00-001 Warszawa", 20.998333, 52.229167),
    ("Praga District", "Historic neighborhood", "Praga-Północ, Warszawa", 21.035000, 52.253333)
]

async def seed_locations():
    conn = await asyncpg.connect(os.getenv("DATABASE_URL"))
    
    try:
        for name, description, address, lon, lat in WARSAW_LOCATIONS:
            await conn.execute(
                """
                INSERT INTO locations (name, description, address, geom) 
                VALUES ($1, $2, $3, ST_SetSRID(ST_MakePoint($4, $5), 4326))
                ON CONFLICT DO NOTHING
                """,
                name, description, address, lon, lat
            )
        print(f"Seeded {len(WARSAW_LOCATIONS)} additional locations")
    finally:
        await conn.close()

if __name__ == "__main__":
    asyncio.run(seed_locations())
