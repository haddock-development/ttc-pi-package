# @haddock/ttc-stack

TTC (Test-Time Compute) Inference Scaling Stack for the **pi coding agent**.

## Installation

```bash
pi install git:github.com/haddock-development/ttc-pi-package
```

Or with HTTPS:
```bash
pi install https://github.com/haddock-development/ttc-pi-package
```

## What's Included

### Extensions

- **ttc-tools.ts** - Custom tools and commands for TTC workflows

### Skills

| Skill | Description |
|-------|-------------|
| `ttc-training` | TTC-aware training (CPT → SFT → RLVR → TTC) |
| `ttc-distill` | Knowledge distillation from teacher to student |
| `ttc-router` | Router training and evaluation for compute scaling |
| `ttc-hparam` | Optuna-based hyperparameter tuning |
| `ttc-judge` | Judge model training for output evaluation |

### Prompt Templates

- `/ttc-train` - Start TTC-aware training
- `/ttc-distill` - Run distillation
- `/ttc-eval` - Evaluate router

### Themes

- **TTC Dark** - Dark theme with TTC mode colors
- **TTC Light** - Light theme with TTC mode colors

## Quick Start

After installation, use the TTC commands:

```
/ttc:train sft qwen-3.5-0.8b my-dataset --backend kaggle
/ttc:distill qwen-2.5-7b qwen-3.5-0.8b my-data --profile high
/ttc:eval my-router --benchmark mmlu
/ttc:status
```

## Tools Available

| Tool | Description |
|------|-------------|
| `ttc_train` | Start TTC training job |
| `ttc_distill` | Run distillation pipeline |
| `ttc_router_eval` | Evaluate router performance |
| `ttc_hparam_tune` | Hyperparameter optimization |
| `ttc_judge_train` | Train judge model |

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+T C` | Quick training command |
| `Ctrl+T D` | Quick distillation command |
| `Ctrl+T S` | Show TTC status |

## TTC Modes

The TTC router decides compute level per query:

| Mode | Samples | Time | Use Case |
|------|---------|------|----------|
| **low** | 1 | ~1s | Simple queries |
| **medium** | 3 | ~5s | Standard tasks |
| **high** | 10 | ~30s | Complex reasoning |
| **superthink** | 50 | ~2min | Hardest problems |

## Backends

| Backend | GPU | Cost | Limit |
|---------|-----|------|-------|
| **kaggle** | T4/P100 | Free | 30h/week |
| **hf-jobs** | A10G/L4 | ~$1-2/h | Unlimited |

## Example Workflow

```
# 1. Train base model with SFT
/ttc:train sft qwen-3.5-0.8b instruction-data --backend kaggle

# 2. Distill from larger teacher
/ttc:distill qwen-2.5-7b qwen-3.5-0.8b math-data --profile high

# 3. Train router
/ttc:router train

# 4. Evaluate
/ttc:eval my-model --benchmark gsm8k
```

## License

MIT
