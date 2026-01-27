# Quantum Risk Analysis System - 23-Qubit Simulations

## System Overview
Advanced quantum computing system for geopolitical and logistics risk analysis using 23-qubit quantum circuits.

## Architecture

## Key Features
1. **23-Qubit Quantum Simulations**: Full quantum circuit simulations
2. **ASCII Circuit Visualization**: Text-based quantum circuit diagrams
3. **4-Second 3D Animations**: Visual quantum state evolution
4. **REST API Backend**: FastAPI-based quantum computing API
5. **Client Showcase**: HTML frontend for POC demonstrations
6. **Multi-Repository Sync**: Git integration across all teams

## API Endpoints
- `POST /api/quantum/simulate` - Run quantum simulation
- `GET /api/quantum/results/{id}` - Get simulation results
- `GET /api/quantum/circuit/{type}` - Get ASCII circuit
- `GET /api/quantum/gif/{id}/{index}` - Get simulation GIF
- `GET /api/quantum/status` - System status

## Generated Files
- `quantum_backend/23_qubit_simulation.py` - Main simulation script
- `quantum_backend/apis/quantum_api.py` - Backend API
- `frontend/quantum_showcase/index.html` - Client showcase
- Simulation results in JSON format
- ASCII circuit diagrams
- 4-second GIF animations

## Usage
1. Run simulations: `python3 quantum_backend/23_qubit_simulation.py`
2. Start API: `python3 quantum_backend/apis/quantum_api.py`
3. Open showcase: Browser to `http://localhost:8080`

## Git Branches
- Main: ENVR2134
- Data-T: DENVR2134  
- Zi-us: ZENVR2134
- Q-bit: QENVR2134
