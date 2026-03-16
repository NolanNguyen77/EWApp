---
name: ui-ux-pro-max
description: "UI/UX design intelligence. 50+ styles, 21+ palettes, 50+ font pairings, 20+ charts. Actions: plan, build, design, review, improve, optimize UI/UX code."
---

# UI/UX Pro Max Skill

This skill provides expert UI/UX design intelligence. It helps you plan projects, choose styles, colors, and typography, and follow best practices.

## Workflow

1.  **Research:** Use the `search` command to find UI/UX strategies for your project.
2.  **Strategy:** Apply the recommended styles, colors, and patterns.
3.  **Execution:** Build components following the provided snippets and UX guidelines.

## Available Resources

-   **Search Script:** `python scripts/search.py`
-   **CSV Data:** Located in `data/` directory.
-   **Stack Snippets:** Located in `data/stacks/`.

## Instructions

When you identify a UI/UX task, use this skill to:

1.  Call `python scripts/search.py "<your query>"` to get a design strategy.
2.  Analyze the `Visual Identity`, `Color Palette`, `Typography`, and `Landing Page Strategy`.
3.  Implement the design using the recommended `Implementation Snippet`.
4.  Verify the implementation against `data/ux-guidelines.csv`.

### Example Query
`python scripts/search.py "fintech mobile app with dark mode"`
