export type InboxTabKey = "all" | "captured" | "reviewing" | "internalizing";

export type InboxRecordKind = "article" | "note" | "link" | "file" | "idea";

export type InboxRecordStatus = Exclude<InboxTabKey, "all">;

export interface InboxRecord {
  id: string;
  title: string;
  summary: string;
  sourceLabel: string;
  kind: InboxRecordKind;
  status: InboxRecordStatus;
  createdAt: string;
  updatedAt: string;
  detail?: string;
  locationLabel?: string;
  canInternalize?: boolean;
  canLocate?: boolean;
}

export interface QuickCaptureDraft {
  title: string;
  sourceLabel: string;
  kind: InboxRecordKind;
  summary: string;
}

export interface DetailActionPayload {
  record: InboxRecord;
  action: "show-internalize" | "locate-source";
}
