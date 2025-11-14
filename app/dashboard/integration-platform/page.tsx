/**
 * Integration Platform Dashboard
 * Central hub for managing third-party integrations, webhooks, and API connections
 */

import { Suspense } from 'react';
import { IntegrationMarketplace } from '@/components/integrations/integration-marketplace';
import { WebhookManager } from '@/components/integrations/webhook-manager';
import { APIMonitor } from '@/components/integrations/api-monitor';
import { DataPipelineViewer } from '@/components/integrations/data-pipeline-viewer';
import { IntegrationLogs } from '@/components/integrations/integration-logs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Plug, Webhook, Activity, GitBranch, FileText, Settings, Plus } from 'lucide-react';

export const metadata = {
  title: 'Integration Platform',
  description: 'Manage third-party integrations, webhooks, and API connections',
};

export default function IntegrationPlatformPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Integration Platform</h1>
          <p className="text-muted-foreground">
            Connect, monitor, and manage all your third-party integrations and APIs
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Integration
          </Button>
        </div>
      </div>

      {/* Integration Health Overview */}
      <Suspense fallback={<IntegrationHealthSkeleton />}>
        <IntegrationHealthOverview />
      </Suspense>

      {/* Main Integration Tabs */}
      <Tabs defaultValue="marketplace" className="space-y-4">
        <TabsList>
          <TabsTrigger value="marketplace" className="flex items-center gap-2">
            <Plug className="h-4 w-4" />
            Marketplace
          </TabsTrigger>
          <TabsTrigger value="webhooks" className="flex items-center gap-2">
            <Webhook className="h-4 w-4" />
            Webhooks
          </TabsTrigger>
          <TabsTrigger value="monitoring" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Monitoring
          </TabsTrigger>
          <TabsTrigger value="pipelines" className="flex items-center gap-2">
            <GitBranch className="h-4 w-4" />
            Data Pipelines
          </TabsTrigger>
          <TabsTrigger value="logs" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Logs
          </TabsTrigger>
        </TabsList>

        <TabsContent value="marketplace" className="space-y-4">
          <Suspense fallback={<MarketplaceSkeleton />}>
            <IntegrationMarketplace />
          </Suspense>
        </TabsContent>

        <TabsContent value="webhooks" className="space-y-4">
          <Suspense fallback={<WebhooksSkeleton />}>
            <WebhookManager />
          </Suspense>
        </TabsContent>

        <TabsContent value="monitoring" className="space-y-4">
          <Suspense fallback={<MonitoringSkeleton />}>
            <APIMonitor />
          </Suspense>
        </TabsContent>

        <TabsContent value="pipelines" className="space-y-4">
          <Suspense fallback={<PipelinesSkeleton />}>
            <DataPipelineViewer />
          </Suspense>
        </TabsContent>

        <TabsContent value="logs" className="space-y-4">
          <Suspense fallback={<LogsSkeleton />}>
            <IntegrationLogs />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function IntegrationHealthSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {[...Array(4)].map((_, i) => (
        <Card key={i}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="h-4 w-32 bg-muted animate-pulse rounded" />
            <div className="h-4 w-4 bg-muted animate-pulse rounded" />
          </CardHeader>
          <CardContent>
            <div className="h-8 w-24 bg-muted animate-pulse rounded mb-2" />
            <div className="h-3 w-20 bg-muted animate-pulse rounded" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function MarketplaceSkeleton() {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Available Integrations</CardTitle>
          <CardDescription>Connect with popular platforms and services</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 bg-muted animate-pulse rounded" />
                    <div>
                      <div className="h-4 w-32 bg-muted animate-pulse rounded mb-2" />
                      <div className="h-3 w-48 bg-muted animate-pulse rounded" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="h-20 bg-muted animate-pulse rounded mb-4" />
                  <div className="flex justify-between">
                    <div className="h-8 w-20 bg-muted animate-pulse rounded" />
                    <div className="h-8 w-20 bg-muted animate-pulse rounded" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function WebhooksSkeleton() {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Webhook Management</CardTitle>
          <CardDescription>Configure and monitor webhook endpoints</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="h-12 bg-muted animate-pulse rounded" />
            <div className="space-y-2">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 bg-muted animate-pulse rounded" />
                    <div>
                      <div className="h-4 w-48 bg-muted animate-pulse rounded mb-2" />
                      <div className="h-3 w-64 bg-muted animate-pulse rounded" />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-16 bg-muted animate-pulse rounded" />
                    <div className="h-8 w-8 bg-muted animate-pulse rounded" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function MonitoringSkeleton() {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>API Health Monitor</CardTitle>
          <CardDescription>Real-time monitoring of API performance and health</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="h-80 bg-muted animate-pulse rounded" />
            <div className="space-y-4">
              <div className="h-32 bg-muted animate-pulse rounded" />
              <div className="h-32 bg-muted animate-pulse rounded" />
              <div className="h-32 bg-muted animate-pulse rounded" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function PipelinesSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Data Pipeline Viewer</CardTitle>
        <CardDescription>Visualize and manage data flow between integrations</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-96 bg-muted animate-pulse rounded" />
      </CardContent>
    </Card>
  );
}

function LogsSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Integration Logs</CardTitle>
        <CardDescription>Detailed logs of all integration activities</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="h-12 bg-muted animate-pulse rounded" />
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-4 p-3 border rounded-lg">
                <div className="h-8 w-8 bg-muted animate-pulse rounded-full" />
                <div className="flex-1">
                  <div className="h-4 w-64 bg-muted animate-pulse rounded mb-1" />
                  <div className="h-3 w-48 bg-muted animate-pulse rounded" />
                </div>
                <div className="h-3 w-20 bg-muted animate-pulse rounded" />
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}