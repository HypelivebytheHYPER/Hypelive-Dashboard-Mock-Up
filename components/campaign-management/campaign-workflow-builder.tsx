"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Workflow,
  Plus,
  Play,
  Pause,
  Settings,
  Users,
  CheckCircle,
  Clock,
  AlertCircle,
  ArrowRight,
  Save,
  Download
} from 'lucide-react';

interface WorkflowStep {
  id: string;
  name: string;
  type: 'approval' | 'notification' | 'task' | 'condition';
  status: 'pending' | 'active' | 'completed' | 'failed';
  assignee?: string;
  dueDate?: string;
  description: string;
  conditions?: string[];
  nextSteps: string[];
}

interface CampaignWorkflow {
  id: string;
  name: string;
  description: string;
  steps: WorkflowStep[];
  isActive: boolean;
  createdAt: string;
}

const mockWorkflows: CampaignWorkflow[] = [
  {
    id: 'workflow-1',
    name: 'Standard Campaign Approval',
    description: 'Standard workflow for campaign approval with brand manager review',
    isActive: true,
    createdAt: '2024-01-15T10:00:00Z',
    steps: [
      {
        id: 'step-1',
        name: 'Campaign Creation',
        type: 'task',
        status: 'completed',
        description: 'Campaign manager creates campaign draft',
        nextSteps: ['step-2']
      },
      {
        id: 'step-2',
        name: 'Brand Manager Review',
        type: 'approval',
        status: 'active',
        assignee: 'Brand Manager',
        description: 'Brand manager reviews campaign concept and budget',
        conditions: ['Budget approval', 'Brand alignment'],
        nextSteps: ['step-3', 'step-4']
      },
      {
        id: 'step-3',
        name: 'KOL Selection',
        type: 'task',
        status: 'pending',
        assignee: 'KOL Coordinator',
        description: 'Select and reach out to appropriate KOLs',
        nextSteps: ['step-5']
      },
      {
        id: 'step-4',
        name: 'Content Approval',
        type: 'approval',
        status: 'pending',
        assignee: 'Content Manager',
        description: 'Review and approve content guidelines',
        nextSteps: ['step-5']
      },
      {
        id: 'step-5',
        name: 'Campaign Launch',
        type: 'task',
        status: 'pending',
        description: 'Launch campaign and monitor performance',
        nextSteps: []
      }
    ]
  },
  {
    id: 'workflow-2',
    name: 'Emergency Campaign',
    description: 'Fast-track workflow for urgent campaigns',
    isActive: false,
    createdAt: '2024-01-20T14:30:00Z',
    steps: [
      {
        id: 'step-1',
        name: 'Quick Campaign Setup',
        type: 'task',
        status: 'completed',
        description: 'Set up campaign with minimal requirements',
        nextSteps: ['step-2']
      },
      {
        id: 'step-2',
        name: 'Manager Approval',
        type: 'approval',
        status: 'active',
        assignee: 'Campaign Manager',
        description: 'Quick approval for urgent campaign',
        nextSteps: ['step-3']
      },
      {
        id: 'step-3',
        name: 'Immediate Launch',
        type: 'task',
        status: 'pending',
        description: 'Launch campaign immediately',
        nextSteps: []
      }
    ]
  }
];

