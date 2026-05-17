# 个人知识内化 Agent V1 执行计划

日期：2026-05-15
状态：待最终评审

## 1. 产品定位与 V1 边界

本项目不是普通收藏夹，也不是单纯 RAG 问答工具，而是一个个人知识内化 Agent。它的核心目标是把用户随手收录的资料，自动转化成可复用、可追溯、可问答、可持续沉淀的个人知识。

V1 的核心闭环：

```text
低摩擦收录
→ 内容解析
→ AI 内化成结构化笔记
→ AI 归入主题/子主题
→ 图谱化展示
→ 基于知识库证据化问答
→ 有价值回答回写笔记
→ 今日提醒/周反馈推动继续处理
```

V1 要做：

- Web 主工作台
- 收录箱
- 附件解析
- 一键内化
- 7 字段结构化笔记
- 主题/子主题归类
- React Flow 知识图谱
- AI 助手证据化问答
- 回写笔记
- 今日提醒
- 周反馈
- 轻量产品级日志、状态机、失败重试

V1 暂不做：

- 桌面快捷收录窗
- 手机端
- Obsidian 同步或导出
- 复杂图谱算法
- 多层主题体系
- 通用聊天机器人
- 大规模多人协作

Agent 角色规则：

- 只服务用户个人知识库，不做泛聊天。
- 不确定时必须说明不确定。
- 回答必须附来源记录。
- 内化笔记必须基于原文和用户批注。
- 用户只做轻确认，不要求手工维护复杂知识体系。
- 系统可以自动建议主题，但关键结果允许用户修改。

## 2. 技术架构设计

V1 采用 Supabase 优先的轻量产品级架构：

```text
Next.js Web 前端
→ FastAPI Agent 后端
→ Supabase Auth
→ Supabase Postgres + pgvector
→ Supabase Storage
→ FastAPI Background Worker
→ 大模型 API / OCR / 文档解析工具
```

### 2.1 分层架构

用户界面层：

- Web 主工作台
- 收录箱
- 知识图谱
- AI 助手
- 详情抽屉
- 内化草稿抽屉
- 日历提醒弹窗

前端层：

- Next.js
- TypeScript
- Tailwind CSS
- shadcn/ui
- Zustand
- React Query
- React Flow

后端 Agent 层：

- FastAPI
- Agent Orchestrator
- Background Worker
- Prompt Registry
- Tool Registry
- Evaluation Logger

Supabase 数据层：

- Supabase Auth
- Supabase Postgres
- pgvector
- Supabase Storage
- Row Level Security

AI 与工具层：

- 大模型 API
- OCR 服务
- PDF / DOCX / MD / TXT 解析
- 网页正文提取
- 向量检索
- 关键词检索

### 2.2 为什么 V1 直接使用 Supabase

Supabase 能减少早期基础设施工作量，让开发重点放在产品闭环和 Agent 能力上：

- 不需要自己维护 PostgreSQL。
- pgvector 可以直接支持 RAG。
- Supabase Storage 可以承载附件和原始快照。
- Supabase Auth 可以直接处理登录鉴权。
- 后续线上演示更方便。
- 本地开发和线上环境差异更小。

FastAPI 后端仍然保留，因为 Agent 编排、OCR、文档解析、RAG、任务执行、Prompt 日志和评测逻辑不适合全部放在前端。

### 2.3 V1 任务机制

V1 暂不把 Redis/Celery 作为必选项，而是使用 Supabase 中的 `jobs` 表配合 FastAPI worker：

```text
用户触发任务
→ FastAPI 写入 jobs 表
→ Worker 轮询 pending jobs
→ 执行解析/内化/嵌入/归类/提醒
→ 更新 job 状态
→ 写入 processing_logs
→ 前端轮询或订阅状态
```

任务状态：

```text
pending
running
succeeded
failed
retrying
cancelled
```

这套机制比同步调用更可靠，但比一开始引入 Redis/Celery 更轻。

