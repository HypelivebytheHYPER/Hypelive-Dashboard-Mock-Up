/**
 * Communication Type Definitions
 * Types for KOL outreach, messaging, and communication management
 */

// Communication Stats
export interface CommunicationStats {
  totalMessages: number;
  unreadMessages: number;
  activeConversations: number;
  responseRate: number;
  avgResponseTime: number;
  platformDistribution: Record<string, number>;
  messageTrends: Array<{
    date: string;
    sent: number;
    received: number;
  }>;
}

// Outreach Message
export interface OutreachMessage {
  id: string;
  kol_id: string;
  kol_name: string;
  platform: string;
  message: string;
  status: 'sent' | 'delivered' | 'read' | 'replied';
  sent_at: string;
  delivered_at?: string;
  read_at?: string;
  replied_at?: string;
  response?: string;
  campaign_id?: string;
  template_id?: string;
  attachments?: string[];
  metadata?: Record<string, any>;
}

// Message Template
export interface MessageTemplate {
  id: string;
  name: string;
  category: string;
  subject: string;
  content: string;
  variables: string[];
  is_active: boolean;
  created_by?: string;
  created_at: string;
  updated_at?: string;
  usage_count?: number;
  average_response_rate?: number;
}

// Conversation Thread
export interface ConversationThread {
  id: string;
  kol_id: string;
  kol_name: string;
  platform: string;
  subject: string;
  last_message: string;
  last_activity: string;
  status: 'active' | 'pending' | 'closed' | 'archived';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  unread_count: number;
  participants: string[];
  campaign_id?: string;
  tags?: string[];
  metadata?: Record<string, any>;
}

// Communication Analytics
export interface CommunicationAnalytics {
  response_rates: {
    platform: Record<string, number>;
    category: Record<string, number>;
  };
  engagement_trends: Array<{
    date: string;
    response_rate: number;
    engagement_score: number;
  }>;
  best_practices: string[];
  optimization_suggestions: string[];
}

// Message Metrics
export interface MessageMetrics {
  message_id: string;
  event: 'sent' | 'delivered' | 'read' | 'replied';
  timestamp: string;
  platform: string;
  response_time?: number;
  read_duration?: number;
  click_throughs?: number;
}

// Platform Configuration
export interface PlatformConfig {
  platform: string;
  is_enabled: boolean;
  api_key?: string;
  webhook_url?: string;
  rate_limit?: number;
  daily_limit?: number;
  settings?: Record<string, any>;
}

// Automated Workflow
export interface AutomatedWorkflow {
  id: string;
  name: string;
  description: string;
  trigger: {
    type: 'time' | 'event' | 'condition';
    config: Record<string, any>;
  };
  actions: WorkflowAction[];
  is_active: boolean;
  created_at: string;
  last_run?: string;
  success_rate?: number;
}

export interface WorkflowAction {
  id: string;
  type: 'send_message' | 'wait' | 'condition' | 'update_status' | 'create_task';
  config: Record<string, any>;
  next_action?: string;
}

// Campaign Workspace
export interface CampaignWorkspace {
  id: string;
  campaign_id: string;
  name: string;
  description: string;
  members: WorkspaceMember[];
  tasks: WorkspaceTask[];
  documents: WorkspaceDocument[];
  discussions: WorkspaceDiscussion[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface WorkspaceMember {
  user_id: string;
  role: 'admin' | 'editor' | 'viewer';
  joined_at: string;
  last_active?: string;
}

export interface WorkspaceTask {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignee_id?: string;
  due_date?: string;
  completed_at?: string;
  created_at: string;
  updated_at: string;
}

export interface WorkspaceDocument {
  id: string;
  name: string;
  type: string;
  url: string;
  uploaded_by: string;
  uploaded_at: string;
  version: number;
  is_latest: boolean;
}

export interface WorkspaceDiscussion {
  id: string;
  title: string;
  content: string;
  author_id: string;
  created_at: string;
  replies: DiscussionReply[];
  is_resolved: boolean;
}

export interface DiscussionReply {
  id: string;
  content: string;
  author_id: string;
  created_at: string;
  is_internal: boolean;
}

// Contract Negotiation
export interface ContractNegotiation {
  id: string;
  campaign_id: string;
  kol_id: string;
  status: 'draft' | 'sent' | 'under_review' | 'negotiating' | 'approved' | 'rejected' | 'signed';
  proposed_terms: ContractTerms;
  negotiated_terms: ContractTerms[];
  current_terms: ContractTerms;
  negotiation_history: NegotiationHistory[];
  participants: string[];
  deadline?: string;
  created_at: string;
  updated_at: string;
}

export interface ContractTerms {
  deliverables: ContractDeliverable[];
  compensation: {
    total_amount: number;
    currency: string;
    payment_schedule: 'upfront' | 'milestone' | 'completion';
    milestones?: ContractMilestone[];
  };
  timeline: {
    start_date: string;
    end_date: string;
    key_dates: string[];
  };
  usage_rights: {
    duration: string;
    territories: string[];
    platforms: string[];
    exclusivity: boolean;
  };
  cancellation_policy: {
    notice_period: number;
    cancellation_fee: number;
    conditions: string[];
  };
}

export interface ContractDeliverable {
  id: string;
  type: string;
  quantity: number;
  specifications: string;
  deadline: string;
  approval_required: boolean;
  revision_limit: number;
}

export interface ContractMilestone {
  id: string;
  name: string;
  description: string;
  amount: number;
  due_date: string;
  completion_criteria: string[];
}

export interface NegotiationHistory {
  id: string;
  action: 'proposed' | 'countered' | 'approved' | 'rejected' | 'commented';
  terms_snapshot: ContractTerms;
  comments?: string;
  participant_id: string;
  created_at: string;
}

// Export all types
export {
  CommunicationStats,
  OutreachMessage,
  MessageTemplate,
  ConversationThread,
  CommunicationAnalytics,
  MessageMetrics,
  PlatformConfig,
  AutomatedWorkflow,
  WorkflowAction,
  CampaignWorkspace,
  WorkspaceMember,
  WorkspaceTask,
  WorkspaceDocument,
  WorkspaceDiscussion,
  DiscussionReply,
  ContractNegotiation,
  ContractTerms,
  ContractDeliverable,
  ContractMilestone,
  NegotiationHistory
};