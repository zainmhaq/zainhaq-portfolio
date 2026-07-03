---
title: "AI-powered documentation quality scoring tool: social media post"
summary: A public-facing explanation of an internal AI documentation tool and the decisions behind it.
docType: Social media post
audience: Hiring managers, content leads, and technical writing teams
purpose: Shows how I explain an internal documentation tool in a concise, public-facing format.
note: This is a portfolio writing sample based on an internal documentation tool I built.
highlights:
  - Explains an internal tool to readers outside the company
  - "Explains design trade-offs: selective AI use, cost, calibration against human review"
  - Presents AI as a review aid rather than a replacement for editorial judgment
pdf: ai-documentation-quality-scoring-tool-social-post.pdf
order: 4
---

AI has made it easier for teams to create more documentation, but harder to keep it accurate, consistent, and useful.

Documentation often draws on input from product managers, engineers, solutions architects, support engineers, and technical writers. More drafts mean more source material to check and more chances for small issues to slip through.

I kept seeing that pattern in review, so I built an AI-powered documentation quality scoring tool while working as a technical writer at Amazon.

I first built it as a VS Code extension for Markdown drafts. Each document received a score out of 5, along with the issues behind the score.

The score combined writing quality with technical accuracy, including unclear structure, long sentences, inconsistent terms, missing context, and claims that seemed to conflict with approved source material.

Because cost mattered, I used Claude Sonnet selectively and reserved AI review for the checks where it added the most value.

I didn't build the tool to replace peer review. The goal was to give reviewers a better starting point. I tested the scores against documents I had already reviewed by hand, then adjusted the scoring until the feedback matched the main issues a strong reviewer would catch.

Later, I added a CLI version for batch scoring web pages and Word documents. That moved the tool beyond individual Markdown drafts and made it useful for assessing documentation quality at a larger scale.

The tool also made documentation quality easier to see. Teams could spot weak docs faster, compare quality across formats, and decide what to fix first.

## Why this sample matters

This sample shows how I turn an internal documentation tool into concise, audience-aware content. It explains the problem, design choices, and workflow value without relying on proprietary implementation details.
