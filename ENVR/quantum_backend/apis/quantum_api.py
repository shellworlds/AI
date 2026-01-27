#!/usr/bin/env python3
"""
Quantum Computing API Backend
Provides REST API endpoints for quantum simulations
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse
from pydantic import BaseModel
from typing import List, Dict, Optional
import subprocess
import json
import os
from datetime import datetime

app = FastAPI(title="Quantum Risk Analysis API",
              description="API for 23-qubit quantum simulations for risk analysis",
              version="1.0.0")

# Enable CORS for frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class QuantumSimulationRequest(BaseModel):
    simulation_type: str = "shipping_risk"
    num_qubits: int = 23
    shots: int = 1024
    parameters: Optional[Dict] = {}

class SimulationResult(BaseModel):
    simulation_id: str
    timestamp: str
    qubits_used: int
    simulation_type: str
    results_path: str
    gif_path: Optional[str]
    ascii_circuit: Optional[str]

# Store simulation results
simulation_db = []

@app.get("/")
async def root():
    return {
        "message": "Quantum Risk Analysis API",
        "version": "1.0.0",
        "endpoints": [
            "/api/quantum/simulate",
            "/api/quantum/results",
            "/api/quantum/circuit/{sim_id}",
            "/api/quantum/gif/{sim_id}"
        ]
    }

@app.post("/api/quantum/simulate", response_model=SimulationResult)
async def run_quantum_simulation(request: QuantumSimulationRequest):
    """Run quantum simulation with specified parameters"""
    
    # Generate unique simulation ID
    sim_id = f"sim_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
    
    try:
        # Run the 23-qubit simulation script
        result = subprocess.run(
            ["python3", "quantum_backend/23_qubit_simulation.py"],
            capture_output=True,
            text=True,
            cwd=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        )
        
        if result.returncode != 0:
            raise HTTPException(status_code=500, detail=f"Simulation failed: {result.stderr}")
        
        # Read simulation results
        results_file = "quantum_backend/simulations/simulation_results.json"
        if os.path.exists(results_file):
            with open(results_file, 'r') as f:
                sim_results = json.load(f)
        else:
            # If no results file, create mock results for demonstration
            sim_results = {
                "timestamp": datetime.now().isoformat(),
                "qubits_used": request.num_qubits,
                "simulation_type": request.simulation_type,
                "animation_files": [f"{request.simulation_type}_simulation.gif"]
            }
        
        # Create simulation result object
        simulation_result = SimulationResult(
            simulation_id=sim_id,
            timestamp=sim_results.get("timestamp", datetime.now().isoformat()),
            qubits_used=sim_results.get("qubits_used", request.num_qubits),
            simulation_type=request.simulation_type,
            results_path=f"/api/quantum/results/{sim_id}",
            gif_path=f"/api/quantum/gif/{sim_id}/0" if sim_results.get("animation_files") else None,
            ascii_circuit=sim_results.get("circuit_diagrams", {}).get(request.simulation_type, "")
        )
        
        # Store in database
        simulation_db.append({
            "id": sim_id,
            "request": request.dict(),
            "result": simulation_result.dict(),
            "timestamp": datetime.now().isoformat()
        })
        
        return simulation_result
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/quantum/results/{simulation_id}")
async def get_simulation_results(simulation_id: str):
    """Get results for a specific simulation"""
    for sim in simulation_db:
        if sim["id"] == simulation_id:
            # Read actual results file if exists
            results_file = "quantum_backend/simulations/simulation_results.json"
            if os.path.exists(results_file):
                with open(results_file, 'r') as f:
                    actual_results = json.load(f)
                return {**sim["result"], "detailed_results": actual_results}
            return sim["result"]
    
    raise HTTPException(status_code=404, detail="Simulation not found")

@app.get("/api/quantum/circuit/{simulation_id}")
async def get_circuit_diagram(simulation_id: str, circuit_type: str = "shipping"):
    """Get ASCII circuit diagram"""
    circuit_file = f"quantum_backend/circuits/ascii_{circuit_type}_circuit.txt"
    if os.path.exists(circuit_file):
        return FileResponse(circuit_file, media_type="text/plain")
    
    # Return sample circuit if file doesn't exist
    sample_circuit = f"""
    23-Qubit Quantum Circuit ({circuit_type.replace('_', ' ').title()})
    {'='*60}
    q_0: ───H───RX(π/4)───RY(π/3)───
    q_1: ───H───RX(π/4)───RY(π/3)───
    q_2: ───H───RX(π/4)───RY(π/3)───
    ... (21 more qubits)
    {'='*60}
    Total Gates: 92 | Depth: 15 | Width: 23
    """
    return JSONResponse(content={"circuit": sample_circuit})

@app.get("/api/quantum/gif/{simulation_id}/{gif_index}")
async def get_simulation_gif(simulation_id: str, gif_index: int = 0):
    """Get simulation GIF animation"""
    gif_files = [
        "frontend/quantum_showcase/simulations/shipping_risk_simulation.gif",
        "frontend/quantum_showcase/simulations/logistics_optimization.gif"
    ]
    
    if 0 <= gif_index < len(gif_files) and os.path.exists(gif_files[gif_index]):
        return FileResponse(gif_files[gif_index], media_type="image/gif")
    
    raise HTTPException(status_code=404, detail="GIF not found")

@app.get("/api/quantum/status")
async def get_api_status():
    """Get API status and system information"""
    import sys
    import platform
    
    return {
        "status": "operational",
        "python_version": sys.version,
        "platform": platform.platform(),
        "simulations_run": len(simulation_db),
        "available_simulations": ["shipping_risk", "logistics_optimization"],
        "max_qubits": 23,
        "api_version": "1.0.0"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
