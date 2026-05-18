"use client";

import { useState } from "react";

import { AIAssistantPanel } from "../ai/AIAssistantPanel";
import { InboxPanel } from "../inbox/InboxPanel";
import {
  aiHistory,
  aiMessages,
  appPages,
  calendarDays,
  graphEdges,
  graphNodes,
  graphTopicDetails,
  inboxRecords,
  knowledgeNoteDetail,
  reminderSnapshot,
  weeklyFeedback
} from "../mock-data";
import { KnowledgeBasePanel } from "../kb/KnowledgeBasePanel";
import type { AppPage, HealthPayload } from "../types";

type WorkspaceAppProps = {
  health: HealthPayload | null;
};

const statusMap = {
  later: "稍后看",
  pending: "待内化",
  done: "已沉淀"
} as const;

export function WorkspaceApp({ health }: WorkspaceAppProps) {
  const [activePage, setActivePage] = useState<AppPage>("inbox");
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);

  const supabaseLabel = health?.supabase.configured
    ? health.supabase.reachable
      ? "Supabase 已连接"
      : "Supabase 暂不可达"
    : "Supabase 未配置";

  return (
    <main className="app-shell">
      <button
        className="floating-button"
        onClick={() => {
          setCalendarOpen((current) => !current);
          setInfoOpen(false);
        }}
      >
        信息与提醒
      </button>

      {calendarOpen && (
        <div className="calendar-popover">
          <div className="calendar-header">
            <span>2026 / 05</span>
            <button onClick={() => setCalendarOpen(false)}>×</button>
          </div>
          <div className="calendar-grid">
            {calendarDays.map((day) => (
              <button
                key={day.id}
                className={
                  day.isToday
                    ? "calendar-day calendar-day-today"
                    : day.inCurrentMonth
                      ? "calendar-day"
                      : "calendar-day calendar-day-muted"
                }
                onClick={() => {
                  if (day.hasRecord) {
                    setInfoOpen(true);
                    setCalendarOpen(false);
                  }
                }}
              >
                {day.dayNumber}
                {day.hasRecord && <i />}
              </button>
            ))}
          </div>
        </div>
      )}

      {infoOpen && (
        <div className="info-overlay" onClick={() => setInfoOpen(false)}>
          <div className="info-modal" onClick={(event) => event.stopPropagation()}>
            <section className="info-card">
              <h3>{reminderSnapshot.dateLabel}</h3>
              <div className="stat-grid">
                <button className="stat-box">
                  <strong>{reminderSnapshot.laterCount}</strong>
                  <span>稍后看</span>
                </button>
                <button className="stat-box">
                  <strong>{reminderSnapshot.pendingCount}</strong>
                  <span>待内化</span>
                </button>
                <button className="stat-box">
                  <strong>{reminderSnapshot.doneCount}</strong>
                  <span>已沉淀新增</span>
                </button>
              </div>

              <div className="reminder-list">
                {reminderSnapshot.reminders.map((item) => (
                  <article key={item.id}>
                    <small>{statusMap[item.status]}</small>
                    <strong>{item.title}</strong>
                    <p>{item.description}</p>
                  </article>
                ))}
              </div>
            </section>

            <section className="info-card info-card-compact">
              <h3>周反馈 · 05/12-05/18</h3>
              <div className="weekly-list">
                {weeklyFeedback.map((item) => (
                  <div key={item.label} className={item.accent ? "weekly-row weekly-row-accent" : "weekly-row"}>
                    <span>{item.label}</span>
                    <strong>{item.value}</strong>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      )}

      <div className="layout-frame">
        <nav className="left-rail">
          <div className="brand-block">
            <div className="brand-logo">INNEX<span>.</span></div>
            <p>
              个人知识内化助手
              <br />
              PERSONAL KNOWLEDGE
              <br />
              INTERNALIZATION ASSISTANT
            </p>
          </div>

          <div className="nav-list">
            {appPages.map((item) => (
              <button
                key={item.id}
                className={activePage === item.id ? "nav-item nav-item-active" : "nav-item"}
                onClick={() => setActivePage(item.id)}
              >
                <div>
                  <strong>{item.labelCn}</strong>
                  <span>{item.labelEn}</span>
                </div>
              </button>
            ))}
          </div>

          <div className="rail-footer">
            <p>BUILDING KNOWLEDGE. INTERNALIZING VALUE.</p>
            <div className="health-stack">
              <span>{health ? "API 在线" : "API 未连接"}</span>
              <strong>{supabaseLabel}</strong>
            </div>
          </div>
        </nav>

        <section className="workspace-stage">
          {activePage === "inbox" && (
            <InboxPanel
              initialRecords={inboxRecords}
              onNavigateKnowledge={() => setActivePage("knowledge")}
              onAskFromNote={() => setActivePage("assistant")}
            />
          )}
          {activePage === "knowledge" && (
            <KnowledgeBasePanel
              nodes={graphNodes}
              edges={graphEdges}
              topicDetails={graphTopicDetails}
              noteDetail={knowledgeNoteDetail}
              onAskFromNote={() => setActivePage("assistant")}
            />
          )}
          {activePage === "assistant" && (
            <AIAssistantPanel
              history={aiHistory}
              initialMessages={aiMessages}
              referenceNote={knowledgeNoteDetail}
            />
          )}
        </section>
      </div>
    </main>
  );
}
