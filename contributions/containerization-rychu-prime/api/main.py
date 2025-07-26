import os
import hashlib
import asyncio
from typing import List, Optional
from datetime import datetime, timedelta

from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel, Field, EmailStr
from jose import JWTError, jwt
from passlib.context import CryptContext
import asyncpg
import redis.asyncio as redis
from prometheus_client import Counter, Histogram, generate_latest, CONTENT_TYPE_LATEST
from starlette.responses import Response

# Configuration
DATABASE_URL = os.getenv("DATABASE_URL")
REDIS_URL = os.getenv("REDIS_URL") 
JWT_SECRET = os.getenv("JWT_SECRET")
CORS_ORIGINS = os.getenv("CORS_ORIGINS", "").split(",")

# Security setup
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
security = HTTPBearer()

# Prometheus metrics
REQUEST_COUNT = Counter('http_requests_total', 'Total HTTP requests', ['method', 'endpoint', 'status'])
REQUEST_LATENCY = Histogram('http_request_duration_seconds', 'HTTP request latency', ['method', 'endpoint'])

# Redis connection pool
redis_pool = None

# FastAPI app initialization
app = FastAPI(
    title="Geo-Location Rychu Prime's Platform API",
    description="Rychu Prime's Tinder for poor",
    version="1.0.0"
)

# CORS middleware
allowed = [o.strip() for o in os.getenv("CORS_ORIGINS", "").split(",") if o.strip()]
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed or ["*"],
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

# Models
class LocationSearch(BaseModel):
    address: str = Field(..., min_length=3, max_length=200)
    radius_km: float = Field(..., gt=0, le=50)

class LocationResult(BaseModel):
    id: int
    name: str
    description: Optional[str]
    address: Optional[str]
    distance_km: float
    latitude: float
    longitude: float

class HealthCheck(BaseModel):
    status: str
    timestamp: datetime
    version: str

# Database connection
async def get_db():
    conn = await asyncpg.connect(DATABASE_URL)
    try:
        yield conn
    finally:
        await conn.close()

# Redis connection
async def get_redis():
    global redis_pool
    if not redis_pool:
        redis_pool = redis.from_url(REDIS_URL, decode_responses=True)
    return redis_pool

# Geocoding with caching
async def geocode_address(address: str, redis_client) -> tuple[float, float]:
    """Geocode address with Redis caching - uses Nominatim for demo"""
    address_hash = hashlib.md5(address.encode()).hexdigest()
    cache_key = f"geocode:{address_hash}"
    
    # Check cache
    cached = await redis_client.get(cache_key)
    if cached:
        lat, lon = map(float, cached.split(","))
        return lat, lon
    
    # For demo: return Warsaw city center coordinates
    # In production, integrate with geocoding service
    import httpx
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(
                "https://nominatim.openstreetmap.org/search",
                params={
                    "q": address,
                    "format": "json",
                    "limit": 1,
                    "countrycodes": "pl"
                },
                timeout=10.0
            )
            data = response.json()
            if data:
                lat, lon = float(data[0]["lat"]), float(data[0]["lon"])
            else:
                # Fallback to Warsaw center
                lat, lon = 52.2297, 21.0122
        except:
            # Fallback to Warsaw center
            lat, lon = 52.2297, 21.0122
    
    # Cache for 24 hours
    await redis_client.set(cache_key, f"{lat},{lon}", ex=86400)
    return lat, lon

# Startup event
@app.on_event("startup")
async def startup_event():
    global redis_pool
    redis_pool = redis.from_url(REDIS_URL, decode_responses=True)

# Health check endpoint
@app.get("/health", response_model=HealthCheck)
async def health_check():
    return HealthCheck(
        status="healthy",
        timestamp=datetime.utcnow(),
        version="1.0.0"
    )

# Metrics endpoint for Prometheus
@app.get("/metrics")
async def metrics():
    return Response(generate_latest(), media_type=CONTENT_TYPE_LATEST)

# Main search endpoint with optimized PostGIS query
@app.post("/search", response_model=List[LocationResult])
async def search_nearby_locations(
    search: LocationSearch,
    db = Depends(get_db),
    redis_client = Depends(get_redis)
):
    REQUEST_COUNT.labels(method="POST", endpoint="/search", status="200").inc()
    
    with REQUEST_LATENCY.labels(method="POST", endpoint="/search").time():
        try:
            # Geocode the search address
            lat, lon = await geocode_address(search.address, redis_client)
            
            # Optimized PostGIS query with spatial index
            query = """
            SELECT 
                id, 
                name, 
                description, 
                address,
                ST_Distance(geom, ST_SetSRID(ST_MakePoint($1, $2), 4326), true) / 1000 as distance_km,
                ST_Y(geom::geometry) as latitude,
                ST_X(geom::geometry) as longitude
            FROM locations 
            WHERE ST_DWithin(geom, ST_SetSRID(ST_MakePoint($1, $2), 4326), $3)
            ORDER BY distance_km ASC
            LIMIT 100;
            """
            
            radius_meters = search.radius_km * 1000
            results = await db.fetch(query, lon, lat, radius_meters)
            
            return [
                LocationResult(
                    id=row["id"],
                    name=row["name"],
                    description=row["description"],
                    address=row["address"],
                    distance_km=round(row["distance_km"], 2),
                    latitude=row["latitude"],
                    longitude=row["longitude"]
                )
                for row in results
            ]
            
        except Exception as e:
            REQUEST_COUNT.labels(method="POST", endpoint="/search", status="500").inc()
            raise HTTPException(status_code=500, detail=f"Search failed: {str(e)}")

# Additional utility endpoints
@app.get("/locations/count")
async def get_location_count(db = Depends(get_db)):
    """Get total number of locations in database"""
    result = await db.fetchval("SELECT COUNT(*) FROM locations")
    return {"total_locations": result}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
