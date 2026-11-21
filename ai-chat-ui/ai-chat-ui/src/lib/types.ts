export type Role = 'user' | 'assistant'
export type Status = 'done' | 'streaming' | 'stopped' | 'error'

export interface WeatherData { city: string; tempC: number; summary: string; days: { day: string; tempC: number }[] }

export interface Message {
  id: string
  role: Role
  content: string
  status: Status
  /** Optional structured "tool result" rendered as a real component instead of text. */
  tool?: { type: 'weather'; data: WeatherData }
}
