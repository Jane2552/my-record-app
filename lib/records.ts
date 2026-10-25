export const CATEGORIES = ['生活', '工作', '運動', '飲食', '心情', '其他'] as const

export type Category = (typeof CATEGORIES)[number]

export type DayRecord = {
  id: string
  date: string
  time: string
  title: string
  note: string
  category: Category
  isAllDay: boolean
  isMustDo: boolean
  completed: boolean
  createdAt: number
}

export type NewDayRecord = Omit<DayRecord, 'id' | 'createdAt'>

export const WEEKDAYS = ['日', '一', '二', '三', '四', '五', '六']

export function toDateKey(date: Date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function parseDateKey(key: string) {
  const [y, m, d] = key.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export function isValidDateKey(value: unknown): value is string {
  return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)
}

export function buildMonthGrid(year: number, month: number) {
  const first = new Date(year, month, 1)
  const start = new Date(year, month, 1 - first.getDay())
  return Array.from({ length: 42 }, (_, i) => {
    const day = new Date(start.getFullYear(), start.getMonth(), start.getDate() + i)
    return { date: day, key: toDateKey(day), inMonth: day.getMonth() === month }
  })
}

export function formatLongDate(key: string) {
  const date = parseDateKey(key)
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日 · 星期${WEEKDAYS[date.getDay()]}`
}
