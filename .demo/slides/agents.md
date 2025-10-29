---
theme: monomi
layout: section
---

# Playwright Test Agents

---
layout: default
---

# First-class support for agents

- **Planner**: explores your app, and creates a test plan
- **Generator**: writes tests based on the plan
- **Healer**: fixes broken tests

<br />
<br />

```bash
npx playwright init-agents --loop=vscode
```

---
layout: default
---

# Using the Planner Agent

```
mode: planner
prompt: Generate a test plan for the EngageTime web application to be able to join as a user, ask questions, respond to polls, and provide feedback.
```

---
layout: default
---

# Using the Generator Agent

```
mode: generator
prompt: Generate the tests for "### 1.1 Session Discovery and Join" section of the test plan.
```

---
layout: default
---

# Using the Healer Agent

```
mode: healer
prompt: Fix the failing tests
```

---
layout: section
---

# Always Review!
