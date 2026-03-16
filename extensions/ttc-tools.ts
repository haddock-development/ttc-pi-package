/**
 * TTC Stack Extension for pi coding agent
 *
 * Provides tools and commands for TTC (Test-Time Compute) workflows:
 * - Training management (CPT → SFT → RLVR → TTC)
 * - Distillation pipelines
 * - Router evaluation
 * - Hyperparameter tuning
 * - Judge/reward model training
 *
 * Usage:
 * 1. Copy this file to ~/.pi/agent/extensions/ or your project's .pi/extensions/
 * 2. Use /ttc:train, /ttc:distill, /ttc:eval, /ttc:status
 */

import type { ExtensionAPI, from "@mariozechner/pi-coding-agent";

// TTC Stack configuration
interface TTCConfig {
    activeJobs: string[];
    lastRun: string | null;
    routesAvailable: string[];
}

let config: TTCConfig = {
    activeJobs: [],
    lastRun: null,
    routesAvailable: [
        "ttc_router_eval",
        "ttc_aware_training",
        "ttc_distill_medium",
        "ttc_distill_high",
        "ttc_hparam_tuning",
        "judge_training",
        "reward_training"
    ]
};

export default function ttcExtension(pi: ExtensionAPI) {
    // Register /ttc:train command
    pi.registerCommand("ttc:train", {
        description: "Start TTC-aware training (CPT → SFT → RLVR → TTC)",
        getArgumentCompletions: (prefix) => {
            const stages = ["cpt", "sft", "rlvr", "ttc"];
            const filtered = stages.filter(s => s.startsWith(prefix));
            return filtered.length > 0 ? filtered.map(s => ({ value: s, label: s })) : null;
        },
        handler: async (args, ctx) => {
            const parts = args.trim().split(/\s+/);
            if (parts.length < 3) {
                ctx.ui.notify("Usage: /ttc:train <stage> <model> <dataset> [--backend <kaggle|hf-jobs>] [--profile <low|medium|high>]", "error");
                return;
            }

            const stage = parts[0];
            const model = parts[1];
            const dataset = parts[2];
            const backend = parts.includes("--backend") ? parts[parts.indexOf("--backend") + 1] : "kaggle";
            const profile = parts.includes("--profile") ? parts[parts.indexOf("--profile") + 1] : "medium";

            ctx.ui.notify(`Starting TTC ${stage.toUpperCase()} training for ${model} on ${backend}...`, "info");

            // Insert training request into editor
            const trainingPrompt = `Use the ttc-training skill to run ${stage.toUpperCase()} training for ${model} on the ${dataset} dataset with ${backend} backend and ${profile} profile.`;
            ctx.editor.setText(trainingPrompt);
            ctx.editor.submit();
        }
    });

    // Register /ttc:distill command
    pi.registerCommand("ttc:distill", {
        description: "Start TTC distillation (teacher → student)",
        getArgumentCompletions: (prefix) => {
            const profiles = ["medium", "high"];
            const filtered = profiles.filter(p => p.startsWith(prefix));
            return filtered.length > 0 ? filtered.map(p => ({ value: p, label: p })) : null;
        },
        handler: async (args, ctx) => {
            const parts = args.trim().split(/\s+/);
            if (parts.length < 3) {
                ctx.ui.notify("Usage: /ttc:distill <teacher> <student> <dataset> [--profile <medium|high>]", "error");
                return;
            }

            const teacher = parts[0];
            const student = parts[1];
            const dataset = parts[2];
            const profile = parts.includes("--profile") ? parts[parts.indexOf("--profile") + 1] : "medium";

            ctx.ui.notify(`Starting distillation: ${teacher} → ${student} (${profile} profile)...`, "info");

            const distillPrompt = `Use the ttc-distill skill to distill ${teacher} into ${student} using the ${dataset} dataset with ${profile} profile.`;
            ctx.editor.setText(distillPrompt);
            ctx.editor.submit();
        }
    });

    // Register /ttc:eval command
    pi.registerCommand("ttc:eval", {
        description: "Evaluate TTC router performance",
        handler: async (args, ctx) => {
            const model = args.trim();
            if (!model) {
                ctx.ui.notify("Usage: /ttc:eval <model>", "error");
                return;
            }

            ctx.ui.notify(`Evaluating TTC router ${model}...`, "info");
            const evalPrompt = `Use the ttc-router skill to evaluate the TTC router ${model}.`;
            ctx.editor.setText(evalPrompt);
            ctx.editor.submit();
        }
    });

    // Register /ttc:status command
    pi.registerCommand("ttc:status", {
        description: "Show TTC stack status",
        handler: async (_args, ctx) => {
            const statusItems = [
                "--- TTC Stack Status ---",
                `Active jobs: ${config.activeJobs.length || "none"}`,
                `Last run: ${config.lastRun || "never"}`,
                "",
                "--- Available Routes ---",
                ...config.routesAvailable.map(r => `  • ${r}`),
                "",
                "--- Backends ---",
                "  • kaggle_gpu_line (free, 30h/week)",
                "  • hf_jobs_gpu_line (paid, unlimited)"
            ];

            await ctx.ui.select("TTC Stack Status", statusItems);
        }
    });

    // Register /ttc:judge command
    pi.registerCommand("ttc:judge", {
        description: "Train or evaluate judge model",
        getArgumentCompletions: (prefix) => {
            const actions = ["train", "eval"];
            const filtered = actions.filter(a => a.startsWith(prefix));
            return filtered.length > 0 ? filtered.map(a => ({ value: a, label: a })) : null;
        },
        handler: async (args, ctx) => {
            const parts = args.trim().split(/\s+/);
            const action = parts[0];

            if (action === "train" && parts.length >= 3) {
                const model = parts[1];
                const dataset = parts[2];
                ctx.ui.notify(`Training judge model ${model}...`, "info");
                const judgePrompt = `Use the ttc-judge skill to train a judge model from ${model} on the ${dataset} dataset.`;
                ctx.editor.setText(judgePrompt);
                ctx.editor.submit();
            } else if (action === "eval" && parts.length >= 2) {
                const model = parts[1];
                ctx.ui.notify(`Evaluating judge model ${model}...`, "info");
                const evalPrompt = `Use the ttc-router skill to evaluate the judge model ${model}.`;
                ctx.editor.setText(evalPrompt);
                ctx.editor.submit();
            } else {
                ctx.ui.notify("Usage: /ttc:judge train <model> <dataset> | /ttc:judge eval <model>", "error");
            }
        }
    });

    // Register /ttc:router command
    pi.registerCommand("ttc:router", {
        description: "Manage TTC router",
        getArgumentCompletions: (prefix) => {
            const actions = ["train", "bench"];
            const filtered = actions.filter(a => a.startsWith(prefix));
            return filtered.length > 0 ? filtered.map(a => ({ value: a, label: a })) : null;
        },
        handler: async (args, ctx) => {
            const action = args.trim();

            if (action === "train") {
                ctx.ui.notify("Starting router training...", "info");
                const routerPrompt = "Use the ttc-router skill to train a TTC router for inference scaling decisions.";
                ctx.editor.setText(routerPrompt);
                ctx.editor.submit();
            } else if (action === "bench") {
                ctx.ui.notify("Benchmarking router...", "info");
                const benchPrompt = "Use the ttc-router skill to benchmark the TTC router performance across different inference modes.";
                ctx.editor.setText(benchPrompt);
                ctx.editor.submit();
            } else {
                ctx.ui.notify("Usage: /ttc:router train | /ttc:router bench", "error");
            }
        }
    });

    // Register /ttc:hparam command
    pi.registerCommand("ttc:hparam", {
        description: "Run Optuna hyperparameter tuning",
        handler: async (args, ctx) => {
            const parts = args.trim().split(/\s+/);
            if (parts.length < 1) {
                ctx.ui.notify("Usage: /ttc:hparam <model> [--trials <n>]", "error");
                return;
            }

            const model = parts[0];
            const trials = parts.includes("--trials") ? parts[parts.indexOf("--trials") + 1] : "50";

            ctx.ui.notify(`Starting hyperparameter tuning for ${model} (${trials} trials)...`, "info");

            const hparamPrompt = `Use the ttc-hparam skill to run Optuna hyperparameter tuning for ${model} with ${trials} trials.`;
            ctx.editor.setText(hparamPrompt);
            ctx.editor.submit();
        }
    });

    // Event hook for tool usage logging
    pi.on("tool_call", async (event, _ctx) => {
        if (event.tool && event.tool.startsWith("ttc_")) {
            console.log(`[TTC Extension] Tool called: ${event.tool}`);
            config.lastRun = new Date().toISOString();
        }
    });

    console.log("[TTC Extension] Loaded successfully");
}
