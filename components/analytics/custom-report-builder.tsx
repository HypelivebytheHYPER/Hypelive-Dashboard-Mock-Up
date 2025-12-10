'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { FileDown, Settings } from 'lucide-react';

interface ReportField {
  id: string;
  name: string;
  selected: boolean;
}

export function CustomReportBuilder() {
  const [reportName, setReportName] = useState('My Custom Report');
  const [fields, setFields] = useState<ReportField[]>([
    { id: 'conversions', name: 'Total Conversions', selected: true },
    { id: 'revenue', name: 'Revenue', selected: true },
    { id: 'avg-order-value', name: 'Average Order Value', selected: true },
    { id: 'conversion-rate', name: 'Conversion Rate', selected: false },
    { id: 'roi', name: 'ROI', selected: false },
    { id: 'customer-lifetime-value', name: 'Customer Lifetime Value', selected: false },
  ]);

  const toggleField = (fieldId: string) => {
    setFields(fields.map(field =>
      field.id === fieldId ? { ...field, selected: !field.selected } : field
    ));
  };

  const handleGenerateReport = () => {
    const selectedFields = fields.filter(f => f.selected).map(f => f.name);
    console.log('Generating report:', {
      name: reportName,
      fields: selectedFields,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Custom Report Builder
        </CardTitle>
        <CardDescription>Create custom reports with selected metrics</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="report-name">Report Name</Label>
          <Input
            id="report-name"
            placeholder="Enter report name"
            value={reportName}
            onChange={(e) => setReportName(e.target.value)}
            className="text-base"
          />
        </div>

        <div className="space-y-3">
          <Label>Select Metrics to Include</Label>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {fields.map(field => (
              <div key={field.id} className="flex items-center gap-3">
                <Checkbox
                  id={field.id}
                  checked={field.selected}
                  onCheckedChange={() => toggleField(field.id)}
                />
                <label
                  htmlFor={field.id}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  {field.name}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg bg-muted p-4">
          <p className="text-sm text-muted-foreground mb-2">
            Selected Metrics: <span className="font-semibold text-foreground">{fields.filter(f => f.selected).length}</span>
          </p>
          <p className="text-xs text-muted-foreground">
            {fields.filter(f => f.selected).length === 0
              ? 'No metrics selected. Select at least one metric to generate a report.'
              : `Ready to generate report with ${fields.filter(f => f.selected).length} metric(s).`}
          </p>
        </div>

        <Button
          onClick={handleGenerateReport}
          className="w-full"
          disabled={fields.filter(f => f.selected).length === 0}
        >
          <FileDown className="mr-2 h-4 w-4" />
          Generate Report
        </Button>
      </CardContent>
    </Card>
  );
}

export default CustomReportBuilder;
