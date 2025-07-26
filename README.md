# Latency Topology Visualizer

A 3D interactive visualization tool for exploring real-time network latency between major crypto exchanges hosted on different cloud providers and regions. Built with Next.js and React Three Fiber.

## Features

- **3D Globe Visualization:**  
  View global exchange locations and their interconnections on a realistic, interactive globe.

- **Live Latency Simulation:**  
  Simulates and updates network latency between exchanges in real time, based on geographic distance and random network conditions.

- **Exchange & Cloud Provider Filtering:**  
  Filter exchanges by cloud provider (AWS, GCP, Azure) and search by exchange name.

- **Latency Range Control:**  
  Adjust the minimum and maximum latency (ms) to visualize only relevant connections.

- **Visualization Layers:**  
  Toggle real-time connections, cloud regions, and latency heatmap overlays.

- **Historical Latency Chart:**  
  View recent latency trends in a chart for selected exchanges.

## Data Model

- **ExchangeMarker**
  ```ts
  interface ExchangeMarker {
    id: string;
    name: string;
    latitude: number;
    longitude: number;
    cloudProvider: 'AWS' | 'GCP' | 'Azure';
    region: string;
    status: 'active' | 'maintenance' | 'offline';
  }
  ```
- **LatencyConnection**
  ```ts
  interface LatencyConnection {
    fromId: string;
    toId: string;
    latencyMs: number;
    timestamp: number;
  }
  ```

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```

2. **Run the development server:**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

3. **Open your browser:**  
   Visit [http://localhost:3000]

## Project Structure

- `src/components/Globe.tsx` – 3D globe and visualization logic
- `src/components/ControlPanel.tsx` – UI controls for filtering and toggling layers
- `src/hooks/useLatencyData.ts` – Simulates and updates latency data
- `src/utils/exchangeData.ts` – List of exchanges and their metadata

## Customization

- Add or modify exchanges in `src/utils/exchangeData.ts`
- Adjust latency simulation logic in `src/hooks/useLatencyData.ts`

## Tech Stack

- Next.js (React)
- React Three Fiber (`@react-three/fiber`)
- Tailwind CSS

