export interface Settings {
  getWebSocketHost(): string;
  readonly sendCommandIntervalMillis: number;
  fullScreen: boolean;
}
