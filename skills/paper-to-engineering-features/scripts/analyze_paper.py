#!/usr/bin/env python3
"""
Paper Analysis Helper Script

Analyzes a paper URL and extracts engineering features for Qwen 3.5 0.8B adaptation.
"""

import argparse
import json
import re
import sys
from dataclasses import dataclass, asdict
from typing import Optional
from urllib.parse import urlparse


@dataclass
class EngineeringFeature:
    category: str
    name: str
    description: str
    implementation_complexity: str  # low, medium, high
    ttc_stage: str  # cpt, sft, rlvr, ttc


@dataclass
class PaperAnalysis:
    paper_id: str
    source: str  # hf, arxiv
    title: str
    abstract: str
    features: list[EngineeringFeature]
    skill_suggestions: list[dict]
    ascii_diagram: Optional[str]


def parse_paper_url(url: str) -> tuple[str, str]:
    """Extract paper ID and source from URL."""
    if "huggingface.co/papers/" in url:
        paper_id = url.split("/papers/")[-1].split("?")[0]
        return paper_id, "hf"
    elif "arxiv.org" in url:
        # Handle various arxiv URL formats
        match = re.search(r"(\d{4}\.\d{4,5}|[a-z-]+/\d+)", url)
        if match:
            return match.group(1), "arxiv"
    raise ValueError(f"Unknown paper URL format: {url}")


def extract_features_from_abstract(abstract: str) -> list[EngineeringFeature]:
    """Extract engineering features from paper abstract."""
    features = []
    abstract_lower = abstract.lower()

    # Architecture keywords
    arch_keywords = {
        "attention": ("Architecture", "Attention mechanism modification"),
        "skip connection": ("Architecture", "Skip connection pattern"),
        "residual": ("Architecture", "Residual connection"),
        "moe": ("Architecture", "Mixture of Experts"),
        "sparse": ("Architecture", "Sparse activation"),
        "parallel": ("Architecture", "Parallel computation"),
    }

    # Training keywords
    train_keywords = {
        "curriculum": ("Training", "Curriculum learning"),
        "regularization": ("Training", "Regularization technique"),
        "optimization": ("Training", "Optimization method"),
        "loss function": ("Training", "Custom loss function"),
        "reward": ("Training", "Reward-based training"),
        "distillation": ("Training", "Knowledge distillation"),
    }

    # Algorithm keywords
    algo_keywords = {
        "sampling": ("Algorithm", "Sampling strategy"),
        "routing": ("Algorithm", "Routing mechanism"),
        "beam": ("Algorithm", "Beam search variant"),
        "decode": ("Algorithm", "Decoding strategy"),
        "verifier": ("Algorithm", "Verification mechanism"),
    }

    all_keywords = {**arch_keywords, **train_keywords, **algo_keywords}

    for keyword, (category, description) in all_keywords.items():
        if keyword in abstract_lower:
            # Determine complexity
            complexity = "medium"
            if any(x in keyword for x in ["attention", "moe", "routing"]):
                complexity = "high"
            elif any(x in keyword for x in ["loss", "decode"]):
                complexity = "low"

            # Determine TTC stage
            stage = "sft"
            if any(x in keyword for x in ["attention", "residual", "sparse"]):
                stage = "cpt"
            elif any(x in keyword for x in ["reward", "verifier", "routing"]):
                stage = "rlvr"
            elif any(x in keyword for x in ["sampling", "beam", "decode"]):
                stage = "ttc"

            features.append(EngineeringFeature(
                category=category,
                name=keyword,
                description=description,
                implementation_complexity=complexity,
                ttc_stage=stage
            ))

    return features


def suggest_skills(features: list[EngineeringFeature], paper_id: str) -> list[dict]:
    """Suggest skill names based on extracted features."""
    skills = []
    short_id = paper_id[:10].replace(".", "-")

    # Always suggest architecture lab if architecture features exist
    arch_features = [f for f in features if f.category == "Architecture"]
    if arch_features:
        skills.append({
            "name": f"qwen-{short_id}-architecture-lab",
            "type": "architecture",
            "purpose": "Architecture retrofit and validation",
            "backend": "kaggle"
        })

    # Suggest bridge if multiple stages involved
    stages = set(f.ttc_stage for f in features)
    if len(stages) > 1:
        skills.append({
            "name": f"qwen-{short_id}-bridge",
            "type": "bridge",
            "purpose": "Bridge to downstream training stages",
            "backend": "local"
        })

    # Suggest HF Jobs if high complexity features exist
    high_complexity = [f for f in features if f.implementation_complexity == "high"]
    if high_complexity:
        skills.append({
            "name": f"qwen-{short_id}-hf-jobs",
            "type": "hf-jobs",
            "purpose": "Full-scale training on HF Jobs",
            "backend": "hf-jobs"
        })

    # Always suggest smoke test
    skills.append({
        "name": f"qwen-{short_id}-kaggle-smoke",
        "type": "smoke",
        "purpose": "Quick validation on Kaggle",
        "backend": "kaggle"
    })

    # Suggest retrofit if architecture changes
    if arch_features:
        skills.append({
            "name": f"qwen-{short_id}-retrofit-lab",
            "type": "retrofit",
            "purpose": "Checkpoint surgery and packaging",
            "backend": "local"
        })

    return skills


