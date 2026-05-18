import type {
  CalendarDay,
  ChatHistoryItem,
  ChatMessage,
  InboxRecord,
  KnowledgeEdge,
  KnowledgeNoteDetail,
  KnowledgeNode,
  KnowledgeTopicDetail,
  ReminderSnapshot,
  WeeklyFeedbackItem
} from "./types";

export const appPages = [
  { id: "inbox", labelCn: "收录箱", labelEn: "INBOX" },
  { id: "knowledge", labelCn: "知识库", labelEn: "KNOWLEDGE BASE" },
  { id: "assistant", labelCn: "AI 助手", labelEn: "AI ASSISTANT" }
] as const;

export const inboxRecords: InboxRecord[] = [
  {
    id: 2,
    title: "Agent 设计灵感：知识助手不等于聊天机器人",
    source: "Notion Blog",
    domain: "notion.so",
    capturedAt: "05-18 09:12",
    status: "done",
    tags: ["Agent", "产品定位"],
    summary: "强调知识助手的长期价值来自持续内化与回写，而不是一次性回答问题。",
    userUnderstanding: "这条记录可以作为产品定位和面试表达的核心案例。",
    content: "知识助手不应只比拼回答质量，更重要的是把用户持续输入转为可复用资产。",
    attachments: [
      { id: "att-201", kind: "file", name: "原始内容.pdf" },
      { id: "att-202", kind: "image", name: "结构示意图.png" }
    ]
  },
  {
    id: 3,
    title: "Transformer 笔记：长上下文不是万能解",
    source: "论文摘录",
    domain: "arxiv.org",
    capturedAt: "05-17 20:43",
    status: "pending",
    tags: ["Transformer", "长上下文"],
    summary: "提醒在复杂系统中，长上下文不能替代结构化工作流和显式状态管理。",
    userUnderstanding: "很适合作为 Workflow-Orchestrated Multi-Agent 的论据。",
    content: "上下文窗口变大并不意味着系统就天然可控，尤其在多阶段任务里。",
    attachments: [{ id: "att-301", kind: "file", name: "paper-note.md" }]
  },
  {
    id: 9,
    title: "RAG 向量检索实践笔记",
    source: "手动输入",
    domain: "",
    capturedAt: "05-16 11:08",
    status: "later",
    tags: ["RAG", "检索"],
    summary: "记录向量检索、重排和 evidence answering 的关键实验经验。",
    userUnderstanding: "后面可以和 AI 助手的证据问答直接联动。",
    content: "RAG 最终体验的关键不只是召回率，还有如何在回答中暴露证据。",
    attachments: [{ id: "att-901", kind: "link", name: "实验看板链接" }]
  }
];

export const calendarDays: CalendarDay[] = [
  { id: "d1", label: "日", dayNumber: 27, inCurrentMonth: false, hasRecord: false },
  { id: "d2", label: "一", dayNumber: 28, inCurrentMonth: false, hasRecord: false },
  { id: "d3", label: "二", dayNumber: 29, inCurrentMonth: false, hasRecord: false },
  { id: "d4", label: "三", dayNumber: 30, inCurrentMonth: false, hasRecord: false },
  { id: "d5", label: "四", dayNumber: 1, inCurrentMonth: true, hasRecord: true },
  { id: "d6", label: "五", dayNumber: 2, inCurrentMonth: true, hasRecord: true },
  { id: "d7", label: "六", dayNumber: 3, inCurrentMonth: true, hasRecord: false },
  { id: "d8", label: "日", dayNumber: 4, inCurrentMonth: true, hasRecord: true },
  { id: "d9", label: "一", dayNumber: 5, inCurrentMonth: true, hasRecord: true },
  { id: "d10", label: "二", dayNumber: 6, inCurrentMonth: true, hasRecord: false },
  { id: "d11", label: "三", dayNumber: 7, inCurrentMonth: true, hasRecord: false },
  { id: "d12", label: "四", dayNumber: 8, inCurrentMonth: true, hasRecord: true },
  { id: "d13", label: "五", dayNumber: 9, inCurrentMonth: true, hasRecord: true },
  { id: "d14", label: "六", dayNumber: 10, inCurrentMonth: true, hasRecord: false },
  { id: "d15", label: "日", dayNumber: 11, inCurrentMonth: true, hasRecord: true },
  { id: "d16", label: "一", dayNumber: 12, inCurrentMonth: true, hasRecord: true },
  { id: "d17", label: "二", dayNumber: 13, inCurrentMonth: true, hasRecord: true },
  { id: "d18", label: "三", dayNumber: 14, inCurrentMonth: true, hasRecord: true, isToday: true },
  { id: "d19", label: "四", dayNumber: 15, inCurrentMonth: true, hasRecord: true },
  { id: "d20", label: "五", dayNumber: 16, inCurrentMonth: true, hasRecord: false },
  { id: "d21", label: "六", dayNumber: 17, inCurrentMonth: true, hasRecord: false }
];

