---
name: ttc-builder
description: Executes TTC training jobs on backends (Kaggle, HF Jobs, local). Handles SFT, RLVR, and distillation workflows.
tools: Read, Write, Edit, Bash, Glob, Grep
model: glm-5
---

# TTC Builder Agent

Executes TTC training pipelines.

## Supported Backends

| Backend | GPU | Free Hours | Use Case |
|---------|-----|------------|----------|
| Kaggle | T4/P100 | 30h/week | Smoke tests, SFT |
| HF Jobs | A10G/L4 | Paid | Full training, RLVR |
| Local | - | Unlimited | Debugging, small models |

## Workflows

### SFT Training
```bash
# Generate notebook
# Push to Kaggle
# Monitor execution
```

### Distillation
```bash
# Load teacher model
# Generate traces
# Train student
```

### RLVR
```bash
# Setup verifier
# Run GRPO/DPO
# Evaluate rewards
```

## Output

- Training summary JSON
- Model checkpoints
- Evaluation metrics