export function CampaignWorkflowBuilder() {
  const [selectedWorkflow, setSelectedWorkflow] = useState<CampaignWorkflow>(mockWorkflows[0]);
  const [isEditing, setIsEditing] = useState(false);
  const [draggedStep, setDraggedStep] = useState<string | null>(null);

  const getStepIcon = (type: WorkflowStep['type']) => {
    switch (type) {
      case 'approval':
        return <CheckCircle className="h-4 w-4" />;
      case 'notification':
        return <Users className="h-4 w-4" />;
      case 'task':
        return <Clock className="h-4 w-4" />;
      case 'condition':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Workflow className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: WorkflowStep['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'active':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'pending':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'failed':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleStepDrag = (stepId: string) => {
    setDraggedStep(stepId);
  };

  const handleStepDrop = (targetStepId: string) => {
    if (draggedStep && draggedStep !== targetStepId) {
      // Logic to reorder steps would go here
      console.log(`Moving step ${draggedStep} before ${targetStepId}`);
    }
    setDraggedStep(null);
  };

  const handleSaveWorkflow = () => {
    console.log('Saving workflow:', selectedWorkflow);
    // Save workflow logic would go here
  };

  const handleExportWorkflow = () => {
    const workflowData = JSON.stringify(selectedWorkflow, null, 2);
    const blob = new Blob([workflowData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedWorkflow.name.replace(/\s+/g, '_')}_workflow.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Workflow Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Campaign Workflows</h2>
          <p className="text-muted-foreground">
            Design and manage automated campaign workflows
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => setIsEditing(!isEditing)}>
            <Settings className="mr-2 h-4 w-4" />
            {isEditing ? 'View Mode' : 'Edit Mode'}
          </Button>
          <Button variant="outline" onClick={handleExportWorkflow}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button onClick={handleSaveWorkflow}>
            <Save className="mr-2 h-4 w-4" />
            Save Workflow
          </Button>
        </div>
      </div>

      {/* Workflow Selector */}
      <Card>
        <CardHeader>
          <CardTitle>Available Workflows</CardTitle>
          <CardDescription>
            Choose a workflow template or create a custom one
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {mockWorkflows.map((workflow) => (
              <Card
                key={workflow.id}
                className={`cursor-pointer transition-all ${
                  selectedWorkflow.id === workflow.id
                    ? 'border-primary shadow-md'
                    : 'hover:border-primary/50'
                }`}
                onClick={() => setSelectedWorkflow(workflow)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{workflow.name}</CardTitle>
                    <Badge variant={workflow.isActive ? 'default' : 'secondary'}>
                      {workflow.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                  <CardDescription>{workflow.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>{workflow.steps.length} steps</span>
                    <span>Created {new Date(workflow.createdAt).toLocaleDateString()}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {/* Add New Workflow Card */}
            <Card className="border-dashed hover:border-solid cursor-pointer transition-all hover:bg-muted/50">
              <CardContent className="flex flex-col items-center justify-center h-full py-8">
                <Plus className="h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">Create New Workflow</p>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Selected Workflow Visualization */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{selectedWorkflow.name}</CardTitle>
              <CardDescription>{selectedWorkflow.description}</CardDescription>
            </div>
            <Badge variant={selectedWorkflow.isActive ? 'default' : 'secondary'}>
              {selectedWorkflow.isActive ? 'Active' : 'Inactive'}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {selectedWorkflow.steps.map((step, index) => (
              <div
                key={step.id}
                className={`relative p-4 rounded-lg border-2 transition-all ${
                  isEditing ? 'cursor-move hover:shadow-md' : ''
                } ${getStatusColor(step.status)}`}
                draggable={isEditing}
                onDragStart={() => handleStepDrag(step.id)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => handleStepDrop(step.id)}
              >
                {/* Step Number and Connector */}
                {index < selectedWorkflow.steps.length - 1 && (
                  <div className="absolute -bottom-2 left-8 right-8 flex justify-center">
                    <ArrowRight className="h-4 w-4 text-muted-foreground rotate-90" />
                  </div>
                )}

                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        {getStepIcon(step.type)}
                        <h4 className="font-medium">{step.name}</h4>
                        <Badge variant="outline" className="text-xs">
                          {step.type}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {step.description}
                      </p>
                      {step.assignee && (
                        <div className="flex items-center gap-2 text-sm">
                          <Users className="h-3 w-3" />
                          <span className="text-muted-foreground">{step.assignee}</span>
                        </div>
                      )}
                      {step.conditions && step.conditions.length > 0 && (
                        <div className="mt-2">
                          <p className="text-xs text-muted-foreground mb-1">Conditions:</p>
                          <div className="flex flex-wrap gap-1">
                            {step.conditions.map((condition, idx) => (
                              <Badge key={idx} variant="secondary" className="text-xs">
                                {condition}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {isEditing && (
                      <Button variant="ghost" size="sm">
                        <Settings className="h-4 w-4" />
                      </Button>
                    )}
                    <Badge className={getStatusColor(step.status)}>
                      {step.status}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Workflow Actions */}
          <div className="flex items-center justify-between pt-4 border-t">
            <div className="text-sm text-muted-foreground">
              {selectedWorkflow.steps.length} steps in workflow
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Play className="mr-2 h-4 w-4" />
                Test Workflow
              </Button>
              <Button variant="outline" size="sm">
                <Pause className="mr-2 h-4 w-4" />
                Pause Workflow
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Workflow Configuration Panel */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Step Configuration</CardTitle>
            <CardDescription>
              Customize each step in your workflow
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Step Type</label>
                <select className="w-full px-3 py-2 border rounded-md">
                  <option value="task">Task</option>
                  <option value="approval">Approval</option>
                  <option value="notification">Notification</option>
                  <option value="condition">Condition</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Assignee</label>
                <select className="w-full px-3 py-2 border rounded-md">
                  <option>Campaign Manager</option>
                  <option>Brand Manager</option>
                  <option>KOL Coordinator</option>
                  <option>Content Manager</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Due Date (days)</label>
                <input type="number" className="w-full px-3 py-2 border rounded-md" placeholder="3" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Conditions</label>
                <textarea 
                  className="w-full px-3 py-2 border rounded-md" 
                  rows={3}
                  placeholder="Enter conditions for this step..."
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Workflow Settings</CardTitle>
            <CardDescription>
              Configure workflow behavior and notifications
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Auto-approve on timeout</p>
                  <p className="text-xs text-muted-foreground">Automatically approve if no response within deadline</p>
                </div>
                <input type="checkbox" className="rounded" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Send notifications</p>
                  <p className="text-xs text-muted-foreground">Notify assignees when steps are assigned</p>
                </div>
                <input type="checkbox" className="rounded" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Escalation enabled</p>
                  <p className="text-xs text-muted-foreground">Escalate to manager if step is overdue</p>
                </div>
                <input type="checkbox" className="rounded" defaultChecked />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Escalation delay (hours)</label>
                <input type="number" className="w-full px-3 py-2 border rounded-md" placeholder="24" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}