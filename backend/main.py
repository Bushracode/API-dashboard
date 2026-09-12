from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List

app = FastAPI(title="Analytics Service")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Metric(BaseModel):
    id: int
    name: str
    value: str
    status: str

metrics_db = [
    {"id": 1, "name": "Active Subscriptions", "value": "1,240", "status": "Operational"},
    {"id": 2, "name": "API Response Time", "value": "142ms", "status": "Optimal"},
    {"id": 3, "name": "Database Load", "value": "24%", "status": "Normal"},
    {"id": 4, "name": "System Bandwidth", "value": "88.4 GB/s", "status": "Optimal"}
]

@app.get("/api/v1/metrics", response_model=List[Metric])
def get_metrics():
    return metrics_db

@app.get("/api/v1/health")
def health_check():
    return {"status": "healthy", "database": "connected"}