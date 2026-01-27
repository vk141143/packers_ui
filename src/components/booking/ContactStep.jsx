import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';

const ContactStep = ({ data, onUpdate, onSubmit, onBack }) => {
  const handleInputChange = (field, value) => {
    onUpdate({ ...data, [field]: value });
  };

  const handleSubmit = () => {
    if (data.name && data.phone && data.email) {
      onSubmit();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Contact Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            placeholder="Enter your full name"
            value={data.name || ''}
            onChange={(e) => handleInputChange('name', e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            type="tel"
            placeholder="Enter your phone number"
            value={data.phone || ''}
            onChange={(e) => handleInputChange('phone', e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            type="email"
            placeholder="Enter your email address"
            value={data.email || ''}
            onChange={(e) => handleInputChange('email', e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="alternatePhone">Alternate Phone (Optional)</Label>
          <Input
            id="alternatePhone"
            type="tel"
            placeholder="Enter alternate phone number"
            value={data.alternatePhone || ''}
            onChange={(e) => handleInputChange('alternatePhone', e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="specialInstructions">Special Instructions</Label>
          <Textarea
            id="specialInstructions"
            placeholder="Any special instructions for the movers..."
            value={data.specialInstructions || ''}
            onChange={(e) => handleInputChange('specialInstructions', e.target.value)}
          />
        </div>

        <div className="flex gap-4">
          <Button variant="outline" onClick={onBack} className="flex-1">
            Back
          </Button>
          <Button 
            onClick={handleSubmit} 
            className="flex-1"
            disabled={!data.name || !data.phone || !data.email}
          >
            Submit Booking
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export { ContactStep };