---
title: Korao
date: 2026-02-01
org: Personal
category: personal
featured: true
summary: A macOS task app that follows real working hours, stays usable offline, and stays small — Tauri, Rust, and React.
tech: [Tauri, Rust, React, TypeScript, Firebase]
tags: [Tauri]
links:
  - label: korao.app
    href: https://www.korao.app/
---

## Problem

Most task apps assume a 9-to-5, a live connection, and a pile of tags before you can write down what to do. Night shifts, freelance hours, and a dead network all break that model. I wanted a local companion that respects when I actually work, does not rewrite yesterday, and still syncs when I am back online.

## Approach

I shipped [Korao](https://www.korao.app/) as a native macOS app (11+, Apple Silicon and Intel) with Tauri: React and TypeScript for the UI, Rust for the shell, Firebase and Google sign-in for sync. The product decisions were the work.

- **Working hours.** You set the window you actually work, including nights. Tasks created inside that window default to today.
- **Offline first.** Create, edit, and complete without a network. Changes sync when the connection returns.
- **A calendar that is a filter.** Color by density; click a date to see that day. Overdue tasks go red. Done tasks sink.
- **Protected history.** Past tasks are read-only so a slip does not rewrite the record.
- **A small surface.** State and date filters. No project trees, priority taxonomies, or notification noise. Dark mode. Install is about 15MB — not an Electron bag.

Releases, bugs, and feedback were part of the cycle, not a leftover.

## Outcome

Korao is live at [korao.app](https://www.korao.app/): free for macOS, no subscription. It is a working install path for a task list that follows the hours you set and does not go blank offline.

## Tech

Tauri, Rust, React, TypeScript, and Firebase.
