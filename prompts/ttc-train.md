---
name: ttc-train
description: Start TTC-aware training with optimal settings for the specified stage and model.
---

Train a Qwen model using the TTC-aware training pipeline.

## Parameters
- `stage`: Training stage (cpt, sft, rlvr, ttc)
- `model`: Base model ID
- `dataset`: Training dataset path
- `backend`: Compute backend (kaggle, hf-jobs, local)

## Stage Details

{{#if (eq stage "cpt")}}
### CPT (Continued Pre-Training)
- Focus: Domain adaptation
- Data: Raw text corpus
- Duration: 2-4 hours on Kaggle
{{/if}}

{{#if (eq stage "sft")}}
### SFT (Supervised Fine-Tuning)
- Focus: Instruction following
- Data: Instruction-response pairs
- Duration: 1-2 hours on Kaggle
{{/if}}

{{#if (eq stage "rlvr")}}
### RLVR (RL with Verifiable Rewards)
- Focus: Reasoning improvement
- Data: Problems with verifiable answers
- Duration: 4-8 hours on HF Jobs
{{/if}}

{{#if (eq stage "ttc")}}
### TTC-Aware Training
- Focus: Test-time compute optimization
- Data: Mixed complexity tasks
- Duration: 6-12 hours on HF Jobs
{{/if}}

## Usage
```
Use the ttc_train tool to start {{stage}} training for {{model}} on {{dataset}} with {{backend}} backend.
```
