/**
 * TTC Stack Extension for pi coding agent
 *
 * Provides tools and commands for TTC (Test-Time Compute) workflows:
 * - Training management (CPT → SFT → RLVR → TTC)
 * - Distillation pipelines
 * - Router evaluation
 * - Hyperparameter tuning
 * - Judge/reward model training
 */

export default function (pi: ExtensionAPI) {
  // Register TTC tools
  pi.registerTool({
    name: "ttc_train",
    description: "Start TTC-aware training with Qwen models. Supports CPT, SFT, RLVR stages.",
    parameters: {
      type: "object",
      properties: {
        stage: { type: "string", enum: ["cpt", "sft", "rlvr", "ttc"], description: "Training stage" },
        model: { type: "string", description: "Base model (e.g., qwen-3.5-0.8b)" },
        dataset: { type: "string", description: "Dataset path or HuggingFace ID" },
        backend: { type: "string", enum: ["kaggle", "hf-jobs", "local"], default: "kaggle" },
        profile: { type: "string", enum: ["low", "medium", "high"], default: "medium" }
      },
      required: ["stage", "model", "dataset"]
    },
    execute: async (params, ctx) => {
      const { stage, model, dataset, backend = "kaggle", profile = "medium" } = params;

      ctx.ui.notify(`Starting TTC ${stage.toUpperCase()} training on ${backend}...`);

      // Construct training command based on backend
      let command = "";
      if (backend === "kaggle") {
        command = `kaggle kernels push -p kaggle-notebooks/ttc-${stage}`;
      } else if (backend === "hf-jobs") {
        command = `huggingface-cli repo create ttc-${stage}-${Date.now()} --type space --space-sdk docker`;
      }

      const result = await ctx.tools.bash(command);

      return {
        status: "started",
        stage,
        model,
        dataset,
        backend,
        profile,
        output: result
      };
    }
  });

  pi.registerTool({
    name: "ttc_distill",
    description: "Run TTC distillation from teacher to student model.",
    parameters: {
      type: "object",
      properties: {
        teacher: { type: "string", description: "Teacher model (e.g., qwen-2.5-7b)" },
        student: { type: "string", description: "Student model (e.g., qwen-3.5-0.8b)" },
        dataset: { type: "string", description: "Dataset for distillation" },
        profile: { type: "string", enum: ["medium", "high"], default: "medium" },
        backend: { type: "string", enum: ["kaggle", "hf-jobs"], default: "hf-jobs" }
      },
      required: ["teacher", "student", "dataset"]
    },
    execute: async (params, ctx) => {
      const { teacher, student, dataset, profile = "medium", backend = "hf-jobs" } = params;

      ctx.ui.notify(`Starting distillation: ${teacher} → ${student} (${profile} profile)`);

      // Select route based on profile
      const route = profile === "high" ? "ttc_distill_high" : "ttc_distill_medium";

      return {
        status: "started",
        route,
        teacher,
        student,
        dataset,
        backend
      };
    }
  });

  pi.registerTool({
    name: "ttc_router_eval",
    description: "Evaluate TTC router for inference scaling decisions.",
    parameters: {
      type: "object",
      properties: {
        model: { type: "string", description: "Router model to evaluate" },
        benchmark: { type: "string", description: "Benchmark dataset (e.g., mmlu, gsm8k)" },
        modes: {
          type: "array",
          items: { type: "string", enum: ["low", "medium", "high", "superthink"] },
          default: ["low", "medium", "high"]
        }
      },
      required: ["model"]
    },
    execute: async (params, ctx) => {
      const { model, benchmark = "mmlu", modes = ["low", "medium", "high"] } = params;

      ctx.ui.notify(`Evaluating TTC router: ${model} on ${benchmark}`);

      return {
        status: "evaluating",
        model,
        benchmark,
        modes,
        route: "ttc_router_eval"
      };
    }
  });

  pi.registerTool({
    name: "ttc_hparam_tune",
    description: "Run Optuna hyperparameter tuning for TTC training.",
    parameters: {
      type: "object",
      properties: {
        model: { type: "string", description: "Model to tune" },
        n_trials: { type: "number", default: 50, description: "Number of Optuna trials" },
        params: {
          type: "array",
          items: { type: "string" },
          default: ["learning_rate", "batch_size", "lora_r"],
          description: "Parameters to tune"
        }
      },
      required: ["model"]
    },
    execute: async (params, ctx) => {
      const { model, n_trials = 50, params = ["learning_rate", "batch_size", "lora_r"] } = params;

      ctx.ui.notify(`Starting hparam tuning: ${n_trials} trials for ${model}`);

      return {
        status: "started",
        route: "ttc_hparam_tuning",
        model,
        n_trials,
        params
      };
    }
  });

  pi.registerTool({
    name: "ttc_judge_train",
    description: "Train a judge model for TTC evaluation.",
    parameters: {
      type: "object",
      properties: {
        base_model: { type: "string", description: "Base model for judge" },
        dataset: { type: "string", description: "Judge training dataset" },
        backend: { type: "string", enum: ["kaggle", "hf-jobs"], default: "kaggle" }
      },
      required: ["base_model", "dataset"]
    },
    execute: async (params, ctx) => {
      const { base_model, dataset, backend = "kaggle" } = params;

      ctx.ui.notify(`Training judge model: ${base_model}`);

      return {
        status: "started",
        route: "judge_training",
        base_model,
        dataset,
        backend
      };
    }
  });

  // Register commands
  pi.registerCommand("/ttc:train", {
    description: "Start TTC-aware training",
    usage: "/ttc:train <stage> <model> <dataset> [--backend <kaggle|hf-jobs>] [--profile <low|medium|high>]",
    handler: async (args, ctx) => {
      const parts = args.split(/\s+/);
      if (parts.length < 3) {
        return "Usage: /ttc:train <stage> <model> <dataset> [--backend <backend>] [--profile <profile>]";
      }
      ctx.editor.setText(`Use the ttc_train tool with: stage=${parts[0]}, model=${parts[1]}, dataset=${parts[2]}`);
      ctx.editor.submit();
    }
  });

  pi.registerCommand("/ttc:distill", {
    description: "Start TTC distillation",
    usage: "/ttc:distill <teacher> <student> <dataset> [--profile <medium|high>]",
    handler: async (args, ctx) => {
      const parts = args.split(/\s+/);
      if (parts.length < 3) {
        return "Usage: /ttc:distill <teacher> <student> <dataset> [--profile <profile>]";
      }
      ctx.editor.setText(`Use the ttc_distill tool with: teacher=${parts[0]}, student=${parts[1]}, dataset=${parts[2]}`);
      ctx.editor.submit();
    }
  });

  pi.registerCommand("/ttc:eval", {
    description: "Evaluate TTC router",
    usage: "/ttc:eval <model> [--benchmark <name>]",
    handler: async (args, ctx) => {
      const model = args.split(/\s+/)[0];
      if (!model) {
        return "Usage: /ttc:eval <model> [--benchmark <name>]";
      }
      ctx.editor.setText(`Use the ttc_router_eval tool to evaluate ${model}`);
      ctx.editor.submit();
    }
  });

  pi.registerCommand("/ttc:status", {
    description: "Show TTC stack status",
    handler: async (args, ctx) => {
      // Check for active jobs
      const status = {
        active_jobs: 0,
        last_run: null,
        routes_available: [
          "ttc_router_eval",
          "ttc_aware_training",
          "ttc_distill_medium",
          "ttc_distill_high",
          "ttc_hparam_tuning",
          "judge_training",
          "reward_training"
        ]
      };

      return `TTC Stack Status:
- Active jobs: ${status.active_jobs}
- Available routes: ${status.routes_available.join(", ")}
- Backends: kaggle_gpu_line, hf_jobs_gpu_line`;
    }
  });

  pi.registerCommand("/ttc:judge", {
    description: "Train or evaluate judge model",
    usage: "/ttc:judge train <model> <dataset> | /ttc:judge eval <model>",
    handler: async (args, ctx) => {
      const [action, model, dataset] = args.split(/\s+/);
      if (action === "train" && model && dataset) {
        ctx.editor.setText(`Use the ttc_judge_train tool with: base_model=${model}, dataset=${dataset}`);
        ctx.editor.submit();
      } else if (action === "eval" && model) {
        ctx.editor.setText(`Use the ttc_router_eval tool to evaluate judge model ${model}`);
        ctx.editor.submit();
      } else {
        return "Usage: /ttc:judge train <model> <dataset> | /ttc:judge eval <model>";
      }
    }
  });

  pi.registerCommand("/ttc:router", {
    description: "Manage TTC router",
    usage: "/ttc:router train | /ttc:router bench",
    handler: async (args, ctx) => {
      const action = args.trim();
      if (action === "train") {
        ctx.editor.setText("Use the ttc_train tool with stage=ttc to train the router");
        ctx.editor.submit();
      } else if (action === "bench") {
        ctx.editor.setText("Use the ttc_router_eval tool to benchmark the router");
        ctx.editor.submit();
      } else {
        return "Usage: /ttc:router train | /ttc:router bench";
      }
    }
  });

  // Register keyboard shortcuts
  pi.registerKeybinding("ctrl+t c", {
    description: "Quick TTC training command",
    action: () => {
      pi.notify("/ttc:train <stage> <model> <dataset>");
    }
  });

  pi.registerKeybinding("ctrl+t d", {
    description: "Quick TTC distillation command",
    action: () => {
      pi.notify("/ttc:distill <teacher> <student> <dataset>");
    }
  });

  pi.registerKeybinding("ctrl+t s", {
    description: "Show TTC status",
    action: () => {
      pi.executeCommand("/ttc:status");
    }
  });

  // Event hooks
  pi.on("tool_call", async (event, ctx) => {
    // Log TTC tool usage
    if (event.tool.startsWith("ttc_")) {
      console.log(`[TTC] Tool called: ${event.tool}`, event.params);
    }
  });

  console.log("[TTC Stack Extension] Loaded successfully");
}
