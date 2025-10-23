---
allowed-tools: Task, Read, Glob, AskUserQuestion
---

# PRD to Design

Automatically generate Figma design mockups from Product Requirements Documents using the design-from-prd agent.

## Usage
```
/pm:prd-to-design [prd-name]
```

**Examples:**
- `/pm:prd-to-design 3d-model-gallery` - Generate designs for the 3D model gallery PRD
- `/pm:prd-to-design` - List available PRDs and let me choose

## Required Rules

**IMPORTANT:** Before executing this command, read and follow:
- `.claude/rules/datetime.md` - For getting real current date/time

## Preflight Checklist

Before proceeding, complete these validation steps silently (don't bother the user with preflight progress).

### 1. MCP Configuration Check
- Read `.mcp.json` to verify required MCP servers are configured:
  - ✅ `figma` - Required for design generation
  - ✅ `github` - For searching design resources
  - ⚠️ `brave-search` - Optional but recommended for Figma Community search
  - ⚠️ `memory` - Optional for remembering design preferences
  - ⚠️ `puppeteer` - Optional for component screenshots

**If Figma MCP is missing:**
- Tell user: "❌ Figma MCP server is not configured. The design-from-prd agent requires Figma access."
- Show instructions:
  ```
  Add to .mcp.json:
  "figma": {
    "description": "Figma design files and design tokens",
    "transport": "http",
    "url": "https://api.figma.com/v1",
    "authentication": {
      "type": "bearer",
      "tokenEnvVar": "FIGMA_ACCESS_TOKEN"
    }
  }

  Get your Figma token at: https://www.figma.com/developers/api#access-tokens
  Set environment variable: FIGMA_ACCESS_TOKEN=your_token
  ```
- Stop execution and wait for user to configure

**If optional MCPs are missing:**
- Note which are missing but continue (agent will adapt)
- Suggest: "💡 For better results, consider adding: [list missing MCPs]"

### 2. PRD Validation

**If prd-name provided:**
- Check if `.claude/prds/$ARGUMENTS.md` exists
- If not found, tell user: "❌ PRD '$ARGUMENTS' not found in .claude/prds/"
- List available PRDs and ask user to choose
- If user selects a different one, update $ARGUMENTS to the selected PRD name

**If no prd-name provided:**
- List all PRDs in `.claude/prds/` directory
- Show each PRD with:
  - Name
  - Description (from frontmatter if available)
  - Creation date
- Use `AskUserQuestion` to let user select which PRD to design
- Update $ARGUMENTS to the selected PRD name

### 3. Agent Availability Check
- Verify `.claude/agents/design-from-prd.md` exists
- If missing, tell user: "❌ design-from-prd agent not found"
- Suggest: "The agent file should be at: .claude/agents/design-from-prd.md"
- Stop execution

## Instructions

You are orchestrating the PRD-to-Design workflow. Your job is to coordinate the design generation process.

### Step 1: PRD Summary
1. Read the selected PRD file: `.claude/prds/$ARGUMENTS.md`
2. Extract key information:
   - Feature name
   - Executive summary
   - Main UI components mentioned
   - Design aesthetic hints (if any)
3. Show the user a brief summary:
   ```
   📄 PRD: $ARGUMENTS

   **Summary**: [Executive summary excerpt]

   **Key UI Components**: [List of components found]

   **Starting design generation...**
   ```

### Step 2: Launch Design Agent
1. Use the `Task` tool to launch the `design-from-prd` agent
2. Pass the following prompt to the agent:

```
Generate Figma design mockups for the PRD: $ARGUMENTS

PRD Location: .claude/prds/$ARGUMENTS.md

Your task:
1. Read and analyze the PRD document
2. Extract all UI requirements and components
3. Search for matching components from:
   - Naive UI (this project uses nuxtjs-naive-ui)
   - Figma Community design systems
   - Open-source design resources on GitHub
4. Present 3-5 curated design system options to the user
5. Let the user choose their preferred design system
6. Generate a complete Figma design file with:
   - All screens/views from the PRD
   - Proper component usage
   - Interactive prototypes
   - Design annotations
7. Export design documentation to: .claude/context/$ARGUMENTS-design-notes.md
8. Return the Figma file link and summary

Remember to:
- Prioritize Naive UI component compatibility
- Learn and store user's design preferences in memory
- Handle missing MCP servers gracefully with fallbacks
- Provide detailed documentation for developer handoff
```

3. Set subagent_type to: `general-purpose`
4. Set description to: `Generate designs from PRD: $ARGUMENTS`

### Step 3: Monitor Progress
1. Wait for the agent to complete
2. The agent will handle all interactions with the user (asking about design preferences, etc.)
3. Do not interrupt the agent's workflow

### Step 4: Post-Generation Summary
After the agent completes, provide a final summary:

```
✅ Design Generation Complete!

**PRD**: $ARGUMENTS
**Figma File**: [Link from agent output]
**Design Documentation**: .claude/context/$ARGUMENTS-design-notes.md

**Design System Used**: [From agent output]
**Screens Created**: [Count from agent output]

**Next Steps**:
1. Review the Figma designs and provide feedback
2. Test the interactive prototype
3. If satisfied, use /pm:prd-parse $ARGUMENTS to create an implementation epic
4. Hand off designs to developers

**To iterate on designs**: Re-run /pm:prd-to-design $ARGUMENTS
```

## Quality Assurance

Before marking the workflow complete, verify:
- ✅ Figma file link is valid and accessible
- ✅ Design documentation file exists
- ✅ All PRD screens/views are represented in designs
- ✅ User was able to select their preferred design system

## Error Recovery

**If agent fails or produces incomplete results:**
1. Capture the error message
2. Explain to user what went wrong
3. Suggest specific fixes:
   - MCP configuration issues → Show how to fix
   - PRD unclear → Suggest clarifying the PRD
   - Figma API errors → Check token and permissions
4. Offer to retry: "Ready to retry? I'll relaunch the agent."

**If user wants to cancel mid-process:**
1. Thank them and save progress
2. Note: "Partial designs may be in your Figma account. Check recent files."
3. Suggest: "Run this command again when ready to continue."

## Integration with CCPM Workflow

This command fits into the CCPM workflow at this stage:

```
/pm:prd-new → ← You are here
              ↓
       /pm:prd-to-design ← **We are here**
              ↓
       [Review designs]
              ↓
       /pm:prd-parse (Create epic)
              ↓
       /pm:epic-start (Begin implementation)
```

After designs are approved, the next natural step is to parse the PRD into an implementation epic.

## Advanced Options (Future Enhancement)

Consider these options for future iterations:
- `--style [minimal|modern|corporate]` - Override design aesthetic
- `--skip-selection` - Use remembered design system preference
- `--components-only` - Generate component library without screens
- `--update-existing [figma-url]` - Update an existing Figma file

For now, these are NOT implemented. The agent handles all options interactively.
