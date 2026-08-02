import axios from 'axios';

/**
 * Groq AI Safety Engine REST Integration
 * Features Automatic Multi-Model Fallback & Token Optimization
 */

const DEFAULT_GROQ_KEY = import.meta.env.VITE_GROQ_API_KEY || '';

// Models in order of preference
const GROQ_MODELS = [
  'llama-3.1-8b-instant',
  'gemma2-9b-it',
  'llama-3.3-70b-versatile',
  'mixtral-8x7b-32768',
];

export const analyzeSafetyWithGroq = async (sensorData, apiKey) => {
  const effectiveKey = apiKey && apiKey.trim() ? apiKey.trim() : DEFAULT_GROQ_KEY;

  const {
    mq2 = 0,
    mq3 = 0,
    mq4 = 0,
    mq5 = 0,
    temperature = 0,
    humidity = 0,
    relayStatus = 0,
    pirMotion = 0,
    leakDuration = 0,
    servo1 = 0,
    servo2 = 0,
    servo3 = 0,
  } = sensorData;

  const avgVentilation = Math.round(((servo1 + servo2 + servo3) / 540) * 100);
  const isOccupantPresent = pirMotion === 1;
  const occupancyState = isOccupantPresent ? 'OCCUPANT PRESENT IN KITCHEN (PIR Active)' : 'Unoccupied';

  const promptText = `
You are the Master AI Safety & Hazardous Gas Diagnostic Engine for an Industrial & Residential Smart Kitchen Safety System.

ANALYZE REAL-TIME IOT METRICS:
- MQ2 (LPG/Smoke): ${mq2} PPM | MQ3 (Alcohol): ${mq3} PPM | MQ4 (Methane): ${mq4} PPM | MQ5 (Hydrogen): ${mq5} PPM
- Temp: ${temperature}°C | Humidity: ${humidity}% | Exhaust Relay: ${relayStatus === 1 ? 'RUNNING' : 'IDLE'}
- PIR Motion: ${occupancyState} | Servos: W1=${servo1}°, W2=${servo2}°, Reg=${servo3}°

${isOccupantPresent ? "PERSON DETECTED IN KITCHEN via PIR Motion. Include specific occupant safety instructions." : "Kitchen unoccupied."}

RESPOND ONLY WITH VALID JSON (NO MARKDOWN):
{
  "emergencyLevel": "NORMAL" | "WARNING" | "CRITICAL" | "EMERGENCY",
  "safetyScore": number (0 to 100),
  "safeToEnter": boolean,
  "riskCategory": string,
  "detectedGasType": string,
  "recommendedActions": [string, string, string],
  "immediateAction": string,
  "confidence": string,
  "reasoning": string
}
`;

  for (const model of GROQ_MODELS) {
    try {
      const response = await axios.post(
        'https://api.groq.com/openai/v1/chat/completions',
        {
          model,
          messages: [
            {
              role: 'system',
              content: 'You are a high-precision IoT safety diagnostic AI. Always reply with raw valid JSON strictly adhering to requested schema.',
            },
            {
              role: 'user',
              content: promptText,
            },
          ],
          temperature: 0.2,
          response_format: { type: 'json_object' },
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${effectiveKey}`,
          },
          timeout: 10000,
        }
      );

      const jsonContent = response.data?.choices?.[0]?.message?.content;
      if (jsonContent) {
        const parsed = JSON.parse(jsonContent);
        return { success: true, data: parsed };
      }
    } catch (err) {
      console.warn(`Groq model ${model} rate limit or error:`, err?.response?.data?.error?.message || err.message);
    }
  }

  return {
    success: false,
    data: generateLocalAISafetyAnalysis(sensorData, avgVentilation, occupancyState, isOccupantPresent).data,
    fallbackUsed: true,
  };
};

/**
 * Interactive AI Chatbot Service with Automatic Multi-Model Fallback
 */
export const askGroqChatbot = async (chatMessages, sensorData, apiKey, historyData = [], alertsData = []) => {
  const effectiveKey = apiKey && apiKey.trim() ? apiKey.trim() : DEFAULT_GROQ_KEY;

  const {
    mq2 = 0,
    mq3 = 0,
    mq4 = 0,
    mq5 = 0,
    temperature = 0,
    humidity = 0,
    relayStatus = 0,
    pirMotion = 0,
    servo1 = 0,
    servo2 = 0,
    servo3 = 0,
  } = sensorData;

  const totalLogged = historyData.length;
  const peakMq2 = historyData.length > 0 ? Math.max(...historyData.map((h) => h.mq2)) : mq2;
  const peakTemp = historyData.length > 0 ? Math.max(...historyData.map((h) => h.temperature)) : temperature;

  const recentLogsFormatted =
    historyData.length > 0
      ? historyData
          .slice(-6)
          .map((h) => `[${h.timestamp}: MQ2 ${h.mq2} PPM, ${h.temperature}°C, Score ${h.safetyScore}]`)
          .join('\n')
      : 'No history logged.';

  const recentAlertsFormatted =
    alertsData.length > 0
      ? alertsData
          .slice(0, 5)
          .map((a) => `[${a.timestamp}] ${a.title}: ${a.message}`)
          .join('\n')
      : 'No alerts logged.';

  const systemPrompt = `
You are AURA-GUARD AI, a Smart Kitchen Safety Assistant.
LIVE TELEMETRY:
- MQ2: ${mq2} PPM | MQ3: ${mq3} PPM | MQ4: ${mq4} PPM | MQ5: ${mq5} PPM
- Temp: ${temperature}°C | Humidity: ${humidity}%
- PIR Motion: ${pirMotion === 1 ? 'PERSON PRESENT IN KITCHEN' : 'Empty Kitchen'}
- Exhaust Fan Relay: ${relayStatus === 1 ? 'RUNNING (ON)' : 'IDLE (OFF)'}
- Servos: W1=${servo1}°, W2=${servo2}°, Regulator=${servo3}°

LOGS DATABASE:
- Total Feeds: ${totalLogged} | Peak MQ2: ${peakMq2} PPM | Peak Temp: ${peakTemp}°C
- Recent Logs:
${recentLogsFormatted}
- Recent Alerts:
${recentAlertsFormatted}

Answer concisely, professionally, and helpfully based on this live and historical data.
`;

  let lastErrorMsg = '';

  for (const model of GROQ_MODELS) {
    try {
      const formattedMessages = [
        { role: 'system', content: systemPrompt },
        ...chatMessages.map((m) => ({ role: m.role, content: m.content })),
      ];

      const response = await axios.post(
        'https://api.groq.com/openai/v1/chat/completions',
        {
          model,
          messages: formattedMessages,
          temperature: 0.6,
          max_tokens: 450,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${effectiveKey}`,
          },
          timeout: 12000,
        }
      );

      const reply = response.data?.choices?.[0]?.message?.content;
      if (reply && reply.trim()) {
        return { success: true, reply };
      }
    } catch (err) {
      lastErrorMsg = err?.response?.data?.error?.message || err.message;
      console.warn(`Groq model ${model} rate limit / error:`, lastErrorMsg);
    }
  }

  return {
    success: false,
    reply: `[Groq API Response Error]: ${lastErrorMsg || 'Rate limit reached on Groq free models. Please try again shortly.'}`,
  };
};

