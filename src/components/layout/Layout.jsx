import React from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { EmergencyBanner } from './EmergencyBanner';
import { useSensorPolling } from '../../hooks/useSensorPolling';

export const Layout = ({ children }) => {
  // Activate sensor polling hook across app
  useSensorPolling();

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-slate-900 selection:bg-emerald-500 selection:text-white">
      <Header />
      <EmergencyBanner />
      <div className="flex-1 flex flex-col lg:flex-row w-full">
        <Sidebar />
        <main className="flex-1 p-4 lg:p-8 overflow-y-auto max-w-[1920px] mx-auto w-full space-y-8 bg-[#F8FAFC]">
          {children}
        </main>
      </div>
    </div>
  );
};
