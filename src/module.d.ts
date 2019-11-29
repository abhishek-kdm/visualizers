type Statement = 'break' | 'continue' | void;

interface BarArrayStats { [stats: string]: string | null }

interface Bar {
  value: number
  color: string
}

interface BarArrayDrawingOptions {
  start_x: number
  start_y: number
  width: number
  spacing: number
  statsBarOffset: number
}

