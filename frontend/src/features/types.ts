export type AppPage = "inbox" | "knowledge" | "assistant";

export interface HealthPayload {
  status: string;
  service: string;
  environment: string;
  supabase: {
    configured: boolean;
    reachable: boolean;
    status_code?: number | null;
    detail?: string | null;
  };
}

export type RecordStatus = "later" | "pending" | "done";
export type CaptureIntent = "later" | "favorite";
export type AttachmentKind = "link" | "file" | "image";

export interface Attachment {
  id: string;
  kind: AttachmentKind;
  name: string;
}

export interface InboxRecord {
  id: number;
  title: string;
  source: string;
  domain: string;
  capturedAt: string;
  status: RecordStatus;
  tags: string[];
  summary: string;
  userUnderstanding: string;
  content: string;
  attachments: Attachment[];
}

export interface ReminderItem {
  id: string;
  title: string;
  description: string;
  status: RecordStatus;
  recordId: number;
}

export interface ReminderSnapshot {
  dateLabel: string;
  laterCount: number;
  pendingCount: number;
  doneCount: number;
  reminders: ReminderItem[];
}

export interface WeeklyFeedbackItem {
  label: string;
  value: string;
  accent?: boolean;
}

export interface CalendarDay {
  id: string;
  label: string;
  dayNumber: number;
  inCurrentMonth: boolean;
  hasRecord: boolean;
  isToday?: boolean;
}

export type KnowledgeNodeKind = "theme" | "subtheme" | "note";

export interface KnowledgeNode {
  id: string;
  kind: KnowledgeNodeKind;
  label: string;
  x: number;
  y: number;
  description: string;
}

export interface KnowledgeEdge {
  id: string;
  source: string;
  target: string;
  semantic?: boolean;
}

export interface KnowledgeNoteDetail {
  id: string;
  title: string;
  theme: string;
  subtheme: string;
  sourceTitle: string;
  summary: string;
  understanding: string;
  body: string[];
  followUps: string[];
  evidence: string;
  relatedNotes: Array<{ id: string; label: string; type: string }>;
}

export interface KnowledgeTopicDetail {
  id: string;
  title: string;
  description: string;
}

export interface ChatReference {
  id: string;
  name: string;
  source: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  time: string;
  text: string;
  references?: ChatReference[];
}

export interface ChatHistoryItem {
  id: string;
  title: string;
  time: string;
  group: string;
}
