# Awesome Game & Embodied Agents

游戏与具身智能研究资源集：从感知、规划和记忆，到游戏动作与机器人控制。

**43 篇精选论文 · 5 个独立开源项目 · 8 个评测／环境 · 8 篇候选**

快照：2026-09-14。具有论文的基准共享同一条记录，视图计数存在重叠；精选资源总数为 52。

本项目基于用户提供的 [Game Agent 知识库](https://dy8q0bnq8y.feishu.cn/wiki/KAI9wbLEniLIIgkHAi6cU48bndd)，参考 [Awesome-Robot-Use-Agent](https://github.com/kairunwen/Awesome-Robot-Use-Agent#projects) 的资源组织方式；具身与部分游戏内容从官方来源补充。

[精选论文](#papers) · [开源项目](#projects) · [评测环境](#benchmarks) · [候选论文](#candidates) · [收录标准](docs/collection-policy.md) · [贡献指南](CONTRIBUTING.md)

## 收录范围

- 正式论文：2021-09-14 至 2026-09-14 的相关顶会顶刊，官方发表记录可追溯。
- 重要 arXiv：首次提交于 2025-09-14 至 2026-09-14，附重要性判断和研究证据，未确认正式接收时明确标注预印本。
- 未充分核对的条目独立列为候选；基础设施按用途收录，不受论文年限限制。
- 不声称穷尽检索、统一排名或已独立复现；元数据核对不等于阅读全文。

## Papers

### Game Agents

| Paper | Venue | Research focus | Sources |
| --- | --- | --- | --- |
| **[DreamerV3](https://www.nature.com/articles/s41586-025-08744-2)**<br>Mastering diverse control tasks through world models | Nature 2025 | 在学习到的世界模型中训练策略，以统一算法配置处理多种控制任务。适合对照游戏与机器人中的模型学习。 | [Paper](https://www.nature.com/articles/s41586-025-08744-2) · [Code](https://github.com/danijar/dreamerv3) |
| **[Voyager](https://openreview.net/forum?id=P8E4Br72j3)**<br>Voyager: An Open-Ended Embodied Agent with Large Language Models | TMLR 2024 | 将自动课程、可复用代码技能库与执行反馈结合，在 Minecraft 中持续探索与积累技能。 | [Paper](https://openreview.net/forum?id=P8E4Br72j3) · [Code](https://github.com/MineDojo/Voyager) · [Project](https://voyager.minedojo.org/) |
| **[Diffusion for Human Behaviour](https://arxiv.org/abs/2301.10677)**<br>Imitating Human Behaviour with Diffusion Models | ICLR 2023 | 用条件扩散模型联合预测鼠标与开火动作，学习人类行为中的多种合理选择。 | [Paper](https://arxiv.org/abs/2301.10677) · [Code](https://github.com/microsoft/Imitating-Human-Behaviour-w-Diffusion) |
| **[SIMA 2](https://arxiv.org/abs/2512.04797)**<br>SIMA 2: A Generalist Embodied Agent for Virtual Worlds | arXiv · 2025.12 | 将 Gemini 的推理与交互能力接入多个三维游戏环境，探索指令跟随、跨环境泛化与自我改进。 | [Paper](https://arxiv.org/abs/2512.04797) · [Project](https://deepmind.google/blog/sima-2-an-agent-that-plays-reasons-and-learns-with-you-in-virtual-3d-worlds/) |
| **[F.A.C.U.L.](https://ojs.aaai.org/index.php/AAAI/article/view/38842)**<br>F.A.C.U.L.: Language-Based Interaction with AI Companions in Gaming | AAAI 2026 | 将玩家的语言指令转成游戏队友的动作程序，结合空间指代、请求分流与行为树执行。 | [Paper](https://ojs.aaai.org/index.php/AAAI/article/view/38842) · [Code](https://github.com/tencent-facul/code) |
| **[GameNGen](https://proceedings.iclr.cc/paper_files/paper/2025/hash/b71ecea210f7159f31e46631fe5c838f-Abstract-Conference.html)**<br>Diffusion Models Are Real-Time Game Engines | ICLR 2025 | 基于历史画面与动作生成可交互的 DOOM 后续画面，探索神经网络作为游戏模拟器的可能性。 | [Paper](https://proceedings.iclr.cc/paper_files/paper/2025/hash/b71ecea210f7159f31e46631fe5c838f-Abstract-Conference.html) · [Project](https://gamengen.github.io/) |
| **[MP5](https://openaccess.thecvf.com/content/CVPR2024/html/Qin_MP5_A_Multi-modal_Open-ended_Embodied_System_in_Minecraft_via_Active_CVPR_2024_paper.html)**<br>MP5: A Multi-modal Open-ended Embodied System in Minecraft via Active Perception | CVPR 2024 | 通过主动感知与规划模块的协作，拆解并执行 Minecraft 中依赖上下文和过程的复杂任务。 | [Paper](https://openaccess.thecvf.com/content/CVPR2024/html/Qin_MP5_A_Multi-modal_Open-ended_Embodied_System_in_Minecraft_via_Active_CVPR_2024_paper.html) · [Project](https://iranqin.github.io/MP5.github.io/) |
| **[COOM](https://proceedings.neurips.cc/paper_files/paper/2023/hash/d61d9f4fe4357296cb658795fd7999f0-Abstract-Datasets_and_Benchmarks.html)**<br>COOM: A Game Benchmark for Continual Reinforcement Learning | NeurIPS 2023 Datasets and Benchmarks | 用顺序到来的视觉域与任务变化评测持续强化学习，同时观察遗忘、前向迁移与新任务学习。 | [Paper](https://proceedings.neurips.cc/paper_files/paper/2023/hash/d61d9f4fe4357296cb658795fd7999f0-Abstract-Datasets_and_Benchmarks.html) · [Code](https://github.com/TTomilin/COOM) |
| **[HASARD](https://proceedings.iclr.cc/paper_files/paper/2025/hash/5ab848771ff8c9c47aac4128e2ef9f4e-Abstract-Conference.html)**<br>HASARD: A Benchmark for Vision-Based Safe Reinforcement Learning in Embodied Agents | ICLR 2025 | 将任务奖励与违规代价分开，评测视觉智能体在危险地形、友军伤害等约束下的决策。 | [Paper](https://proceedings.iclr.cc/paper_files/paper/2025/hash/5ab848771ff8c9c47aac4128e2ef9f4e-Abstract-Conference.html) · [Project](https://sites.google.com/view/hasard-bench/) |
| **[Video PreTraining](https://proceedings.neurips.cc/paper_files/paper/2022/hash/9c7008aff45b5d8f0973b23e1a22ada0-Abstract-Conference.html)**<br>Video PreTraining (VPT): Learning to Act by Watching Unlabeled Online Videos | NeurIPS 2022 | 用少量带动作标签的数据学习逆动力学，再为网络视频补充动作标签，扩展 Minecraft 行为预训练。 | [Paper](https://proceedings.neurips.cc/paper_files/paper/2022/hash/9c7008aff45b5d8f0973b23e1a22ada0-Abstract-Conference.html) |
| **[Principled Video Representations](https://proceedings.iclr.cc/paper_files/paper/2024/hash/eb60f103645fd14c94826665f8505a6d-Abstract-Conference.html)**<br>Towards Principled Representation Learning from Videos for Reinforcement Learning | ICLR 2024 | 研究无动作标签的视频预训练如何影响控制能力，分析表征对动态背景干扰的敏感性。 | [Paper](https://proceedings.iclr.cc/paper_files/paper/2024/hash/eb60f103645fd14c94826665f8505a6d-Abstract-Conference.html) · [Code](https://github.com/microsoft/Intrepid) |
| **[DuRND](https://proceedings.mlr.press/v267/ma25j.html)**<br>Catching Two Birds with One Stone: Reward Shaping with Dual Random Networks for Balancing Exploration and Exploitation | ICML 2025 | 结合新颖性与奖励相关度设计探索奖励，平衡稀疏奖励任务中的探索和利用。 | [Paper](https://proceedings.mlr.press/v267/ma25j.html) · [Code](https://github.com/mahaozhe/DuRND) |
| **[Action-Sufficient Representations](https://proceedings.mlr.press/v162/huang22f.html)**<br>Action-Sufficient State Representation Learning for Control with Structural Constraints | ICML 2022 | 学习保留控制相关因素的紧凑状态表示，并用想象转移辅助策略学习。 | [Paper](https://proceedings.mlr.press/v162/huang22f.html) |
| **[DIAMOND](https://proceedings.neurips.cc/paper_files/paper/2024/hash/6bdde0373d53d4a501249547084bed43-Abstract-Conference.html)**<br>Diffusion for World Modeling: Visual Details Matter in Atari | NeurIPS 2024 | 在扩散世界模型中保留视觉细节并训练控制策略；另提供 CS:GO 交互画面生成扩展。 | [Paper](https://proceedings.neurips.cc/paper_files/paper/2024/hash/6bdde0373d53d4a501249547084bed43-Abstract-Conference.html) · [Code](https://github.com/eloialonso/diamond) |
| **[StateSpaceDiffuser](https://proceedings.nips.cc/paper_files/paper/2025/hash/63943ee9fe347f3d95892cf87d9a42e6-Abstract-Conference.html)**<br>StateSpaceDiffuser: Bringing Long Context to Diffusion World Models | NeurIPS 2025 | 以状态空间序列模型压缩长历史，为扩散世界模型提供记忆，关注回访场景的一致性。 | [Paper](https://proceedings.nips.cc/paper_files/paper/2025/hash/63943ee9fe347f3d95892cf87d9a42e6-Abstract-Conference.html) · [Code](https://github.com/insait-institute/StateSpaceDiffuser) |
| **[EDELINE](https://proceedings.neurips.cc/paper_files/paper/2025/hash/97c903fbf21a7d863af2015d8803ca8f-Abstract-Conference.html)**<br>EDELINE: Enhancing Memory in Diffusion-based World Models via Linear-Time Sequence Modeling | NeurIPS 2025 | 将线性时间序列记忆加入扩散世界模型，统一预测画面、奖励和终止，并在想象轨迹中训练策略。 | [Paper](https://proceedings.neurips.cc/paper_files/paper/2025/hash/97c903fbf21a7d863af2015d8803ca8f-Abstract-Conference.html) · [Code](https://github.com/LJH-coding/EDELINE) |
| **[Contextual Similarity Distillation](https://iclr.cc/virtual/2026/poster/10008663)**<br>Contextual Similarity Distillation: Ensemble Uncertainties with a Single Model | ICLR 2026 Main Conference | 用单个模型近似集成的不确定性，将其作为稀疏视觉导航的探索信号。 | [Paper](https://iclr.cc/virtual/2026/poster/10008663) · [Code](https://github.com/anyboby/contextual-similarity-distillation) |
| **[RATE](https://iclr.cc/virtual/2026/poster/10007816)**<br>Recurrent Action Transformer with Memory | ICLR 2026 Main Conference | 为决策 Transformer 加入跨片段记忆，研究长程任务中线索保留和回报条件动作预测。 | [Paper](https://iclr.cc/virtual/2026/poster/10007816) · [Project](https://sites.google.com/view/rate-model/) |
| **[VisionMask](https://www.ijcai.org/proceedings/2025/74)**<br>Why the Agent Made that Decision: Contrastive Explanation Learning for Reinforcement Learning | IJCAI 2025 | 学习动作之间的对比视觉解释，分析强化学习策略作出某个决策的依据。 | [Paper](https://www.ijcai.org/proceedings/2025/74) |
| **[EVAPS](https://proceedings.neurips.cc/paper_files/paper/2023/hash/0c1e94af650f5c74b1f3da467c2308c2-Abstract-Conference.html)**<br>Enhancing Robot Program Synthesis Through Environmental Context | NeurIPS 2023 | 将程序结构与执行前后的视觉上下文对齐，修复机器人领域语言中的候选程序。 | [Paper](https://proceedings.neurips.cc/paper_files/paper/2023/hash/0c1e94af650f5c74b1f3da467c2308c2-Abstract-Conference.html) |
| **[Just Cluster It](https://proceedings.mlr.press/v235/wagner24a.html)**<br>Just Cluster It: An Approach for Exploration in High-Dimensions using Clustering and Pre-Trained Representations | ICML 2024 | 通过视觉特征聚类近似状态访问计数，构造回合内与跨回合探索奖励。 | [Paper](https://proceedings.mlr.press/v235/wagner24a.html) · [Code](https://github.com/stefanwm13/just-cluster-it-public) |
| **[E3B](https://proceedings.neurips.cc/paper_files/paper/2022/hash/f4f79698d48bdc1a6dec20583724182b-Abstract-Conference.html)**<br>Exploration via Elliptical Episodic Bonuses | NeurIPS 2022 | 用回合内特征覆盖程度构造椭圆探索奖励，并以逆动力学学习可控状态表示。 | [Paper](https://proceedings.neurips.cc/paper_files/paper/2022/hash/f4f79698d48bdc1a6dec20583724182b-Abstract-Conference.html) · [Project](https://e3bagent.github.io/) |
| **[Successor Feature Landmarks](https://proceedings.neurips.cc/paper_files/paper/2021/hash/e27c71957d1e6c223e0d48a165da2ee1-Abstract.html)**<br>Successor Feature Landmarks for Long-Horizon Goal-Conditioned Reinforcement Learning | NeurIPS 2021 | 通过后继特征组织可达地标，由高层图规划与低层目标策略配合处理长程导航。 | [Paper](https://proceedings.neurips.cc/paper_files/paper/2021/hash/e27c71957d1e6c223e0d48a165da2ee1-Abstract.html) · [Code](https://github.com/2016choang/sfl) |
| **[CoSHRL](https://ojs.aaai.org/index.php/AAAI/article/view/30132)**<br>Handling Long and Richly Constrained Tasks through Constrained Hierarchical Reinforcement Learning | AAAI 2024 — Safe, Robust and Responsible AI Track | 组合目标条件技能与受约束路径搜索，在长期任务中权衡到达目标与累计危险成本。 | [Paper](https://ojs.aaai.org/index.php/AAAI/article/view/30132) |
| **[PE-DQN](https://proceedings.iclr.cc/paper_files/paper/2024/hash/cfea00ddf5a5f514bd3368d639d1933d-Abstract-Conference.html)**<br>Diverse Projection Ensembles for Distributional Reinforcement Learning | ICLR 2024 | 集成不同回报分布表示，用模型间分歧估计认知不确定性并驱动探索。 | [Paper](https://proceedings.iclr.cc/paper_files/paper/2024/hash/cfea00ddf5a5f514bd3368d639d1933d-Abstract-Conference.html) |
| **[MOSS](https://proceedings.neurips.cc/paper_files/paper/2022/hash/a7667ee5d545a43d2f0fda98863c260e-Abstract-Conference.html)**<br>A Mixture of Surprises for Unsupervised Reinforcement Learning | NeurIPS 2022 | 混合追求新颖性与降低不可预测性的技能，在无监督预训练后适配下游控制任务。 | [Paper](https://proceedings.neurips.cc/paper_files/paper/2022/hash/a7667ee5d545a43d2f0fda98863c260e-Abstract-Conference.html) · [Code](https://github.com/LeapLabTHU/MOSS) |
| **[DEPS](https://proceedings.neurips.cc/paper_files/paper/2023/hash/6b8dfb8c0c12e6fafc6c256cb08a5ca7-Abstract-Conference.html)**<br>Describe, Explain, Plan and Select: Interactive Planning with LLMs Enables Open-World Multi-Task Agents | NeurIPS 2023 | 将执行描述、失败解释和子目标选择接入语言规划，通过环境反馈修订 Minecraft 长程计划。 | [Paper](https://proceedings.neurips.cc/paper_files/paper/2023/hash/6b8dfb8c0c12e6fafc6c256cb08a5ca7-Abstract-Conference.html) |
| **[STEVE-1](https://proceedings.neurips.cc/paper_files/paper/2023/hash/dd03f856fc7f2efeec8b1c796284561d-Abstract-Conference.html)**<br>STEVE-1: A Generative Model for Text-to-Behavior in Minecraft | NeurIPS 2023 | 在 VPT 行为模型上接入文本和视觉条件，让 Minecraft 智能体执行短程开放指令。 | [Paper](https://proceedings.neurips.cc/paper_files/paper/2023/hash/dd03f856fc7f2efeec8b1c796284561d-Abstract-Conference.html) |

### Embodied Agents

跨域论文在两个方向均显示，但数据中只有一个条目。会议年与论文集出版年不同时，以会议年展示，并在数据的 publicationNote 中注明。

| Paper | Venue | Research focus | Sources |
| --- | --- | --- | --- |
| **[DreamerV3](https://www.nature.com/articles/s41586-025-08744-2)**<br>Mastering diverse control tasks through world models | Nature 2025 | 在学习到的世界模型中训练策略，以统一算法配置处理多种控制任务。适合对照游戏与机器人中的模型学习。 | [Paper](https://www.nature.com/articles/s41586-025-08744-2) · [Code](https://github.com/danijar/dreamerv3) |
| **[OpenVLA](https://proceedings.mlr.press/v270/kim25c.html)**<br>OpenVLA: An Open-Source Vision-Language-Action Model | CoRL 2024 | 将视觉、语言与机器人动作统一建模，开放模型权重和训练工具，支持针对新任务进行高效微调。 | [Paper](https://proceedings.mlr.press/v270/kim25c.html) · [Code](https://github.com/openvla/openvla) · [Project](https://openvla.github.io/) |
| **[Diffusion Policy](https://diffusion-policy.cs.columbia.edu/)**<br>Diffusion Policy: Visuomotor Policy Learning via Action Diffusion | RSS 2023 | 把机器人动作序列建模为条件去噪过程，用视觉观察生成多模态连续动作。 | [Paper](https://diffusion-policy.cs.columbia.edu/) · [Code](https://github.com/real-stanford/diffusion_policy) |
| **[Hi Robot](https://proceedings.mlr.press/v267/shi25d.html)**<br>Hi Robot: Open-Ended Instruction Following with Hierarchical Vision-Language-Action Models | ICML 2025 | 由高层视觉语言模型理解复杂指令与用户反馈，低层视觉语言动作模型执行具体子任务。 | [Paper](https://proceedings.mlr.press/v267/shi25d.html) |
| **[π*0.6 / RECAP](https://arxiv.org/abs/2511.14759)**<br>π*0.6: a VLA That Learns From Experience | arXiv · 2025.11 | 结合示范、自主执行和人类纠正，通过优势条件化的强化学习改进视觉语言动作模型。 | [Paper](https://arxiv.org/abs/2511.14759) · [Project](https://www.pi.website/blog/pistar06) |
| **[ACT / ALOHA](https://roboticsproceedings.org/rss19/p016.html)**<br>Learning Fine-Grained Bimanual Manipulation with Low-Cost Hardware | RSS 2023 | 通过低成本双臂遥操作收集示范，利用 Transformer 预测动作块，学习精细双臂操作。 | [Paper](https://roboticsproceedings.org/rss19/p016.html) · [Project](https://tonyzhaozh.github.io/aloha/) |
| **[LIBERO](https://proceedings.neurips.cc/paper_files/paper/2023/hash/8c3c666820ea055a77726d66fc7d447f-Abstract-Datasets_and_Benchmarks.html)**<br>LIBERO: Benchmarking Knowledge Transfer for Lifelong Robot Learning | NeurIPS 2023 D&B | 通过空间、对象、目标和任务组合的变化评测机器人终身学习与知识迁移。 | [Paper](https://proceedings.neurips.cc/paper_files/paper/2023/hash/8c3c666820ea055a77726d66fc7d447f-Abstract-Datasets_and_Benchmarks.html) · [Code](https://github.com/Lifelong-Robot-Learning/LIBERO) |
| **[EVAPS](https://proceedings.neurips.cc/paper_files/paper/2023/hash/0c1e94af650f5c74b1f3da467c2308c2-Abstract-Conference.html)**<br>Enhancing Robot Program Synthesis Through Environmental Context | NeurIPS 2023 | 将程序结构与执行前后的视觉上下文对齐，修复机器人领域语言中的候选程序。 | [Paper](https://proceedings.neurips.cc/paper_files/paper/2023/hash/0c1e94af650f5c74b1f3da467c2308c2-Abstract-Conference.html) |
| **[Octo](https://www.roboticsproceedings.org/rss20/p090.html)**<br>Octo: An Open-Source Generalist Robot Policy | RSS 2024 | 基于跨机器人示范预训练通用策略，通过语言或目标图像指定任务，并适配新的输入与动作空间。 | [Paper](https://www.roboticsproceedings.org/rss20/p090.html) · [Project](https://octo-models.github.io/) |
| **[RT-2](https://proceedings.mlr.press/v229/zitkovich23a.html)**<br>RT-2: Vision-Language-Action Models Transfer Web Knowledge to Robotic Control | CoRL 2023 | 把机器人动作表示为 token，与视觉语言任务联合训练，研究网络知识向操作任务的迁移。 | [Paper](https://proceedings.mlr.press/v229/zitkovich23a.html) |
| **[VoxPoser](https://proceedings.mlr.press/v229/huang23b.html)**<br>VoxPoser: Composable 3D Value Maps for Robotic Manipulation with Language Models | CoRL 2023 | 用语言模型组合感知结果与三维价值图，为机器人运动规划提供可执行的目标约束。 | [Paper](https://proceedings.mlr.press/v229/huang23b.html) |
| **[ReKep](https://proceedings.mlr.press/v270/huang25g.html)**<br>ReKep: Spatio-Temporal Reasoning of Relational Keypoint Constraints for Robotic Manipulation | CoRL 2024 | 将指令转化为三维关键点间的时空约束，通过优化实现多阶段机器人操作。 | [Paper](https://proceedings.mlr.press/v270/huang25g.html) |
| **[EmbodiedBench](https://proceedings.mlr.press/v267/yang25f.html)**<br>EmbodiedBench: Comprehensive Benchmarking Multi-modal Large Language Models for Vision-Driven Embodied Agents | ICML 2025 | 系统评测多模态语言模型在视觉驱动的具身任务中的决策能力。 | [Paper](https://proceedings.mlr.press/v267/yang25f.html) |
| **[Consistency Policy](https://www.roboticsproceedings.org/rss20/p071.html)**<br>Consistency Policy: Accelerated Visuomotor Policies via Consistency Distillation | RSS 2024 | 从扩散策略中蒸馏更少步数的动作生成，研究计算资源受限时的视觉控制时延。 | [Paper](https://www.roboticsproceedings.org/rss20/p071.html) |
| **[BAKU](https://proceedings.neurips.cc/paper_files/paper/2024/hash/ff887781480973bd3cb6026feb378d1e-Abstract-Conference.html)**<br>BAKU: An Efficient Transformer for Multi-Task Policy Learning | NeurIPS 2024 | 使用 Transformer 学习多任务机器人策略，研究高效架构与动作预测设计。 | [Paper](https://proceedings.neurips.cc/paper_files/paper/2024/hash/ff887781480973bd3cb6026feb378d1e-Abstract-Conference.html) |
| **[VLA-Cache](https://proceedings.neurips.cc/paper_files/paper/2025/hash/f062da1973ac9ac61fc6d44dd7fa309f-Abstract-Conference.html)**<br>VLA-Cache: Efficient Vision-Language-Action Manipulation via Adaptive Token Caching | NeurIPS 2025 | 复用视觉 token 计算以加速视觉语言动作模型，关注推理时延与操作成功率的权衡。 | [Paper](https://proceedings.neurips.cc/paper_files/paper/2025/hash/f062da1973ac9ac61fc6d44dd7fa309f-Abstract-Conference.html) |
| **[RoboChemist](https://proceedings.mlr.press/v305/zhang25i.html)**<br>RoboChemist: Long-Horizon and Safety-Compliant Robotic Chemical Experimentation | CoRL 2025 | 组合高层视觉语言规划与低层动作模型，研究多阶段实验操作中的任务反馈与规程约束。 | [Paper](https://proceedings.mlr.press/v305/zhang25i.html) |

## Projects

独立工具、框架与基础设施。论文配套代码随论文列出。

| Project | Environment / role | Interface | Setup & limits | Official sources |
| --- | --- | --- | --- | --- |
| **LeRobot** | 真实机器人与数据集 | Python Robot 接口、训练与数据工具 | 需按机器人型号安装驱动并完成标定；数据集、模型与代码的许可分别核对。 | [Code](https://github.com/huggingface/lerobot) |
| **OpenPI** | 机器人策略训练与推理 | Python、模型服务与数据配置 | 模型权重和硬件依赖按具体版本准备；不假设所有论文组件都已发布。 | [Code](https://github.com/Physical-Intelligence/openpi) |
| **Gymnasium** | 多类单智能体环境 | Python reset / step API | 接口标准化不会自动对齐各环境的难度、观测权限和奖励。 | [Code](https://github.com/Farama-Foundation/Gymnasium) |
| **PettingZoo** | 合作、对抗与混合任务 | AEC 与 Parallel API | 需注明通信机制、可观测性、对手和团队奖励设置。 | [Code](https://github.com/Farama-Foundation/PettingZoo) |
| **Genesis** | 机器人仿真场景 | 仿真与控制接口 | 仿真物理、硬件和功能支持取决于具体版本；不等同于经过验证的 sim-to-real 迁移。 | [Code](https://github.com/Genesis-Embodied-AI/genesis-world) |

## Benchmarks

同一基准若有正式论文，保留论文与环境两种视图。使用时需记录版本、动作空间、观测权限和任务子集。

| Benchmark / environment | Environment / task | Interface | Evaluation boundary | Sources |
| --- | --- | --- | --- | --- |
| **COOM** | Doom / ViZDoom | ViZDoom 视觉任务序列 → SAC 与持续学习方法；已知任务边界，部分方法使用任务身份。 | 同时看性能、遗忘与前向迁移；已知任务边界/身份不能等同开放任务流，归一化 AP 不是胜率。 依据原有逐篇笔记整理，未独立复现；原笔记的核验声明保留为来源信息。 | [Paper](https://proceedings.neurips.cc/paper_files/paper/2023/hash/d61d9f4fe4357296cb658795fd7999f0-Abstract-Datasets_and_Benchmarks.html) · [Code](https://github.com/TTomilin/COOM) |
| **HASARD** | Doom / ViZDoom | 局部视觉 → 带独立 reward/cost 的约束 PPO 系列；含完整及简化动作配置。 | 期望成本预算不等于逐次零违规；固定惩罚与约束优化不同，比较需固定动作空间、预算和课程资源。 依据原有逐篇笔记整理，未独立复现；原笔记的核验声明保留为来源信息。 | [Paper](https://proceedings.iclr.cc/paper_files/paper/2025/hash/5ab848771ff8c9c47aac4128e2ef9f4e-Abstract-Conference.html) · [Project](https://sites.google.com/view/hasard-bench/) |
| **LIBERO** | 机器人操作仿真 | 语言目标、模拟观测与动作 | 报告时需注明任务套件、示范、任务顺序与评测协议；仿真结果不等于真实部署。 | [Paper](https://proceedings.neurips.cc/paper_files/paper/2023/hash/8c3c666820ea055a77726d66fc7d447f-Abstract-Datasets_and_Benchmarks.html) · [Code](https://github.com/Lifelong-Robot-Learning/LIBERO) |
| **EmbodiedBench** | 多个具身仿真任务与环境 | 视觉观察 → 环境定义的动作 | 任务类型、动作抽象层级和环境设置不同，不能只比较汇总成功率。 | [Paper](https://proceedings.mlr.press/v267/yang25f.html) |
| **ViZDoom** | DOOM | 视觉观察、游戏变量与离散动作 | 需要说明是否读取游戏变量、帧跳与动作集；基础环境不受论文发表年限限制。 | [Code](https://github.com/Farama-Foundation/ViZDoom) |
| **Habitat-Lab** | 三维室内环境 | 传感器观测与任务动作接口 | 场景数据与模拟器需要匹配配置；评测协议随任务不同。 | [Code](https://github.com/facebookresearch/habitat-lab) |
| **AI2-THOR** | 三维室内交互场景 | 视觉观察与环境动作 API | 离散对象交互不等于真实关节级控制；需要明确所用任务定义。 | [Code](https://github.com/allenai/ai2thor) |
| **ManiSkill** | 机器人操作仿真 | 仿真观察、动作与技能任务 | 需说明环境版本、机器人、控制模式与训练数据；仿真吞吐不等于真实控制性能。 | [Code](https://github.com/mani-skill/ManiSkill) |

## Candidates

以下是知识库中的近一年线索，影响力或正式发表证据尚待充分核验，不计入精选。

| Paper | Recorded year | Pending review | Source |
| --- | --- | --- | --- |
| X-Ego: Acquiring Team-Level Tactical Situational Awareness via Cross-Egocentric Contrastive Video Representation Learning | 2025 | 近一年预印本线索；正式接收或影响力依据尚待充分核对 | [Paper](https://arxiv.org/abs/2510.19150) |
| Game-TARS: Pretrained Foundation Models for Scalable Generalist Multimodal Game Agents | 2025 | 近一年预印本线索；正式接收或影响力依据尚待充分核对 | [Paper](https://arxiv.org/abs/2510.23691) |
| GameWAM: A World Action Model for Video Games | 2026 | 近一年预印本线索；正式接收或影响力依据尚待充分核对 | [Paper](https://arxiv.org/abs/2608.26200) |
| See, Symbolize, Act: Grounding VLMs with Spatial Representations for Better Gameplay | 2026 | 近一年预印本线索；正式接收或影响力依据尚待充分核对 | [Paper](https://arxiv.org/abs/2603.11601) |
| Playing DOOM with 1.3M Parameters: Specialized Small Models vs Large Language Models for Real-Time Game Control | 2026 | 近一年预印本线索；正式接收或影响力依据尚待充分核对 | [Paper](https://arxiv.org/abs/2604.07385) |
| Augmenting Human Performance with an XR Agent Learning from Online Behavior and BCI Evidence | 2026 | 近一年预印本线索；正式接收或影响力依据尚待充分核对 | [Paper](https://arxiv.org/abs/2608.30369) |
| Procedural Generation of First Person Shooter Maps using Map-Elites | 2026 | 近一年预印本线索；正式接收或影响力依据尚待充分核对 | [Paper](https://arxiv.org/abs/2605.30570) |
| Account Consistency from Gameplay Traces: Same-Player Verification in Counter-Strike 2 | 2026 | 近一年预印本线索；正式接收或影响力依据尚待充分核对 | [Paper](https://arxiv.org/abs/2608.24893) |

## 来源与筛选记录

本次论文总表读取 106 行，19 行无标题，合并 4 行重复，得到 83 条独立有标题线索。未入选不代表质量判断；具体处理见 [筛选记录](data/selection-audit.json)。

每个条目保留来源、核对日期、环境、接口、比较边界与收录依据；保留的知识库原核验声明不视作本次重新核验。原始导出位于被忽略的本地目录，不包含于发布内容。未同步修改原飞书知识库。

## Website

[展示网站](https://labixiaoq.github.io/Awesome-Game-Embodied-Agents/) · [GitHub 项目](https://github.com/labixiaoQ/Awesome-Game-Embodied-Agents)

展示网站由 GitHub Pages 托管，网页公开访问。

无需第三方前端依赖。Node.js 20+：

```sh
npm run build
npm run check
npm run dev
```

打开终端打印的本地网址。网页支持领域、类型、主题、年份、关键词筛选，以及可分享的 URL 筛选状态。静态 HTML 自带完整精选列表，交互数据加载失败时仍可阅读。

- 内容入口：`data/resources.json`。
- 网站输出：`dist/`，可部署到任意静态托管。
- 生成步骤会同步 README、静态页面和网站数据；不要直接修改生成的列表。
- 网站通过 GitHub Pages 发布。仓库 Settings → Pages 中的发布来源选择 GitHub Actions。
- 更新并推送到 `main` 后自动检查、构建和发布；也可在 Actions → Publish GitHub Pages 中手动运行。
- 新部署状态可在仓库 Actions 查看；复制仓库时请同步修改 `data/resources.json` 中的网站和仓库地址。

## License & attribution

原始网站代码采用 [MIT](LICENSE)。引用论文、第三方代码、模型、数据和知识库内容保留各自权利。此索引不重新授权被引用作品。
