---
name: paper-to-engineering-features
description: Transform HuggingFace/arXiv research papers into trainable engineering features, skills, scripts and configs for Qwen 3.5 0.8B. Use when user provides a paper URL or wants to convert research into implementation. Creates complete skill ecosystems with ASCII diagrams.
---

# Paper to Engineering Features

Converts research papers into trainable engineering features for the TTC Stack.

## IMPORTANT: TillDone Setup Required

This skill requires the TillDone task system. Before doing any work, you MUST:

```
1. tilldone new-list "Paper to Skills Conversion"
2. tilldone add "Fetch paper from URL"
3. tilldone add "Extract engineering features"
4. tilldone add "Map features to TTC stages"
5. tilldone add "Generate skill ecosystem"
6. tilldone add "Create ASCII diagram"
7. tilldone add "Create GitHub repos"
8. tilldone toggle 1  # Mark first task as inprogress
```

Only AFTER these steps can you use other tools!

## Workflow

### Task 1: Fetch Paper

First mark task 1 as inprogress: `tilldone toggle 1`

**For HuggingFace Papers (2501.xxxxx format):**
```bash
PAPER_ID="<paper-id from URL>"
curl -s "https://huggingface.co/api/papers/$PAPER_ID" | jq '.title, .abstract, .authors'
```

**For arXiv:**
```bash
PAPER_ID="<paper-id from URL>"
curl -s "http://export.arxiv.org/api/query?id_list=$PAPER_ID"
```

After fetching: `tilldone toggle 1` (mark done), `tilldone toggle 2` (start next)

### Task 2: Extract Engineering Features

Analyze and extract:

| Category | What to Look For |
|----------|-----------------|
| **Architecture** | Layer modifications, attention variants, skip connections |
| **Training Methods** | Loss functions, optimization, curriculum learning |
| **Algorithms** | Sampling strategies, routing logic, decoding |
| **Data Pipeline** | Dataset requirements, preprocessing |
| **Evaluation** | Benchmarks, metrics, baselines |

After extracting: `tilldone toggle 2`, `tilldone toggle 3`

### Task 3: Map to TTC Pipeline

Map features to stages:

```
CPT → Architecture changes, tokenizer modifications
SFT → Instruction formats, LoRA configs, data schemas
RLVR → Reward signals, verifier configs, GRPO/DPO
TTC → Router decisions, parallel sampling, self-refinement
```

After mapping: `tilldone toggle 3`, `tilldone toggle 4`

### Task 4: Generate Skill Ecosystem

Create package structure:
```
paper-<short-name>/
├── SKILL.md
├── scripts/{train.py, evaluate.py, inference.py}
├── references/{architecture.md, paper-summary.md}
└── configs/{sft.yaml, rlvr.yaml, router.yaml}
```

After generating: `tilldone toggle 4`, `tilldone toggle 5`

### Task 5: Create ASCII Diagram

Generate architecture visualization:
```
┌─────────────────────────────────────────────┐
│              Qwen 3.5 0.8B                  │
│  ┌─────────────────────────────────────┐   │
│  │        [Modifications here]         │   │
│  └─────────────────────────────────────┘   │
└─────────────────────────────────────────────┘
```

After diagram: `tilldone toggle 5`, `tilldone toggle 6`

### Task 6: Create GitHub Repos

```bash
gh repo create qwen-<feature-name> --public --description "Qwen implementation"
git init && git add . && git commit -m "Initial skill ecosystem"
git push origin main
```

After repos created: `tilldone toggle 6`

## Output Format

Provide at the end:
1. Paper Summary (3 bullets)
2. Features Table
3. TTC Stage Mapping
4. Generated Skills List
5. ASCII Diagram
6. GitHub Repo Links
7. Installation Commands

## Example Usage

User: "Convert this paper to skills: https://huggingface.co/papers/2512.24880"

Agent MUST first:
```
tilldone new-list "mHC Paper to Skills"
tilldone add texts=["Fetch mHC paper", "Extract features", "Map to TTC", "Generate skills", "Create diagram", "Create repos"]
tilldone toggle 1
```

Then proceed with actual work using bash, file writes, etc.
