---
name: ttc-router
description: TTC router skill for inference scaling decisions. Use when training, evaluating, or benchmarking the router that decides between low/medium/high/superthink compute modes.
compatibility: Requires router model and benchmark datasets
---

# TTC Router Skill

The TTC router decides which compute level to use for each query:
- **low**: Quick responses (~1s)
- **medium**: Standard reasoning (~5s)
- **high**: Deep thinking (~30s)
- **superthink**: Maximum compute (~2min)

## Router Architecture

```
                    ┌─────────────┐
                    │   Router    │
                    │  Classifier │
                    └──────┬──────┘
                           │
          ┌────────────────┼────────────────┐
          ▼                ▼                ▼
    ┌──────────┐    ┌──────────┐    ┌──────────┐
    │   LOW    │    │  MEDIUM  │    │   HIGH   │
    │ 1 sample │    │ 3 samples│    │ 10 samples│
    └──────────┘    └──────────┘    └──────────┘
```

## Router Training

```bash
python scripts/train_router.py \
  --base-model Qwen/Qwen2.5-0.5B \
  --trace-data path/to/traces.jsonl \
  --output models/ttc-router \
  --backend kaggle
```

### Training Data Format

```jsonl
{"query": "What is 2+2?", "complexity": "low", "optimal_samples": 1}
{"query": "Solve this math problem...", "complexity": "high", "optimal_samples": 10}
```

## Router Evaluation

```bash
python scripts/eval_router.py \
  --router models/ttc-router \
  --benchmark mmlu \
  --modes low,medium,high
```

### Evaluation Metrics

| Metric | Description |
|--------|-------------|
| **Accuracy** | Correct routing decisions |
| **Efficiency** | Average compute per query |
| **Coverage** | Distribution across modes |

## Router Benchmarks

| Benchmark | Low | Medium | High | Router Choice |
|-----------|-----|--------|------|---------------|
| MMLU | 45% | 58% | 62% | Mixed |
| GSM8K | 30% | 55% | 70% | Pred. High |
| Simple QA | 85% | 86% | 87% | Pred. Low |

## Superthink Mode

For maximum reasoning:

```bash
python scripts/superthink.py \
  --model Qwen/Qwen2.5-7B-Instruct \
  --query "Complex problem..." \
  --samples 50 \
  --aggregation best_of_n
```

## Example

```
User: Train a router that knows when to use more thinking

Agent will:
1. Collect inference traces with varying compute
2. Train classifier on complexity labels
3. Evaluate on held-out benchmark
4. Return router model
```

## References

- [Router Architecture](references/router-arch.md)
- [Complexity Classification](references/complexity.md)
