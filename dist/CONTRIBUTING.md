# Contributing

欢迎提交与游戏和具身智能相关的论文、工具与环境。

1. 阅读 [收录标准](docs/collection-policy.md)，确认时间窗口和发表渠道。
2. 在 `data/resources.json` 增加或更新条目；通过标题、DOI、arXiv ID 检查是否重复。
3. 填写官方原文、代码或项目链接、简述、环境、输入与动作、局限和收录理由。
4. 新预印本提供首次提交日期及重要性证据；证据不足请使用 `status: "candidate"`。
5. 不把未运行的实验写成“已复现”，不把 Workshop 写成主会，不提交个人阅读记录、未授权材料或访问凭据。
6. 运行 `npm run build` 和 `npm run check`，一起提交数据与生成的 README / 展示文件。

`year` 表示会议召开年份或期刊发表年份；`publicationNote` 记录与论文集出版年份的差异。`kinds` 支持同一基准同时属于 `papers` 和 `benchmarks`，请勿为两个视图复制同一条记录。

独立基础设施的 `year` 可以为 `null`，避免把核对日期写成项目首次发布年。新增外部链接必须来自确认过的 HTTPS 官方来源。
