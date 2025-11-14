/**
 * Communication Hub
 * Integrated communication platform for KOL outreach and team collaboration
 */

import { Suspense } from 'react';
import { KOLOutreachCenter } from '@/components/communication/kol-outreach-center';
import { CampaignWorkspace } from '@/components/communication/campaign-workspace';
import { ContractNegotiation } from '@/components/communication/contract-negotiation';
import { AutomatedWorkflows } from '@/components/communication/automated-workflows';
import { MessageTemplates } from '@/components/communication/message-templates';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { MessageCircle, Users, FileText, Workflow, Send, Settings } from 'lucide-react';

export const metadata = {
  title: 'Communication Hub',
  description: 'Integrated communication platform for KOL outreach and collaboration',
};

export default function CommunicationHubPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Communication Hub</h1>
          <p className="text-muted-foreground">
            Manage all communications with KOLs and team collaboration in one place
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Button>
          <Button>
            <Send className="mr-2 h-4 w-4" />
            New Message
          </Button>
        </div>
      </div>

      {/* Communication Stats */}
      <Suspense fallback={<CommunicationStatsSkeleton />}>
        <CommunicationStats />
      </Suspense>

      {/* Main Communication Tabs */}
      <Tabs defaultValue="outreach" className="space-y-4">
        <TabsList>
          <TabsTrigger value="outreach" className="flex items-center gap-2">
            <MessageCircle className="h-4 w-4" />
            KOL Outreach
          </TabsTrigger>
          <TabsTrigger value="workspace" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Team Workspace
          </TabsTrigger>
          <TabsTrigger value="contracts" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Contracts
          </TabsTrigger>
          <TabsTrigger value="automations" className="flex items-center gap-2">
            <Workflow className="h-4 w-4" />
            Automations
          </TabsTrigger>
        </TabsList>

        <TabsContent value="outreach" className="space-y-4">
          <Suspense fallback={<OutreachSkeleton />}>
            <KOLOutreachCenter />
          </Suspense>
        </TabsContent>

        <TabsContent value="workspace" className="space-y-4">
          <Suspense fallback={<WorkspaceSkeleton />}>
            <CampaignWorkspace />
          </Suspense>
        </TabsContent>

        <TabsContent value="contracts" className="space-y-4">
          <Suspense fallback={<ContractsSkeleton />}>
            <ContractNegotiation />
          </Suspense>
        </TabsContent>

        <TabsContent value="automations" className="space-y-4">
          <Suspense fallback={<AutomationsSkeleton />}>
            <AutomatedWorkflows />
          </Suspense>
        </TabsContent>
      </Tabs>

      {/* Message Templates Section */}
      <Card>
        <CardHeader>
          <CardTitle>Message Templates</CardTitle>
          <CardDescription>
            Pre-built message templates for different communication scenarios
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<TemplatesSkeleton />}>
            <MessageTemplates />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}

function CommunicationStatsSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {[...Array(4)].map((_, i) => (
        <Card key={i}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="h-4 w-28 bg-muted animate-pulse rounded" />
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

function OutreachSkeleton() {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>KOL Outreach Center</CardTitle>
          <CardDescription>Multi-channel messaging and outreach management</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="h-12 bg-muted animate-pulse rounded" />
            <div className="space-y-2">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center gap-4 p-4 border rounded-lg">
                  <div className="h-10 w-10 bg-muted animate-pulse rounded-full" />
                  <div className="flex-1">
                    <div className="h-4 w-48 bg-muted animate-pulse rounded mb-2" />
                    <div className="h-3 w-32 bg-muted animate-pulse rounded" />
                  </div>
                  <div className="h-8 w-16 bg-muted animate-pulse rounded" />
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-10 bg-muted animate-pulse rounded" />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function WorkspaceSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Campaign Workspace</CardTitle>
        <CardDescription>Team collaboration and project management</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="h-12 bg-muted animate-pulse rounded" />
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="space-y-4">
              <div className="h-64 bg-muted animate-pulse rounded" />
              <div className="h-32 bg-muted animate-pulse rounded" />
            </div>
            <div className="space-y-4">
              <div className="h-48 bg-muted animate-pulse rounded" />
              <div className="h-48 bg-muted animate-pulse rounded" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ContractsSkeleton() {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Contract Negotiation</CardTitle>
          <CardDescription>Manage contracts and negotiations with KOLs</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="h-12 bg-muted animate-pulse rounded" />
            <div className="grid gap-4 lg:grid-cols-3">
              {[...Array(3)].map((_, i) => (
                <Card key={i}>
                  <CardHeader>
                    <div className="h-4 w-32 bg-muted animate-pulse rounded mb-2" />
                    <div className="h-3 w-24 bg-muted animate-pulse rounded" />
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
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function AutomationsSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Automated Workflows</CardTitle>
        <CardDescription>Automate communication sequences and follow-ups</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="h-12 bg-muted animate-pulse rounded" />
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <div className="h-4 w-48 bg-muted animate-pulse rounded" />
                  <div className="h-6 w-16 bg-muted animate-pulse rounded" />
                </div>
                <div className="grid grid-cols-4 gap-4">
                  {[...Array(4)].map((_, j) => (
                    <div key={j} className="h-16 bg-muted animate-pulse rounded" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function TemplatesSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {[...Array(6)].map((_, i) => (
        <Card key={i}>
          <CardHeader>
            <div className="h-4 w-32 bg-muted animate-pulse rounded mb-2" />
            <div className="h-3 w-48 bg-muted animate-pulse rounded" />
          </CardHeader>
          <CardContent>
            <div className="h-24 bg-muted animate-pulse rounded mb-4" />
            <div className="flex justify-between">
              <div className="h-8 w-20 bg-muted animate-pulse rounded" />
              <div className="h-8 w-20 bg-muted animate-pulse rounded" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}