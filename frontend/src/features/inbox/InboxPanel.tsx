"use client";

import { useMemo, useState } from "react";

import type { CaptureIntent, InboxRecord, RecordStatus } from "../types";

type InboxPanelProps = {
  initialRecords: InboxRecord[];
  onNavigateKnowledge: (recordId: number) => void;
  onAskFromNote: (recordId: number) => void;
};

type DrawerMode = "record" | "note";

const statusLabels: Record<RecordStatus, string> = {
  later: "稍后看",
  pending: "待内化",
  done: "已沉淀"
};

export function InboxPanel({
  initialRecords,
  onNavigateKnowledge,
  onAskFromNote
}: InboxPanelProps) {
  const [records, setRecords] = useState(initialRecords);
  const [activeTab, setActiveTab] = useState<"all" | RecordStatus>("all");
  const [intent, setIntent] = useState<CaptureIntent>("favorite");
  const [content, setContent] = useState(
    "https://www.notion.so/blog/ai-productivity-framework"
  );
  const [understanding, setUnderstanding] = useState(
    "这篇文章提出了一个很完整的 AI 生产力闭环，和 INNEX 的理念很契合。"
  );
  const [selectedRecordId, setSelectedRecordId] = useState<number | null>(
    initialRecords[0]?.id ?? null
  );
  const [drawerMode, setDrawerMode] = useState<DrawerMode>("record");

  const visibleRecords = useMemo(() => {
    if (activeTab === "all") {
      return records;
    }

    return records.filter((record) => record.status === activeTab);
  }, [activeTab, records]);

  const selectedRecord =
    records.find((record) => record.id === selectedRecordId) ?? visibleRecords[0] ?? null;

  const counts = useMemo(
    () => ({
      all: records.length,
      later: records.filter((record) => record.status === "later").length,
      pending: records.filter((record) => record.status === "pending").length,
      done: records.filter((record) => record.status === "done").length
    }),
    [records]
  );

  function addRecord() {
    const normalized = content.trim();

    if (!normalized) {
      return;
    }

    const createdRecord: InboxRecord = {
      id: Date.now(),
      title: normalized.length > 36 ? `${normalized.slice(0, 36)}...` : normalized,
      source: "手动输入",
      domain: "",
      capturedAt: "05-18 16:40",
      status: intent === "later" ? "later" : "pending",
      tags: ["新收录"],
      summary: "新收录内容将在 Phase 2 接入真实解析流程后自动补全摘要与标签。",
      userUnderstanding: understanding.trim(),
      content: normalized,
      attachments: [{ id: `att-${Date.now()}`, kind: "file", name: "新附件示意.png" }]
    };

    setRecords((current) => [createdRecord, ...current]);
    setSelectedRecordId(createdRecord.id);
    setDrawerMode("record");
    setContent("");
    setUnderstanding("");
    setActiveTab("all");
  }

  function renderActions(record: InboxRecord) {
    if (record.status === "done") {
      return (
        <>
          <button className="drawer-action-btn" onClick={() => setDrawerMode("note")}>
            查看笔记详情
          </button>
          <button
            className="drawer-action-btn primary"
            onClick={() => onAskFromNote(record.id)}
          >
            基于此笔记提问
          </button>
          <button
            className="drawer-action-btn"
            onClick={() => onNavigateKnowledge(record.id)}
          >
            在知识库定位
          </button>
        </>
      );
    }

    return (
      <>
        <button className="drawer-action-btn">查看原内容</button>
        <button className="drawer-action-btn primary" onClick={() => setDrawerMode("note")}>
          一键内化
        </button>
      </>
    );
  }

  return (
    <section className="workspace-page workspace-page-active">
      <div className="hero-poster">
        <div className="hero-copy">
          <p className="hero-kicker">PHASE 1 PROTOTYPE MIGRATION</p>
          <h2 className="hero-title">INNEX</h2>
          <p className="hero-subtitle">把输入变成资产，而不是停留在一次性回答。</p>
        </div>
      </div>

      <div className="workspace-page-body">
        <div className="inbox-stack">
          <section className="content-panel capture-panel">
            <div className="section-heading">
              <span className="section-bar" />
              <div>
                <h3>快速录入</h3>
                <p>QUICK CAPTURE</p>
              </div>
            </div>

            <div className="capture-grid">
              <label className="field-block">
                <span>内容输入</span>
                <textarea
                  value={content}
                  onChange={(event) => setContent(event.target.value)}
                  placeholder="粘贴链接 / 输入文本 / 粘贴图片 / 拖拽文件..."
                />
              </label>
              <label className="field-block">
                <span>我的理解</span>
                <textarea
                  value={understanding}
                  onChange={(event) => setUnderstanding(event.target.value)}
                  placeholder="写下你的理解，会用于后续内化..."
                />
              </label>
            </div>

            <div className="capture-attachments">
              <span className="attachment-chip">AI生产力框架完整解读.pdf</span>
              <span className="attachment-chip">框架流程图.png</span>
            </div>

            <div className="capture-actions">
              <div className="segmented">
                <button
                  className={intent === "later" ? "segmented-active" : ""}
                  onClick={() => setIntent("later")}
                >
                  稍后看
                </button>
                <button
                  className={intent === "favorite" ? "segmented-active" : ""}
                  onClick={() => setIntent("favorite")}
                >
                  收藏
                </button>
              </div>
              <button className="btn-primary" onClick={addRecord}>
                添加记录
              </button>
            </div>
          </section>

          <section className="content-panel list-panel">
            <div className="section-heading">
              <span className="section-bar" />
              <div>
                <h3>收录箱</h3>
                <p>INBOX</p>
              </div>
            </div>

            <div className="tab-row">
              <button
                className={activeTab === "all" ? "tab-active" : ""}
                onClick={() => setActiveTab("all")}
              >
                全部 ({counts.all})
              </button>
              <button
                className={activeTab === "later" ? "tab-active" : ""}
                onClick={() => setActiveTab("later")}
              >
                稍后看 ({counts.later})
              </button>
              <button
                className={activeTab === "pending" ? "tab-active" : ""}
                onClick={() => setActiveTab("pending")}
              >
                待内化 ({counts.pending})
              </button>
              <button
                className={activeTab === "done" ? "tab-active" : ""}
                onClick={() => setActiveTab("done")}
              >
                已沉淀 ({counts.done})
              </button>
            </div>

            <div className="record-list">
              {visibleRecords.map((record) => (
                <button
                  key={record.id}
                  className={
                    record.id === selectedRecord?.id ? "record-card record-card-active" : "record-card"
                  }
                  onClick={() => {
                    setSelectedRecordId(record.id);
                    setDrawerMode(record.status === "done" ? "note" : "record");
                  }}
                >
                  <div className="record-card-top">
                    <strong>{record.title}</strong>
                    <span className={`status-badge status-${record.status}`}>
                      {statusLabels[record.status]}
                    </span>
                  </div>
                  <p>{record.summary}</p>
                  <div className="record-meta">
                    <span>{record.source}</span>
                    <span>{record.capturedAt}</span>
                  </div>
                  <div className="chip-row">
                    {record.tags.map((tag) => (
                      <span key={tag} className="tag-chip">
                        {tag}
                      </span>
                    ))}
                  </div>
                </button>
              ))}
            </div>
          </section>
        </div>

        <aside className="detail-drawer">
          {selectedRecord ? (
            <>
              <div className="drawer-header">
                <div>
                  <p className="drawer-overline">
                    {drawerMode === "record" ? "收录详情" : "笔记详情"}
                  </p>
                  <h3>{selectedRecord.title}</h3>
                </div>
              </div>

              <div className="drawer-section">
                <div className="drawer-grid">
                  <div>
                    <span className="drawer-label">来源</span>
                    <p>{selectedRecord.source}</p>
                  </div>
                  <div>
                    <span className="drawer-label">收录时间</span>
                    <p>{selectedRecord.capturedAt}</p>
                  </div>
                  <div>
                    <span className="drawer-label">状态</span>
                    <p>{statusLabels[selectedRecord.status]}</p>
                  </div>
                  <div>
                    <span className="drawer-label">标签</span>
                    <p>{selectedRecord.tags.join(" · ")}</p>
                  </div>
                </div>
              </div>

              <div className="drawer-section">
                <span className="drawer-label">摘要</span>
                <p>{selectedRecord.summary}</p>
              </div>

              <div className="drawer-section">
                <span className="drawer-label">我的理解</span>
                <textarea readOnly value={selectedRecord.userUnderstanding} />
              </div>

              <div className="drawer-section">
                <span className="drawer-label">附件</span>
                <div className="chip-row">
                  {selectedRecord.attachments.map((attachment) => (
                    <span key={attachment.id} className="attachment-chip">
                      {attachment.name}
                    </span>
                  ))}
                </div>
              </div>

              {drawerMode === "note" && (
                <div className="drawer-section">
                  <span className="drawer-label">AI 笔记正文</span>
                  <ol className="note-list">
                    <li>知识助手的长期价值，在于把输入整理成可追溯的知识资产。</li>
                    <li>Workflow 负责状态推进，Agent 负责语义理解与生成。</li>
                    <li>这条结论可以复用于产品方案、面试表达和竞品分析。</li>
                  </ol>
                </div>
              )}

              <div className="drawer-actions">{renderActions(selectedRecord)}</div>
            </>
          ) : (
            <div className="empty-state">
              <p>从左侧选择一条记录，查看详情与后续动作。</p>
            </div>
          )}
        </aside>
      </div>
    </section>
  );
}