### 2.4 模型调用原则

- 内化 Agent：强模型。
- 知识结构 Agent：强模型或中等模型。
- 问答 Agent：强模型。
- 今日提醒/周反馈：中等或轻模型。
- 标题、标签、来源识别：轻模型。
- 文件解析、状态流转、筛选、存储：不用 LLM。

### 2.5 部署策略

- 前端：先本地开发，后续可部署到 Vercel。
- 后端：先本地 FastAPI，后续可部署到 Render、Railway 或 VPS。
- 数据库与文件：一开始使用 Supabase。
- 模型 API：通过环境变量配置，保留替换供应商的空间。
- 定时任务：V1 使用 FastAPI worker 或云端 cron 触发。

## 3. 核心数据模型设计

V1 采用轻量产品级数据模型，核心表如下：

```text
users
records
attachments
notes
note_chunks
topics
subtopics
tags
record_tags
note_relations
conversations
messages
answer_sources
note_writebacks
reminder_cards
weekly_feedbacks
jobs
processing_logs
prompt_versions
evaluation_cases
```

核心数据链路：

```text
User
→ Record 原始收录
→ Attachment 附件
→ Note 内化笔记
→ NoteChunk 检索分块
→ Topic / SubTopic 知识结构
→ Relation 笔记关系
→ Conversation / Message 问答
→ AnswerSource 回答引用
→ Writeback 回写沉淀
→ Reminder / WeeklyFeedback 提醒反馈
→ Job / ProcessingLog 任务与日志
```

关键表职责：

- `records`：保存原始收录内容、来源、状态、解析状态、异常标记。
- `attachments`：保存上传文件、图片、PDF、DOCX 等附件信息，文件本体放 Supabase Storage。
- `notes`：保存 7 字段内化结果、所属主题/子主题、来源 record。
- `note_chunks`：保存由内化笔记生成的轻量检索分块，用于向量检索和证据化问答。
- `topics` / `subtopics`：保存 V1 固定两层知识结构。
- `tags` / `record_tags`：保存轻量标签，标签与主题分离。
- `note_relations`：保存笔记之间的补充、对比、延伸、反例、应用关系。
- `conversations` / `messages`：保存 AI 助手多轮会话。
- `answer_sources`：保存每次回答引用了哪些笔记或原始记录。
- `note_writebacks`：保存“加入笔记”的问答沉淀。
- `reminder_cards` / `weekly_feedbacks`：保存今日提醒和周反馈快照。
- `jobs` / `processing_logs`：保存异步任务状态和 Agent 执行日志。
- `prompt_versions`：保存不同 Agent 的 Prompt 版本。
- `evaluation_cases`：保存失败案例和评测样本。

用户可见状态保持简单：

```text
稍后看
待内化
已沉淀
```

系统内部状态使用更细字段承载，例如：

```text
parse_status
internalization_status
embedding_status
graph_status
```

V1 会加入 `note_chunks` 表，但采用轻量方式使用：内化笔记保存后，将核心观点、关键概念、我的理解、可复用结论、使用场景、相关问题、原文依据等字段合并后切分为少量 chunk，并写入向量。暂不做完整的 `record_chunks`、chunk 版本管理和复杂来源定位，等笔记规模和检索质量需求上升后再扩展。

## 4. Agent 工作流设计

V1 不把所有环节都包装成 Agent。文件解析、状态流转、存储写入、提醒统计等确定性任务使用普通工作流完成；真正需要语义理解、归纳、判断和生成的环节，才交给 Agent。

整体编排采用 Orchestrator + Workflows + Agents：

```text
Workflow Orchestrator
├─ 收录解析 Workflow
├─ 内化 Agent
├─ 知识结构 Agent
├─ 证据化问答 Agent
├─ 回写沉淀 Workflow
└─ 提醒反馈 Workflow
```

每个工作流或 Agent 遵循统一执行格式：

