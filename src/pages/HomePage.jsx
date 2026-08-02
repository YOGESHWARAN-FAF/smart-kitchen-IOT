import React from 'react';
import { motion } from 'framer-motion';
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

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: 'easeOut' },
  },
};

export const HomePage = () => {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6 sm:space-y-8 pb-10"
    >
      {/* 1. Summary Metric Cards Row */}
      <motion.section variants={itemVariants}>
        <SummaryCards />
      </motion.section>

      {/* 2. 4 Gas Sensor Spectral Array */}
      <motion.section variants={itemVariants}>
        <FourGasSensors />
      </motion.section>

      {/* 3. AI Safety Panel (Featured Hero AI Card) */}
      <motion.section variants={itemVariants}>
        <AISafetyPanel />
      </motion.section>

      {/* 4. Live Thermal Heat Map & 3D Kitchen View Grid */}
      <motion.section variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <LiveThermalMap />
        <Kitchen3DView />
      </motion.section>

      {/* 5. Temperature & Humidity Thermal Color Maps */}
      <motion.section variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        <TemperatureMap />
        <HumidityMap />
      </motion.section>

      {/* 6. Live Recharts 24-Hour Telemetry */}
      <motion.section variants={itemVariants}>
        <LiveCharts />
      </motion.section>

      {/* 7. Solenoid Relay, Servo Fan Panel & System Health Row */}
      <motion.section variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <RelayPanel />
        <ServoPanel />
        <SystemHealth />
      </motion.section>

      {/* 8. Alert Center Log */}
      <motion.section variants={itemVariants}>
        <AlertCenter />
      </motion.section>

      {/* Interactive Personalized AI Safety Chatbot */}
      <AIChatbot />
    </motion.div>
  );
};

