import type { WeatherData } from '../lib/types'

/** Generative UI: the model returns structured data, and the app decides how to render it. */
export function WeatherCard({ data }: { data: WeatherData }) {
  const max = Math.max(...data.days.map((d) => d.tempC))
  return (
    <figure className="mb-3 w-full max-w-sm rounded-2xl border border-edge bg-white p-4">
      <figcaption className="flex items-baseline justify-between">
        <span className="font-extrabold">{data.city}</span>
        <span className="text-sm text-soft">{data.summary}</span>
      </figcaption>
      <p className="mt-1 text-4xl font-extrabold">{data.tempC}°C</p>
      <ul className="mt-4 flex items-end gap-3" aria-label="Five day forecast">
        {data.days.map((d) => (
          <li key={d.day} className="flex flex-1 flex-col items-center gap-1 text-xs text-soft">
            <div className="w-full rounded-t bg-teal" style={{ height: `${(d.tempC / max) * 56}px` }} />
            <span className="font-semibold text-ink">{d.tempC}°</span>
            {d.day}
          </li>
        ))}
      </ul>
    </figure>
  )
}
