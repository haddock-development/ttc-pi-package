---
name: ttc-judge
description: Judge model training skill for TTC evaluation. Use when training models to evaluate and score outputs from other models. Supports reward model training and judge datasets.
compatibility: Requires judge training dataset and compute backend
---

# TTC Judge Training Skill

Train judge models for evaluating model outputs in the TTC stack.

## Judge Architecture

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Query     │     │  Response   │     │   Judge     │
│             │────▶│   Model     │────▶│   Model     │
└─────────────┘     └─────────────┘     └──────┬──────┘
                                               │
                                               ▼
                                        ┌─────────────┐
                                        │   Score     │
                                        │  0.0 - 1.0  │
                                        └─────────────┘
```

## Judge Training

### Dataset Format

```jsonl
{"query": "...", "response": "...", "score": 0.9, "rationale": "Correct and well-explained"}
{"query": "...", "response": "...", "score": 0.3, "rationale": "Partially correct but incomplete"}
```

### Training Command

```bash
python scripts/train_judge.py \
  --base-model Qwen/Qwen2.5-0.5B \
  --dataset path/to/judge_data.jsonl \
  --output models/ttc-judge \
  --backend kaggle
```

## Judge Types

| Type | Purpose | Output |
|------|---------|--------|
| **Scorer** | Rate response quality | 0.0-1.0 |
| **Ranker** | Compare two responses | A or B |
| **Verifier** | Check correctness | True/False |
| **Critic** | Provide feedback | Text |

## Evaluation

```bash
python scripts/eval_judge.py \
  --judge models/ttc-judge \
  --benchmark judge-bench \
  --metrics accuracy,correlation
```

## Judge Metrics

- **Accuracy**: Agreement with human labels
- **Kendall τ**: Correlation with human rankings
- **Calibration**: Score alignment with actual quality

## Use in TTC Pipeline

```python
from ttc_judge import JudgeModel

judge = JudgeModel.from_pretrained("models/ttc-judge")

# Score responses
for response in responses:
    score = judge.score(query, response)
    if score > 0.8:
        accept(response)
```

## Example

```
User: Train a judge to evaluate math solutions

Agent will:
1. Prepare judge dataset with scored examples
2. Train judge model
3. Evaluate on held-out set
4. Return judge model path
```

## References

- [Judge Dataset Creation](references/judge-data.md)
- [Reward Modeling Guide](references/reward-model.md)
