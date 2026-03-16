---
name: paper-to-engineering-features
description: Transform HuggingFace/arXiv research papers into trainable engineering features, skills, scripts and configs for Qwen 3.5 0.8B. Use when user provides a paper URL or wants to convert research into implementation. Creates complete skill ecosystems with ASCII diagrams.
---

# Paper to Engineering Features

Converts research papers into trainable engineering features for the TTC Stack.

## Input
User provides a paper URL from:
- HuggingFace Papers: `https://huggingface.co/papers/<paper-id>`
- arXiv: `https://arxiv.org/abs/<paper-id>`

## Step-by-Step Workflow

### Step 1: Fetch Paper

**For HuggingFace Papers:**
```bash
# Extract paper ID from URL
PAPER_ID="<paper-id from URL>"

# Use curl to fetch paper info from HF API
curl -s "https://huggingface.co/api/papers/$PAPER_ID" | jq '.'
```

**For arXiv:**
```bash
# Extract paper ID from URL
PAPER_ID="<paper-id from URL>"

# Use curl to fetch from arXiv API
curl -s "http://export.arxiv.org/api/query?id_list=$PAPER_ID"
```

Read the abstract, title, authors, and key technical claims.

### Step 2: Extract Engineering Features

Analyze the paper and extract features into these categories:

| Category | What to Look For |
|----------|-----------------|
| **Architecture** | Layer modifications, attention variants, skip connections, MoE patterns |
| **Training Methods** | Loss functions, optimization tricks, curriculum learning, regularization |
| **Algorithms** | Core algorithms, sampling strategies, routing logic, decoding methods |
| **Data Pipeline** | Dataset requirements, preprocessing steps, augmentation |
| **Evaluation** | Benchmarks used, metrics, baseline comparisons |

Create a feature table like:
```
| Feature | Category | Complexity | TTC Stage |
|---------|----------|------------|-----------|
| Skip connection pattern | Architecture | Medium | CPT |
| Custom loss function | Training | Low | SFT |
| Best-of-N sampling | Algorithm | Low | TTC |
```

### Step 3: Map to Qwen 3.5 0.8B TTC Pipeline

Map each feature to a TTC stage:

```
CPT (Continued Pre-Training)
├── Architecture changes → checkpoint surgery scripts
├── New modalities → data pipeline configs
└── Tokenizer changes → vocabulary expansion

SFT (Supervised Fine-Tuning)
├── Instruction format → chat template configs
├── Task-specific heads → LoRA adapter configs
└── Data requirements → dataset schemas

RLVR (Reinforcement Learning with Verifiable Rewards)
├── Reward signals → verifier configs
├── Sampling strategies → generation configs
└── Policy updates → GRPO/DPO configs

TTC (Test-Time Compute)
├── Router decisions → router model configs
├── Parallel sampling → best-of-N configs
└── Self-refinement → critique loops
```

### Step 4: Generate Skill Ecosystem

Create the skill package structure in a temporary directory:

```
paper-<short-name>/
├── SKILL.md              # Main skill definition
├── scripts/
│   ├── train.py          # Training entry point
│   ├── evaluate.py       # Evaluation script
│   └── inference.py      # Inference wrapper
├── references/
│   ├── architecture.md   # Detailed architecture docs
│   └── paper-summary.md  # Original paper summary
└── configs/
    ├── sft.yaml          # SFT training config
    ├── rlvr.yaml         # RLVR config
    └── router.yaml       # TTC router config
```

### Step 5: Create ASCII Architecture Diagram

Generate a visual diagram:

```
┌─────────────────────────────────────────────┐
│              Qwen 3.5 0.8B                  │
│  ┌─────────────────────────────────────┐   │
│  │           Embedding Layer           │   │
│  └──────────────────┬──────────────────┘   │
│                     ▼                       │
│  ┌─────────────────────────────────────┐   │
│  │        Transformer Layers           │   │
│  │   [List modifications here]         │   │
│  └──────────────────┬──────────────────┘   │
│                     ▼                       │
│  ┌─────────────────────────────────────┐   │
│  │           Output Head               │   │
│  └─────────────────────────────────────┘   │
└─────────────────────────────────────────────┘
```

### Step 6: Create GitHub Repository

```bash
# Create new repo
cd /tmp/paper-<short-name>
gh repo create qwen-<feature-name> --public --description "Qwen 3.5 0.8B implementation"

# Push
git init
git add .
git commit -m "Initial skill ecosystem from paper <paper-id>"
git branch -M main
git remote add origin https://github.com/$(gh api user -q '.login')/qwen-<feature-name>.git
git push -u origin main
```

## Output Format

After processing, provide:

1. **Paper Summary** - 3 bullet points of key contributions
2. **Engineering Features Table** - What was extracted
3. **TTC Stage Mapping** - Which features go where
4. **Generated Skills List** - Names and descriptions
5. **ASCII Diagram** - Architecture visualization
6. **GitHub Repo Links** - URLs to created repos
7. **Installation Commands** - How to use in pi

## Example Output

```
## Paper: mHC (2512.24880)

### Summary
- Introduces manifold-constrained hyper-connections for better gradient flow
- Shows 2-5% improvement on reasoning benchmarks
- Compatible with existing Transformer architectures

### Features Extracted
| Feature | Category | Complexity | Stage |
|---------|----------|------------|-------|
| Manifold skip connections | Architecture | High | CPT |
| Constrained residuals | Architecture | Medium | CPT |

### Generated Skills
1. qwen-mhc-architecture-lab - Architecture retrofit
2. qwen-mhc-kaggle-smoke - Quick validation
3. qwen-mhc-hf-jobs - Full training
4. qwen-mhc-bridge - Pipeline bridge
5. qwen-mhc-retrofit-lab - Checkpoint surgery

### Repositories
- https://github.com/<user>/qwen-mhc-architecture-lab
- https://github.com/<user>/qwen-mhc-kaggle-smoke
- ...

### Install
pi install https://github.com/<user>/qwen-mhc-architecture-lab
```

## Notes

- Always create NEW repositories (preserve originals)
- Use descriptive names: `qwen-<feature>-<type>`
- Generate at least 3 skills per paper (architecture-lab, kaggle-smoke, hf-jobs)
- Include installation commands for each generated skill
