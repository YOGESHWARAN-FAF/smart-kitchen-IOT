# System Architecture & Software Workflow Documentation

## 📄 Overview

**AURA-GUARD** is an enterprise-grade, zero-backend, AI-powered **Smart Kitchen Safety & Hazardous Gas Monitoring System**. The frontend application runs entirely inside the browser using React 19, Vite, Tailwind CSS, Zustand, Recharts, Framer Motion, and HTML5 Canvas.

---

## 🔄 End-to-End Software Data Workflow

```
┌──────────────────────────────┐
│ ESP32 IoT Microcontroller    │
│ • MQ2, MQ3, MQ4, MQ5 Sensors │
│ • Temp & Humidity (DHT11)    │
│ • PIR Motion Sensor          │
│ • Exhaust Fan Relay & Servos │
└──────────────┬───────────────┘
               │ HTTP POST / REST Write (every 15s)
               ▼
┌──────────────────────────────┐
│ ThingSpeak REST API Cloud    │
│ • Channel 1 (3441914): Gases │
│ • Channel 2 (3441916): Servos│
└──────────────┬───────────────┘
               │ HTTP GET / REST Polling (15s Timer)
               ▼
┌──────────────────────────────┐
│ React Sensor Polling Hook    │ (`src/hooks/useSensorPolling.js`)
│ • Fetches live channel feeds │
│ • Validates sensor bounds    │
└──────────────┬───────────────┘
               │ Updates State
               ▼
┌──────────────────────────────┐
│ Zustand Central Store        │ (`src/store/useSensorStore.js`)
│ • Holds current metrics      │
│ • Appends 24-hr history log  │
└──────┬───────────────┬───────┘
       │               │
       │ Trigger AI    │ Render UI Data
       ▼               ▼
┌──────────────┐ ┌───────────────────────────────────────────┐
│ Groq LLM API │ │ React Dashboard Components               │
│ • Llama-3.1  │ │ • Summary Metric Cards                    │
│ • Multi-Model│ │ • 4-Gas Spectral Array Visualizers        │
│   Fallback   │ │ • 3D Digital Twin Kitchen Blueprint       │
│ • PIR Alert  │ │ • Live Thermal Gas Diffusion Heatmap      │
└──────┬───────┘ │ • Recharts 24-Hour Telemetry Graphs      │
       │         │ • Interactive Groq AI Safety Chatbot      │
       └────────►└───────────────────────────────────────────┘
```

---

## 📊 Detailed Workflow Execution Steps

### 1. IoT Hardware Data Ingestion (ESP32 ➔ ThingSpeak REST API)
- The physical **ESP32 microcontroller** samples physical sensors every 15 seconds:
  - **Channel 1 (ID: `3441914`)**: Field 1 (`MQ-4 Sensor 1 - Stove`), Field 2 (`MQ-4 Sensor 2 - Cylinder`), Field 3 (`MQ-4 Sensor 3 - Ceiling`), Field 4 (`MQ-4 Sensor 4 - Wall`), Field 5 (`Temp`), Field 6 (`Humidity`), Field 7 (`Exhaust Fan Relay Status`), Field 8 (`Manual Relay Control`).
  - **Channel 2 (ID: `3441916`)**: Field 1 (`Servo 1 - Window 1 W1`), Field 2 (`Servo 2 - Window 2 W2`), Field 3 (`Servo 3 - LPG Gas Regulator Valve`), Field 4 (`PIR Motion Occupancy`).
- ESP32 writes sensor telemetry payloads to ThingSpeak REST endpoints using HTTP GET/POST.

### 2. Client-Side REST Polling Engine (`src/hooks/useSensorPolling.js`)
- The custom React hook `useSensorPolling` runs a non-blocking `setInterval` timer every **15 seconds** (decoupled from component re-renders).
- Executes async parallel REST HTTP requests:
  - `fetchThingSpeakChannel1(channelId, readKey)`
  - `fetchThingSpeakChannel2(channelId, readKey)`
