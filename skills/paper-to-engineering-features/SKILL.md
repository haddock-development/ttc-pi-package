---
name: paper-to-engineering-features
description: Transform HuggingFace/arXiv research papers into trainable engineering features, skills, scripts and configs for Qwen 3.5 0.8B. Use when user provides a paper URL or wants to convert research into implementation. Creates complete skill ecosystems with ASCII diagrams.
---

# Paper to Engineering Features

Converts research papers into trainable engineering features for the TTC Stack.

## Input
User provides a paper URL:
- HuggingFace Papers: `https://huggingface.co/papers/<paper-id>`
- arXiv: `https://arxiv.org/abs/<paper-id>`

## Workflow

### 1. Fetch Paper

**HuggingFace Papers:**
```bash
PAPER_ID="<paper-id from URL>"
curl -s "https://huggingface.co/api/papers/$PAPER_ID"
```

**arXiv:**
```bash
PAPER_ID="<paper-id from URL>"
curl -s "http://export.arxiv.org/api/query?id_list=$PAPER_ID"
```

### 2. Extract Engineering Features

| Category | What to Look For |
|----------|-----------------|
| Architecture | Layer modifications, attention variants, skip connections, MoE |
| Training | Loss functions, optimization, curriculum learning |
| Algorithms | Sampling strategies, routing logic, decoding |
| Data | Dataset requirements, preprocessing |
| Evaluation | Benchmarks, metrics, baselines |

### 3. Map to TTC Stages

```
CPT (Continued Pre-Training)
├── Architecture changes → checkpoint surgery
└── Tokenizer changes → vocabulary expansion

SFT (Supervised Fine-Tuning)
├── Instruction format → chat template configs
└── Data requirements → dataset schemas

RLVR (Reinforcement Learning)
├── Reward signals → verifier configs
└── Policy updates → GRPO/DPO configs

TTC (Test-Time Compute)
├── Router decisions → router configs
└── Parallel sampling → best-of-N configs
```

### 4. Generate Skill Package

```
qwen-<feature-name>/
├── SKILL.md
├── scripts/
│   ├── train.py
│   ├── evaluate.py
│   └── inference.py
├── references/
│   ├── architecture.md
│   └── paper-summary.md
└── configs/
    ├── sft.yaml
    ├── rlvr.yaml
    └── router.yaml
```

### 5. Create ASCII Diagram

```
┌─────────────────────────────────────────────┐
│              Qwen 3.5 0.8B                  │
│  ┌─────────────────────────────────────┐   │
│  │        [Feature modifications]      │   │
│  └─────────────────────────────────────┘   │
└─────────────────────────────────────────────┘
```

### 6. Create GitHub Repos

```bash
gh repo create qwen-<feature-name> --public --description "Qwen implementation"
git init && git add . && git commit -m "Initial skill ecosystem"
git push origin main
```

## Output

Provide:
1. Paper Summary (3 bullets)
2. Features Table
3. TTC Stage Mapping
4. Generated Skills (3-5 per paper)
5. ASCII Diagram
6. GitHub Repo Links
7. Installation Commands

## Example

From `https://huggingface.co/papers/2512.24880`:

| Skill | Purpose | Backend |
|-------|---------|---------|
| qwen-mhc-architecture-lab | Architecture retrofit | Kaggle |
| qwen-mhc-kaggle-smoke | Quick validation | Kaggle |
| qwen-mhc-hf-jobs | Full training | HF Jobs |
| qwen-mhc-bridge | Pipeline bridge | N/A |
| qwen-mhc-retrofit-lab | Checkpoint surgery | Local |
