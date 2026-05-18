import type { InboxRecord } from "./types";

export const inboxTabs = [
  { key: "all", label: "全部", description: "所有收录记录" },
  { key: "captured", label: "待分拣", description: "刚进入收录箱" },
  { key: "reviewing", label: "处理中", description: "正在标注或提炼" },
  { key: "internalizing", label: "待内化", description: "准备进入内化流" }
] as const;

export const mockInboxRecords: InboxRecord[] = [
  {
    id: "rec-001",
    title: "Agent orchestration notes",
    summary: "整理多 agent 编排时的任务切片和状态回传模式。",
    sourceLabel: "Readwise Reader",
    kind: "article",
    status: "captured",
    createdAt: "2026-05-18 09:20",
    updatedAt: "2026-05-18 09:20",
    detail: "这条记录保留了原始摘录、任务分工草稿，以及后续要映射到知识卡片的字段。",
    locationLabel: "reader://agent-orchestration-notes",
    canInternalize: true,
    canLocate: true
  },
  {
    id: "rec-002",
    title: "Inbox layout migration checklist",
    summary: "把 HTML 原型迁移到 Next.js 时需要保持三栏视图和右侧抽屉骨架。",
    sourceLabel: "Manual Capture",
    kind: "note",
    status: "reviewing",
    createdAt: "2026-05-17 19:45",
    updatedAt: "2026-05-18 10:05",
    detail: "当前重点是组件边界和交互主路径，视觉样式由主线程统一收口。",
    locationLabel: "kb://projects/inbox-migration",
    canInternalize: true,
    canLocate: true
  },
  {
    id: "rec-003",
    title: "Prompt pattern: synthesis loop",
    summary: "沉淀一个从收录到内化的提示词循环模板。",
    sourceLabel: "Prompt Library",
    kind: "idea",
    status: "internalizing",
    createdAt: "2026-05-16 14:10",
    updatedAt: "2026-05-18 08:55",
    detail: "可从详情抽屉触发内化预览，后续接到真正的工作流或定位能力。",
    locationLabel: "prompt://synthesis-loop",
    canInternalize: true,
    canLocate: false
  }
];
