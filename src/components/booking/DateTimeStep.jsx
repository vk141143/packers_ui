import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

const DateTimeStep = ({ data, onUpdate, onNext, onBack }) => {
  const handleInputChange = (field, value) => {
    onUpdate({ ...data, [field]: value });
  };

  const handleNext = () => {
    if (data.moveDate && data.timeSlot) {
      onNext();
    }
  };

  const timeSlots = [
    '8:00 AM - 10:00 AM',
    '10:00 AM - 12:00 PM',
    '12:00 PM - 2:00 PM',
    '2:00 PM - 4:00 PM',
    '4:00 PM - 6:00 PM'
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Schedule Your Move</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="moveDate">Moving Date</Label>
          <Input
            id="moveDate"
            type="date"
            value={data.moveDate || ''}
            onChange={(e) => handleInputChange('moveDate', e.target.value)}
            min={new Date().toISOString().split('T')[0]}
          />
        </div>

        <div>
          <Label htmlFor="timeSlot">Preferred Time Slot</Label>
          <Select value={data.timeSlot || ''} onValueChange={(value) => handleInputChange('timeSlot', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select time slot" />
            </SelectTrigger>
            <SelectContent>
              {timeSlots.map((slot) => (
                <SelectItem key={slot} value={slot}>
                  {slot}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="packingService">Packing Service</Label>
          <Select value={data.packingService || ''} onValueChange={(value) => handleInputChange('packingService', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select packing option" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="self">Self Packing</SelectItem>
              <SelectItem value="partial">Partial Packing</SelectItem>
              <SelectItem value="full">Full Packing Service</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="insurance">Insurance Coverage</Label>
          <Select value={data.insurance || ''} onValueChange={(value) => handleInputChange('insurance', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select insurance option" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="basic">Basic Coverage</SelectItem>
              <SelectItem value="standard">Standard Coverage</SelectItem>
              <SelectItem value="premium">Premium Coverage</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-4">
          <Button variant="outline" onClick={onBack} className="flex-1">
            Back
          </Button>
          <Button 
            onClick={handleNext} 
            className="flex-1"
            disabled={!data.moveDate || !data.timeSlot}
          >
            Next Step
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DateTimeStep;