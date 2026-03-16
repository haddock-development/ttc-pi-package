---
name: ttc-hparam
description: Hyperparameter tuning skill for TTC training using Optuna. Use when optimizing learning rate, batch size, LoRA rank, and other training parameters.
compatibility: Requires Optuna installed and compute backend
---

# TTC Hyperparameter Tuning Skill

Automated hyperparameter search for TTC training pipelines using Optuna.

## Setup

```bash
pip install optuna optuna-integration
```

## Tunable Parameters

| Parameter | Range | Default |
|-----------|-------|---------|
| `learning_rate` | 1e-6 to 1e-3 | 2e-5 |
| `batch_size` | 1, 2, 4, 8, 16 | 4 |
| `lora_r` | 4, 8, 16, 32, 64 | 16 |
| `lora_alpha` | 8, 16, 32 | 32 |
| `warmup_ratio` | 0.0 to 0.2 | 0.1 |
| `weight_decay` | 0.0 to 0.1 | 0.01 |

## Quick Tune

```bash
python scripts/optuna_tune.py \
  --model Qwen/Qwen3.5-0.8B \
  --dataset path/to/data \
  --n-trials 20 \
  --backend kaggle \
  --metric eval_loss
```

## Full Sweep

```bash
python scripts/optuna_tune.py \
  --model Qwen/Qwen3.5-0.8B \
  --dataset path/to/data \
  --n-trials 100 \
  --backend hf-jobs \
  --metric eval_loss \
  --pruner median \
  --sampler tpe
```

## Study Configuration

```python
import optuna

def objective(trial):
    lr = trial.suggest_float("learning_rate", 1e-6, 1e-3, log=True)
    batch_size = trial.suggest_categorical("batch_size", [1, 2, 4, 8])
    lora_r = trial.suggest_categorical("lora_r", [4, 8, 16, 32])

    # Run training with these params
    loss = train_and_evaluate(lr, batch_size, lora_r)
    return loss
```

## Output

After tuning:
- `optuna_study.db` - SQLite database with all trials
- `best_params.json` - Optimal hyperparameters
- `optuna_dashboard.html` - Visualization report

## Example

```
User: Tune hyperparameters for my SFT training on Qwen 0.8B

Agent will:
1. Define search space
2. Launch Optuna study
3. Run trials on backend
4. Report best parameters
5. Save study results
```

## Best Practices

1. **Start small**: 10-20 trials for quick exploration
2. **Use pruning**: Stop bad trials early
3. **Log everything**: Track all metrics
4. **Cross-validate**: Run multiple seeds
