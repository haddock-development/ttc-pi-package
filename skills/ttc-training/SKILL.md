---
name: ttc-training
description: TTC-aware training skill for Qwen models. Use when training models with Test-Time Compute awareness, including CPT → SFT → RLVR → TTC pipeline stages. Supports Kaggle and HF Jobs backends.
compatibility: Requires kaggle-cli or huggingface-cli configured
---

# TTC Training Skill

Training pipeline for Qwen models with TTC (Test-Time Compute) awareness.

## Setup

```bash
# Ensure kaggle CLI is configured
kaggle competitions list

# Or for HF Jobs
huggingface-cli login
```

## Training Stages

### 1. CPT (Continued Pre-Training)

```bash
# From ttc-inference-scaling-stack repo
python scripts/cpt_train.py \
  --model Qwen/Qwen2.5-0.5B \
  --dataset path/to/corpus \
  --backend kaggle \
  --output-dir models/cpt-qwen
```

### 2. SFT (Supervised Fine-Tuning)

```bash
python scripts/sft_train.py \
  --base-model models/cpt-qwen \
  --dataset path/to/sft_data \
  --lora-r 16 \
  --backend kaggle
```

### 3. RLVR (Reinforcement Learning with Verifiable Rewards)

```bash
python scripts/rlvr_train.py \
  --sft-model models/sft-qwen \
  --verifier qwen-verifier \
  --backend hf-jobs
```

### 4. TTC-Aware Training

```bash
python scripts/ttc_train.py \
  --rlvr-model models/rlvr-qwen \
  --router-profile balanced \
  --backend hf-jobs
```

## Profiles

| Profile | Compute | Use Case |
|---------|---------|----------|
| `low` | ~1 GPU-hour | Quick experiments, smoke tests |
| `medium` | ~5 GPU-hours | Standard training, Kaggle |
| `high` | ~20+ GPU-hours | Production runs, HF Jobs |

## Backends

- **kaggle**: Free T4/P100, 30h/week limit
- **hf-jobs**: Paid A10G/L4, unlimited
- **local**: Your own GPU

## Expected Outputs

After training completion:
- `models/<stage>-qwen/final_model/` - Model weights
- `models/<stage>-qwen/train_summary.json` - Training metrics
- `models/<stage>-qwen/config.json` - Training configuration

## Example

```
User: Train Qwen 3.5 0.8B on my instruction dataset with SFT, use Kaggle backend

Agent will:
1. Load skill instructions (this file)
2. Prepare Kaggle notebook configuration
3. Launch training job
4. Monitor and report results
5. Save model to specified location
```

## References

- [TTC Stack Repository](https://github.com/haddock-development/ttc-inference-scaling-stack)
- [Qwen Training Guide](references/qwen-training.md)
- [Kaggle Backend Setup](references/kaggle-setup.md)
