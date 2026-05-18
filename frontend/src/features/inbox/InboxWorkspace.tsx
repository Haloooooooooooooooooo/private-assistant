"use client";

import { useMemo, useState } from "react";
import { mockInboxRecords, inboxTabs } from "./data";
import { InboxDetailDrawer } from "./components/InboxDetailDrawer";
import { InboxList } from "./components/InboxList";
import { InboxTabs } from "./components/InboxTabs";
import { QuickCapturePanel } from "./components/QuickCapturePanel";
import type { DetailActionPayload, InboxRecord, InboxTabKey, QuickCaptureDraft } from "./types";

export interface InboxWorkspaceProps {
  initialRecords?: InboxRecord[];
  defaultTab?: InboxTabKey;
  defaultSelectedRecordId?: string | null;
  onCreateRecord?: (record: InboxRecord) => void;
  onOpenRecord?: (record: InboxRecord) => void;
  onDetailAction?: (payload: DetailActionPayload) => void;
}

const emptyDraft: QuickCaptureDraft = {
  title: "",
  sourceLabel: "",
  kind: "note",
  summary: ""
};

function buildRecordFromDraft(draft: QuickCaptureDraft): InboxRecord {
  const timestamp = new Date().toLocaleString("zh-CN", {
    hour12: false
  });

  return {
    id: `rec-${Date.now()}`,
    title: draft.title.trim(),
    sourceLabel: draft.sourceLabel.trim() || "Manual Capture",
    kind: draft.kind,
    summary: draft.summary.trim() || "等待后续补充摘要。",
    status: "captured",
    createdAt: timestamp,
    updatedAt: timestamp,
    detail: "这是一条刚加入收录箱的新记录，主线程接线后可补充完整详情。",
    locationLabel: "manual://new-record",
    canInternalize: true,
    canLocate: true
  };
}

export function InboxWorkspace(props: InboxWorkspaceProps) {
  const {
    initialRecords = mockInboxRecords,
    defaultTab = "all",
    defaultSelectedRecordId = initialRecords[0]?.id ?? null,
    onCreateRecord,
    onOpenRecord,
    onDetailAction
  } = props;

  const [records, setRecords] = useState<InboxRecord[]>(initialRecords);
  const [activeTab, setActiveTab] = useState<InboxTabKey>(defaultTab);
  const [selectedRecordId, setSelectedRecordId] = useState<string | null>(defaultSelectedRecordId);
  const [draft, setDraft] = useState<QuickCaptureDraft>(emptyDraft);
  const [showInternalizePreview, setShowInternalizePreview] = useState(false);
  const [lastActionLabel, setLastActionLabel] = useState<string | null>(null);

  const counts = useMemo<Record<InboxTabKey, number>>(() => {
    return records.reduce(
      (accumulator, record) => {
        accumulator.all += 1;
        accumulator[record.status] += 1;
        return accumulator;
      },
      {
        all: 0,
        captured: 0,
        reviewing: 0,
        internalizing: 0
      }
    );
  }, [records]);

  const visibleRecords = useMemo(() => {
    if (activeTab === "all") {
      return records;
    }

    return records.filter((record) => record.status === activeTab);
  }, [activeTab, records]);

  const selectedRecord =
    records.find((record) => record.id === selectedRecordId) ??
    visibleRecords[0] ??
    records[0] ??
    null;

  const handleTabChange = (tab: InboxTabKey) => {
    setActiveTab(tab);
    setShowInternalizePreview(false);
    setLastActionLabel(null);

    const nextVisibleRecords =
      tab === "all" ? records : records.filter((record) => record.status === tab);

    setSelectedRecordId(nextVisibleRecords[0]?.id ?? null);
  };

  const handleCreateRecord = () => {
    if (!draft.title.trim()) {
      setLastActionLabel("请先输入标题，再加入收录箱。");
      return;
    }

    const nextRecord = buildRecordFromDraft(draft);

    setRecords((current) => [nextRecord, ...current]);
    setDraft(emptyDraft);
    setActiveTab("all");
    setSelectedRecordId(nextRecord.id);
    setShowInternalizePreview(false);
    setLastActionLabel(`已加入收录箱：${nextRecord.title}`);
    onCreateRecord?.(nextRecord);
  };

  const handleSelectRecord = (recordId: string) => {
    const nextRecord = records.find((item) => item.id === recordId);

    setSelectedRecordId(recordId);
    setShowInternalizePreview(false);
    setLastActionLabel(null);

    if (nextRecord) {
      onOpenRecord?.(nextRecord);
    }
  };

  const handleTriggerAction = (payload: DetailActionPayload) => {
    if (payload.action === "show-internalize") {
      setShowInternalizePreview(true);
      setLastActionLabel(`已打开内化展示占位：${payload.record.title}`);
    }

    if (payload.action === "locate-source") {
      setLastActionLabel(`定位动作占位：${payload.record.locationLabel ?? payload.record.title}`);
    }

    onDetailAction?.(payload);
  };

  return (
    <main className="inbox-workspace">
      <div className="inbox-layout">
        <QuickCapturePanel draft={draft} onDraftChange={setDraft} onSubmit={handleCreateRecord} />

        <section className="inbox-panel inbox-list-panel" aria-labelledby="inbox-list-title">
          <div className="panel-header">
            <div>
              <p className="panel-eyebrow">Inbox</p>
              <h2 id="inbox-list-title">收录箱主视图</h2>
            </div>
            <span className="panel-badge">{visibleRecords.length} 条</span>
          </div>

          <InboxTabs activeTab={activeTab} counts={counts} tabs={inboxTabs} onTabChange={handleTabChange} />
          <InboxList
            records={visibleRecords}
            selectedRecordId={selectedRecord?.id ?? null}
            onSelectRecord={handleSelectRecord}
          />
        </section>

        <InboxDetailDrawer
          record={selectedRecord}
          showInternalizePreview={showInternalizePreview}
          lastActionLabel={lastActionLabel}
          onTriggerAction={handleTriggerAction}
        />
      </div>
    </main>
  );
}
