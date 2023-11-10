import { Settings } from './settings-type';

const settings: Settings = {
  getWebSocketHost(): string {
    return `${window.location.hostname}:5000`;
  },
  sendCommandIntervalMillis: 1000,
  fullScreen: false,
};

export default settings;
