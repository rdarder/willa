import { Settings } from './settings-type';

const settings: Settings = {
  getWebSocketHost(): string {
    return window.location.host;
  },
  sendCommandIntervalMillis: 100,
  fullScreen: true,
};

export default settings;
