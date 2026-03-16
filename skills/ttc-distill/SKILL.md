---
name: ttc-distill
description: TTC distillation skill for knowledge transfer from teacher to student models. Use when distilling large models to smaller ones with TTC awareness. Supports medium and high profiles.
compatibility: Requires access to teacher model and compute backend
---

# TTC Distillation Skill

Distill knowledge from large teacher models to smaller student models while preserving TTC capabilities.

## Setup

```bash
# Ensure HF token has access to teacher model
huggingface-cli login

# Verify teacher model access
python -c "from transformers import AutoModel; AutoModel.from_pretrained('teacher-model-id')"
```

## Distillation Profiles

### Medium Profile (Free)

- **Backend**: Kaggle GPU (T4/P100)
- **Batch Size**: 4-8
- **Teacher**: 7B-14B models
- **Time**: 2-4 hours
- **Cost**: Free (30h/week limit)

```bash
python scripts/distill.py \
  --teacher Qwen/Qwen2.5-7B-Instruct \
  --student Qwen/Qwen2.5-0.5B \
  --dataset path/to/distill_data \
  --profile medium \
  --backend kaggle
```

### High Profile (Paid)

- **Backend**: HF Jobs (A10G/L4)
- **Batch Size**: 16-32
- **Teacher**: 14B-72B models
- **Time**: 4-12 hours
- **Cost**: ~$5-20

```bash
python scripts/distill.py \
  --teacher Qwen/Qwen2.5-72B-Instruct \
  --student Qwen/Qwen3.5-0.8B \
  --dataset path/to/distill_data \
  --profile high \
  --backend hf-jobs
```

## Distillation Pipeline

```
1. Load teacher model (frozen)
2. Load student model (trainable)
3. Generate teacher outputs on dataset
4. Train student to match teacher
5. Evaluate distillation quality
6. Save student model
```

## Input Contract

- `teacher_model_id`: HuggingFace model ID
- `student_model_id`: Base student model ID
- `dataset`: Path to distillation dataset
- `profile`: "medium" or "high"

## Output Contract

- `distill_summary.json`: Training metrics
- `final_model/`: Distilled student model
- `teacher_traces.jsonl`: Teacher reasoning traces (optional)

## Example

```
User: Distill Qwen 2.5 7B to 0.8B using my math dataset

Agent will:
1. Check teacher access
2. Prepare distillation config
3. Launch job on selected backend
4. Monitor progress
5. Return distilled model path
```

## Quality Metrics

After distillation, check:
- **Perplexity** on validation set (< 5.0 is good)
- **Teacher alignment** (> 80% agreement)
- **Benchmark scores** (MMLU, GSM8K, etc.)