- Parses raw string fields into structured floating-point telemetry values.

### 3. State Management & History Database (`src/store/useSensorStore.js`)
- Received live metrics update the global Zustand state `metrics`.
- Concurrently appends a timestamped data point to `history` (buffer capped at 120 historical entries for optimal browser memory performance).
- Evaluates single-fire notification guards (`hasFiredHazardToast`) so emergency toast alerts fire **strictly ONCE** per hazard occurrence.

### 4. Autonomous Groq LLM Diagnostic Engine (`src/services/groq.js`)
- The dashboard automatically dispatches telemetry payloads to the **Groq Cloud REST API** (`https://api.groq.com/openai/v1/chat/completions`).
- **Multi-Model Fallback Sequence**:
  1. `llama-3.1-8b-instant` (500,000 Tokens Per Day capacity)
  2. `gemma2-9b-it`
  3. `llama-3.3-70b-versatile`
  4. `mixtral-8x7b-32768`
- **PIR Motion Occupancy Processing**:
  - When `pirMotion === 1`, the prompt instructs the LLM: *"A person is detected in the kitchen. Provide personalized occupant safety instructions."*
- Returns structured JSON containing:
  - `emergencyLevel` (`NORMAL`, `WARNING`, `CRITICAL`, `EMERGENCY`)
  - `safetyScore` (`0 - 100`)
  - `safeToEnter` (`boolean`)
  - `detectedGasType` (e.g. `LPG / Propane / Smoke`)
  - `recommendedActions` & `reasoning` narrative.

### 5. Interactive Groq AI Safety Assistant Chatbot (`src/components/dashboard/AIChatbot.jsx`)
- Users can open the floating AI Chatbot drawer and ask custom questions.
- Chatbot passes full real-time telemetry + recent 15 historical telemetry entries + system audit log to Groq LLM.
- Answers user questions dynamically with real-time model text responses!

### 6. Visual Component Rendering

#### A. 3D Digital Twin Kitchen Blueprint (`Kitchen3DView.jsx`)
- HTML5 Canvas 2.5D top-down floor plan:
  - **Servo 1**: Animates louvre slat rotation (`0°–180°`) on North Wall Window 1.
  - **Servo 2**: Animates louvre slat rotation (`0°–180°`) on East Wall Window 2.
  - **Servo 3**: Animates LPG Regulator Valve handle on cooking stove/cylinder.
  - **Relay (Field 7/8)**: Animates spinning fan blades on Wall Exhaust Fan when Relay = `1`.
  - **Vector Airflow Streamlines**: Renders dynamic dashed cyan streamlines pulling air from Servo 3 (Gas Valve) towards spinning Relay Exhaust Fan and open Windows.

#### B. Live Gas Thermal Diffusion Heatmap (`LiveThermalMap.jsx`)
- HTML5 Canvas rendering a 4-node radial heat diffusion matrix representing MQ2, MQ3, MQ4, and MQ5 sensors.
- Color grading shifts dynamically based on concentration thresholds: Green (`Safe`) ➔ Yellow (`Warning`) ➔ Orange ➔ Red (`Hazard`).
- Overlaid with dynamic cyan radar sweep scanning lines.

#### C. 4-Gas Spectral Array Visualizers (`FourGasSensors.jsx` & `CircularGauge.jsx`)
- SVG circular gauges displaying gas PPMs with color-gradient arcs (`0 PPM` to `1000 PPM`), capacity percentage readouts, and status badges.

#### D. Telemetry Analytics (`LiveCharts.jsx` & `AnalyticsPage.jsx`)
- Recharts graphics displaying 24-hour comparative timelines for multi-gas PPMs, ambient temperature, relative humidity, and AI safety scores.

---

## 🎨 Theme & Styling Architecture

