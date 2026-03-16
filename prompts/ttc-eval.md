---
name: ttc-eval
description: Evaluate TTC router on standard benchmarks.
---

Evaluate the TTC router for {{model}} on {{benchmark}}.

## Evaluation Modes

- **low**: Single sample, fast inference
- **medium**: 3 samples with majority voting
- **high**: 10 samples with best-of-n selection
- **superthink**: 50 samples with aggregation

## Benchmarks

| Benchmark | Focus | Expected Modes |
|-----------|-------|----------------|
| MMLU | Knowledge | Mixed |
| GSM8K | Math | High/Superthink |
| HumanEval | Code | Medium/High |
| SimpleQA | Facts | Low |

## Usage
```
Use the ttc_router_eval tool to evaluate {{model}} on {{benchmark}} across modes: {{modes}}.
```