export const reminderSnapshot: ReminderSnapshot = {
  dateLabel: "今日信息卡 · 2026-05-18",
  laterCount: 8,
  pendingCount: 5,
  doneCount: 2,
  reminders: [
    {
      id: "rem-01",
      title: "Transformer 笔记：长上下文不是万能解",
      description: "待内化 · 收录已 3 天，内容质量高",
      status: "pending",
      recordId: 3
    },
    {
      id: "rem-02",
      title: "Agent 设计灵感：知识助手不等于聊天机器人",
      description: "已沉淀 · 可用于产品定位表达",
      status: "done",
      recordId: 2
    },
    {
      id: "rem-03",
      title: "RAG 向量检索实践笔记",
      description: "稍后看 · 等待时间最久的未处理记录",
      status: "later",
      recordId: 9
    }
  ]
};

export const weeklyFeedback: WeeklyFeedbackItem[] = [
  { label: "本周新增记录", value: "18 条" },
  { label: "本周已沉淀", value: "7 条" },
  { label: "关注主题 Top3", value: "RAG · Agent · 复盘" },
  { label: "可复用笔记", value: "6 条" },
  { label: "下周建议补强", value: "知识系统", accent: true }
];

export const graphNodes: KnowledgeNode[] = [
  { id: "theme-ai", kind: "theme", label: "AI 产品经理", x: 450, y: 95, description: "主题层" },
  { id: "sub-agent", kind: "subtheme", label: "Agent 设计", x: 660, y: 210, description: "子主题层" },
  { id: "sub-rag", kind: "subtheme", label: "RAG 实践", x: 260, y: 375, description: "子主题层" },
  { id: "sub-ks", kind: "subtheme", label: "知识系统", x: 635, y: 430, description: "子主题层" },
  { id: "sub-interview", kind: "subtheme", label: "面试表达", x: 360, y: 525, description: "子主题层" },
  { id: "note-021", kind: "note", label: "内化与复用", x: 720, y: 295, description: "笔记节点" },
  { id: "note-037", kind: "note", label: "RAG 复盘", x: 188, y: 372, description: "笔记节点" },
  { id: "note-045", kind: "note", label: "回写闭环", x: 726, y: 452, description: "笔记节点" }
];

export const graphEdges: KnowledgeEdge[] = [
  { id: "e1", source: "theme-ai", target: "sub-agent" },
  { id: "e2", source: "theme-ai", target: "sub-rag" },
  { id: "e3", source: "theme-ai", target: "sub-ks" },
  { id: "e4", source: "theme-ai", target: "sub-interview" },
  { id: "e5", source: "sub-agent", target: "note-021" },
  { id: "e6", source: "sub-rag", target: "note-037" },
  { id: "e7", source: "sub-ks", target: "note-045" },
  { id: "e8", source: "note-021", target: "note-045", semantic: true }
];

