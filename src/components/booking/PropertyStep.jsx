import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

const PropertyStep = ({ data = {}, onUpdate, onNext }) => {
  const handleRequestTypeChange = (value) => {
    onUpdate({ ...data, requestType: value });
  };

  const handleNext = () => {
    if (data.requestType) {
      onNext();
    }
  };

  return (
    <Card className="text-gray-900">
      <CardHeader>
        <CardTitle className="text-gray-900">What do you need?</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Select value={data.requestType || ''} onValueChange={handleRequestTypeChange}>
            <SelectTrigger className="text-gray-900">
              <SelectValue placeholder="Select service type" className="text-gray-900" />
            </SelectTrigger>
            <SelectContent className="text-gray-900">
              <SelectItem value="house-clearance" className="text-gray-900">House Clearance</SelectItem>
              <SelectItem value="office-clearance" className="text-gray-900">Office Clearance</SelectItem>
              <SelectItem value="moving" className="text-gray-900">Moving Service</SelectItem>
              <SelectItem value="storage" className="text-gray-900">Storage Service</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button 
          onClick={handleNext} 
          className="w-full"
          disabled={!data.requestType}
        >
          Next Step
        </Button>
      </CardContent>
    </Card>
  );
};

export { PropertyStep };