"use client";

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Template,
  Star,
  Users,
  DollarSign,
  Calendar,
  TrendingUp,
  Play,
  Settings,
  Copy,
  CheckCircle
} from 'lucide-react';
import { campaignService } from '@/lib/api/services/campaign-service';
import { formatNumber, formatPercentage } from '@/lib/utils/formatters';
import { Skeleton } from '@/components/ui/skeleton';
import { CampaignTemplate } from '@/lib/types/campaign.types';

export function CampaignTemplates() {
  const [selectedTemplate, setSelectedTemplate] = useState<CampaignTemplate | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const { data: templates, isLoading, error } = useQuery({
    queryKey: ['campaign-templates'],
    queryFn: () => campaignService.getCampaignTemplates(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  const categories = ['all', 'brand_awareness', 'product_launch', 'sales_driving', 'engagement'];

  const filteredTemplates = templates?.filter(template => 
    categoryFilter === 'all' || template.objective === categoryFilter
  ) || [];

  const handleUseTemplate = (template: CampaignTemplate) => {
    // Navigate to campaign creation with template data
    window.location.href = `/dashboard/campaign-management/create?template=${template.id}`;
  };

  const handlePreviewTemplate = (template: CampaignTemplate) => {
    setSelectedTemplate(template);
  };

  if (isLoading) {
    return <TemplatesSkeleton />;
  }

  if (error) {
    return (
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle>Error Loading Templates</CardTitle>
          <CardDescription>Failed to load campaign templates</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={() => window.location.reload()} variant="outline">
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Template Filter */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Campaign Templates</h2>
          <p className="text-muted-foreground">
            Pre-built campaign templates for common marketing scenarios
          </p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 border rounded-md text-sm"
          >
            <option value="all">All Categories</option>
            <option value="brand_awareness">Brand Awareness</option>
            <option value="product_launch">Product Launch</option>
            <option value="sales_driving">Sales Driving</option>
            <option value="engagement">Engagement</option>
          </select>
        </div>
      </div>

      {/* Template Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredTemplates.map((template) => (
          <Card key={template.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-primary/10 text-primary">
                      <Template className="h-6 w-6" />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">{template.name}</CardTitle>
                    <CardDescription>{template.description}</CardDescription>
                  </div>
                </div>
                <Badge variant={template.is_active ? 'default' : 'secondary'}>
                  {template.is_active ? 'Active' : 'Inactive'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Template Stats */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">{formatNumber(template.usage_count)}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Uses</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <TrendingUp className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">{formatPercentage(template.average_roi)}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Avg ROI</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Star className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">{formatPercentage(template.success_rate)}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Success</p>
                  </div>
                </div>

                {/* Template Tags */}
                <div className="flex flex-wrap gap-1">
                  {template.tags.slice(0, 3).map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {template.tags.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{template.tags.length - 3}
                    </Badge>
                  )}
                </div>

                {/* Template Actions */}
                <div className="flex items-center gap-2">
                  <Button 
                    size="sm" 
                    className="flex-1"
                    onClick={() => handleUseTemplate(template)}
                  >
                    <Play className="mr-2 h-4 w-4" />
                    Use Template
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handlePreviewTemplate(template)}
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    Preview
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Template Preview Modal */}
      {selectedTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <Card className="m-4">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>{selectedTemplate.name}</CardTitle>
                    <CardDescription>{selectedTemplate.description}</CardDescription>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setSelectedTemplate(null)}
                  >
                    ✕
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Template Overview */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <div className="text-2xl font-bold text-primary">{formatNumber(selectedTemplate.usage_count)}</div>
                      <p className="text-sm text-muted-foreground">Times Used</p>
                    </div>
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{formatPercentage(selectedTemplate.average_roi)}</div>
                      <p className="text-sm text-muted-foreground">Average ROI</p>
                    </div>
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{formatPercentage(selectedTemplate.success_rate)}</div>
                      <p className="text-sm text-muted-foreground">Success Rate</p>
                    </div>
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">
                        {selectedTemplate.is_active ? 'Active' : 'Inactive'}
                      </div>
                      <p className="text-sm text-muted-foreground">Status</p>
                    </div>
                  </div>

                  {/* Template Configuration */}
                  <div className="grid gap-6 lg:grid-cols-2">
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Campaign Objective</h3>
                      <Badge variant="secondary" className="text-sm">
                        {selectedTemplate.objective}
                      </Badge>
                      
                      <h3 className="text-lg font-semibold mb-3 mt-4">Category</h3>
                      <Badge variant="outline" className="text-sm">
                        {selectedTemplate.category}
                      </Badge>
                      
                      <h3 className="text-lg font-semibold mb-3 mt-4">Tags</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedTemplate.tags.map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-3">Performance Metrics</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Usage Count</span>
                          <span className="font-medium">{formatNumber(selectedTemplate.usage_count)}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Average ROI</span>
                          <span className="font-medium text-green-600">{formatPercentage(selectedTemplate.average_roi)}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Success Rate</span>
                          <span className="font-medium text-blue-600">{formatPercentage(selectedTemplate.success_rate)}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Status</span>
                          <Badge variant={selectedTemplate.is_active ? 'default' : 'secondary'}>
                            {selectedTemplate.is_active ? 'Active' : 'Inactive'}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-end gap-3 pt-4 border-t">
                    <Button 
                      variant="outline" 
                      onClick={() => setSelectedTemplate(null)}
                    >
                      Close
                    </Button>
                    <Button 
                      onClick={() => {
                        handleUseTemplate(selectedTemplate);
                        setSelectedTemplate(null);
                      }}
                    >
                      <Copy className="mr-2 h-4 w-4" />
                      Use This Template
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}

function TemplatesSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-10 w-32" />
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div>
                    <Skeleton className="h-5 w-40 mb-2" />
                    <Skeleton className="h-3 w-48" />
                  </div>
                </div>
                <Skeleton className="h-5 w-16" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  {[...Array(3)].map((_, j) => (
                    <div key={j} className="text-center">
                      <Skeleton className="h-4 w-16 mx-auto mb-1" />
                      <Skeleton className="h-3 w-12 mx-auto" />
                    </div>
                  ))}
                </div>
                <div className="flex flex-wrap gap-1">
                  {[...Array(4)].map((_, j) => (
                    <Skeleton key={j} className="h-5 w-16" />
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <Skeleton className="h-9 flex-1" />
                  <Skeleton className="h-9 w-20" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}