```text
输入
→ 任务判断
→ 选择工具
→ 执行
→ 校验
→ 写入结果
→ 记录日志
```

### 4.1 收录解析 Workflow

收录解析主要是确定性工程流程，不作为独立 Agent。

```text
接收文本/链接/附件
→ 判断内容类型
→ 调用解析工具或 OCR
→ 提取正文
→ 生成标题/来源/标签建议
→ 保存原始快照
→ 更新 records 状态
→ 写入 processing_logs
```

LLM 仅用于标题生成、来源识别、简短摘要、标签建议等低风险辅助环节。

### 4.2 内化 Agent

```text
读取 Record 原文 + 用户批注
→ 生成 7 字段内化草稿
→ 校验是否基于原文
→ 用户轻确认/编辑
→ 保存 Note
→ 生成 note_chunks
→ 写入向量
```

内化 Agent 是 V1 的核心能力之一，目标不是简单总结，而是把内容转成未来可复用的知识单元。

### 4.3 知识结构 Agent

```text
读取新 Note
→ 检索已有 Topic/SubTopic
→ 判断归属
→ 必要时建议新建主题/子主题
→ 生成结构边
→ 发现少量相关笔记
→ 写入 note_relations
```

V1 允许知识结构 Agent 生成主题合并/拆分建议，但不自动执行合并/拆分。用户确认后再修改结构，避免 AI 把知识库结构弄乱。

### 4.4 证据化问答 Agent

```text
理解问题
→ 检索 note_chunks
→ 结合主题/标签过滤
→ 判断证据是否充分
→ 生成回答
→ 附来源
→ 保存 conversation/message/answer_sources
```

问答 Agent 只基于用户知识库回答，不做通用闲聊。证据不足时必须明确说明不确定。

### 4.5 回写沉淀 Workflow

```text
用户点击加入笔记
→ 生成规范化问题
→ 写入 note_writebacks
→ 更新 note_chunks
→ 更新向量索引
→ 记录为有效行为
```

回写沉淀以确定性写入为主，LLM 只用于规范化问题等低风险生成环节。

### 4.6 提醒反馈 Workflow

```text
定时触发
→ 统计稍后看/待内化/已沉淀
→ 挑选今日建议处理记录
→ 生成 reminder_cards
→ 每周生成 weekly_feedbacks
→ 保存快照
```

提醒反馈中，统计和候选筛选使用规则完成；今日建议理由、周反馈总结和下周补强建议可调用 LLM。

### 4.7 错误处理规则

- 每次异步执行创建 `job`。
- 成功写入 `succeeded`。
- 失败写入 `failed`。
- 可重试任务进入 `retrying`。
- 错误原因写入 `processing_logs`。
- 不允许静默失败。
- 重要写入动作必须通过后端 Service 层。

## 5. RAG 与记忆系统设计

V1 的记忆系统不做成抽象的“AI 记住我”，而是拆成短期记忆、长期记忆和召回机制。

### 5.1 短期记忆

短期记忆用于当前任务和当前会话：

- 当前 AI 助手会话。
- 最近几轮 `messages`。
- 当前选中的 `note`。
- 从笔记详情发起追问时挂载该 `note`。
- 当前 `job` 的输入、输出和中间状态。

### 5.2 长期记忆

长期记忆由结构化数据承载：

- `notes`
- `note_chunks`
- `topics` / `subtopics`
- `tags`
- `note_relations`
- `note_writebacks`
- `processing_logs`
- `reminder_cards` / `weekly_feedbacks`

### 5.3 RAG 召回流程

```text
用户问题
→ 关键词检索
→ 向量检索 note_chunks
→ 主题/标签过滤
→ 当前笔记上下文加权
→ 相关笔记扩展
→ 轻量 rerank
→ 证据充分性判断
→ 回答并附来源
```

V1 使用轻量 rerank：先召回 10-20 条候选 chunk，再用规则或模型重排，选 3-5 条作为最终回答证据。

