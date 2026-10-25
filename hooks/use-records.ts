'use client'

import useSWR from 'swr'
import type { DayRecord, NewDayRecord } from '@/lib/records'

const fetcher = async (url: string) => {
  const res = await fetch(url)
  if (!res.ok) throw new Error('載入失敗')
  return res.json() as Promise<DayRecord[]>
}

export function useRecords() {
  const { data, error, isLoading, mutate } = useSWR('/api/records', fetcher)

  async function addRecord(input: NewDayRecord) {
    const res = await fetch('/api/records', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    })
    if (!res.ok) {
      const body = await res.json().catch(() => ({}))
      throw new Error(body.error ?? '儲存失敗')
    }
    await mutate()
  }

  async function removeRecord(id: string) {
    await mutate(
      async (current) => {
        const res = await fetch(`/api/records/${id}`, { method: 'DELETE' })
        if (!res.ok) throw new Error('刪除失敗')
        return current?.filter((r) => r.id !== id)
      },
      { optimisticData: (current) => current?.filter((r) => r.id !== id) ?? [], rollbackOnError: true, revalidate: false },
    )
  }

  return { records: data ?? [], error, isLoading, addRecord, removeRecord, refresh: mutate }
}
