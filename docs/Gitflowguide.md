# FleetPesa — Git Flow Guide

Share this with the whole team. This is our standard workflow — follow it every time, no exceptions.

## Branch structure

```
main   ── final, deployable code only (locked until integration week)
  ▲
  │  merge only near the end of the project
  │
dev    ── default branch, all work lands here via PR
  ▲
  │  merge via PR after review
  │
ft-<feature>  ── one branch per task, created by you
```

- **`dev`** is the default branch. Everyone clones onto `dev` automatically.
- **`main`** stays untouched until frontend and backend are fully integrated and tested together — deployment happens from here at the very end.
- Both `dev` and `main` are protected: no direct pushes, PR + 1 approval required, force-push blocked.

## Branch naming

Format: `ft-<short-feature-name>` — no personal names in the branch name (GitHub already shows who committed via the PR).

| Good | Bad |
|---|---|
| `ft-login-ui` | `ft-login-jared` |
| `ft-vehicle-routes` | `jared-vehicles` |
| `ft-remittance-submit` | `feature1` |

## Daily workflow

### 1. Start your day — sync with dev

```bash
git checkout dev
git pull origin dev
```

### 2. Create your feature branch

```bash
git checkout -b ft-<your-feature>
```

One branch per task. If you finish a task and start a new one, create a new branch — don't keep piling unrelated work onto one branch.

### 3. Write code in small, tested increments

Don't write a whole feature and commit once at the end. Build → test it works → commit → repeat.

```bash
git add <files>
git commit -m "Add phone number validation to login form"
```

**Commit message rules:**
- Be specific and descriptive — not "fix stuff", "update", or "basic CSS"
- Say what changed and why if it's not obvious
- One logical change per commit where reasonable

**If you used AI to generate code:** read it, understand it, and commit it in pieces as you incorporate and verify each part — never paste a large AI-generated block and commit it all at once without understanding it.

### 4. Sync with `dev` regularly — don't wait until the end

```bash
git pull origin dev --no-rebase
```

Do this **daily**, not just right before you push. Frequent small syncs mean small, manageable conflicts instead of one huge painful one at the end.

If you see:
```
hint: You have divergent branches and need to specify how to reconcile them.
```
Always use `--no-rebase` (a normal merge) — don't use rebase or fast-forward-only for this project.

### 5. Resolve conflicts if they appear

1. Run `git status` to see which files conflict
2. Open each file — for VS Code, use the **Accept Current Change / Accept Incoming Change / Accept Both Changes** buttons that appear above each conflict block, or edit manually
3. Delete any leftover `<<<<<<<`, `=======`, `>>>>>>>` markers
4. Then:
   ```bash
   git add <resolved files>
   git commit -m "Resolve merge conflict in <file>"
   ```

### 6. Push your branch

```bash
git push origin ft-<your-feature>
```

First push on a new branch needs `-u`:
```bash
git push -u origin ft-<your-feature>
```

### 7. Open a Pull Request into `dev`

- Base: `dev` — never `main`
- Title: short and descriptive
- Description: what you did, what MVP/task it covers, anything the reviewer should know or test
- Tag **Fredrick** as reviewer

### 8. Wait for review — don't merge your own PR

Fredrick (QA) will pull your branch locally, run it, and test it before approving. This can take some time — don't force-merge or bypass review.

### 9. After merge — clean up

```bash
git checkout dev
git pull origin dev
git branch -d ft-<your-feature>
```

---

## Rules — non-negotiable

1. **Never write code directly on `dev` or `main`.** Always work in a `ft-<feature>` branch.
2. **Never force-push** (`git push --force` / `-f`) to any shared branch. If git refuses your push because you're behind, pull and merge first — don't force it.
3. **Never commit `node_modules`, `.env`, `dist/`, or any secrets.** Check `.gitignore` covers these before your first commit on a new machine.
4. **Never push a folder inside another folder of the same project by mistake** — confirm your `frontend/`, `backend/`, `docs/` sit directly at the repo root before committing structural changes. Run `ls` and check against `STRUCTURE.md` if unsure.
5. **One task = one branch = one PR.** Don't bundle unrelated changes together.
6. **Reviewer must pull and actually run the code locally before approving** — never approve a PR by reading the diff alone.
7. **Report blockers within 24 hours.** If you're stuck on a conflict, a bug, or waiting on someone else's PR to merge first — say so in the group chat immediately, don't sit on it.

---

## Quick reference — copy/paste cheat sheet

```bash
# Start of day
git checkout dev
git pull origin dev

# New task
git checkout -b ft-<feature-name>

# While working
git add <files>
git commit -m "Descriptive message"

# Stay synced (do this often)
git pull origin dev --no-rebase

# Push
git push -u origin ft-<feature-name>

# After PR is approved & merged
git checkout dev
git pull origin dev
git branch -d ft-<feature-name>
```

---

## If something breaks

- **"fatal: couldn't find remote ref"** — check for typos, stray characters, or inline `#` comments in your command; run one command at a time
- **"divergent branches"** — run `git pull origin dev --no-rebase`
- **"unable to access... 403"** — you don't have collaborator access yet or you're using your GitHub password instead of a Personal Access Token; message Fredrick
- **Merge shows thousands of changed files** — you likely committed `node_modules` or `package-lock.json` by accident; message Fredrick immediately, don't try to force-merge it
- **Anything else** — post in the group chat before trying random fixes. A 5-minute question beats a 2-hour git disaster.