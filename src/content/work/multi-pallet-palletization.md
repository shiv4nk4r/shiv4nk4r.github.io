---
title: Multi-pallet palletization
date: 2025-09-01
org: GreyOrange
category: research
featured: true
summary: A two-phase iterative heuristic for palletization in robotics-integrated warehousing.
tech: [Python, heuristics]
tags: [ALNS, OR]
links: []
---

## Problem

Palletization sets throughput in a robotics-integrated warehouse. A weak packing hits cartons-per-hour, robot travel, operator idle time, and how well robots and people stay coordinated during pick and load. Constraint-based 3D bin packing and Adaptive Large Neighborhood Search could state the problem, but they did not scale under heterogeneous item sizes, routing-dependent pickups, and stability while the pallet is still being built.

## Approach

Phase 1 groups items into pallets with warehouse factors: pickup proximity, volume and weight balance, stacking compatibility, fewer robot trips, less operator wait. Phase 2 checks each pallet with a coordinate assignment solver for geometry and stacking stability. Fill ratio is walked between 70% and 80% until the packing is feasible and usable.

Further method, data, and production detail are confidential and bound by a company contract.

## Outcome

The pipeline stayed under 10 seconds for 700+ items and improved volume use and robot travel relative to the formulations that did not scale. I cannot say more here.

## Tech

Python and the two-phase heuristic. The rest is under contract.
