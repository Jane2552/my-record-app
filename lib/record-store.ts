import { type DayRecord, type NewDayRecord, toDateKey } from './records'

// Temporary in-memory store; swap these functions for database queries once a database is connected.
const globalStore = globalThis as unknown as { __records?: DayRecord[] }

function seed(): DayRecord[] {
  const today = new Date()
  const offset = (days: number) =>
    toDateKey(new Date(today.getFullYear(), today.getMonth(), today.getDate() + days))
  return [
    { id: crypto.randomUUID(), date: offset(0), time: '08:30', title: '晨跑 5 公里', note: '沿住海旁跑，天氣好好。', category: '運動', isAllDay: false, isMustDo: false, completed: false, createdAt: Date.now() },
    { id: crypto.randomUUID(), date: offset(0), time: '13:00', title: '同事食午飯', note: '試咗新開嗰間茶記，菠蘿油唔錯。', category: '飲食', isAllDay: false, isMustDo: false, completed: false, createdAt: Date.now() + 1 },
    { id: crypto.randomUUID(), date: offset(-2), time: '15:00', title: '季度報告', note: '完成初稿，聽日再改。', category: '工作', isAllDay: false, isMustDo: true, completed: true, createdAt: Date.now() + 2 },
  ]
}

export function getRecordStore() {
  if (!globalStore.__records) globalStore.__records = seed()
  return globalStore.__records
}

export function listRecords(month?: string) {
  const all = getRecordStore()
  const filtered = month ? all.filter((r) => r.date.startsWith(month)) : all
  return [...filtered].sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time))
}

export function createRecord(input: NewDayRecord) {
  const record: DayRecord = { ...input, id: crypto.randomUUID(), createdAt: Date.now() }
  getRecordStore().push(record)
  return record
}

export function deleteRecord(id: string) {
  const all = getRecordStore()
  const index = all.findIndex((r) => r.id === id)
  if (index === -1) return false
  all.splice(index, 1)
  return true
}
