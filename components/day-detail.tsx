'use client'

import { useState } from 'react'
import { Check, Pencil, Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { type DayRecord, formatLongDate } from '@/lib/records'

type Props = { dateKey: string; records: DayRecord[]; journal: string; onJournalChange: (value: string) => void; onAdd: () => void; onDelete: (id: string) => void; onToggle: (id: string) => void; onEdit: (record: DayRecord) => void }

export function DayDetail({ dateKey, records, journal, onJournalChange, onAdd, onDelete, onToggle, onEdit }: Props) {
  const [tab, setTab] = useState<'detail' | 'journal'>('detail')
  return <section aria-labelledby="day-heading" className="flex flex-col gap-4 rounded-xl border bg-card p-5">
    <div className="flex gap-5 border-b" role="tablist">{[['detail', '當日詳情'], ['journal', '日記']].map(([id, label]) => <button key={id} role="tab" aria-selected={tab === id} onClick={() => setTab(id as 'detail' | 'journal')} className={`border-b-2 px-1 pb-3 text-sm ${tab === id ? 'border-primary font-medium' : 'border-transparent text-muted-foreground'}`}>{label}</button>)}</div>
    {tab === 'journal' ? <div className="flex flex-col gap-3"><h2 className="text-lg font-semibold">{formatLongDate(dateKey)} · 日記</h2><Textarea value={journal} onChange={(e) => onJournalChange(e.target.value)} placeholder="寫低今日嘅心情同片段……" className="min-h-48 resize-y" /></div> : <>
      <header className="flex items-start justify-between gap-3"><div><p className="text-xs font-medium tracking-widest text-muted-foreground">當日詳情</p><h2 id="day-heading" className="text-lg font-semibold">{formatLongDate(dateKey)}</h2></div><Button size="sm" onClick={onAdd}><Plus />新增</Button></header>
      {records.length === 0 ? <div className="rounded-lg border border-dashed px-4 py-10 text-center"><p className="text-sm text-muted-foreground">呢日仲未有記錄</p></div> : <ol className="relative flex flex-col gap-4 border-l-2 border-dashed border-border pl-5">{records.map((r) => <li key={r.id} className="relative flex flex-col gap-1.5"><span className={`absolute top-1.5 -left-6.5 size-3 rounded-full border-2 border-card ${r.isMustDo ? (r.completed ? 'bg-emerald-500' : 'bg-red-500') : 'bg-primary'}`} aria-hidden="true" /><div className="flex items-start justify-between gap-2"><div className="min-w-0"><div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">{r.isAllDay ? <span>全日</span> : r.time && <span className="font-mono">{r.time}</span>}<span className="rounded-full bg-secondary px-2 py-0.5">{r.category}</span>{r.isMustDo && <span className={r.completed ? 'text-emerald-600' : 'text-red-600'}>{r.completed ? '已完成' : '必做'}</span>}</div><p className="mt-1 font-medium">{r.title}</p>{r.note && <p className="text-sm text-muted-foreground">{r.note}</p>}</div><div className="flex shrink-0 gap-1">{r.isMustDo && <Button variant="outline" size="sm" onClick={() => onToggle(r.id)} className={r.completed ? 'border-emerald-500 text-emerald-600' : ''}>{r.completed ? <Check /> : null}完成</Button>}<Button variant="ghost" size="icon" aria-label="編輯記錄" onClick={() => onEdit(r)}><Pencil /></Button><Button variant="ghost" size="icon" aria-label="刪除記錄" onClick={() => onDelete(r.id)}><Trash2 /></Button></div></div></li>)}</ol>}
    </>}
  </section>
}
