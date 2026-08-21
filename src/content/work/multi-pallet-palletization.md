---
title: Multi-pallet palletization
date: 2025-09-01
org: GreyOrange
category: research
featured: true
summary: A two-phase heuristic plus Adaptive Large Neighborhood Search for 3D multi-pallet bin packing at warehouse scale.
tech: [Python, heuristics, ALNS]
links:
  - label: GitHub
    href: https://github.com/shiv4nk4r/multi-pallet-palletizer
---

## Problem

Multi-pallet 3D packing is a bin-packing problem that standard constraint solvers did not finish on large, real fulfillment datasets.

## Approach

I designed a two-phase strategy: a fast constructive heuristic for a feasible packing, then Adaptive Large Neighborhood Search to refine it. The work included benchmarking heuristics, constraint solvers, and metaheuristics on internal data.

## Outcome

The pipeline produced usable packings on dataset sizes where a straight constraint model stalled. Research and code live in the public palletizer repo.

## Tech

Python, custom heuristics, and ALNS. See the GitHub repository for the solver layout.
