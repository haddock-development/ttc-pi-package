# Config Schemas

## SFT Config Schema

```yaml
# configs/sft.yaml
model:
  base_model: "Qwen/Qwen2.5-0.5B"
  adapter_type: "lora"  # lora, qlora, or full
  lora_r: 16
  lora_alpha: 32
  lora_dropout: 0.05

data:
  dataset_path: "<dataset-path>"
  train_split: "train"
  eval_split: "eval"
  max_seq_length: 2048
  chat_template: "qwen"

training:
  num_epochs: 3
  batch_size: 4
  gradient_accumulation_steps: 4
  learning_rate: 2e-4
  warmup_ratio: 0.1
  weight_decay: 0.01

backend:
  type: "kaggle"  # kaggle, hf-jobs, local
  gpu_type: "T4"
  max_hours: 9

output:
  output_dir: "models/sft-output"
  push_to_hub: true
  hub_repo_id: "<username>/<model-name>"
```

## RLVR Config Schema

```yaml
# configs/rlvr.yaml
model:
  sft_model: "models/sft-output"
  verifier_model: "<verifier-path>"

data:
  dataset_path: "<dataset-path>"
  prompt_column: "prompt"
  response_column: "response"
  reward_column: "reward"

rlvr:
  algorithm: "grpo"  # grpo, dpo, ppo
  kl_coef: 0.1
  reward_scaling: true
  clip_range: 0.2

training:
  num_epochs: 2
  batch_size: 8
  learning_rate: 1e-5
  rollout_batch_size: 64

backend:
  type: "hf-jobs"
  gpu_type: "L4"
  max_hours: 24

output:
  output_dir: "models/rlvr-output"
  push_to_hub: true
```

## TTC Router Config Schema

```yaml
# configs/router.yaml
router:
  model: "models/router"
  num_modes: 4
  mode_names: ["low", "medium", "high", "superthink"]

thresholds:
  low:
    max_tokens: 512
    temperature: 0.7
    samples: 1
  medium:
    max_tokens: 1024
    temperature: 0.8
    samples: 3
  high:
    max_tokens: 2048
    temperature: 0.9
    samples: 10
  superthink:
    max_tokens: 4096
    temperature: 1.0
    samples: 50

router_training:
  dataset_path: "<traces-dataset>"
  feature_columns: ["prompt_length", "complexity_score"]
  label_column: "optimal_mode"

backend:
  type: "kaggle"
  gpu_type: "T4"

output:
  output_dir: "models/router-output"
```

## Retrofit Config Schema

```yaml
# configs/retrofit.yaml
source:
  model: "Qwen/Qwen2.5-0.5B"
  revision: "main"

architecture:
  # Architecture-specific changes
  modification_type: "<modification-type>"
  parameters:
    <param1>: <value1>
    <param2>: <value2>

verification:
  check_shapes: true
  check_params: true
  test_forward_pass: true
  test_input: "Hello, world!"

output:
  output_dir: "models/retrofit-output"
  push_to_hub: true
  hub_repo_id: "<username>/<modified-model>"
```

## Evaluation Config Schema

```yaml
# configs/eval.yaml
model:
  path: "models/<model-path>"
  device: "cuda"

benchmarks:
  - name: "gsm8k"
    type: "accuracy"
    split: "test"
    num_samples: 1000
  - name: "mmlu"
    type: "accuracy"
    split: "test"
    num_samples: 500
  - name: "humaneval"
    type: "pass@k"
    k: [1, 10, 100]

generation:
  max_new_tokens: 512
  temperature: 0.0  # greedy for eval
  batch_size: 8

output:
  results_dir: "results/"
  save_predictions: true
  push_to_hub: true
```
