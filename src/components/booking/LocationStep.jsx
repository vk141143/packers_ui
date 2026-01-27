import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';

const LocationStep = ({ data, onUpdate, onNext, onBack }) => {
  const handleInputChange = (field, value) => {
    onUpdate({ ...data, [field]: value });
  };

  const handleNext = () => {
    if (data.pickupAddress && data.deliveryAddress && data.pickupCity && data.deliveryCity) {
      onNext();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pickup & Delivery Locations</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="font-semibold text-lg">Pickup Location</h3>
          <div>
            <Label htmlFor="pickupAddress">Address</Label>
            <Textarea
              id="pickupAddress"
              placeholder="Enter pickup address"
              value={data.pickupAddress || ''}
              onChange={(e) => handleInputChange('pickupAddress', e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="pickupCity">City</Label>
              <Input
                id="pickupCity"
                placeholder="City"
                value={data.pickupCity || ''}
                onChange={(e) => handleInputChange('pickupCity', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="pickupPincode">Pincode</Label>
              <Input
                id="pickupPincode"
                placeholder="Pincode"
                value={data.pickupPincode || ''}
                onChange={(e) => handleInputChange('pickupPincode', e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold text-lg">Delivery Location</h3>
          <div>
            <Label htmlFor="deliveryAddress">Address</Label>
            <Textarea
              id="deliveryAddress"
              placeholder="Enter delivery address"
              value={data.deliveryAddress || ''}
              onChange={(e) => handleInputChange('deliveryAddress', e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="deliveryCity">City</Label>
              <Input
                id="deliveryCity"
                placeholder="City"
                value={data.deliveryCity || ''}
                onChange={(e) => handleInputChange('deliveryCity', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="deliveryPincode">Pincode</Label>
              <Input
                id="deliveryPincode"
                placeholder="Pincode"
                value={data.deliveryPincode || ''}
                onChange={(e) => handleInputChange('deliveryPincode', e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <Button variant="outline" onClick={onBack} className="flex-1">
            Back
          </Button>
          <Button 
            onClick={handleNext} 
            className="flex-1"
            disabled={!data.pickupAddress || !data.deliveryAddress || !data.pickupCity || !data.deliveryCity}
          >
            Next Step
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default LocationStep;