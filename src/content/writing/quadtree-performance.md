---
title: Keeping a dashboard fast with a QuadTree
date: 2025-09-19
summary: How a QuadTree let a warehouse dashboard render thousands of points without freezing the UI.
---

A warehouse dashboard that plots thousands of points will freeze if React paints every marker on every frame. I used a QuadTree to keep only the points that matter for the current viewport in the React tree.

The public visualizer is the same idea, stripped of internal data: [live demo](https://shiv4nk4r.github.io/react-quad-tree-map-visualizer/) and [source](https://github.com/shiv4nk4r/react-quad-tree-map-visualizer).

On the internal dashboard this cut load time and interaction cost by 5×. The case study is under Work: [Manager dashboard / QuadTree](/work/quadtree-dashboard).
