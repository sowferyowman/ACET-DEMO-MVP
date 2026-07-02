# ACET-DEMO-MVP
An adaptive mock examination platform for high-stakes exam prep for Ateneo University

### Out-of-Scope 
* Live Server Hosting Infrastructure Setup 
* Production Cloud Database Provisioning & Management
* Continuous Infrastructure & Server-Side Security Monitoring
* DevOps/SysAdmin Live Operations and Maintenance

---

## Tech Stack (Local Development & Testing)

| Layer | Technology / Tool | Purpose / Function |
| :--- | :--- | :--- |
| **Frontend UI** | Next.js 14 (App Router) + Tailwind CSS | Responsive, interactive, and modular user workspace modules |
| **State & Logic** | React Hooks / Zustand | Direct client-side session management, answer capturing, and timing constraints |
| **Local Testing DB** | Mock JSON Architecture / LocalStorage | Capturing and loading mock structural exams, performance logs, and temporary user metrics |

---

## Prerequisites

* **Node.js** v18.0.0 o +
* **npm** or **yarn** package manager
* **Git** installed locally

## Pulling Changes
```bash
git branch 
# checks what branch you are in
# you must be in [your-branch] before doing the next steps
git fetch origin
git merge origin/development-branch
```
**Note: Always pull from the repository before pushing your changes.**

## Adding/Pushing your Changes Workflow
```bash
git checkout -b [your-branch]
# make your changes
git add .
git commit -m "[see format below]: describe what you did"
# example git commit -m "[feat]: created login page"
git push origin [your-branch]
# example git push origin mejia-branch
```
---

## Commit Message Format
```
feat:     new feature added
fix:      bug fix
chore:    config, deps, tooling (no logic change)
refactor: code restructure, no behavior change
docs:     documentation only
style:    formatting only
test:     adding or fixing tests
```

---
## Creating a Pull Request
This is to be done **every time you push changes** to the repo.
1. Go to the repo on GitHub — you'll see a **Compare & pull request banner**
2. Click it, or go to **Pull requests → New pull request**
3. base: **development-branch** ← compare: **your-branch**
4. Write a *short description of what you did*, which pages/files you changed and what changed in them
5. Click **Create pull request**
