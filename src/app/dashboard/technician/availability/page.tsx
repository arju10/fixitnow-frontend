'use client';

import { useEffect, useState } from 'react';
import { useTechnicians } from '@/hooks/useTechnicians';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Plus, Trash2, Clock, Check, X } from 'lucide-react';
import toast from 'react-hot-toast';

const DAYS = [
  { value: 0, label: 'Sunday' },
  { value: 1, label: 'Monday' },
  { value: 2, label: 'Tuesday' },
  { value: 3, label: 'Wednesday' },
  { value: 4, label: 'Thursday' },
  { value: 5, label: 'Friday' },
  { value: 6, label: 'Saturday' },
];

export default function TechnicianAvailabilityPage() {
  const { availability, loading, fetchAvailability, addAvailability, deleteAvailability } =
    useTechnicians();
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    dayOfWeek: 1,
    startTime: '09:00',
    endTime: '17:00',
    isActive: true,
  });

  useEffect(() => {
    fetchAvailability();
  }, [fetchAvailability]);

  const handleAdd = async () => {
    if (!formData.startTime || !formData.endTime) {
      toast.error('Please fill in all fields');
      return;
    }

    if (formData.startTime >= formData.endTime) {
      toast.error('Start time must be before end time');
      return;
    }

    try {
      await addAvailability(formData);
      setIsAdding(false);
      setFormData({ dayOfWeek: 1, startTime: '09:00', endTime: '17:00', isActive: true });
    } catch (error) {
      toast.error('Failed to add availability slot');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this availability slot?')) return;
    try {
      await deleteAvailability(id);
    } catch (error) {
      toast.error('Failed to delete availability slot');
    }
  };

  const getDayLabel = (day: number) => {
    return DAYS.find((d) => d.value === day)?.label || 'Unknown';
  };

  // Group availability by day
  const groupedAvailability = availability.reduce((acc: any, slot: any) => {
    const day = slot.dayOfWeek;
    if (!acc[day]) acc[day] = [];
    acc[day].push(slot);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold">Availability</h1>
        {!isAdding && (
          <Button onClick={() => setIsAdding(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Availability
          </Button>
        )}
      </div>

      {/* Add Form */}
      {isAdding && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Add Availability Slot</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <label className="text-sm font-medium">Day</label>
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={formData.dayOfWeek}
                  onChange={(e) =>
                    setFormData({ ...formData, dayOfWeek: parseInt(e.target.value) })
                  }
                >
                  {DAYS.map((day) => (
                    <option key={day.value} value={day.value}>
                      {day.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Start Time</label>
                <Input
                  type="time"
                  value={formData.startTime}
                  onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">End Time</label>
                <Input
                  type="time"
                  value={formData.endTime}
                  onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                />
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <Button onClick={handleAdd}>Add Slot</Button>
              <Button
                variant="outline"
                onClick={() => {
                  setIsAdding(false);
                  setFormData({
                    dayOfWeek: 1,
                    startTime: '09:00',
                    endTime: '17:00',
                    isActive: true,
                  });
                }}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Availability List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 animate-pulse rounded-lg bg-muted/50" />
          ))}
        </div>
      ) : availability.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {DAYS.map((day) => {
            const slots = groupedAvailability[day.value] || [];
            if (slots.length === 0) return null;

            return (
              <Card key={day.value}>
                <CardHeader>
                  <CardTitle className="text-lg">{day.label}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {slots.map((slot: any) => (
                    <div
                      key={slot.id}
                      className="flex items-center justify-between rounded-lg border p-3"
                    >
                      <div className="flex items-center gap-3">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>
                          {slot.startTime} - {slot.endTime}
                        </span>
                        <Badge variant={slot.isActive ? 'success' : 'destructive'}>
                          {slot.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                      <Button size="sm" variant="destructive" onClick={() => handleDelete(slot.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="rounded-lg border py-12 text-center">
          <Clock className="mx-auto h-12 w-12 text-muted-foreground/50" />
          <h3 className="mt-4 text-lg font-medium">No availability set</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Add your working hours so customers can book you
          </p>
          {!isAdding && (
            <Button onClick={() => setIsAdding(true)} className="mt-4">
              <Plus className="mr-2 h-4 w-4" />
              Add Availability
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
