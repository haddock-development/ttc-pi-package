---
name: paper-to-engineering-features
description: Transform HuggingFace/arXiv research papers into trainable engineering features, skills, scripts and configs for Qwen 3.5 0.8B. Use when user provides a paper URL or wants to convert research into implementation. Creates complete skill ecosystems with ASCII diagrams.
compatibility: Requires huggingface-cli, gh CLI, access to arXiv/HF Papers
---

# Paper to Engineering Features

Converts research papers into trainable engineering features for the TTC Stack.

## Workflow

### 1. Paper Fetch

**HuggingFace Papers:**
```
https://huggingface.co/papers/<paper-id>
```
Use `mcp__hf-mcp-server__paper_search` to find papers, then `mcp__hf-mcp-server__hub_repo_details` for details.

**arXiv:**
```
https://arxiv.org/abs/<paper-id>
```
Use `mcp__web_reader__webReader` to fetch abstract and content.

### 2. Engineering Feature Extraction

For each paper, extract:

| Category | What to Extract |
|----------|-----------------|
| **Architecture** | Layer modifications, attention variants, connection patterns |
| **Training Methods** | Loss functions, optimization, curriculum, regularization |
| **Algorithms** | Core algorithms, sampling strategies, routing logic |
| **Data Pipeline** | Dataset requirements, preprocessing, augmentation |
| **Evaluation** | Benchmarks, metrics, baselines to compare against |

### 3. Qwen 3.5 0.8B Adaptation

Map extracted features to TTC pipeline stages:

```
CPT (Continued Pre-Training)
├── Architecture changes → Model surgery scripts
├── New modalities → Data pipeline configs
└── Tokenizer changes → Vocabulary expansion

SFT (Supervised Fine-Tuning)
├── Instruction format → Chat template configs
├── Task-specific heads → LoRA adapter configs
└── Data requirements → Dataset schemas

RLVR (Reinforcement Learning with Verifiable Rewards)
├── Reward signals → Verifier configs
├── Sampling strategies → Generation configs
└── Policy updates → GRPO/DPO configs

TTC (Test-Time Compute)
├── Router decisions → Router model configs
├── Parallel sampling → Best-of-N configs
└── Self-refinement → Critique loops
```

### 4. Skill Ecosystem Generation

Generate a complete skill package:

```
paper-<short-name>/
├── SKILL.md              # Main skill definition
├── scripts/
│   ├── train.py          # Training entry point
│   ├── evaluate.py       # Evaluation script
│   └── inference.py      # Inference wrapper
├── references/
│   ├── architecture.md   # Detailed architecture docs
│   ├── training.md       # Training methodology
│   └── paper-summary.md  # Original paper summary
└── configs/
    ├── sft.yaml          # SFT training config
    ├── rlvr.yaml         # RLVR config
    └── router.yaml       # TTC router config
```

### 5. ASCII Architecture Diagrams

Create visual diagrams using ASCII art:

```
Example mHC Architecture:

     ┌─────────────────────────────────────────────┐
     │                  Qwen 3.5 0.8B              │
     │  ┌─────────────────────────────────────┐   │
     │  │           Embedding Layer           │   │
     │  └──────────────────┬──────────────────┘   │
     │                     ▼                       │
     │  ┌─────────────────────────────────────┐   │
     │  │  Layer 0: Standard Attention        │   │
     │  └──────────────────┬──────────────────┘   │
     │                     ▼                       │
     │  ┌─────────────────────────────────────┐   │
     │  │  Layer 1-20: mHC Skip Connections   │◄──┐
     │  │  ┌───┐  ┌───┐  ┌───┐               │   │
     │  │  │L1 │→ │L5 │→ │L10│→ ...         │   │
     │  │  └─┬─┘  └─┬─┘  └─┬─┘               │   │
     │  │    │      │      │                  │   │
     │  │    └──────┴──────┴──────────────────┼───┘
     │  └─────────────────────────────────────┘   │
     │                     ▼                       │
     │  ┌─────────────────────────────────────┐   │
     │  │           Output Head               │   │
     │  └─────────────────────────────────────┘   │
     └─────────────────────────────────────────────┘
```

### 6. GitHub Repository Creation

Create a NEW repository (preserve originals):

```bash
# Create new repo
gh repo create qwen-<feature-name> --public --description "Qwen 3.5 0.8B implementation of <paper>"

# Push skill ecosystem
git init && git add . && git commit -m "Initial skill ecosystem from <paper-id>"
git push origin main
```

## Example: mHC Paper → 5 Skills

From paper `https://huggingface.co/papers/2512.24880`:

| Skill | Purpose | Backend |
|-------|---------|---------|
| `qwen-mhc-architecture-lab` | Architecture retrofit workflow | Local/Kaggle |
| `qwen-mhc-bridge` | Bridge to downstream training | N/A |
| `qwen-mhc-hf-jobs` | HF Jobs validation runs | HF Jobs |
| `qwen-mhc-kaggle-smoke` | Quick smoke tests | Kaggle |
| `qwen-mhc-retrofit-lab` | Checkpoint surgery & packaging | Local |

## Skill Templates

### Architecture Lab Skill

```markdown
---
name: <feature>-architecture-lab
description: <Feature> architecture retrofit for Qwen 3.5 0.8B
---

# <Feature> Architecture Lab

## Overview
[Brief description of the architectural change]

## Implementation Steps
1. Load base model
2. Apply architecture modifications
3. Verify parameter counts
4. Run forward pass test
5. Push modified model

## Scripts
- `scripts/retrofit.py` - Main architecture surgery
- `scripts/verify.py` - Parameter verification

## Configs
- `configs/retrofit.yaml` - Retrofit configuration
```

### Kaggle Smoke Skill

```markdown
---
name: <feature>-kaggle-smoke
description: Cheap Kaggle smoke validation for <feature>
---

# <Feature> Kaggle Smoke

## Purpose
Quick validation on Kaggle's free T4 GPU.

## Notebook Structure
1. Install dependencies
2. Load modified model
3. Run inference test
4. Compare against baseline

## Resource Limits
- GPU: T4 (16GB VRAM)
- Time: 9h max
- Storage: 20GB
```

### HF Jobs Skill

```markdown
---
name: <feature>-hf-jobs
description: HF Jobs workflow for <feature> full validation
---

# <Feature> HF Jobs

## Purpose
Full-scale training and evaluation on HF Jobs.

## Job Types
- `validate`: Quick validation run
- `train`: Full training run
- `eval`: Benchmark evaluation

## Resource Profiles
| Profile | GPU | Hours |
|---------|-----|-------|
| small | A10G | 2-4 |
| medium | L4 | 8-16 |
| large | A100 | 24+ |
```

## Output Format

After processing a paper, provide:

1. **Paper Summary** - Key contributions in 3 bullet points
2. **Engineering Features Table** - What was extracted
3. **Qwen Adaptation Plan** - Mapping to TTC stages
4. **Skill List** - Generated skills with descriptions
5. **ASCII Diagram** - Architecture visualization
6. **GitHub Repos** - Links to created repositories
7. **Installation Commands** - How to use in pi

## Usage

```
User: Convert this paper to skills: https://huggingface.co/papers/2512.24880

Agent will:
1. Fetch paper via HF MCP
2. Extract engineering features
3. Generate 3-5 skills with configs
4. Create ASCII architecture diagram
5. Create GitHub repos
6. Provide installation commands
```

## References

- `references/paper-template.md` - Template for paper analysis
- `references/skill-template.md` - Template for skill generation
- `references/config-schemas.md` - YAML config schemas
