import React from 'react'
import { Clock, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface TimeSlot {
  time: string
  available: boolean
  price?: number
}

interface TimeSlotPickerProps {
  timeSlots: TimeSlot[]
  selectedTime?: string
  onTimeSelect: (time: string) => void
  className?: string
  title?: string
}

export default function TimeSlotPicker({
  timeSlots,
  selectedTime,
  onTimeSelect,
  className,
  title = "Horários Disponíveis"
}: TimeSlotPickerProps) {
  const availableSlots = timeSlots.filter(slot => slot.available)
  const unavailableSlots = timeSlots.filter(slot => !slot.available)

  return (
    <div className={cn("bg-card rounded-lg border p-4", className)}>
      {/* Header */}
      <div className="flex items-center space-x-2 mb-4">
        <Clock className="h-5 w-5 text-primary" />
        <h3 className="font-semibold text-lg">{title}</h3>
      </div>

      {/* Available time slots */}
      {availableSlots.length > 0 && (
        <div className="mb-6">
          <h4 className="text-sm font-medium text-muted-foreground mb-3">
            Horários Livres ({availableSlots.length})
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {availableSlots.map((slot) => {
              const isSelected = selectedTime === slot.time
              
              return (
                <Button
                  key={slot.time}
                  variant={isSelected ? "default" : "outline"}
                  onClick={() => onTimeSelect(slot.time)}
                  className={cn(
                    "relative h-12 flex flex-col items-center justify-center p-2",
                    "transition-all duration-200",
                    "hover:scale-105 active:scale-95",
                    {
                      "bg-primary text-primary-foreground shadow-lg": isSelected,
                      "hover:bg-primary/10 hover:border-primary": !isSelected,
                    }
                  )}
                >
                  <div className="flex items-center space-x-1">
                    <span className="font-medium">{slot.time}</span>
                    {isSelected && (
                      <CheckCircle className="h-3 w-3" />
                    )}
                  </div>
                  {slot.price && (
                    <span className="text-xs opacity-75">
                      R$ {slot.price.toFixed(2)}
                    </span>
                  )}
                </Button>
              )
            })}
          </div>
        </div>
      )}

      {/* Unavailable time slots */}
      {unavailableSlots.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-muted-foreground mb-3">
            Horários Ocupados ({unavailableSlots.length})
          </h4>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {unavailableSlots.map((slot) => (
              <div
                key={slot.time}
                className={cn(
                  "h-10 flex items-center justify-center p-2 rounded-md",
                  "bg-muted text-muted-foreground border border-dashed",
                  "text-sm font-medium"
                )}
              >
                {slot.time}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No slots available */}
      {availableSlots.length === 0 && unavailableSlots.length === 0 && (
        <div className="text-center py-8">
          <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">
            Nenhum horário disponível para esta data
          </p>
        </div>
      )}

      {/* Selected time confirmation */}
      {selectedTime && (
        <div className="mt-4 p-3 bg-primary/10 rounded-lg border border-primary/20">
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">
              Horário selecionado: <strong>{selectedTime}</strong>
            </span>
          </div>
        </div>
      )}
    </div>
  )
}