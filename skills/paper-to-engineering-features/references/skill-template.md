# Skill Generation Template

## Architecture Lab Skill

```markdown
---
name: <prefix>-<feature>-architecture-lab
description: <Feature> architecture retrofit workflow for Qwen 3.5 0.8B. Use when modifying model architecture based on <paper>.
---

# <Feature> Architecture Lab

## Overview
<2-3 sentence description of the architectural change>

## Source Paper
- **Paper**: [<title>](<url>)
- **Key Innovation**: <one sentence>

## Architecture Changes

<ASCII diagram of changes>

## Implementation Steps

### 1. Setup
```bash
pip install torch transformers accelerate
```

### 2. Load Base Model
```python
from transformers import AutoModelForCausalLM
model = AutoModelForCausalLM.from_pretrained("Qwen/Qwen2.5-0.5B")
```

### 3. Apply Modifications
<code or description>

### 4. Verify
<verification steps>

### 5. Push
<push to Hub>

## Scripts

| Script | Purpose |
|--------|---------|
| `scripts/retrofit.py` | Apply architecture changes |
| `scripts/verify.py` | Verify parameter counts |
| `scripts/test_forward.py` | Test forward pass |

## Configs

| Config | Purpose |
|--------|---------|
| `configs/retrofit.yaml` | Retrofit settings |
| `configs/test.yaml` | Test settings |

## Expected Outputs

- `models/<feature>-qwen/` - Modified model
- `models/<feature>-qwen/config.json` - Modified config
- `models/<feature>-qwen/verify.json` - Verification results

## References

- [Paper](<url>)
- [Reference Implementation](<url if available>)
```

## Kaggle Smoke Skill

```markdown
---
name: <prefix>-<feature>-kaggle-smoke
description: Cheap Kaggle smoke validation for <feature>. Quick tests on free T4 GPU.
---

# <Feature> Kaggle Smoke

## Purpose
Validate <feature> implementation on Kaggle's free GPU tier.

## Resource Limits
- **GPU**: T4 (16GB VRAM)
- **Time**: 9 hours max
- **Storage**: 20GB
- **Internet**: Required for model download

## Notebook Structure

### Cell 1: Setup
```python
!pip install transformers accelerate torch
```

### Cell 2: Load Model
```python
from transformers import AutoModelForCausalLM
model = AutoModelForCausalLM.from_pretrained("<model-path>")
```

### Cell 3: Test Inference
```python
# Quick inference test
```

### Cell 4: Validate
```python
# Validation against baseline
```

## Success Criteria
- [ ] Model loads without OOM
- [ ] Forward pass completes
- [ ] Output matches expected format
- [ ] No numerical instabilities

## Output Files
- `output/test_results.json` - Test results
- `output/memory_usage.json` - Memory profile
```

## HF Jobs Skill

```markdown
---
name: <prefix>-<feature>-hf-jobs
description: HF Jobs workflow for <feature> full-scale training and evaluation.
---

# <Feature> HF Jobs

## Job Types

### validate
Quick validation run (1-2 hours)

```bash
huggingface-cli job create --gpu a10g --time 2h
```

### train
Full training run (8-24 hours)

```bash
huggingface-cli job create --gpu l4 --time 24h
```

### eval
Benchmark evaluation (2-4 hours)

```bash
huggingface-cli job create --gpu a10g --time 4h
```

## Resource Profiles

| Profile | GPU | VRAM | Hours | Cost |
|---------|-----|------|-------|------|
| small | A10G | 24GB | 2-4 | ~$2-4 |
| medium | L4 | 24GB | 8-16 | ~$8-16 |
| large | A100 | 80GB | 24+ | ~$24+ |

## Scripts

| Script | Purpose |
|--------|---------|
| `scripts/launch_validate.py` | Launch validation job |
| `scripts/launch_train.py` | Launch training job |
| `scripts/launch_eval.py` | Launch evaluation job |
| `scripts/monitor.py` | Monitor job status |

## Configs

| Config | Purpose |
|--------|---------|
| `configs/validate.yaml` | Validation config |
| `configs/train.yaml` | Training config |
| `configs/eval.yaml` | Evaluation config |

## Expected Outputs

- `models/<feature>-final/` - Final trained model
- `results/train_metrics.json` - Training metrics
- `results/eval_metrics.json` - Evaluation metrics
```

## Bridge Skill

```markdown
---
name: <prefix>-<feature>-bridge
description: Bridge from <feature> checkpoints to downstream TTC training stages.
---

# <Feature> Bridge

## Purpose
Connect validated <feature> checkpoints to CPT, SFT, RLVR, and TTC consumers.

## Input Contract

| Artifact | Required | Format |
|----------|----------|--------|
| `checkpoint/` | Yes | HuggingFace format |
| `config.json` | Yes | JSON |
| `verify.json` | Recommended | JSON |

## Output Contract

| Artifact | Format | Consumer |
|----------|--------|----------|
| `model_for_cpt/` | HuggingFace | CPT stage |
| `model_for_sft/` | HuggingFace | SFT stage |
| `model_for_rlvr/` | HuggingFace | RLVR stage |
| `model_for_ttc/` | HuggingFace | TTC stage |

## Bridge Steps

1. **Validate Checkpoint** - Ensure checkpoint integrity
2. **Prepare for CPT** - Add CPT-specific configs
3. **Prepare for SFT** - Add chat template, LoRA configs
4. **Prepare for RLVR** - Add verifier configs
5. **Prepare for TTC** - Add router configs

## Scripts

| Script | Purpose |
|--------|---------|
| `scripts/bridge_cpt.py` | Bridge to CPT |
| `scripts/bridge_sft.py` | Bridge to SFT |
| `scripts/bridge_rlvr.py` | Bridge to RLVR |
| `scripts/bridge_ttc.py` | Bridge to TTC |
```