### 5.4 回答约束

- 回答必须基于召回证据。
- 每条回答必须附来源记录。
- 来源至少包含标题、来源、时间。
- 证据不足时明确说明不确定。
- 不把通用知识伪装成用户知识库内容。
- 从笔记详情发起的追问，应优先使用当前笔记和相关笔记。

### 5.5 向量化对象

V1 优先向量化 `note_chunks`，chunk 来源于内化笔记的结构化字段。暂不对所有原始 `records` 全量向量化，避免未确认内容污染问答结果。

## 6. 页面与交互设计

V1 保留三个主模块：

```text
1. 收录箱
2. 知识库图谱
3. AI 助手
```

同时包含四个局部体验：

```text
1. 详情抽屉
2. 内化草稿抽屉
3. 笔记追问抽屉
4. 日历提醒弹窗
```

### 6.1 收录箱

收录箱是 V1 主工作页，承担低摩擦收录和待处理记录管理。

核心能力：

- 快速添加文本、链接、图片和附件。
- 快速录入区采用左右结构：左侧内容输入，右侧“我的理解（选填）”。
- 状态选择改为底部二元按钮：稍后看 / 收藏。
- 支持批注输入：我的理解。
- 支持附件上传和剪贴板图片粘贴。
- 提交后记录即时进入列表。
- 支持实时搜索和下拉联想。
- 搜索结果列表直接在主体区域展示。
- 搜索态使用前端临时 `搜索结果` chip，不写入真实标签系统。
- 支持状态、来源、时间、标签筛选。
- 支持记录详情抽屉。
- 支持一键内化。

列表动作：

- 稍后看：转待内化、一键内化、删除。
- 待内化：一键内化、删除。
- 已沉淀：查看笔记、在知识库定位、删除。

### 6.2 详情抽屉

详情抽屉用于查看和轻编辑原始记录：

- 查看原文。
- 编辑“我的理解”。
- 编辑标签。
- 修改状态。
- 查看解析状态和异常原因。
- 触发一键内化。

### 6.3 内化草稿抽屉

一键内化后打开内化草稿抽屉，展示 7 字段结构：

```text
核心观点
关键概念
我的理解
可复用结论
使用场景
相关问题
原文依据
```

用户可以轻确认或微调。保存后生成 `note`，记录进入已沉淀状态，并触发 `note_chunks` 向量化和知识结构归类。

### 6.4 知识库图谱

V1 使用 React Flow 实现星图形态的图谱主视图，并为 3D 视图保留扩展位（先落地 2D 星图）。

图谱能力：

- 两栏结构：主区域为全景星图，右侧为笔记详情抽屉（可调宽、可关闭），不使用中栏笔记列表。
- 节点类型：主题节点、子主题节点、笔记节点（在星图中直接可见）。
- 双层边模型：
  - 结构边：主题 -> 子主题 -> 笔记（表达归属）
  - 语义边：笔记 <-> 笔记（表达知识关系）
- 关系类型：补充、对比、延伸、反例、应用。
- 不同主题使用不同颜色。
- 单条笔记仅主归属 1 个子主题，但可跨主题建立语义连接。
- 点击笔记节点打开右侧笔记详情抽屉。
- 从收录箱跳转时自动定位并高亮目标笔记。
- 支持基础缩放、拖拽、悬浮高亮关联。

V1 不做复杂图谱算法，不自动执行主题合并/拆分。知识结构 Agent 可以生成建议，用户确认后再修改。

### 6.5 AI 助手

AI 助手是独立模块，只做基于知识库的证据化问答。

核心能力：

- 页面采用整列历史对话栏（类似 ChatGPT 左侧历史会话列），支持会话切换与新建会话。
- 多轮会话。
- 基于 `note_chunks` 检索。
- 回答必须附来源。
- 证据不足时说明不确定。
- 支持从笔记详情发起“基于此笔记提问”。
- 每条回答支持“加入笔记”。
- 点击回答中的任一来源笔记，可直接在右侧抽屉打开该笔记详情。
- 输入区仅保留问题输入与发送，不保留附加模式开关。

