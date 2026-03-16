---
name: ttc-distill
description: Distill knowledge from a teacher model to a student model.
---

Distill knowledge from {{teacher}} to {{student}}.

## Distillation Pipeline

1. **Load Teacher**: Load frozen teacher model
2. **Prepare Student**: Initialize student with LoRA adapters
3. **Generate Traces**: Run teacher on distillation dataset
4. **Train Student**: Minimize KL divergence with teacher outputs
5. **Evaluate**: Check student performance on benchmarks

## Profile Selection

| Profile | Compute | Teacher Size | Cost |
|---------|---------|--------------|------|
| medium | Kaggle T4 | ≤7B | Free |
| high | HF A10G | ≤72B | ~$10 |

## Usage
```
Use the ttc_distill tool with teacher={{teacher}}, student={{student}}, profile={{profile}}.
```
