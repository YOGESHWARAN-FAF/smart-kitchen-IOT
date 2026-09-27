import axios from 'axios';

/**
 * ThingSpeak REST API Service
 * Directly reads live sensor feeds from Channel 1 and Channel 2
 */
export const fetchThingSpeakData = async (config) => {
  const {
    channel1Id,
    channel2Id,
    readKey1 = '',
    readKey2 = '',
  } = config;

  if (!channel1Id) {
    return { success: false, reason: 'No Channel ID provided' };
  }

  try {
    // Channel 1 REST URL
    const urlCh1 = `https://api.thingspeak.com/channels/${channel1Id}/feeds/last.json${
      readKey1 ? `?api_key=${readKey1}` : ''
    }`;

    const resCh1 = await axios.get(urlCh1, { timeout: 6000 });

    if (!resCh1.data || resCh1.data === '-1') {
      throw new Error('Channel 1 empty or invalid response');
    }

    const feed1 = resCh1.data;

    let feed2 = {};
    if (channel2Id) {
      try {
        const urlCh2 = `https://api.thingspeak.com/channels/${channel2Id}/feeds/last.json${
          readKey2 ? `?api_key=${readKey2}` : ''
        }`;
        const resCh2 = await axios.get(urlCh2, { timeout: 5000 });
        if (resCh2.data && resCh2.data !== '-1') {
          feed2 = resCh2.data;
        }
      } catch (err) {
        console.warn('ThingSpeak Channel 2 fetch skipped or failed:', err.message);
      }
    }

    // Extract ONLY raw sensor metrics from Channel 1 and Channel 2
    // (Actuators: Servos & Relay Fan are controlled by internal application safety interlocks)
    const metrics = {
      mq2: Number(feed1.field1) || 0,
      mq3: Number(feed1.field2) || 0,
      mq4: Number(feed1.field3) || 0,
      mq5: Number(feed1.field4) || 0,
      temperature: Number(feed1.field5) || 0,
      humidity: Number(feed1.field6) || 0,

      // Channel 2: Field 4 is MOTION (PIR sensor)
      pirMotion: Number(feed2.field4) || 0,
      
      createdAt: feed1.created_at || new Date().toISOString(),
    };

    return {
      success: true,
      data: metrics,
    };
  } catch (error) {
    console.error('ThingSpeak REST fetch error:', error.message);
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Fetch past historical feed sequence for Recharts visualization from ThingSpeak
 */
export const fetchThingSpeakHistory = async (channelId, readKey = '', results = 30) => {
  if (!channelId) return null;
  try {
    const url = `https://api.thingspeak.com/channels/${channelId}/feeds.json?results=${results}${
      readKey ? `&api_key=${readKey}` : ''
    }`;
    const res = await axios.get(url, { timeout: 8000 });
    if (res.data && res.data.feeds) {
      return res.data.feeds.map((feed) => {
        const time = new Date(feed.created_at);
        const mq2 = Number(feed.field1) || 0;
        const mq3 = Number(feed.field2) || 0;
        const mq4 = Number(feed.field3) || 0;
        const mq5 = Number(feed.field4) || 0;
        const isGasHazard = Math.max(mq2, mq3, mq4, mq5) > 300;

        return {
          timestamp: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          fullTime: feed.created_at,
          mq2,
          mq3,
          mq4,
          mq5,
          temperature: Number(feed.field5) || 0,
          humidity: Number(feed.field6) || 0,
          relayStatus: isGasHazard ? 1 : 0,
          pirMotion: 0,
          safetyScore: isGasHazard ? 30 : 95,
        };
      });
    }
    return null;
  } catch (err) {
    console.warn('ThingSpeak history fetch error:', err.message);
    return null;
  }
};

/**
 * Send write update command to ThingSpeak Channel 1 (Field 8 Relay Control)
 */
export const writeThingSpeakRelay = async (writeKey, relayValue) => {
  if (!writeKey) return { success: false, reason: 'No Write API Key provided' };
  try {
    const url = `https://api.thingspeak.com/update?api_key=${writeKey}&field8=${relayValue}`;
    const res = await axios.get(url, { timeout: 6000 });
    if (res.data && res.data !== 0) {
      return { success: true, entryId: res.data };
    }
    return { success: false, reason: 'Rate limit or write rejected' };
  } catch (err) {
    console.error('ThingSpeak REST write error:', err.message);
    return { success: false, error: err.message };
  }
};