### 6.6 笔记追问抽屉

从笔记详情触发，自动挂载当前笔记上下文：

- 当前笔记优先作为问答上下文。
- 可召回相关笔记。
- 回答仍需附来源。
- 支持回写到当前笔记。

### 6.7 日历提醒弹窗

顶部保留信息 icon。点击后打开小日历：

- 有记录/无记录日期使用不同颜色。
- 点击某天弹出当日信息弹窗。
- 若当日同时存在今日提醒和周反馈，则同层展示两张卡。
- 今日提醒和周反馈按快照保存，历史默认不自动重算。

## 7. 开发阶段路线

V1 采用“高保真 UI 骨架优先 + 垂直切片接入”的开发路线。先把产品形态和主要交互搭起来，再逐步接入真实数据、Agent 能力、RAG 问答和工程稳定性。

### 7.1 阶段 1：高保真 UI 骨架

目标：先做出一个看起来完整、好看、可演示的产品外壳。

实现内容：

- 整体导航布局。
- 收录箱页面。
- 快速添加栏。
- 记录列表。
- 筛选区。
- 详情抽屉。
- 内化草稿抽屉。
- 知识库图谱页面。
- React Flow mock 图谱。
- 右侧笔记详情抽屉。
- AI 助手页面。
- 信息 icon。
- 日历提醒弹窗。

这一阶段使用 mock 数据，但组件结构要贴近真实数据模型，避免后续大改。

### 7.2 阶段 2：接入真实数据

目标：让 UI 从 mock 数据切换到 Supabase 数据。

实现内容：

- 初始化 Supabase 项目。
- 建立核心表。
- 接入 Supabase Auth。
- 实现 records 增删查改。
- 实现 attachments 上传到 Supabase Storage。
- 实现 tags。
- 实现 topics / subtopics。
- 实现 notes 基础读写。

### 7.3 阶段 3：接入核心 Agent 闭环

目标：跑通收录 → 内化 → 沉淀 → 归类 → 图谱更新。

实现内容：

- FastAPI 后端。
- jobs 表与 worker。
- 收录解析 Workflow。
- 一键内化 Agent。
- 7 字段内化草稿。
- 用户确认保存 note。
- 生成 note_chunks。
- 写入向量。
- 知识结构 Agent。
- 主题/子主题归类。
- 图谱数据刷新。

### 7.4 阶段 4：接入证据化问答和回写

目标：让 AI 助手基于知识库回答，并能把有价值回答沉淀回笔记。

实现内容：

- conversations / messages。
- note_chunks 检索。
- 关键词检索。
- 轻量 rerank。
- 证据充分性判断。
- 回答附来源。
- 从笔记详情发起追问。
- 加入笔记。
- note_writebacks。
- 更新 note_chunks 和向量索引。

### 7.5 阶段 5：提醒反馈和工程稳定性

目标：补齐持续使用闭环和轻量产品级稳定性。

实现内容：

- 今日提醒。
- 周反馈。
- reminder_cards。
- weekly_feedbacks。
- processing_logs。
- prompt_versions。
- evaluation_cases。
- 失败重试。
- Agent 执行日志。
- 基础评测样例。

### 7.6 阶段 6：V1.1 增强

V1.1 再考虑：

- 桌面快捷收录窗。
- 更复杂的图谱语义边。
- 主题合并/拆分确认界面。
- 更完整的 Prompt 评测体系。
- Redis/Celery 任务队列升级。
- 更强的检索 rerank。

## 8. 测试、评测与日志

V1 不做完整评测后台，但从第一版开始保留日志和简单评测案例表，避免后续优化只靠感觉。

### 8.1 执行日志

`processing_logs` 记录每次 Agent 或 Workflow 执行过程：

