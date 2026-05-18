import type { ChangeEvent, FormEvent } from "react";
import type { InboxRecordKind, QuickCaptureDraft } from "../types";

interface QuickCapturePanelProps {
  draft: QuickCaptureDraft;
  isSubmitting?: boolean;
  onDraftChange: (draft: QuickCaptureDraft) => void;
  onSubmit: () => void;
}

const kindOptions: Array<{ value: InboxRecordKind; label: string }> = [
  { value: "article", label: "文章" },
  { value: "note", label: "笔记" },
  { value: "link", label: "链接" },
  { value: "file", label: "文件" },
  { value: "idea", label: "想法" }
];

export function QuickCapturePanel(props: QuickCapturePanelProps) {
  const { draft, isSubmitting = false, onDraftChange, onSubmit } = props;

  const handleFieldChange =
    (field: keyof QuickCaptureDraft) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      onDraftChange({
        ...draft,
        [field]: event.target.value
      });
    };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit();
  };

  return (
    <section className="inbox-panel inbox-quick-capture" aria-labelledby="quick-capture-title">
      <div className="panel-header">
        <div>
          <p className="panel-eyebrow">Quick Capture</p>
          <h2 id="quick-capture-title">快速收录</h2>
        </div>
        <span className="panel-badge">Phase 1</span>
      </div>

      <form className="quick-capture-form" onSubmit={handleSubmit}>
        <label className="field">
          <span className="field-label">标题</span>
          <input
            className="field-input"
            name="title"
            value={draft.title}
            onChange={handleFieldChange("title")}
            placeholder="例如：一条稍后要内化的记录"
          />
        </label>

        <label className="field">
          <span className="field-label">来源</span>
          <input
            className="field-input"
            name="sourceLabel"
            value={draft.sourceLabel}
            onChange={handleFieldChange("sourceLabel")}
            placeholder="例如：Readwise / 手动收录 / 链接"
          />
        </label>

        <div className="field-row">
          <label className="field">
            <span className="field-label">类型</span>
            <select
              className="field-input"
              name="kind"
              value={draft.kind}
              onChange={handleFieldChange("kind")}
            >
              {kindOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <label className="field">
          <span className="field-label">摘记</span>
          <textarea
            className="field-input field-textarea"
            name="summary"
            value={draft.summary}
            onChange={handleFieldChange("summary")}
            placeholder="先把原始线索丢进来，后续再分拣。"
            rows={4}
          />
        </label>

        <div className="quick-capture-actions">
          <button className="action-button primary" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "收录中..." : "加入收录箱"}
          </button>
        </div>
      </form>
    </section>
  );
}
