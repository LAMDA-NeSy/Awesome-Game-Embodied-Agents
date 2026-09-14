# Awesome Game & Embodied Agents

A curated collection of research on agents that perceive, plan, and act in games and the physical world.

[**Explore the website ↗**](https://labixiaoq.github.io/Awesome-Game-Embodied-Agents/) · [Articles](#articles) · [Papers](#papers) · [Projects](#projects) · [Datasets](#datasets) · [Benchmarks](#benchmarks) · [Video demos](#video-demos) · [Contributing](CONTRIBUTING.md)

**6 articles · 49 papers · 5 projects · 4 datasets · 8 benchmarks · 8 video demos**

8 candidate papers remain separate from the curated collection.

Snapshot: **2026-09-14**. There are **72 unique curated resources**. Dataset and benchmark papers appear in multiple views, so category counts overlap.

Game agents operate in virtual environments through observations, game APIs, or keyboard and mouse actions. Embodied agents connect perception and planning to simulated or physical robot actions. This collection brings their methods together while documenting the interfaces and evaluation conditions that make comparisons meaningful.

## Contents

- [Getting started](#getting-started)
- [Selection criteria](#selection-criteria)
- [Articles](#articles)
- [Papers](#papers)
  - [Surveys](#surveys)
  - [Game agents](#game-agents)
  - [Embodied agents](#embodied-agents)
- [Projects](#projects)
- [Datasets](#datasets)
- [Benchmarks](#benchmarks)
- [Video demos](#video-demos)
- [Candidates](#candidates)
- [Sources and verification](#sources-and-verification)
- [Website and maintenance](#website-and-maintenance)
- [Acknowledgements](#acknowledgements)

## Getting started

- **Read:** Explore [game-agent papers](#game-agents) on world models, exploration, memory, and control, or [embodied-agent papers](#embodied-agents) on robot policies and planning.
- **Build:** Find [open-source projects](#projects) for data collection, policy training, and environment interfaces.
- **Evaluate:** Choose [benchmarks and environments](#benchmarks), then align observation access, action spaces, training budgets, and evaluation protocols.
- **Contribute:** Follow the [contribution guide](CONTRIBUTING.md) to propose a resource with official sources and a clear inclusion rationale.

## Selection criteria

| Track | Window | Required evidence |
| --- | --- | --- |
| Leading conferences and journals | 2021-09-14 – 2026-09-14 | Relevant main-conference or journal publication, checked against an official record |
| Important recent arXiv research | 2025-09-14 – 2026-09-14 | First submission date, explicit editorial rationale, and supporting research evidence |
| Tools and environments | Reviewed for current research use | Official purpose, interfaces, and setup requirements; no paper-age cutoff |

Priority venues include NeurIPS, ICLR, ICML, CVPR, ICCV, ECCV, AAAI, IJCAI, RSS, CoRL, ICRA, IROS, Nature, Science, T-RO, IJRR, TPAMI, JMLR, and TMLR. This is a subject-specific editorial policy, not a claim that every venue belongs to the same official tier.

Unconfirmed work is listed as a candidate. Preprints are labeled separately from peer-reviewed papers. The collection does not claim exhaustive coverage, a citation ranking, or independent reproduction of the listed experiments. See the [full policy](docs/collection-policy.md).

## Articles

Official author and research-team articles provide context and implementation guidance; they are not counted as peer-reviewed papers.

| Article | Author / team | Date | Research focus |
| --- | --- | --- | --- |
| [Learning to play Minecraft with Video PreTraining](https://openai.com/index/vpt/) | OpenAI | 2022-06-23 | Explains how inverse-dynamics labels turn large video collections into training data for Minecraft behavior. |
| [A generalist AI agent for 3D virtual environments](https://deepmind.google/blog/sima-generalist-ai-agent-for-3d-virtual-environments/) | Google DeepMind | 2024-03-13 | Introduces a language-instructed agent trained across different virtual environments. |
| [SIMA 2: An Agent that Plays, Reasons, and Learns With You in Virtual 3D Worlds](https://deepmind.google/blog/sima-2-an-agent-that-plays-reasons-and-learns-with-you-in-virtual-3d-worlds/) | Google DeepMind · SIMA Team | 2025-11-13 | Describes Gemini-based reasoning, interaction, and generalization in virtual worlds. |
| [π0: Our First Generalist Policy](https://www.pi.website/blog/pi0) | Physical Intelligence | 2024-10-31 | Introduces a vision-language-action policy with flow-matching action outputs and examples of adaptation to robot tasks. |
| [LeRobot v0.6.0: Imagine, Evaluate, Improve](https://huggingface.co/blog/lerobot-release-v060) | Hugging Face · LeRobot team | 2026-07-07 | Documents a robot-learning release connecting policy training, evaluation, reward models, and corrective deployment data. |
| [Robot-use agents](https://web.mit.edu/phillipi/www/writing/robot-use-agents.html) | Phillip Isola · MIT | 2026-09-07 | Explores agents that reason over goals and operate robots through sensor and actuator interfaces. |

## Papers

### Surveys

| Survey | Venue | Research focus | Sources |
| --- | --- | --- | --- |
| **[Foundation models in robotics](https://journals.sagepub.com/doi/10.1177/02783649241281508)**<br>Foundation models in robotics: Applications, challenges, and the future | IJRR 2025 | Reviews how foundation models enter robot perception, planning, and control, with a research agenda spanning data, uncertainty, safety, latency, and reproducibility. | [Paper](https://journals.sagepub.com/doi/10.1177/02783649241281508) |
| **[Foundation models for manipulation](https://journals.sagepub.com/doi/10.1177/02783649251390579)**<br>What foundation models can bring for robot learning in manipulation: A survey | IJRR 2026 | Organizes foundation models into a modular framework for general manipulation and examines the opportunities and limits of each role. | [Paper](https://journals.sagepub.com/doi/10.1177/02783649251390579) |

### Game agents

| Paper | Venue | Research focus | Sources |
| --- | --- | --- | --- |
| **[DreamerV3](https://www.nature.com/articles/s41586-025-08744-2)**<br>Mastering diverse control tasks through world models | Nature 2025 | Trains policies inside a learned world model with a shared algorithm configuration across diverse control tasks, connecting game and robot learning. | [Paper](https://www.nature.com/articles/s41586-025-08744-2) · [Code](https://github.com/danijar/dreamerv3) |
| **[Voyager](https://openreview.net/forum?id=P8E4Br72j3)**<br>Voyager: An Open-Ended Embodied Agent with Large Language Models | TMLR 2024 | Combines an automatic curriculum, reusable code skills, and execution feedback for continuing exploration and skill acquisition in Minecraft. | [Paper](https://openreview.net/forum?id=P8E4Br72j3) · [Code](https://github.com/MineDojo/Voyager) · [Project](https://voyager.minedojo.org/) |
| **[Diffusion for Human Behaviour](https://arxiv.org/abs/2301.10677)**<br>Imitating Human Behaviour with Diffusion Models | ICLR 2023 | Uses conditional diffusion to jointly predict mouse movement and firing, capturing multiple plausible choices in human behavior. | [Paper](https://arxiv.org/abs/2301.10677) · [Code](https://github.com/microsoft/Imitating-Human-Behaviour-w-Diffusion) |
| **[SIMA 2](https://arxiv.org/abs/2512.04797)**<br>SIMA 2: A Generalist Embodied Agent for Virtual Worlds | arXiv · 2025.12 | Connects Gemini reasoning and interaction to multiple 3D games, studying instruction following, cross-environment generalization, and self-improvement. | [Paper](https://arxiv.org/abs/2512.04797) · [Project](https://deepmind.google/blog/sima-2-an-agent-that-plays-reasons-and-learns-with-you-in-virtual-3d-worlds/) |
| **[F.A.C.U.L.](https://ojs.aaai.org/index.php/AAAI/article/view/38842)**<br>F.A.C.U.L.: Language-Based Interaction with AI Companions in Gaming | AAAI 2026 | Turns player language into action programs for game companions through spatial grounding, intent routing, and behavior-tree execution. | [Paper](https://ojs.aaai.org/index.php/AAAI/article/view/38842) · [Code](https://github.com/tencent-facul/code) |
| **[GameNGen](https://proceedings.iclr.cc/paper_files/paper/2025/hash/b71ecea210f7159f31e46631fe5c838f-Abstract-Conference.html)**<br>Diffusion Models Are Real-Time Game Engines | ICLR 2025 | Generates interactive DOOM frames conditioned on past images and player actions, exploring neural networks as game simulators. | [Paper](https://proceedings.iclr.cc/paper_files/paper/2025/hash/b71ecea210f7159f31e46631fe5c838f-Abstract-Conference.html) · [Project](https://gamengen.github.io/) |
| **[MP5](https://openaccess.thecvf.com/content/CVPR2024/html/Qin_MP5_A_Multi-modal_Open-ended_Embodied_System_in_Minecraft_via_Active_CVPR_2024_paper.html)**<br>MP5: A Multi-modal Open-ended Embodied System in Minecraft via Active Perception | CVPR 2024 | Combines active perception and modular planning to decompose and execute Minecraft tasks with contextual and procedural dependencies. | [Paper](https://openaccess.thecvf.com/content/CVPR2024/html/Qin_MP5_A_Multi-modal_Open-ended_Embodied_System_in_Minecraft_via_Active_CVPR_2024_paper.html) · [Project](https://iranqin.github.io/MP5.github.io/) |
| **[Video PreTraining](https://proceedings.neurips.cc/paper_files/paper/2022/hash/9c7008aff45b5d8f0973b23e1a22ada0-Abstract-Conference.html)**<br>Video PreTraining (VPT): Learning to Act by Watching Unlabeled Online Videos | NeurIPS 2022 | Learns inverse dynamics from a small action-labeled dataset, then annotates internet videos to scale Minecraft behavioral pretraining. | [Paper](https://proceedings.neurips.cc/paper_files/paper/2022/hash/9c7008aff45b5d8f0973b23e1a22ada0-Abstract-Conference.html) |
| **[Principled Video Representations](https://proceedings.iclr.cc/paper_files/paper/2024/hash/eb60f103645fd14c94826665f8505a6d-Abstract-Conference.html)**<br>Towards Principled Representation Learning from Videos for Reinforcement Learning | ICLR 2024 | Studies how video pretraining without action labels affects control, including sensitivity to distracting visual dynamics. | [Paper](https://proceedings.iclr.cc/paper_files/paper/2024/hash/eb60f103645fd14c94826665f8505a6d-Abstract-Conference.html) · [Code](https://github.com/microsoft/Intrepid) |
| **[DuRND](https://proceedings.mlr.press/v267/ma25j.html)**<br>Catching Two Birds with One Stone: Reward Shaping with Dual Random Networks for Balancing Exploration and Exploitation | ICML 2025 | Combines novelty and reward relevance to balance exploration and exploitation in sparse-reward tasks. | [Paper](https://proceedings.mlr.press/v267/ma25j.html) · [Code](https://github.com/mahaozhe/DuRND) |
| **[Action-Sufficient Representations](https://proceedings.mlr.press/v162/huang22f.html)**<br>Action-Sufficient State Representation Learning for Control with Structural Constraints | ICML 2022 | Learns compact state representations that retain control-relevant factors and uses imagined transitions to support policy learning. | [Paper](https://proceedings.mlr.press/v162/huang22f.html) |
| **[DIAMOND](https://proceedings.neurips.cc/paper_files/paper/2024/hash/6bdde0373d53d4a501249547084bed43-Abstract-Conference.html)**<br>Diffusion for World Modeling: Visual Details Matter in Atari | NeurIPS 2024 | Preserves visual detail in diffusion world models for policy learning in Atari, with a separate interactive CS:GO frame-generation extension. | [Paper](https://proceedings.neurips.cc/paper_files/paper/2024/hash/6bdde0373d53d4a501249547084bed43-Abstract-Conference.html) · [Code](https://github.com/eloialonso/diamond) |
| **[StateSpaceDiffuser](https://proceedings.nips.cc/paper_files/paper/2025/hash/63943ee9fe347f3d95892cf87d9a42e6-Abstract-Conference.html)**<br>StateSpaceDiffuser: Bringing Long Context to Diffusion World Models | NeurIPS 2025 | Compresses long histories with a state-space sequence model to give diffusion world models memory when revisiting scenes. | [Paper](https://proceedings.nips.cc/paper_files/paper/2025/hash/63943ee9fe347f3d95892cf87d9a42e6-Abstract-Conference.html) · [Code](https://github.com/insait-institute/StateSpaceDiffuser) |
| **[EDELINE](https://proceedings.neurips.cc/paper_files/paper/2025/hash/97c903fbf21a7d863af2015d8803ca8f-Abstract-Conference.html)**<br>EDELINE: Enhancing Memory in Diffusion-based World Models via Linear-Time Sequence Modeling | NeurIPS 2025 | Adds linear-time sequence memory to a diffusion world model, predicting images, rewards, and termination for policy learning in imagined trajectories. | [Paper](https://proceedings.neurips.cc/paper_files/paper/2025/hash/97c903fbf21a7d863af2015d8803ca8f-Abstract-Conference.html) · [Code](https://github.com/LJH-coding/EDELINE) |
| **[Contextual Similarity Distillation](https://iclr.cc/virtual/2026/poster/10008663)**<br>Contextual Similarity Distillation: Ensemble Uncertainties with a Single Model | ICLR 2026 Main Conference | Approximates ensemble uncertainty with a single model and uses it as an exploration signal for sparse visual navigation. | [Paper](https://iclr.cc/virtual/2026/poster/10008663) · [Code](https://github.com/anyboby/contextual-similarity-distillation) |
| **[RATE](https://iclr.cc/virtual/2026/poster/10007816)**<br>Recurrent Action Transformer with Memory | ICLR 2026 Main Conference | Adds memory across segments to a decision transformer for retaining clues and predicting return-conditioned actions in long-horizon tasks. | [Paper](https://iclr.cc/virtual/2026/poster/10007816) · [Project](https://sites.google.com/view/rate-model/) |
| **[VisionMask](https://www.ijcai.org/proceedings/2025/74)**<br>Why the Agent Made that Decision: Contrastive Explanation Learning for Reinforcement Learning | IJCAI 2025 | Learns contrastive visual explanations between actions to inspect why a reinforcement-learning policy makes a decision. | [Paper](https://www.ijcai.org/proceedings/2025/74) |
| **[EVAPS](https://proceedings.neurips.cc/paper_files/paper/2023/hash/0c1e94af650f5c74b1f3da467c2308c2-Abstract-Conference.html)**<br>Enhancing Robot Program Synthesis Through Environmental Context | NeurIPS 2023 | Aligns program structure with visual context before and after execution to repair candidate programs in a robot domain-specific language. | [Paper](https://proceedings.neurips.cc/paper_files/paper/2023/hash/0c1e94af650f5c74b1f3da467c2308c2-Abstract-Conference.html) |
| **[Just Cluster It](https://proceedings.mlr.press/v235/wagner24a.html)**<br>Just Cluster It: An Approach for Exploration in High-Dimensions using Clustering and Pre-Trained Representations | ICML 2024 | Approximates state visitation counts by clustering visual representations, providing exploration bonuses within and across episodes. | [Paper](https://proceedings.mlr.press/v235/wagner24a.html) · [Code](https://github.com/stefanwm13/just-cluster-it-public) |
| **[E3B](https://proceedings.neurips.cc/paper_files/paper/2022/hash/f4f79698d48bdc1a6dec20583724182b-Abstract-Conference.html)**<br>Exploration via Elliptical Episodic Bonuses | NeurIPS 2022 | Constructs elliptical episodic exploration bonuses from feature coverage, using inverse dynamics to learn controllable state representations. | [Paper](https://proceedings.neurips.cc/paper_files/paper/2022/hash/f4f79698d48bdc1a6dec20583724182b-Abstract-Conference.html) · [Project](https://e3bagent.github.io/) |
| **[Successor Feature Landmarks](https://proceedings.neurips.cc/paper_files/paper/2021/hash/e27c71957d1e6c223e0d48a165da2ee1-Abstract.html)**<br>Successor Feature Landmarks for Long-Horizon Goal-Conditioned Reinforcement Learning | NeurIPS 2021 | Organizes reachable landmarks with successor features, combining graph planning and low-level goal policies for long-horizon navigation. | [Paper](https://proceedings.neurips.cc/paper_files/paper/2021/hash/e27c71957d1e6c223e0d48a165da2ee1-Abstract.html) · [Code](https://github.com/2016choang/sfl) |
| **[CoSHRL](https://ojs.aaai.org/index.php/AAAI/article/view/30132)**<br>Handling Long and Richly Constrained Tasks through Constrained Hierarchical Reinforcement Learning | AAAI 2024 — Safe, Robust and Responsible AI Track | Combines goal-conditioned skills and constrained path search to balance goal reaching against accumulated hazard costs over long tasks. | [Paper](https://ojs.aaai.org/index.php/AAAI/article/view/30132) |
| **[PE-DQN](https://proceedings.iclr.cc/paper_files/paper/2024/hash/cfea00ddf5a5f514bd3368d639d1933d-Abstract-Conference.html)**<br>Diverse Projection Ensembles for Distributional Reinforcement Learning | ICLR 2024 | Ensembles different return-distribution representations and uses disagreement to estimate epistemic uncertainty for exploration. | [Paper](https://proceedings.iclr.cc/paper_files/paper/2024/hash/cfea00ddf5a5f514bd3368d639d1933d-Abstract-Conference.html) |
| **[MOSS](https://proceedings.neurips.cc/paper_files/paper/2022/hash/a7667ee5d545a43d2f0fda98863c260e-Abstract-Conference.html)**<br>A Mixture of Surprises for Unsupervised Reinforcement Learning | NeurIPS 2022 | Mixes novelty-seeking and unpredictability-reducing skills during unsupervised pretraining, then adapts to downstream control tasks. | [Paper](https://proceedings.neurips.cc/paper_files/paper/2022/hash/a7667ee5d545a43d2f0fda98863c260e-Abstract-Conference.html) · [Code](https://github.com/LeapLabTHU/MOSS) |
| **[DEPS](https://proceedings.neurips.cc/paper_files/paper/2023/hash/6b8dfb8c0c12e6fafc6c256cb08a5ca7-Abstract-Conference.html)**<br>Describe, Explain, Plan and Select: Interactive Planning with LLMs Enables Open-World Multi-Task Agents | NeurIPS 2023 | Connects execution descriptions, failure explanations, and subgoal selection to language planning, revising long-horizon Minecraft plans with feedback. | [Paper](https://proceedings.neurips.cc/paper_files/paper/2023/hash/6b8dfb8c0c12e6fafc6c256cb08a5ca7-Abstract-Conference.html) |
| **[STEVE-1](https://proceedings.neurips.cc/paper_files/paper/2023/hash/dd03f856fc7f2efeec8b1c796284561d-Abstract-Conference.html)**<br>STEVE-1: A Generative Model for Text-to-Behavior in Minecraft | NeurIPS 2023 | Conditions a VPT behavior model on text and visual goals to follow short-horizon, open-ended instructions in Minecraft. | [Paper](https://proceedings.neurips.cc/paper_files/paper/2023/hash/dd03f856fc7f2efeec8b1c796284561d-Abstract-Conference.html) |

### Embodied agents

Cross-domain papers appear in both sections but have a single catalogue record. Where conference and proceedings years differ, the conference year is displayed and the distinction is recorded in `publicationNote`.

| Paper | Venue | Research focus | Sources |
| --- | --- | --- | --- |
| **[DreamerV3](https://www.nature.com/articles/s41586-025-08744-2)**<br>Mastering diverse control tasks through world models | Nature 2025 | Trains policies inside a learned world model with a shared algorithm configuration across diverse control tasks, connecting game and robot learning. | [Paper](https://www.nature.com/articles/s41586-025-08744-2) · [Code](https://github.com/danijar/dreamerv3) |
| **[OpenVLA](https://proceedings.mlr.press/v270/kim25c.html)**<br>OpenVLA: An Open-Source Vision-Language-Action Model | CoRL 2024 | Unifies vision, language, and robot actions in an open model, with released weights and training tools for adaptation to new tasks. | [Paper](https://proceedings.mlr.press/v270/kim25c.html) · [Code](https://github.com/openvla/openvla) · [Project](https://openvla.github.io/) |
| **[Diffusion Policy](https://diffusion-policy.cs.columbia.edu/)**<br>Diffusion Policy: Visuomotor Policy Learning via Action Diffusion | RSS 2023 | Models robot action sequences as conditional denoising, generating multimodal continuous actions from visual observations. | [Paper](https://diffusion-policy.cs.columbia.edu/) · [Code](https://github.com/real-stanford/diffusion_policy) |
| **[Hi Robot](https://proceedings.mlr.press/v267/shi25d.html)**<br>Hi Robot: Open-Ended Instruction Following with Hierarchical Vision-Language-Action Models | ICML 2025 | Uses a high-level vision-language model to interpret complex instructions and feedback, while a low-level vision-language-action model executes subtasks. | [Paper](https://proceedings.mlr.press/v267/shi25d.html) |
| **[π*0.6 / RECAP](https://arxiv.org/abs/2511.14759)**<br>π*0.6: a VLA That Learns From Experience | arXiv · 2025.11 | Combines demonstrations, autonomous execution, and human corrections to improve vision-language-action models through advantage-conditioned reinforcement learning. | [Paper](https://arxiv.org/abs/2511.14759) · [Project](https://www.pi.website/blog/pistar06) |
| **[ACT / ALOHA](https://roboticsproceedings.org/rss19/p016.html)**<br>Learning Fine-Grained Bimanual Manipulation with Low-Cost Hardware | RSS 2023 | Learns fine bimanual manipulation from low-cost teleoperation demonstrations by predicting action chunks with a transformer. | [Paper](https://roboticsproceedings.org/rss19/p016.html) · [Project](https://tonyzhaozh.github.io/aloha/) |
| **[EVAPS](https://proceedings.neurips.cc/paper_files/paper/2023/hash/0c1e94af650f5c74b1f3da467c2308c2-Abstract-Conference.html)**<br>Enhancing Robot Program Synthesis Through Environmental Context | NeurIPS 2023 | Aligns program structure with visual context before and after execution to repair candidate programs in a robot domain-specific language. | [Paper](https://proceedings.neurips.cc/paper_files/paper/2023/hash/0c1e94af650f5c74b1f3da467c2308c2-Abstract-Conference.html) |
| **[Octo](https://www.roboticsproceedings.org/rss20/p090.html)**<br>Octo: An Open-Source Generalist Robot Policy | RSS 2024 | Pretrains a generalist policy on demonstrations from multiple robots, with language or goal-image conditioning and adaptation to new inputs and action spaces. | [Paper](https://www.roboticsproceedings.org/rss20/p090.html) · [Project](https://octo-models.github.io/) |
| **[RT-2](https://proceedings.mlr.press/v229/zitkovich23a.html)**<br>RT-2: Vision-Language-Action Models Transfer Web Knowledge to Robotic Control | CoRL 2023 | Represents robot actions as tokens and co-trains them with vision-language tasks to study transfer of web knowledge into manipulation. | [Paper](https://proceedings.mlr.press/v229/zitkovich23a.html) |
| **[VoxPoser](https://proceedings.mlr.press/v229/huang23b.html)**<br>VoxPoser: Composable 3D Value Maps for Robotic Manipulation with Language Models | CoRL 2023 | Uses language models to compose perception outputs and 3D value maps into objectives and constraints for robot motion planning. | [Paper](https://proceedings.mlr.press/v229/huang23b.html) |
| **[ReKep](https://proceedings.mlr.press/v270/huang25g.html)**<br>ReKep: Spatio-Temporal Reasoning of Relational Keypoint Constraints for Robotic Manipulation | CoRL 2024 | Translates instructions into spatial and temporal constraints between 3D keypoints for optimization-based, multi-stage robot manipulation. | [Paper](https://proceedings.mlr.press/v270/huang25g.html) |
| **[Consistency Policy](https://www.roboticsproceedings.org/rss20/p071.html)**<br>Consistency Policy: Accelerated Visuomotor Policies via Consistency Distillation | RSS 2024 | Distills diffusion policies into fewer action-generation steps to study visual-control latency under limited compute. | [Paper](https://www.roboticsproceedings.org/rss20/p071.html) |
| **[BAKU](https://proceedings.neurips.cc/paper_files/paper/2024/hash/ff887781480973bd3cb6026feb378d1e-Abstract-Conference.html)**<br>BAKU: An Efficient Transformer for Multi-Task Policy Learning | NeurIPS 2024 | Uses transformers for multitask robot policies, studying efficient architectures and action-prediction designs. | [Paper](https://proceedings.neurips.cc/paper_files/paper/2024/hash/ff887781480973bd3cb6026feb378d1e-Abstract-Conference.html) |
| **[VLA-Cache](https://proceedings.neurips.cc/paper_files/paper/2025/hash/f062da1973ac9ac61fc6d44dd7fa309f-Abstract-Conference.html)**<br>VLA-Cache: Efficient Vision-Language-Action Manipulation via Adaptive Token Caching | NeurIPS 2025 | Reuses visual-token computation to accelerate vision-language-action models, examining the tradeoff between latency and manipulation success. | [Paper](https://proceedings.neurips.cc/paper_files/paper/2025/hash/f062da1973ac9ac61fc6d44dd7fa309f-Abstract-Conference.html) |
| **[RoboChemist](https://proceedings.mlr.press/v305/zhang25i.html)**<br>RoboChemist: Long-Horizon and Safety-Compliant Robotic Chemical Experimentation | CoRL 2025 | Combines high-level vision-language planning and low-level action models for multi-stage laboratory tasks, with feedback and procedural constraints. | [Paper](https://proceedings.mlr.press/v305/zhang25i.html) |

### Dataset papers

| Paper | Venue | Research focus | Sources |
| --- | --- | --- | --- |
| **[MineDojo](https://proceedings.neurips.cc/paper_files/paper/2022/hash/74a67268c5cc5910f64938cac4526a90-Abstract.html)**<br>MineDojo: Building Open-Ended Embodied Agents with Internet-Scale Knowledge | NeurIPS 2022 D&B | Combines Minecraft tasks with a multimodal knowledge collection of videos, tutorials, wiki pages, and discussions for open-ended agent learning. | [Paper](https://proceedings.neurips.cc/paper_files/paper/2022/hash/74a67268c5cc5910f64938cac4526a90-Abstract.html) · [Code](https://github.com/MineDojo/MineDojo) · [Data](https://minedojo.org/) |
| **[Open X-Embodiment](https://doi.org/10.1109/ICRA57147.2024.10611477)**<br>Open X-Embodiment: Robotic Learning Datasets and RT-X Models | ICRA 2024 | Brings together diverse robot trajectories in shared formats to study cross-robot transfer and generalist policies. | [Paper](https://doi.org/10.1109/ICRA57147.2024.10611477) · [Code](https://github.com/google-deepmind/open_x_embodiment) · [Data](https://robotics-transformer-x.github.io/) |
| **[BridgeData V2](https://proceedings.mlr.press/v229/walke23a.html)**<br>BridgeData V2: A Dataset for Robot Learning at Scale | CoRL 2023 | Provides diverse low-cost robot manipulation trajectories across multiple environments for scalable imitation learning and offline reinforcement learning. | [Paper](https://proceedings.mlr.press/v229/walke23a.html) · [Data](https://rail-berkeley.github.io/bridgedata/) |
| **[DROID](https://www.roboticsproceedings.org/rss20/p120.html)**<br>DROID: A Large-Scale In-The-Wild Robot Manipulation Dataset | RSS 2024 | Collects manipulation demonstrations across many scenes and institutions to study learning from diverse real-world experience. | [Paper](https://www.roboticsproceedings.org/rss20/p120.html) · [Data](https://droid-dataset.github.io/) |

### Benchmark papers

| Paper | Venue | Research focus | Sources |
| --- | --- | --- | --- |
| **[COOM](https://proceedings.neurips.cc/paper_files/paper/2023/hash/d61d9f4fe4357296cb658795fd7999f0-Abstract-Datasets_and_Benchmarks.html)**<br>COOM: A Game Benchmark for Continual Reinforcement Learning | NeurIPS 2023 Datasets and Benchmarks | Evaluates continual reinforcement learning under sequential visual and task shifts, tracking forgetting, forward transfer, and new-task learning. | [Paper](https://proceedings.neurips.cc/paper_files/paper/2023/hash/d61d9f4fe4357296cb658795fd7999f0-Abstract-Datasets_and_Benchmarks.html) · [Code](https://github.com/TTomilin/COOM) |
| **[HASARD](https://proceedings.iclr.cc/paper_files/paper/2025/hash/5ab848771ff8c9c47aac4128e2ef9f4e-Abstract-Conference.html)**<br>HASARD: A Benchmark for Vision-Based Safe Reinforcement Learning in Embodied Agents | ICLR 2025 | Separates task rewards from violation costs to evaluate visual agents under hazards such as dangerous terrain and friendly fire. | [Paper](https://proceedings.iclr.cc/paper_files/paper/2025/hash/5ab848771ff8c9c47aac4128e2ef9f4e-Abstract-Conference.html) · [Project](https://sites.google.com/view/hasard-bench/) |
| **[LIBERO](https://proceedings.neurips.cc/paper_files/paper/2023/hash/8c3c666820ea055a77726d66fc7d447f-Abstract-Datasets_and_Benchmarks.html)**<br>LIBERO: Benchmarking Knowledge Transfer for Lifelong Robot Learning | NeurIPS 2023 D&B | Evaluates lifelong robot learning and knowledge transfer across changes in spatial relations, objects, goals, and task combinations. | [Paper](https://proceedings.neurips.cc/paper_files/paper/2023/hash/8c3c666820ea055a77726d66fc7d447f-Abstract-Datasets_and_Benchmarks.html) · [Code](https://github.com/Lifelong-Robot-Learning/LIBERO) |
| **[EmbodiedBench](https://proceedings.mlr.press/v267/yang25f.html)**<br>EmbodiedBench: Comprehensive Benchmarking Multi-modal Large Language Models for Vision-Driven Embodied Agents | ICML 2025 | Systematically evaluates multimodal language models on decision-making in visually grounded embodied tasks. | [Paper](https://proceedings.mlr.press/v267/yang25f.html) |

## Projects

Standalone tools, frameworks, and research infrastructure. Code accompanying a paper is linked from its paper entry.

| Project | Environment / role | Interface | Setup and limitations | Official sources |
| --- | --- | --- | --- | --- |
| **LeRobot** | Real robots and robot-learning datasets. | Python robot interfaces, training utilities, and data tools. | Install model-specific drivers and calibrate the hardware. Check dataset, model, and code licenses separately. | [Code](https://github.com/huggingface/lerobot) |
| **OpenPI** | Robot policy training and inference. | Python, model serving, and dataset configuration. | Prepare model weights and hardware dependencies for the chosen release. Do not assume every component of a related paper has been released. | [Code](https://github.com/Physical-Intelligence/openpi) |
| **Gymnasium** | Diverse single-agent environments. | Python reset / step API. | A standardized interface does not automatically align task difficulty, observation access, or rewards across environments. | [Code](https://github.com/Farama-Foundation/Gymnasium) |
| **PettingZoo** | Cooperative, competitive, and mixed tasks. | AEC and Parallel APIs. | Specify communication mechanisms, observability, opponents, and team-reward settings. | [Code](https://github.com/Farama-Foundation/PettingZoo) |
| **Genesis** | Robot simulation scenes. | Simulation and control interfaces. | Physics, hardware compatibility, and feature support depend on the release. Simulation does not establish validated sim-to-real transfer. | [Code](https://github.com/Genesis-Embodied-AI/genesis-world) |

## Datasets

These four datasets share records with their peer-reviewed papers. Follow the official data links for downloads, documentation, and license terms.

| Dataset | Domain | Contents | Sources |
| --- | --- | --- | --- |
| **MineDojo** | game | Combines Minecraft tasks with a multimodal knowledge collection of videos, tutorials, wiki pages, and discussions for open-ended agent learning. | [Paper](https://proceedings.neurips.cc/paper_files/paper/2022/hash/74a67268c5cc5910f64938cac4526a90-Abstract.html) · [Code](https://github.com/MineDojo/MineDojo) · [Data](https://minedojo.org/) |
| **Open X-Embodiment** | embodied | Brings together diverse robot trajectories in shared formats to study cross-robot transfer and generalist policies. | [Paper](https://doi.org/10.1109/ICRA57147.2024.10611477) · [Code](https://github.com/google-deepmind/open_x_embodiment) · [Data](https://robotics-transformer-x.github.io/) |
| **BridgeData V2** | embodied | Provides diverse low-cost robot manipulation trajectories across multiple environments for scalable imitation learning and offline reinforcement learning. | [Paper](https://proceedings.mlr.press/v229/walke23a.html) · [Data](https://rail-berkeley.github.io/bridgedata/) |
| **DROID** | embodied | Collects manipulation demonstrations across many scenes and institutions to study learning from diverse real-world experience. | [Paper](https://www.roboticsproceedings.org/rss20/p120.html) · [Data](https://droid-dataset.github.io/) |

## Benchmarks

Benchmark papers share a record with their environment listing. Report the environment version, action space, observation access, and task subset when using them.

| Benchmark / environment | Environment / task | Interface | Evaluation boundary | Sources |
| --- | --- | --- | --- | --- |
| **COOM** | Doom / ViZDoom. | Sequences of visual ViZDoom tasks are evaluated with SAC and continual-learning methods. Task boundaries are known; some methods use task identity. | Compare performance, forgetting, and forward transfer together. Known task boundaries or identities differ from an open task stream; normalized average performance is not a win rate. Compiled from existing paper notes; not independently reproduced. Original review claims are retained as source information. | [Paper](https://proceedings.neurips.cc/paper_files/paper/2023/hash/d61d9f4fe4357296cb658795fd7999f0-Abstract-Datasets_and_Benchmarks.html) · [Code](https://github.com/TTomilin/COOM) |
| **HASARD** | Doom / ViZDoom. | Partial visual observations feed constrained PPO variants with separate rewards and costs, using full or simplified action configurations. | An expected-cost budget does not guarantee zero violations in every trial. Fixed penalties differ from constrained optimization; action spaces, budgets, and curriculum resources must be aligned. Compiled from existing paper notes; not independently reproduced. Original review claims are retained as source information. | [Paper](https://proceedings.iclr.cc/paper_files/paper/2025/hash/5ab848771ff8c9c47aac4128e2ef9f4e-Abstract-Conference.html) · [Project](https://sites.google.com/view/hasard-bench/) |
| **LIBERO** | Simulated robot manipulation. | Language goals with simulated observations and actions. | Specify the task suite, demonstrations, task order, and evaluation protocol. Simulation results do not establish real-world deployment performance. | [Paper](https://proceedings.neurips.cc/paper_files/paper/2023/hash/8c3c666820ea055a77726d66fc7d447f-Abstract-Datasets_and_Benchmarks.html) · [Code](https://github.com/Lifelong-Robot-Learning/LIBERO) |
| **EmbodiedBench** | Multiple embodied simulation tasks and environments. | Visual observations map to environment-defined actions. | Task types, action abstraction, and environment settings differ; aggregate success rates alone do not support direct comparisons. | [Paper](https://proceedings.mlr.press/v267/yang25f.html) |
| **ViZDoom** | DOOM. | Visual observations, game variables, and discrete actions. | Specify access to game variables, frame skipping, and the action set. The underlying environment is not subject to the paper publication window. | [Code](https://github.com/Farama-Foundation/ViZDoom) |
| **Habitat-Lab** | 3D indoor environments. | Sensor observations and task-action interfaces. | Scene datasets and the simulator must be configured together. Evaluation protocols depend on the task. | [Code](https://github.com/facebookresearch/habitat-lab) |
| **AI2-THOR** | Interactive 3D indoor scenes. | Visual observations and environment action APIs. | Discrete object interaction differs from real joint-level control. State the exact task definition. | [Code](https://github.com/allenai/ai2thor) |
| **ManiSkill** | Simulated robot manipulation. | Simulated observations, actions, and skill tasks. | Specify the environment version, robot, control mode, and training data. Simulation throughput is not real-world control performance. | [Code](https://github.com/mani-skill/ManiSkill) |

## Video demos

[**Watch the playable video gallery**](https://labixiaoq.github.io/Awesome-Game-Embodied-Agents/#demos). Videos are embedded from original project hosts; no third-party video is copied into this repository. Games, generated worlds, real robots, and simulation have separate filters. The year identifies the source project release, not the exact recording date. Clips are qualitative author-reported evidence, not independently measured success rates.

| Demo | Setting | Credit | Watch / source | Related work |
| --- | --- | --- | --- | --- |
| **Voyager · Minecraft mining** | game-control | Voyager research team | [Project](https://voyager.minedojo.org/) · [Video](https://voyager.minedojo.org/assets/videos/gallery/diamond.mp4) · [Code](https://github.com/MineDojo/Voyager) | [Voyager](https://openreview.net/forum?id=P8E4Br72j3) |
| **Voyager · Collecting cactus** | game-control | Voyager research team | [Project](https://voyager.minedojo.org/) · [Video](https://voyager.minedojo.org/assets/videos/gallery/cactus.mp4) · [Code](https://github.com/MineDojo/Voyager) | [Voyager](https://openreview.net/forum?id=P8E4Br72j3) |
| **GameNGen · Neural DOOM** | generated-world | GameNGen research team | [Project](https://gamengen.github.io/) · [Video](https://gamengen.github.io/static/videos/e1m1_t.mp4) | [GameNGen](https://proceedings.iclr.cc/paper_files/paper/2025/hash/b71ecea210f7159f31e46631fe5c838f-Abstract-Conference.html) |
| **DIAMOND · Generated CS:GO** | generated-world | DIAMOND research team | [Project](https://diamond-wm.github.io/) · [Video](https://diamond-wm.github.io/static/videos/8.mp4) · [Code](https://github.com/eloialonso/diamond) | [DIAMOND](https://proceedings.neurips.cc/paper_files/paper/2024/hash/6bdde0373d53d4a501249547084bed43-Abstract-Conference.html) |
| **OpenVLA · Manipulation in clutter** | real-robot | OpenVLA research team | [Project](https://openvla.github.io/) · [Video](https://openvla.github.io/static/videos/carousel/bridge_pick_clutter_2.mp4) · [Code](https://github.com/openvla/openvla) | [OpenVLA](https://proceedings.mlr.press/v270/kim25c.html) |
| **ACT / ALOHA · Slotting a battery** | real-robot | Tony Zhao and the ALOHA / ACT team | [Project](https://tonyzhaozh.github.io/aloha/) · [Video](https://tonyzhaozh.github.io/aloha/resources/slot_battery.mp4) | [ACT / ALOHA](https://roboticsproceedings.org/rss19/p016.html) |
| **Diffusion Policy · Mug manipulation** | real-robot | Cheng Chi and the Diffusion Policy team | [Project](https://diffusion-policy.cs.columbia.edu/) · [Video](https://diffusion-policy.cs.columbia.edu/videos/highlight_mug.mp4) · [Code](https://github.com/real-stanford/diffusion_policy) | [Diffusion Policy](https://diffusion-policy.cs.columbia.edu/) |
| **Diffusion Policy · Simulated lifting** | simulation | Cheng Chi and the Diffusion Policy team | [Project](https://diffusion-policy.cs.columbia.edu/) · [Video](https://diffusion-policy.cs.columbia.edu/videos/lift.mp4) · [Code](https://github.com/real-stanford/diffusion_policy) | [Diffusion Policy](https://diffusion-policy.cs.columbia.edu/) |

## Candidates

These recent leads from the knowledge base need further verification of publication or significance. They are excluded from curated counts.

| Paper | Recorded year | Pending review | Source |
| --- | --- | --- | --- |
| X-Ego: Acquiring Team-Level Tactical Situational Awareness via Cross-Egocentric Contrastive Video Representation Learning | 2025 | Recent preprint lead; official acceptance or evidence of significance needs further verification. | [Paper](https://arxiv.org/abs/2510.19150) |
| Game-TARS: Pretrained Foundation Models for Scalable Generalist Multimodal Game Agents | 2025 | Recent preprint lead; official acceptance or evidence of significance needs further verification. | [Paper](https://arxiv.org/abs/2510.23691) |
| GameWAM: A World Action Model for Video Games | 2026 | Recent preprint lead; official acceptance or evidence of significance needs further verification. | [Paper](https://arxiv.org/abs/2608.26200) |
| See, Symbolize, Act: Grounding VLMs with Spatial Representations for Better Gameplay | 2026 | Recent preprint lead; official acceptance or evidence of significance needs further verification. | [Paper](https://arxiv.org/abs/2603.11601) |
| Playing DOOM with 1.3M Parameters: Specialized Small Models vs Large Language Models for Real-Time Game Control | 2026 | Recent preprint lead; official acceptance or evidence of significance needs further verification. | [Paper](https://arxiv.org/abs/2604.07385) |
| Augmenting Human Performance with an XR Agent Learning from Online Behavior and BCI Evidence | 2026 | Recent preprint lead; official acceptance or evidence of significance needs further verification. | [Paper](https://arxiv.org/abs/2608.30369) |
| Procedural Generation of First Person Shooter Maps using Map-Elites | 2026 | Recent preprint lead; official acceptance or evidence of significance needs further verification. | [Paper](https://arxiv.org/abs/2605.30570) |
| Account Consistency from Gameplay Traces: Same-Player Verification in Counter-Strike 2 | 2026 | Recent preprint lead; official acceptance or evidence of significance needs further verification. | [Paper](https://arxiv.org/abs/2608.24893) |

## Sources and verification

The source table contained 106 rows: 19 had no title and 4 were duplicates, leaving 83 distinct titled leads. See the [selection audit](data/selection-audit.json) for their disposition. Exclusion from this snapshot is not a judgment of research quality.

Entries retain sources, review dates, environments, interfaces, limitations, and inclusion rationales. Original knowledge-base review labels have been translated into English and retained as source claims; they do not mean that a fresh full-text review or independent reproduction was performed. The raw export remains in an ignored local directory and is excluded from the repository and website. The original knowledge base has not been modified.

## Website and maintenance

[**Live website**](https://labixiaoq.github.io/Awesome-Game-Embodied-Agents/) · [GitHub repository](https://github.com/labixiaoQ/Awesome-Game-Embodied-Agents)

The public website is hosted on GitHub Pages. It supports domain, resource type, topic, year, and keyword filters, with shareable URL state. The static HTML includes the complete curated list and remains readable if interactive data loading fails.

No third-party frontend dependencies are required. With Node.js 20 or later:

```sh
npm run build
npm run check
npm run dev
```

Open the local URL printed by the server.

- **Catalogue:** `data/resources.json` is the source of truth. Keep summaries and labels in English.
- **Website:** `dist/` contains the static page and browser assets.
- **Generated content:** The build synchronizes the README, resource list, website data, and supporting documents. Edit the catalogue and build script rather than generated resource rows.
- **Publishing:** In repository Settings → Pages, select GitHub Actions. Pushes to `main` check, build, and publish automatically. The **Publish GitHub Pages** workflow also supports manual runs.
- **Forks:** Update `repositoryUrl` and `siteUrl` in the catalogue and the repository links in the page before publishing your own copy.

This is a manually maintained snapshot; there is no scheduled paper scraper or automatic write-back to Feishu.

## Acknowledgements

The game research starts from the supplied [Game Agent knowledge base](https://dy8q0bnq8y.feishu.cn/wiki/KAI9wbLEniLIIgkHAi6cU48bndd) (original access permissions apply). Additional game and embodied resources were collected from official sources. The resource organization and website layout are inspired by [Awesome Robot Use Agent](https://github.com/kairunwen/Awesome-Robot-Use-Agent#projects) by [Kairun Wen](https://github.com/kairunwen).

## Citation

If this collection helps your work, cite the repository and the individual resources you use. A machine-readable [citation file](CITATION.cff) is included.

## License

Original website code is released under the [MIT License](LICENSE). Papers, third-party code, models, datasets, and knowledge-base materials retain their respective rights. This index does not relicense referenced works.
