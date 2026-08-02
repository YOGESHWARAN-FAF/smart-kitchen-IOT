# Smart Kitchen Safety Monitoring System (AURA-GUARD)

An enterprise-grade React dashboard for an **AI-Powered Smart Kitchen Safety & IoT Monitoring System**.

---

## 🌟 Key Features

- **Live ThingSpeak REST IoT Feeds**: Reads live multi-gas sensor array data every 15 seconds from ThingSpeak REST API.
- **Groq LLM AI Engine**: Autonomous hazard classification, reasoning diagnostic, and dynamic PIR occupant safety instructions powered by `llama-3.3-70b-versatile` and `llama-3.1-8b-instant`.
- **Personalized Interactive AI Chatbot**: Real-time AI Assistant drawer to answer custom safety queries with live & historical telemetry database context.
- **3D Digital Twin Blueprint**: Interactive 2.5D visualizer animating Servo 1 (Window 1 Louvre Vent), Servo 2 (Window 2 Louvre Vent), Servo 3 (LPG Regulator Valve), and Relay (Kitchen Exhaust Fan) with dynamic airflow streamlines.
- **Gas Thermal Heatmap**: Canvas visualizer rendering real-time concentration heat diffusion matrix (Green → Yellow → Orange → Red).
- **24-Hour Telemetry Analytics**: Recharts timelines for multi-gas PPMs, ambient temperature, relative humidity, and safety scores.
- **Pure Crystal White Aesthetic**: Light theme with `#FFFFFF` cards, `#F8FAFC` soft ice slate background, Emerald Green action buttons, and Yellow status tags.

---

## 🚀 Getting Started

### 1. Installation

```bash
git clone https://github.com/YOGESHWARAN-FAF/smart-kitchen-IOT.git
cd smart-kitchen-IOT
npm install
```

### 2. Running Locally

```bash
npm run dev
```

Open `http://localhost:3000` in your web browser.

---

## 🛠️ Built With

- **React 19**
- **Vite**
- **Tailwind CSS**
- **Recharts**
- **Framer Motion**
- **Zustand**
- **Lucide React**
- **React Router**
- **Axios**
- **React Hot Toast**
