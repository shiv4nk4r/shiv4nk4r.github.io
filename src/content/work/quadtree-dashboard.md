---
title: Manager dashboard · QuadTree
date: 2024-09-01
org: GreyOrange
category: industry
featured: true
summary: A QuadTree kept a warehouse manager dashboard interactive while plotting thousands of points.
tech: [React, JavaScript, QuadTree]
links:
  - label: Live demo
    href: https://shiv4nk4r.github.io/react-quad-tree-map-visualizer/
  - label: GitHub
    href: https://github.com/shiv4nk4r/react-quad-tree-map-visualizer
---

## Problem

The in-house manager dashboard slowed to a crawl when it rendered thousands of data points in React.

## Approach

I partitioned points with a QuadTree so the UI only mounted markers that mattered for the current viewport, then shipped a public visualizer of the same idea without internal data.

## Outcome

Load time and interaction cost on the dashboard improved by 5×. The manager dashboard work sat alongside a 30% improvement in warehouse oversight and a 10% increase in revenue from the broader feature set, and backend work on the same product line cut server response time by 40%.

## Tech

React, JavaScript, and a QuadTree spatial index.
