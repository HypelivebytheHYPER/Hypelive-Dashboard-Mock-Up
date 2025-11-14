"use client";

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  MoreHorizontal, 
  Users, 
  DollarSign, 
  Calendar,
  TrendingUp,
  Edit,
  Trash2,
  BarChart3,
  MessageCircle,
  Play,
  Pause
} from 'lucide-react';
import { campaignService } from '@/lib/api/services/campaign-service';
import { formatCurrency, formatNumber } from '@/lib/utils/formatters';
import { Skeleton } from '@/components/ui/skeleton';
import { CampaignStatus, Campaign } from '@/lib/types/campaign.types';

interface ActiveCampaignsProps {
  onCampaignSelect?: (campaign: Campaign) => void;
}

export function ActiveCampaigns({ onCampaignSelect }: ActiveCampaignsProps) {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<CampaignStatus | 'all'>('all');

  const { data: campaigns, isLoading, error } = useQuery({
    queryKey: ['active-campaigns', page, statusFilter],
    queryFn: () => campaignService.getActiveCampaigns({
      page,
      limit: 10,
      status: statusFilter === 'all' ? undefined : statusFilter,
    }),
    staleTime: 60 * 1000, // 1 minute
  });

  const handleCampaignAction = async (campaignId: string, action: 'edit' | 'delete' | 'pause' | 'analytics') => {
    try {
      switch (action) {
        case 'edit':
          // Navigate to edit page or open edit modal
          window.location.href = `/dashboard/campaign-management/${campaignId}/edit`;
          break;
        case 'delete':
          if (confirm('Are you sure you want to delete this campaign?')) {
            await campaignService.deleteCampaign(campaignId);
            // Refetch campaigns after deletion
            window.location.reload();
          }
          break;
        case 'pause':
          await campaignService.updateCampaignStatus(campaignId, 'paused');
          window.location.reload();
          break;
        case 'analytics':
          window.location.href = `/dashboard/campaign-management/${campaignId}/analytics`;
          break;
      }
    } catch (error) {
      console.error('Campaign action failed:', error);
      alert('Failed to perform action. Please try again.');
    }
  };

  const getStatusBadge = (status: CampaignStatus) => {
    const variants = {
      active: 'bg-green-100 text-green-800 hover:bg-green-200',
      paused: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200',
      completed: 'bg-blue-100 text-blue-800 hover:bg-blue-200',
      draft: 'bg-gray-100 text-gray-800 hover:bg-gray-200',
      cancelled: 'bg-red-100 text-red-800 hover:bg-red-200',
    };

    return (
      <Badge className={variants[status]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Active Campaigns</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div>
                    <Skeleton className="h-4 w-48 mb-2" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Skeleton className="h-8 w-20" />
                  <Skeleton className="h-8 w-20" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle>Error Loading Campaigns</CardTitle>
          <CardDescription>Failed to load active campaigns</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={() => window.location.reload()} variant="outline">
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!campaigns?.items.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Active Campaigns</CardTitle>
          <CardDescription>You don't have any active campaigns at the moment.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild>
            <a href="/dashboard/campaign-management/create">
              Create Your First Campaign
            </a>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Active Campaigns</CardTitle>
            <CardDescription>
              {campaigns.total} campaigns • {campaigns.items.length} showing
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as CampaignStatus | 'all')}
              className="px-3 py-2 border rounded-md text-sm"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="paused">Paused</option>
              <option value="completed">Completed</option>
              <option value="draft">Draft</option>
            </select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Campaign</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>KOLs</TableHead>
              <TableHead>Budget</TableHead>
              <TableHead>Progress</TableHead>
              <TableHead>Performance</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {campaigns.items.map((campaign) => (
              <TableRow key={campaign.id} className="hover:bg-muted/50">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={campaign.imageUrl} alt={campaign.name} />
                      <AvatarFallback>
                        {campaign.name.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{campaign.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {campaign.description}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{getStatusBadge(campaign.status)}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    {campaign.kolCount}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="font-medium">{formatCurrency(campaign.budget)}</div>
                  <div className="text-sm text-muted-foreground">
                    Spent: {formatCurrency(campaign.spentBudget)}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <Progress value={campaign.progress} className="h-2" />
                    <div className="text-xs text-muted-foreground">
                      {campaign.progress}%
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1">
                      <TrendingUp className="h-3 w-3 text-green-600" />
                      <span className="text-sm font-medium">{campaign.roi}% ROI</span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {campaign.engagementRate}% engagement
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => handleCampaignAction(campaign.id, 'analytics')}>
                        <BarChart3 className="mr-2 h-4 w-4" />
                        View Analytics
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleCampaignAction(campaign.id, 'edit')}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Campaign
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleCampaignAction(campaign.id, 'message')}>
                        <MessageCircle className="mr-2 h-4 w-4" />
                        Message KOLs
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        onClick={() => handleCampaignAction(campaign.id, 'pause')}
                        disabled={campaign.status === 'paused'}
                      >
                        <Pause className="mr-2 h-4 w-4" />
                        Pause Campaign
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleCampaignAction(campaign.id, 'delete')}
                        className="text-destructive"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete Campaign
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
        {/* Pagination */}
        {campaigns.totalPages > 1 && (
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-muted-foreground">
              Showing {campaigns.items.length} of {campaigns.total} campaigns
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
              >
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {page} of {campaigns.totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(Math.min(campaigns.totalPages, page + 1))}
                disabled={page === campaigns.totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}