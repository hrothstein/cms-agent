# Quick Start Guide - Prompts for Cursor

This guide contains the exact prompts to give Cursor for building each system.

---

## 📦 Project 1: Card Management System (CMS)

**PRD Document:** `CMS_PRD_Complete.md`

**Prompt for Cursor:**

```
Build a Card Management System (CMS) following the specifications in CMS_PRD_Complete.md.

CRITICAL REQUIREMENTS:
1. Create feature/cms branch (DO NOT touch master until complete)
2. Build standalone web application (React frontend + Node.js backend + PostgreSQL)
3. Implement all core features: Cards, Transactions, Alerts, Disputes, Card Services
4. Simulate MuleSoft integration with console logs (show integration points)
5. NO new Heroku Dynos - ask for existing app names before deployment
6. NO partial releases - only deploy when BOTH frontend AND backend work together

BUILD ORDER:
Phase 1: Database + Backend foundation + Authentication (Week 1)
Phase 2: Core card features (Dashboard, Lock/Unlock, Controls) (Week 2)
Phase 3: Transactions, Alerts, Disputes (Week 3)
Phase 4: Card Services + MuleSoft integration points (Week 4)
Phase 5: Testing, Polish, Deployment (Week 5)

Start by creating the feature/cms branch, then build incrementally following the phase-by-phase instructions.
Commit frequently. Test each feature as you build it.
Do NOT deploy until ALL acceptance criteria are met.
```

---

## 🤖 Project 2: Admin Agent (Conversational AI)

**PRD Document:** `CMS_Admin_Agent_PRD.md`

**Prompt for Cursor:**

```
Build a conversational AI admin agent following the specifications in CMS_Admin_Agent_PRD.md.

CRITICAL REQUIREMENTS:
1. Create feature/admin-agent branch (DO NOT touch master)
2. Test MCP connection FIRST before building anything else
3. MCP endpoint: https://hbr-flextest-dl2x0l.8hm1bl.usa-e2.cloudhub.io/cms/
4. Test all 10 MCP tools individually before proceeding
5. Integrate LLM (Claude or GPT-4) with function calling
6. Build chat UI (React + TypeScript)
7. NO new Heroku Dynos - ask for existing app names
8. NO partial releases - only deploy when complete

BUILD ORDER:
Phase 1: Create feature branch and test MCP connection (all 10 tools)
Phase 2: Build backend with LLM integration
Phase 3: Build frontend chat interface
Phase 4: Test end-to-end
Phase 5: Deploy to existing infrastructure

Start by creating the feature/admin-agent branch and testing the MCP connection.
Do NOT proceed until all 10 MCP tools are verified working.
```

---

## 📊 Build Order Summary

### If building CMS first:
1. Give Cursor the **CMS prompt** above
2. Wait for complete, working CMS
3. Then give Cursor the **Admin Agent prompt**

### If building Admin Agent first:
1. Ensure CMS APIs exist (via MCP)
2. Give Cursor the **Admin Agent prompt**
3. Agent will connect to existing CMS via MCP

### If building both simultaneously:
**Not recommended** - build one at a time to avoid confusion and ensure quality.

---

## ⚠️ Critical Reminders for Both Projects:

### Before Starting:
- [ ] Create feature branch (don't touch master)
- [ ] Read the full PRD document
- [ ] Understand the constraints

### During Development:
- [ ] Commit frequently with clear messages
- [ ] Test each feature as you build
- [ ] Check console for errors regularly
- [ ] Follow the build order in the PRD

### Before Deployment:
- [ ] Complete ALL acceptance criteria
- [ ] Test end-to-end flows
- [ ] Zero console errors
- [ ] Ask for existing Heroku app names (NO new Dynos)
- [ ] Only deploy when EVERYTHING works together

---

## 📁 File Structure

```
/mnt/user-data/outputs/
├── CMS_PRD_Complete.md              ← Full CMS specification
├── CMS_Admin_Agent_PRD.md           ← Full Agent specification  
└── CURSOR_PROMPTS_QUICKSTART.md     ← This file (quick reference)
```

---

## 🎯 Success Criteria

### CMS is Complete When:
- ✅ User can log in
- ✅ User can view and manage cards
- ✅ User can view transactions
- ✅ User can manage alerts
- ✅ User can file disputes
- ✅ Frontend and backend work together
- ✅ No console errors
- ✅ All demo scenarios work

### Admin Agent is Complete When:
- ✅ All 10 MCP tools work
- ✅ LLM responds naturally
- ✅ Can manage customers via chat
- ✅ Can manage cards via chat
- ✅ Context retention works
- ✅ Confirmation for deletes works
- ✅ Frontend and backend work together
- ✅ No console errors
- ✅ All demo scenarios work

---

## 💡 Tips for Success

1. **Read the PRD First** - Don't skip the documentation
2. **Follow Build Order** - Don't jump ahead
3. **Test Incrementally** - Don't wait until the end
4. **Commit Often** - Save your progress frequently
5. **One Feature at a Time** - Don't try to build everything at once
6. **Check Constraints** - Remember: No new Dynos, no partial releases
7. **Ask Questions** - If unclear, ask before building

---

**Ready to build!** 🚀

Copy the appropriate prompt above and paste it into Cursor to begin.