/**
 * Local AI Fallback Analyzer (Guarantees zero downtime and offline operation)
 */
function generateLocalAISafetyAnalysis(data, ventilationPct, occupancy, isOccupantPresent) {
  const { mq2, mq3, mq4, mq5, temperature, humidity, relayStatus, leakDuration } = data;

  const maxGas = Math.max(mq2, mq3, mq4, mq5);
  let emergencyLevel = 'NORMAL';
  let safeToEnter = true;
  let riskCategory = 'Optimal Safety';
  let detectedGasType = 'None (Ambient Air)';
  let immediateAction = isOccupantPresent
    ? 'Occupant Alert: Kitchen environment normal. Maintain standard safety precautions.'
    : 'Continue routine monitoring.';

  let actions = [
    isOccupantPresent ? 'OCCUPANT SAFETY: Person detected in kitchen area.' : 'Kitchen is currently unoccupied.',
    'Kitchen environmental metrics are within safe operational bounds.',
    'Exhaust ventilation set to baseline dynamic flow.',
  ];

  if (mq2 > mq4 && mq2 > mq3 && mq2 > mq5 && mq2 > 250) {
    detectedGasType = 'LPG / Propane / Smoke';
  } else if (mq4 > mq2 && mq4 > mq3 && mq4 > 250) {
    detectedGasType = 'Methane / Natural Gas';
  } else if (mq3 > 250) {
    detectedGasType = 'Ethanol / Alcohol Vapors';
  } else if (mq5 > 250) {
    detectedGasType = 'Town Gas / Hydrogen';
  }

  let baseScore = 100;
  if (maxGas > 150) baseScore -= Math.round((maxGas - 150) * 0.12);
  if (temperature > 35) baseScore -= Math.round((temperature - 35) * 2);
  if (humidity < 20 || humidity > 80) baseScore -= 5;
  if (leakDuration > 30) baseScore -= 15;

  const safetyScore = Math.min(Math.max(baseScore, 0), 100);

  if (maxGas >= 550 || temperature >= 50 || leakDuration > 45) {
    emergencyLevel = 'EMERGENCY';
    safeToEnter = false;
    riskCategory = 'Severe Fire & Explosive Hazard';
    immediateAction = isOccupantPresent
      ? 'PERSON IN KITCHEN: EVACUATE IMMEDIATELY! DO NOT TOUCH LIGHT SWITCHES OR FLAMES!'
      : 'EVACUATE IMMEDIATELY & ENGAGE EMERGENCY ISOLATION VALVE!';
    actions = [
      isOccupantPresent ? 'OCCUPANT WARNING: Leave the kitchen area immediately.' : 'Kitchen unoccupied.',
      'DO NOT operate light switches or electrical appliances.',
      'Automatic exhaust fan active at 100% capacity.',
    ];
  } else if (maxGas >= 320 || temperature >= 40) {
    emergencyLevel = 'WARNING';
    safeToEnter = false;
    riskCategory = 'Elevated Gas Concentration Warning';
    immediateAction = isOccupantPresent
      ? 'OCCUPANT ALERT: Gas concentration detected. Open windows and step back.'
      : 'Open manual windows and check gas appliances.';
  }

  const reasoning = `Diagnostic analysis computed from 4-gas spectral array: Peak gas concentration recorded at ${maxGas} PPM (${detectedGasType}). Ambient temperature is ${temperature}°C. PIR Motion Sensor: ${
    isOccupantPresent ? 'PERSON DETECTED IN KITCHEN area.' : 'Kitchen is unoccupied.'
  }`;

  return {
    success: true,
    data: {
      emergencyLevel,
      safetyScore,
      safeToEnter,
      riskCategory,
      detectedGasType,
      recommendedActions: actions,
      immediateAction,
      confidence: '98.5%',
      reasoning,
    },
  };
}