- 任务类型。
- 输入摘要。
- 使用的 Prompt 版本。
- 使用的模型。
- 调用工具。
- 检索到的笔记或 chunk。
- 输出摘要。
- 用户是否修改。
- 用户是否保存。
- 失败原因。
- 耗时。
- 成本估算。

### 8.2 Prompt 版本

`prompt_versions` 记录不同 Agent 的 Prompt：

- agent_name
- version
- prompt_content
- status
- created_at

每次 Agent 执行时记录使用的 Prompt 版本，方便后续对比效果。

### 8.3 简单评测案例

`evaluation_cases` 保存失败案例和人工评分样本：

- case_type
- input_content
- expected_output
- actual_output
- failure_type
- failure_reason
- improvement_note
- score

V1 评测分 5 类：

- 解析质量：能否正确处理文本、链接、图片、PDF、DOCX。
- 内化质量：7 字段是否准确、有用、无编造。
- 归类质量：主题/子主题是否合理。
- 问答质量：是否找对证据、回答是否附来源、证据不足是否拒答。
- 回写质量：是否写到正确笔记、是否保留问题和回答。

### 8.4 V1 测试重点

- 收录后是否能进入正确状态。
- 解析失败是否保留记录和失败原因。
- 一键内化是否生成可编辑草稿。
- 用户确认后是否正确生成 note 和 note_chunks。
- 图谱是否能展示主题、子主题、笔记。
- AI 问答是否附来源。
- 证据不足时是否明确不确定。
- 回写是否进入正确笔记区块。
- 今日提醒和周反馈是否按快照保存。

## 9. 最终执行清单

V1 按中粒度清单推进，采用“高保真 UI 骨架优先 + 垂直切片接入”的方式。

### P0：项目初始化与基础技术栈

- [ ] 初始化 Next.js + TypeScript 项目。
- [ ] 接入 Tailwind CSS 和 shadcn/ui。
- [ ] 规划前端目录结构：页面、组件、hooks、services、types。
- [ ] 初始化 FastAPI 后端项目。
- [ ] 规划后端目录结构：routes、services、workflows、agents、tools、schemas。
- [ ] 创建 Supabase 项目。
- [ ] 配置 Supabase Auth、Postgres、Storage、pgvector。
- [ ] 配置环境变量管理。
- [ ] 建立前后端 API 调用方式。
- [ ] 准备 mock 数据结构，先服务 UI 骨架。

### P1：高保真 UI 骨架

- [ ] 搭建整体 App Shell 和主导航。
- [ ] 实现收录箱页面布局。
- [ ] 实现快速添加栏。
- [ ] 实现记录列表和状态样式。
- [ ] 实现状态、来源、时间、标签筛选 UI。
- [ ] 实现实时搜索和前端临时 `搜索结果` chip。
- [ ] 实现记录详情抽屉。
- [ ] 实现内化草稿抽屉和 7 字段编辑界面。
- [ ] 实现知识库图谱页面。
- [ ] 使用 React Flow 做 mock 图谱。
- [ ] 实现图谱右侧笔记详情抽屉。
- [ ] 实现 AI 助手页面。
- [ ] 实现笔记追问抽屉。
- [ ] 实现顶部信息 icon、日历和提醒弹窗。
- [ ] 做一轮桌面端视觉打磨，保证第一眼完整、清爽、好用。

### P2：Supabase 数据接入

- [ ] 建立 `records`、`attachments`、`notes`、`note_chunks` 表。
- [ ] 建立 `topics`、`subtopics`、`tags`、`record_tags` 表。
- [ ] 建立 `note_relations`、`conversations`、`messages` 表。
- [ ] 建立 `answer_sources`、`note_writebacks` 表。
- [ ] 建立 `reminder_cards`、`weekly_feedbacks` 表。
- [ ] 建立 `jobs`、`processing_logs`、`prompt_versions`、`evaluation_cases` 表。
- [ ] 配置基础 RLS 策略。
- [ ] 接入 Supabase Auth。
- [ ] 实现 records 增删查改。
- [ ] 实现 tags 增删改查。
- [ ] 实现 attachments 上传到 Supabase Storage。
- [ ] 将收录箱 UI 从 mock 数据切换到真实数据。
- [ ] 将知识图谱 UI 从 mock 数据切换到 topics / subtopics / notes。

