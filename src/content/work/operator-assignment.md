---
title: Operator assignment
date: 2025-06-01
org: GreyOrange
category: research
featured: true
summary: Synchronizing human operators with robotic tasks by modeling assignment as a vehicle routing problem.
tech: [Python, OR-Tools, Node.js]
links: []
---

## Problem

Warehouse operators and robots were assigned independently. Idle time stacked up, and service levels slipped when a human was not where a robot needed them.

## Approach

I scoped the work as a vehicle routing problem, then compared heuristics, constraint solvers, and a custom search against production-scale logs. The solver had to respect skills, travel, and live warehouse constraints—not a textbook VRP.

## Outcome

The assignment solver reached ~85% of the theoretical best of the existing algorithm and was used in production assignment.

## Tech

Python, OR-Tools, and Node.js services that exposed assignments to the warehouse stack.
