import { NextResponse } from 'next/server'
import { deleteRecord, getRecordStore } from '@/lib/record-store'

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await request.json().catch(() => null)
  const records = getRecordStore()
  const record = records.find((item) => item.id === id)
  if (!record) return NextResponse.json({ error: '搵唔到記錄' }, { status: 404 })
  if (typeof body?.completed === 'boolean') record.completed = body.completed
  return NextResponse.json(record)
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  if (!deleteRecord(id)) return NextResponse.json({ error: '搵唔到記錄' }, { status: 404 })
  return new NextResponse(null, { status: 204 })
}
