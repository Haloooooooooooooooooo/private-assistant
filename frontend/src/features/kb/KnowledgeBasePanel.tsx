"use client";

import { useMemo, useState } from "react";

import type { KnowledgeEdge, KnowledgeNode, KnowledgeNoteDetail, KnowledgeTopicDetail } from "../types";

type KnowledgeBasePanelProps = {
  nodes: KnowledgeNode[];
  edges: KnowledgeEdge[];
  topicDetails: Record<string, KnowledgeTopicDetail>;
  noteDetail: KnowledgeNoteDetail;
  onAskFromNote: (noteId: string) => void;
};

export function KnowledgeBasePanel({
  nodes,
  edges,
  topicDetails,
  noteDetail,
  onAskFromNote
}: KnowledgeBasePanelProps) {
  const [selectedNodeId, setSelectedNodeId] = useState(noteDetail.id);

  const selectedNode = useMemo(
    () => nodes.find((node) => node.id === selectedNodeId) ?? nodes[0],
    [nodes, selectedNodeId]
  );

  const structuralEdges = edges.filter((edge) => !edge.semantic);
  const semanticEdges = edges.filter((edge) => edge.semantic);
  const isNote = selectedNode?.kind === "note";
  const topicDetail = selectedNode ? topicDetails[selectedNode.id] : null;

  return (
    <section className="workspace-page">
      <div className="kb-shell">
        <div className="kb-main content-panel">
          <div className="section-heading">
            <span className="section-bar" />
            <div>
              <h3>知识库</h3>
              <p>KNOWLEDGE BASE</p>
            </div>
          </div>
          <p className="section-copy">
            以主题为核心，连接子主题与知识笔记，构建你的知识星球。
          </p>

          <div className="kb-stage">
            <svg className="kb-graph" viewBox="0 0 900 600" preserveAspectRatio="xMidYMid meet">
              {structuralEdges.map((edge) => {
                const source = nodes.find((node) => node.id === edge.source);
                const target = nodes.find((node) => node.id === edge.target);

                if (!source || !target) {
                  return null;
                }

                return (
                  <line
                    key={edge.id}
                    className="graph-edge"
                    x1={source.x}
                    y1={source.y}
                    x2={target.x}
                    y2={target.y}
                  />
                );
              })}

              {semanticEdges.map((edge) => {
                const source = nodes.find((node) => node.id === edge.source);
                const target = nodes.find((node) => node.id === edge.target);

                if (!source || !target) {
                  return null;
                }

                return (
                  <line
                    key={edge.id}
                    className="graph-edge graph-edge-semantic"
                    x1={source.x}
                    y1={source.y}
                    x2={target.x}
                    y2={target.y}
                  />
                );
              })}

              {nodes.map((node) => (
                <g
                  key={node.id}
                  className={
                    node.id === selectedNodeId ? "graph-node graph-node-selected" : "graph-node"
                  }
                  transform={`translate(${node.x}, ${node.y})`}
                  onClick={() => setSelectedNodeId(node.id)}
                >
                  <circle
                    r={node.kind === "theme" ? 34 : node.kind === "subtheme" ? 24 : 9}
                    className={`graph-dot graph-dot-${node.kind}`}
                  />
                  <text y={node.kind === "note" ? -18 : 48}>{node.label}</text>
                </g>
              ))}
            </svg>

            <div className="kb-legend">
              <span><i className="legend-swatch legend-theme" />主题</span>
              <span><i className="legend-swatch legend-subtheme" />子主题</span>
              <span><i className="legend-swatch legend-note" />笔记</span>
              <span><i className="legend-line legend-structure" />结构关系</span>
              <span><i className="legend-line legend-semantic" />语义关系</span>
            </div>

            <div className="kb-controls">
              <button>⊕</button>
              <button>⊖</button>
              <button>⊙ 适应视图</button>
              <button>↺ 重置视图</button>
            </div>
          </div>
        </div>

        <aside className="detail-drawer">
          {isNote ? (
            <>
              <div className="drawer-header">
                <div>
                  <p className="drawer-overline">笔记详情</p>
                  <h3>{noteDetail.title}</h3>
                </div>
              </div>

              <div className="drawer-section">
                <div className="drawer-grid">
                  <div>
                    <span className="drawer-label">主题</span>
                    <p>{noteDetail.theme}</p>
                  </div>
                  <div>
                    <span className="drawer-label">子主题</span>
                    <p>{noteDetail.subtheme}</p>
                  </div>
                  <div>
                    <span className="drawer-label">来源记录</span>
                    <p>{noteDetail.sourceTitle}</p>
                  </div>
                </div>
              </div>

              <div className="drawer-section">
                <span className="drawer-label">摘要</span>
                <p>{noteDetail.summary}</p>
              </div>

              <div className="drawer-section">
                <span className="drawer-label">我的理解</span>
                <textarea readOnly value={noteDetail.understanding} />
              </div>

              <div className="drawer-section">
                <span className="drawer-label">AI 笔记正文</span>
                <ol className="note-list">
                  {noteDetail.body.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ol>
              </div>

              <div className="drawer-section">
                <span className="drawer-label">相关追问</span>
                <div className="followup-list">
                  {noteDetail.followUps.map((item) => (
                    <span key={item} className="question-chip">
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              <div className="drawer-section">
                <span className="drawer-label">引用依据</span>
                <p>{noteDetail.evidence}</p>
              </div>

              <div className="drawer-section">
                <span className="drawer-label">关联笔记</span>
                <div className="related-list">
                  {noteDetail.relatedNotes.map((item) => (
                    <button key={item.id} className="related-item">
                      <span>{item.label}</span>
                      <strong>{item.type}</strong>
                    </button>
                  ))}
                </div>
              </div>

              <div className="drawer-actions">
                <button className="drawer-action-btn">查看原笔记</button>
                <button
                  className="drawer-action-btn primary"
                  onClick={() => onAskFromNote(noteDetail.id)}
                >
                  基于此笔记提问
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="drawer-header">
                <div>
                  <p className="drawer-overline">主题视图</p>
                  <h3>{topicDetail?.title ?? selectedNode?.label}</h3>
                </div>
              </div>
              <div className="drawer-section">
                <p>{topicDetail?.description ?? selectedNode?.description}</p>
              </div>
              <div className="drawer-actions">
                <button className="drawer-action-btn">重命名</button>
                <button className="drawer-action-btn primary">基于此主题提问</button>
              </div>
            </>
          )}
        </aside>
      </div>
    </section>
  );
}
