import { NextResponse } from 'next/server'
import { createRecord, listRecords } from '@/lib/record-store'
import { CATEGORIES, type Category, isValidDateKey } from '@/lib/records'

export async function GET(request: Request) {
  const month = new URL(request.url).searchParams.get('month') ?? undefined
  if (month && !/^\d{4}-\d{2}$/.test(month)) {
    return NextResponse.json({ error: '月份格式錯誤' }, { status: 400 })
  }
  return NextResponse.json(listRecords(month))
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  const title = typeof body?.title === 'string' ? body.title.trim().slice(0, 80) : ''
  const note = typeof body?.note === 'string' ? body.note.trim().slice(0, 2000) : ''
  const time = typeof body?.time === 'string' && /^\d{2}:\d{2}$/.test(body.time) ? body.time : ''
  const category = CATEGORIES.includes(body?.category) ? (body.category as Category) : '其他'
  const isAllDay = body?.isAllDay === true
  const isMustDo = body?.isMustDo === true

  if (!isValidDateKey(body?.date) || !title) {
    return NextResponse.json({ error: '請填寫日期同標題' }, { status: 400 })
  }

  return NextResponse.json(createRecord({ date: body.date, title, note, time: isAllDay ? '' : time, category, isAllDay, isMustDo, completed: false }), { status: 201 })
}