- **Theme Style**: Clean Crystal White background (`#F8FAFC`), pure white cards (`#FFFFFF`), light slate borders (`#E2E8F0`), and high-contrast dark text (`#0F172A`).
- **Action Buttons**: Emerald Green (`#10B981` / `#059669`).
- **Status Tags & Badges**: Yellow Badges (`#FEF08A` / `#854D0E`), Green Badges (`#D1FAE5` / `#065F46`), Red Badges (`#FEE2E2` / `#991B1B`).

---

## 📁 Repository Structure

```
d:\LPG\
├── src/
│   ├── components/
│   │   ├── dashboard/
│   │   │   ├── AIChatbot.jsx          # Interactive Groq LLM Assistant Drawer
│   │   │   ├── AISafetyPanel.jsx        # Hero AI Reasoning Diagnostic Card
│   │   │   ├── AlertCenter.jsx          # System Audit & Hazard Event Log
│   │   │   ├── FourGasSensors.jsx       # 4 SVG Circular Thermal Gauges
│   │   │   ├── HumidityMap.jsx          # Relative Humidity Meter
│   │   │   ├── Kitchen3DView.jsx        # 2.5D Digital Twin Blueprint
│   │   │   ├── LiveCharts.jsx           # Recharts Telemetry Timelines
│   │   │   ├── LiveThermalMap.jsx       # Canvas Gas Diffusion Heatmap
│   │   │   ├── RelayPanel.jsx           # Exhaust Fan Relay Status Panel
│   │   │   ├── ServoPanel.jsx           # Servo 1-3 Telemetry Gauges
│   │   │   ├── SummaryCards.jsx         # 11 KPI Summary Metric Cards
│   │   │   ├── SystemHealth.jsx         # Pipeline & Health Telemetry
│   │   │   └── TemperatureMap.jsx       # Thermal Gradient Map
│   │   ├── layout/
│   │   │   ├── EmergencyBanner.jsx      # Critical Hazard Top Alert Bar
│   │   │   ├── Header.jsx               # Header with Clock & Status Pills
│   │   │   ├── Layout.jsx               # Main Light Crystal Page Layout Wrapper
│   │   │   └── Sidebar.jsx              # Navigation Sidebar
│   │   └── ui/
│   │       ├── CircularGauge.jsx        # SVG Arc Circular Gauge
│   │       ├── GlassCard.jsx            # White Card Container
│   │       └── ToggleSwitch.jsx         # Toggle Switch Component
│   ├── hooks/
│   │   └── useSensorPolling.js          # 15s ThingSpeak REST Polling Hook
│   ├── pages/
│   │   ├── AnalyticsPage.jsx            # Aggregated Statistical Analytics
│   │   ├── HistoryPage.jsx              # 24-Hour Logs & CSV Export Engine
│   │   ├── HomePage.jsx                 # Main Command Center Dashboard
│   │   └── SettingsPage.jsx             # Channel IDs, API Keys & Thresholds
│   ├── services/
│   │   ├── groq.js                      # Client-side REST Groq LLM Engine & Chatbot
│   │   ├── helpers.js                   # Color mappers, CSV Exporter & Formatters
│   │   └── thingspeak.js                # ThingSpeak REST API Read/Write Client
│   ├── store/
│   │   ├── useSensorStore.js            # Zustand Live Metrics & History Store
│   │   └── useSettingsStore.js          # Zustand Credentials & Settings Store
│   └── styles/
│       └── index.css                    # Tailwind CSS Design System
├── .env                                 # Environment Variables (Ignored in Git)
├── .env.example                         # Environment Variables Template
├── .gitignore                           # Git Ignored Files
├── index.html                           # Base HTML Template
├── package.json                         # Dependencies & Scripts
├── README.md                            # GitHub Project Readme
├── WORKFLOW.md                          # Architecture & Workflow Documentation
├── tailwind.config.js                   # Tailwind Config
└── vite.config.js                       # Vite Config
```
