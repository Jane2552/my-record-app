'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { buildMonthGrid, type DayRecord, WEEKDAYS } from '@/lib/records'
import { cn } from '@/lib/utils'

type Props = {
  year: number
  month: number
  todayKey: string
  selectedKey: string
  recordsByDay: Map<string, DayRecord[]>
  onSelect: (key: string) => void
  onPrev: () => void
  onNext: () => void
  onToday: () => void
}

export function MonthCalendar({ year, month, todayKey, selectedKey, recordsByDay, onSelect, onPrev, onNext, onToday }: Props) {
  const cells = buildMonthGrid(year, month)
  const monthTotal = cells.reduce((sum, c) => sum + (c.inMonth ? (recordsByDay.get(c.key)?.length ?? 0) : 0), 0)

  return (
    <section aria-labelledby="month-heading" className="flex flex-col gap-5">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex items-baseline gap-3">
          <h2 id="month-heading" className="font-mono text-5xl font-semibold tracking-tight md:text-6xl">
            {String(month + 1).padStart(2, '0')}
          </h2>
          <div className="flex flex-col leading-tight">
            <span className="text-sm text-muted-foreground">{year}</span>
            <span className="text-sm font-medium">本月 {monthTotal} 條記錄</span>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="outline" size="sm" onClick={onToday}>
            今日
          </Button>
          <Button variant="ghost" size="icon" onClick={onPrev} aria-label="上個月">
            <ChevronLeft />
          </Button>
          <Button variant="ghost" size="icon" onClick={onNext} aria-label="下個月">
            <ChevronRight />
          </Button>
        </div>
      </div>

      <div role="grid" aria-label={`${year}年${month + 1}月`} className="overflow-hidden rounded-xl border bg-card">
        <div role="row" className="grid grid-cols-7 border-b bg-muted">
          {WEEKDAYS.map((d, i) => (
            <div
              key={d}
              role="columnheader"
              className={cn('py-2 text-center text-xs font-medium text-muted-foreground', (i === 0 || i === 6) && 'text-primary')}
            >
              {d}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {cells.map(({ key, date, inMonth }, i) => {
            const items = recordsByDay.get(key) ?? []
            const visibleItems = items.filter((r) => r.isAllDay === false && r.time.trim().length > 0).sort((a, b) => a.time.localeCompare(b.time))
            const calendarItems = visibleItems.length ? visibleItems : []
            const isToday = key === todayKey
            const isSelected = key === selectedKey
            return (
              <button
                key={key}
                type="button"
                role="gridcell"
                aria-selected={isSelected}
                aria-label={`${date.getMonth() + 1}月${date.getDate()}日，${items.length} 條記錄`}
                onClick={() => onSelect(key)}
                className={cn(
                  'group relative flex aspect-square flex-col items-start gap-1 border-border p-1.5 text-left transition-colors outline-none focus-visible:z-10 focus-visible:ring-2 focus-visible:ring-ring md:aspect-auto md:min-h-24 md:p-2',
                  i % 7 !== 6 && 'border-r',
                  i < 35 && 'border-b',
                  !inMonth && 'bg-muted/50 text-muted-foreground/60',
                  isSelected ? 'bg-primary text-primary-foreground' : 'hover:bg-muted',
                )}
              >
                <span
                  className={cn(
                    'flex size-7 items-center justify-center rounded-full font-mono text-sm',
                    isToday && !isSelected && 'bg-accent font-semibold text-accent-foreground',
                    isToday && isSelected && 'bg-primary-foreground font-semibold text-primary',
                  )}
                >
                  {date.getDate()}
                </span>

                {calendarItems.length > 0 && (
                  <>
                    <ul className="hidden w-full flex-col gap-0.5 md:flex" aria-hidden="true">
                      {calendarItems.slice(0, 2).map((r) => (
                        <li
                          key={r.id}
                          className={cn(
                            'truncate rounded px-1.5 py-0.5 text-xs',
                            isSelected ? 'bg-primary-foreground/15' : 'bg-secondary text-secondary-foreground',
                          )}
                        >
                          {r.title}
                        </li>
                      ))}
                      {calendarItems.length > 2 && (
                        <li className={cn('px-1.5 text-xs', isSelected ? 'text-primary-foreground/80' : 'text-muted-foreground')}>
                          +{calendarItems.length - 2}
                        </li>
                      )}
                    </ul>
                    <span className="mt-auto flex gap-0.5 md:hidden" aria-hidden="true">
                      {calendarItems.slice(0, 3).map((r) => (
                        <span key={r.id} className={cn('size-1.5 rounded-full', isSelected ? 'bg-primary-foreground' : 'bg-primary')} />
                      ))}
                    </span>
                  </>
                )}
              </button>
            )
          })}
        </div>
      </div>
    </section>
  )
}
