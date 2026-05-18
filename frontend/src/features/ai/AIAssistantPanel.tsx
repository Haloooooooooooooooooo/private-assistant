"use client";

import { useMemo, useState } from "react";

import type { ChatHistoryItem, ChatMessage, KnowledgeNoteDetail } from "../types";

type AIAssistantPanelProps = {
  history: ChatHistoryItem[];
  initialMessages: ChatMessage[];
  referenceNote: KnowledgeNoteDetail;
};

export function AIAssistantPanel({
  history,
  initialMessages,
  referenceNote
}: AIAssistantPanelProps) {
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const groupedHistory = useMemo(() => {
    return history.reduce<Record<string, ChatHistoryItem[]>>((accumulator, item) => {
      accumulator[item.group] ??= [];
      accumulator[item.group].push(item);
      return accumulator;
    }, {});
  }, [history]);

  function sendMessage() {
    const normalized = input.trim();

    if (!normalized) {
      return;
    }

    const nextMessages: ChatMessage[] = [
      ...messages,
      {
        id: `user-${Date.now()}`,
        role: "user",
        time: "16:46",
        text: normalized
      },
      {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        time: "16:46",
        text: "根据当前知识库，可确定的部分是：这条问题与输入变资产、证据化问答和 Workflow 约束直接相关。若要做更强市场判断，还需要更多竞品与用户验证记录。",
        references: [
          { id: "inline-1", name: referenceNote.title, source: `AI笔记 · ${referenceNote.subtheme}` }
        ]
      }
    ];

    setMessages(nextMessages);
    setInput("");
  }

  return (
    <section className="workspace-page">
      <div className="ai-shell">
        <aside className="ai-sidebar content-panel">
          <div className="ai-sidebar-top">
            <button className="btn-primary btn-full">+ 新建对话</button>
            <input className="ghost-input" placeholder="搜索会话..." />
          </div>

          <div className="history-groups">
            {Object.entries(groupedHistory).map(([group, items]) => (
              <div key={group}>
                <p className="history-group-title">{group}</p>
                {items.map((item, index) => (
                  <button
                    key={item.id}
                    className={index === 0 && group === "今天" ? "history-item history-item-active" : "history-item"}
                  >
                    <span>{item.title}</span>
                    <strong>{item.time}</strong>
                  </button>
                ))}
              </div>
            ))}
          </div>
        </aside>

        <div className="ai-main content-panel">
          <div className="section-heading">
            <span className="section-bar" />
            <div>
              <h3>AI 助手</h3>
              <p>EVIDENCE-BOUND ANSWERING</p>
            </div>
          </div>

          <div className="message-list">
            {messages.map((message) => (
              <article key={message.id} className={`message-card message-${message.role}`}>
                <div className="message-avatar">
                  {message.role === "assistant" ? "AI" : "你"}
                </div>
                <div className="message-bubble">
                  <div className="message-time">{message.time}</div>
                  <p>{message.text}</p>
                  {message.references && (
                    <div className="reference-list">
                      {message.references.map((reference) => (
                        <button
                          key={reference.id}
                          className="reference-chip"
                          onClick={() => setDrawerOpen(true)}
                        >
                          <span>{reference.name}</span>
                          <strong>{reference.source}</strong>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>

          <div className="composer">
            <textarea
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="只询问知识库中的内容；证据不足时会明确说明不确定..."
            />
            <div className="composer-actions">
              <span>Shift + Enter 换行，Enter 发送</span>
              <button className="btn-primary" onClick={sendMessage}>
                发送
              </button>
            </div>
          </div>
        </div>

        <aside className={drawerOpen ? "detail-drawer detail-drawer-open" : "detail-drawer"}>
          <div className="drawer-header">
            <div>
              <p className="drawer-overline">引用笔记</p>
              <h3>{referenceNote.title}</h3>
            </div>
          </div>
          <div className="drawer-section">
            <span className="drawer-label">摘要</span>
            <p>{referenceNote.summary}</p>
          </div>
          <div className="drawer-section">
            <span className="drawer-label">AI 笔记正文</span>
            <ol className="note-list">
              {referenceNote.body.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ol>
          </div>
          <div className="drawer-actions">
            <button className="drawer-action-btn" onClick={() => setDrawerOpen(false)}>
              收起
            </button>
            <button className="drawer-action-btn primary">加入笔记</button>
          </div>
        </aside>
      </div>
    </section>
  );
}