### P3：FastAPI 与任务系统

- [ ] 实现 FastAPI 基础服务。
- [ ] 实现用户鉴权中间件，校验 Supabase 用户身份。
- [ ] 实现 records API。
- [ ] 实现 attachments API。
- [ ] 实现 notes API。
- [ ] 实现 graph API。
- [ ] 实现 conversations API。
- [ ] 实现 jobs API。
- [ ] 实现 `jobs` 表驱动的轻量 worker。
- [ ] 实现任务状态流转：pending、running、succeeded、failed、retrying、cancelled。
- [ ] 实现 `processing_logs` 写入。
- [ ] 实现基础失败重试机制。

### P4：内化与知识结构 Agent

- [ ] 实现收录解析 Workflow。
- [ ] 支持文本、链接、图片、PDF、DOCX、MD、TXT 的解析入口。
- [ ] 支持不支持文件的记录保留和失败原因标记。
- [ ] 实现 Prompt Registry。
- [ ] 实现内化 Agent Prompt。
- [ ] 实现一键内化 API。
- [ ] 生成 7 字段内化草稿。
- [ ] 支持用户编辑和确认草稿。
- [ ] 保存 confirmed note。
- [ ] 生成 `note_chunks`。
- [ ] 写入 pgvector 向量。
- [ ] 实现知识结构 Agent Prompt。
- [ ] 实现主题/子主题归类。
- [ ] 实现相关笔记发现。
- [ ] 实现主题合并/拆分建议，但不自动执行。
- [ ] 内化完成后刷新知识图谱。

### P5：RAG 问答与回写

- [ ] 实现 `note_chunks` 关键词检索。
- [ ] 实现 `note_chunks` 向量检索。
- [ ] 实现主题、标签、当前笔记上下文加权。
- [ ] 实现轻量 rerank。
- [ ] 实现证据充分性判断。
- [ ] 实现证据化问答 Prompt。
- [ ] 回答中附来源记录。
- [ ] 保存 conversations 和 messages。
- [ ] 保存 answer_sources。
- [ ] 实现从笔记详情发起追问。
- [ ] 实现“加入笔记”。
- [ ] 保存 note_writebacks。
- [ ] 回写后更新 note_chunks 和向量索引。

### P6：提醒反馈

- [ ] 实现日历“有记录/无记录”判定。
- [ ] 实现今日提醒候选筛选。
- [ ] 生成每日最多 3 条建议处理记录。
- [ ] 生成每条记录的建议动作和理由。
- [ ] 保存 reminder_cards 日快照。
- [ ] 实现周反馈统计。
- [ ] 生成新增记录数、已沉淀数、关注主题 Top3、可复用笔记数、下周补强主题。
- [ ] 保存 weekly_feedbacks 周快照。
- [ ] 实现历史卡片查看。
- [ ] 支持手动重新计算当日/当周卡片。

### P7：评测日志与 V1 收尾

- [ ] 补齐关键 Agent 的 processing_logs。
- [ ] 保存每次 Agent 执行使用的 prompt_versions。
- [ ] 建立第一批 evaluation_cases。
- [ ] 准备解析质量测试样例。
- [ ] 准备内化质量测试样例。
- [ ] 准备归类质量测试样例。
- [ ] 准备问答质量测试样例。
- [ ] 准备回写质量测试样例。
- [ ] 做一轮端到端测试：收录 → 内化 → 图谱 → 问答 → 回写 → 提醒。
- [ ] 修复关键异常状态。
- [ ] 完成 V1 演示数据。
- [ ] 整理 V1 项目说明和演示话术。