def generate_ascii_diagram(features: list[EngineeringFeature], paper_id: str) -> str:
    """Generate a simple ASCII architecture diagram."""
    arch_features = [f for f in features if f.category == "Architecture"]

    if not arch_features:
        return f"""
    ┌─────────────────────────────┐
    │      Qwen 3.5 0.8B          │
    │                             │
    │  (No architecture changes   │
    │   detected from paper)      │
    │                             │
    └─────────────────────────────┘
    """

    mods = ", ".join(f.name for f in arch_features[:3])
    return f"""
    ┌─────────────────────────────────────────────┐
    │              Qwen 3.5 0.8B                  │
    │  ┌─────────────────────────────────────┐   │
    │  │           Embedding Layer           │   │
    │  └──────────────────┬──────────────────┘   │
    │                     ▼                       │
    │  ┌─────────────────────────────────────┐   │
    │  │        Transformer Layers           │   │
    │  │                                     │   │
    │  │   Modifications: {mods:<20}│   │
    │  │                                     │   │
    │  └──────────────────┬──────────────────┘   │
    │                     ▼                       │
    │  ┌─────────────────────────────────────┐   │
    │  │           Output Head               │   │
    │  └─────────────────────────────────────┘   │
    └─────────────────────────────────────────────┘
    """


def analyze_paper(url: str, abstract: Optional[str] = None, title: Optional[str] = None) -> PaperAnalysis:
    """Analyze a paper and extract engineering features."""
    paper_id, source = parse_paper_url(url)

    if not abstract:
        abstract = "No abstract provided. Please fetch from source."

    features = extract_features_from_abstract(abstract)
    skills = suggest_skills(features, paper_id)
    diagram = generate_ascii_diagram(features, paper_id)

    return PaperAnalysis(
        paper_id=paper_id,
        source=source,
        title=title or f"Paper {paper_id}",
        abstract=abstract[:500] + "..." if len(abstract) > 500 else abstract,
        features=features,
        skill_suggestions=skills,
        ascii_diagram=diagram
    )


def main():
    parser = argparse.ArgumentParser(description="Analyze paper for engineering features")
    parser.add_argument("url", help="Paper URL (HF Papers or arXiv)")
    parser.add_argument("--abstract", help="Paper abstract (if not fetching)")
    parser.add_argument("--title", help="Paper title (if not fetching)")
    parser.add_argument("--output", "-o", help="Output JSON file")
    parser.add_argument("--json", action="store_true", help="Output as JSON")

    args = parser.parse_args()

    try:
        analysis = analyze_paper(args.url, args.abstract, args.title)
        result = asdict(analysis)

        if args.output:
            with open(args.output, "w") as f:
                json.dump(result, f, indent=2)
            print(f"Analysis saved to {args.output}")
        elif args.json:
            print(json.dumps(result, indent=2))
        else:
            print(f"\n{'='*60}")
            print(f"Paper: {analysis.title}")
            print(f"ID: {analysis.paper_id} ({analysis.source})")
            print(f"{'='*60}\n")
            print(f"Abstract:\n{analysis.abstract[:200]}...\n")
            print(f"\nEngineering Features ({len(analysis.features)}):")
            for f in analysis.features:
                print(f"  [{f.category}] {f.name}: {f.description}")
                print(f"    Complexity: {f.implementation_complexity}, Stage: {f.ttc_stage}")
            print(f"\nSuggested Skills ({len(analysis.skill_suggestions)}):")
            for s in analysis.skill_suggestions:
                print(f"  - {s['name']} ({s['type']}): {s['purpose']}")
            print(f"\nArchitecture Diagram:")
            print(analysis.ascii_diagram)

    except Exception as e:
        print(f"Error: {e}", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()
