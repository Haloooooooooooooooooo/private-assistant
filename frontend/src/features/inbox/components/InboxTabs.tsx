import type { InboxTabKey } from "../types";

interface InboxTabsProps {
  activeTab: InboxTabKey;
  counts: Record<InboxTabKey, number>;
  tabs: ReadonlyArray<{
    key: InboxTabKey;
    label: string;
    description: string;
  }>;
  onTabChange: (tab: InboxTabKey) => void;
}

export function InboxTabs(props: InboxTabsProps) {
  const { activeTab, counts, tabs, onTabChange } = props;

  return (
    <div className="inbox-tabs" role="tablist" aria-label="Inbox tabs">
      {tabs.map((tab) => {
        const isActive = tab.key === activeTab;

        return (
          <button
            key={tab.key}
            type="button"
            role="tab"
            className={isActive ? "tab-button is-active" : "tab-button"}
            aria-selected={isActive}
            onClick={() => onTabChange(tab.key)}
          >
            <span className="tab-label">{tab.label}</span>
            <span className="tab-count">{counts[tab.key] ?? 0}</span>
          </button>
        );
      })}
    </div>
  );
}
