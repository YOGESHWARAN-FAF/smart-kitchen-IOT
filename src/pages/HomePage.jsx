import React from 'react';
import { SummaryCards } from '../components/dashboard/SummaryCards';
import { LiveThermalMap } from '../components/dashboard/LiveThermalMap';
import { FourGasSensors } from '../components/dashboard/FourGasSensors';
import { TemperatureMap } from '../components/dashboard/TemperatureMap';
import { HumidityMap } from '../components/dashboard/HumidityMap';
import { Kitchen3DView } from '../components/dashboard/Kitchen3DView';
import { LiveCharts } from '../components/dashboard/LiveCharts';
import { AISafetyPanel } from '../components/dashboard/AISafetyPanel';
import { RelayPanel } from '../components/dashboard/RelayPanel';
import { ServoPanel } from '../components/dashboard/ServoPanel';
import { SystemHealth } from '../components/dashboard/SystemHealth';
import { AlertCenter } from '../components/dashboard/AlertCenter';
import { AIChatbot } from '../components/dashboard/AIChatbot';

export const HomePage = () => {
  return (
    <div className="space-y-8 pb-10">
      {/* 1. Summary Metric Cards Row */}
      <section>
        <SummaryCards />
      </section>

      {/* 2. 4 Gas Sensor Spectral Array */}
      <section>
        <FourGasSensors />
      </section>

      {/* 3. AI Safety Panel (Featured Hero AI Card) */}
      <section>
        <AISafetyPanel />
      </section>

      {/* 4. Live Thermal Heat Map & 3D Kitchen View Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LiveThermalMap />
        <Kitchen3DView />
      </section>

      {/* 5. Temperature & Humidity Thermal Color Maps */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TemperatureMap />
        <HumidityMap />
      </section>

      {/* 6. Live Recharts 24-Hour Telemetry */}
      <section>
        <LiveCharts />
      </section>

      {/* 7. Solenoid Relay, Servo Fan Panel & System Health Row */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <RelayPanel />
        <ServoPanel />
        <SystemHealth />
      </section>

      {/* 8. Alert Center Log */}
      <section>
        <AlertCenter />
      </section>

      {/* Interactive Personalized AI Safety Chatbot */}
      <AIChatbot />
    </div>
  );
};
