# Collection policy

Snapshot: **2026-09-14**. Publication windows are fixed for this edition and should be reviewed when the catalogue is updated.

## Curated papers

- Include relevant leading-conference and journal papers published from **2021-09-14 through 2026-09-14**.
- Priority venues include NeurIPS (including the formal Datasets and Benchmarks track), ICLR, ICML, CVPR, ICCV, ECCV, AAAI, IJCAI, RSS, CoRL, ICRA, and IROS; journals include Nature, Science, T-RO, IJRR, TPAMI, JMLR, and TMLR. This is a subject-specific selection policy, not a single official venue ranking.
- Workshops, Bridges, submissions, and author-only acceptance claims do not automatically qualify as main-conference publications. Use official proceedings, publisher records, or official acceptance lists.
- Distinguish conference years from proceedings publication years. Papers from 2021 need a precise date within the window; the original 2021 entry is from NeurIPS in December.
- Research should directly concern agent perception, decision-making, actions, planning, learning, cooperation, or evaluation. Describe frame generation as supporting research rather than control capability.
- Group surveys, methods/frameworks, dataset papers, and benchmark papers by contribution. Multiple views may share the same record.

## Important recent arXiv research

- First submission must fall between **2025-09-14 and 2026-09-14**. A revised version does not reset the window.
- Provide traceable reasons for significance: released and adopted models or environments, substantial multi-task evaluations, independent follow-up work, or a complete official research report establishing a significant research direction.
- Importance is an editorial judgment that needs a rationale and evidence links. Institutional reputation, social engagement, and unverified citation counts are insufficient on their own. This edition does not claim a quantitative citation-impact assessment.
- SIMA 2 and π*0.6 / RECAP are selected as significant research directions, with first submission dates, official reports, and explicit rationales retained. They remain labeled arXiv unless formal acceptance is verified.
- Work lacking sufficient bibliographic or significance evidence stays in the candidate view and is excluded from curated counts.

## Articles, tools, datasets, and benchmarks

Official research articles provide context and implementation guidance. They are not counted as peer-reviewed papers. Standalone infrastructure is assessed by current purpose, interface, setup requirements, and license source; it is not excluded solely because of the paper-age window.

Dataset and benchmark papers can appear in multiple views with one shared record. Category counts must not be summed as the total number of unique entries.

## Video demonstrations

Use public videos from original research teams, official project pages, or clearly credited community authors. Retain an accessible source-page link, creator credit, known release date or year, task setting, and related paper/project links. Embed the original hosted video rather than copying it into this repository.

Separate game control, generated game frames, real-robot execution, simulation, and teleoperation. Explain playback speed when the source specifies it. A curated or edited demonstration is author-reported qualitative evidence, not an independently measured success rate or proof of general autonomy. A publication date attached to a related paper does not prove the exact recording date of a clip.

## Evidence and comparison boundaries

Catalogue editing, source checks, prior knowledge-base full-text review, personal reading, and independent reproduction are distinct states. Checks here primarily cover bibliographic records, project descriptions, and abstracts. Original Chinese knowledge-base review labels are translated into English and retained as source claims, not re-certified.

Align environments and tasks, observation access, action granularity, training data and budget, execution latency, and evaluation protocols before comparing results. Keep navigation, frame generation, executable programs, and real robot control separate. This website does not offer a mixed leaderboard across games or hardware.

## Updates

Maintain `data/resources.json`, add official sources and resource limitations, then run `npm run build` and `npm run check`. When promoting a candidate, update `status`, `selectionTrack`, `selectionReason`, `evidence`, and `checkedAt`.

New paper selection is manually curated. Weekly checks refresh existing verified statistics and report source-link availability. Routine checks do not promote candidates, alter publication windows, or certify paper claims. There is no automatic paper scraper or write-back to the original Feishu knowledge base. Raw source exports are excluded from the repository and published website.