export const graphTopicDetails: Record<string, KnowledgeTopicDetail> = {
  "theme-ai": {
    id: "theme-ai",
    title: "主题：AI 产品经理",
    description: "以主题为核心，连接子主题与知识笔记，构建你的知识星球。"
  },
  "sub-agent": {
    id: "sub-agent",
    title: "主题：Agent 设计",
    description: "聚焦 Workflow-Orchestrated Multi-Agent 的职责边界、状态推进与可观测性。"
  },
  "sub-rag": {
    id: "sub-rag",
    title: "主题：RAG 实践",
    description: "围绕检索、重排、证据化回答和长文档切分的实验记录。"
  },
  "sub-ks": {
    id: "sub-ks",
    title: "主题：知识系统",
    description: "围绕知识状态、结构维护与回写闭环的系统设计。"
  },
  "sub-interview": {
    id: "sub-interview",
    title: "主题：面试表达",
    description: "把项目经验转成结构清晰、可复述的面试叙事。"
  }
};

export const knowledgeNoteDetail: KnowledgeNoteDetail = {
  id: "note-021",
  title: "知识助手的核心竞争力是持续内化与复用",
  theme: "AI 产品经理",
  subtheme: "Agent 设计",
  sourceTitle: "Agent 设计灵感：知识助手不等于聊天机器人",
  summary: "这条笔记强调知识助手的核心价值是持续内化与回写，不是一次性问答。",
  understanding: "真正的差异不在回答能力本身，而在于能否形成输入-整理-沉淀-复用的闭环。",
  body: [
    "知识助手的长期价值，不在于像 ChatGPT 一样回答问题，而在于能把用户不断输入的材料，持续整理成可复用、可连接、可追溯的知识资产。",
    "知识产品不能只强调搜索或问答。如果系统只能临时回答，它很容易被更强的通用模型替代。",
    "讲知识助手时，应优先强调输入如何变成资产，而不是只讲能不能回答。",
    "可用于：产品方案、面试表达、竞品分析、知识库定位。"
  ],
  followUps: [
    "为什么知识状态管理比纯收藏更重要？",
    "如何设计回写闭环而不打扰用户？"
  ],
  evidence: "\"助手的价值来自持续整理与回写，而不是一次性回答。\"",
  relatedNotes: [
    { id: "note-014", label: "Transformer 笔记：长上下文…", type: "补充" },
    { id: "note-037", label: "RAG 实验复盘", type: "对比" },
    { id: "note-045", label: "知识回写闭环设计", type: "延伸" }
  ]
};

export const aiHistory: ChatHistoryItem[] = [
  { id: "chat-01", title: "RAG 实验结果总结", time: "10:32", group: "今天" },
  { id: "chat-02", title: "主题结构优化建议", time: "09:08", group: "今天" },
  { id: "chat-03", title: "知识回写闭环", time: "昨天", group: "更早" }
];

export const aiMessages: ChatMessage[] = [
  {
    id: "msg-01",
    role: "user",
    time: "10:32",
    text: "帮我总结这周 RAG 实验的结果和关键结论。"
  },
  {
    id: "msg-02",
    role: "assistant",
    time: "10:32",
    text: "本周围绕 RAG 的召回与重排路进行了系统实验，整体结论是混合检索结合重排在召回与准确率之间取得更优平衡。",
    references: [
      { id: "ref-01", name: "RAG 实验记录 A", source: "Notion · 05-14 10:12" },
      { id: "ref-02", name: "向量检索对比笔记", source: "手动输入 · 05-13 22:48" }
    ]
  },
  {
    id: "msg-03",
    role: "user",
    time: "10:35",
    text: "不同的分解器对长文档生成质量的影响如何？"
  },
  {
    id: "msg-04",
    role: "assistant",
    time: "10:35",
    text: "现有知识库能支持的结论是：语义边界切分在避免跨段割裂上表现最好，但如果要做更强结论，还需要更多长文档样本。",
    references: [{ id: "ref-03", name: "长文档切分策略评估", source: "Notion · 05-11 14:30" }]
  }
];
