import type { DetailActionPayload, InboxRecord } from "../types";

interface InboxDetailDrawerProps {
  record: InboxRecord | null;
  showInternalizePreview: boolean;
  lastActionLabel: string | null;
  onTriggerAction: (payload: DetailActionPayload) => void;
}

export function InboxDetailDrawer(props: InboxDetailDrawerProps) {
  const { record, showInternalizePreview, lastActionLabel, onTriggerAction } = props;

  if (!record) {
    return (
      <aside className="inbox-panel inbox-detail-drawer is-empty" aria-label="Detail drawer">
        <div className="drawer-empty-state">
          <p className="panel-eyebrow">Detail Drawer</p>
          <h2>选择一条记录</h2>
          <p>这里会承接详情、内化入口和定位动作。</p>
        </div>
      </aside>
    );
  }

  return (
    <aside className="inbox-panel inbox-detail-drawer" aria-label="Detail drawer">
      <div className="panel-header">
        <div>
          <p className="panel-eyebrow">Detail Drawer</p>
          <h2>{record.title}</h2>
        </div>
        <span className="panel-badge">{record.status}</span>
      </div>

      <div className="drawer-meta">
        <div className="meta-row">
          <span className="meta-label">来源</span>
          <span className="meta-value">{record.sourceLabel}</span>
        </div>
        <div className="meta-row">
          <span className="meta-label">类型</span>
          <span className="meta-value">{record.kind}</span>
        </div>
        <div className="meta-row">
          <span className="meta-label">更新时间</span>
          <span className="meta-value">{record.updatedAt}</span>
        </div>
      </div>

      <section className="drawer-section">
        <h3>摘要</h3>
        <p>{record.summary}</p>
      </section>

      <section className="drawer-section">
        <h3>详情骨架</h3>
        <p>{record.detail ?? "主线程接线后，这里可以展示更完整的原文、摘录和结构化字段。"}</p>
      </section>

      <section className="drawer-actions">
        <button
          type="button"
          className="action-button primary"
          disabled={!record.canInternalize}
          onClick={() => onTriggerAction({ record, action: "show-internalize" })}
        >
          打开内化展示
        </button>
        <button
          type="button"
          className="action-button"
          disabled={!record.canLocate}
          onClick={() => onTriggerAction({ record, action: "locate-source" })}
        >
          定位原始来源
        </button>
      </section>

      <section className="drawer-section">
        <h3>动作反馈</h3>
        <p>{lastActionLabel ?? "尚未触发动作。"}</p>
      </section>

      {showInternalizePreview ? (
        <section className="drawer-section internalize-preview" aria-live="polite">
          <h3>内化展示占位</h3>
          <p>这里预留给内化工作流预览、知识卡生成结果或后续步骤入口。</p>
          <p className="preview-location">{record.locationLabel ?? "等待主线程接入真实定位信息。"}</p>
        </section>
      ) : null}
    </aside>
  );
}
