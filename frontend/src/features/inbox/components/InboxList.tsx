import type { InboxRecord } from "../types";

interface InboxListProps {
  records: InboxRecord[];
  selectedRecordId: string | null;
  onSelectRecord: (recordId: string) => void;
}

export function InboxList(props: InboxListProps) {
  const { records, selectedRecordId, onSelectRecord } = props;

  if (records.length === 0) {
    return (
      <div className="inbox-list-empty" role="status">
        <p>当前 tab 里还没有记录。</p>
      </div>
    );
  }

  return (
    <ul className="inbox-list" aria-label="Inbox records">
      {records.map((record) => {
        const isSelected = record.id === selectedRecordId;

        return (
          <li key={record.id}>
            <button
              type="button"
              className={isSelected ? "inbox-list-item is-selected" : "inbox-list-item"}
              onClick={() => onSelectRecord(record.id)}
            >
              <div className="list-item-topline">
                <span className="record-kind">{record.kind}</span>
                <span className="record-status">{record.status}</span>
              </div>
              <strong className="record-title">{record.title}</strong>
              <p className="record-summary">{record.summary}</p>
              <div className="list-item-meta">
                <span>{record.sourceLabel}</span>
                <span>{record.updatedAt}</span>
              </div>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
