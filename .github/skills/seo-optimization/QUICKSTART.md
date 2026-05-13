# SEO Optimization Skill - Quick Start Guide

## What Was Created

A complete SEO optimization skill for ToolTrove that includes:

1. **SKILL.md** - Main documentation with workflows and quality criteria
2. **Automated Audit Script** (`scripts/audit-seo.js`) - Validates all SEO fields automatically
3. **Quality Checklist** - Detailed validation criteria for titles, descriptions, keywords, tags
4. **Keyword Research Guide** - Strategy for discovering and validating keywords
5. **SEO Template** - JSON template showing proper structure

## Getting Started

### Run Automated Audit

```bash
# From project root
node .github/skills/seo-optimization/scripts/audit-seo.js
```

This generates a color-coded report showing:
- ✓/✗ Pass/fail for each tool
- Summary statistics (% compliance)
- Specific issues and warnings
- Priority recommendations

### Current Status (From First Run)

**Total tools**: 7  
**Compliance**: 0% (0/7 passed)  
**Common issues**:
- ❌ **Titles too long** - Most exceed 60 character limit
- ❌ **Missing tags** - All 7 tools need tag arrays
- ❌ **Meta descriptions** - Some too short, some too long
- ⚠️ **Too many keywords** - All have 10+ keywords (should be 3-5)

### Priority Fixes

1. **Reduce title length** from 60+ chars to 50-60 range
   - Example: "Free GANN Hexagonal SR Calculator" (shorter)

2. **Add tags array** to each tool's SEO object
   - Example: `"tags": ["trading calculator", "support resistance", "gann theory"]`

3. **Adjust keyword counts** - Reduce from 10+ to 3-5 main keywords

4. **Fine-tune descriptions** - Ensure 150-160 character range

### Manual Workflow

When optimizing individual tools:

1. **Audit** - Run script to identify issues
2. **Edit** - Update `tool-seo-data.json` based on checklist
3. **Validate** - Run script again to verify fixes
4. **Verify** - Check rendering in browser

### Command Options

```bash
# Full site audit
node .github/skills/seo-optimization/scripts/audit-seo.js

# Single tool
node .github/skills/seo-optimization/scripts/audit-seo.js --tool pdf-merge

# JSON export for CI/CD
node .github/skills/seo-optimization/scripts/audit-seo.js --format json --output audit.json

# Filter multiple tools
node .github/skills/seo-optimization/scripts/audit-seo.js --tool pdf
```

### Quality Criteria Reference

**Title** (50-60 characters)
- "Merge PDFs Online - Free & Fast" ✓ (56 chars)
- "Free GANN Hexagonal Support & Resistance Calculator" ✗ (83 chars)

**Meta Description** (150-160 characters)
- "Merge multiple PDFs into one file instantly. No signup required. Free, secure, and works on all devices." ✓ (157 chars)

**Keywords** (3-5 total)
- ✓ Good: `["merge pdf", "combine pdfs", "pdf merger", "online tool", "free"]`
- ✗ Bad: 10+ keywords, too many

**Tags** (3-5 tags, 2-4 words each)
- ✓ Good: `["batch processing", "file combination", "free pdf tool", "merge documents"]`
- ✗ Missing: All tools currently have empty/missing tags array

## Next Steps

### Immediate Actions

1. **Run audit** to generate detailed report
   ```bash
   node .github/skills/seo-optimization/scripts/audit-seo.js
   ```

2. **Pick high-impact tool** (e.g., pdf-merge) and fix:
   - Trim title to 50-60 chars
   - Add tags array with 3-5 items
   - Adjust meta description to 150-160 chars

3. **Re-run audit** to confirm improvements
   ```bash
   node .github/skills/seo-optimization/scripts/audit-seo.js --tool pdf-merge
   ```

### Integration Options

**Add to package.json** (tools-ecosystem/):
```json
{
  "scripts": {
    "audit:seo": "node ../.github/skills/seo-optimization/scripts/audit-seo.js",
    "audit:seo:json": "node ../.github/skills/seo-optimization/scripts/audit-seo.js --format json --output audit-report.json"
  }
}
```

Then run: `npm run audit:seo`

**Pre-commit Hook** (auto-audit before commit):
```bash
# .husky/pre-commit
node .github/skills/seo-optimization/scripts/audit-seo.js
```

## File Structure

```
.github/skills/seo-optimization/
├── SKILL.md                    # Main skill documentation
├── scripts/
│   ├── audit-seo.js           # Automated audit script
│   ├── README.md              # Script usage guide
│   └── (QUICKSTART.md)         # This file
├── references/
│   ├── seo-checklist.md       # Detailed validation criteria
│   └── keyword-research.md    # Keyword discovery strategy
└── assets/
    └── seo-template.json      # JSON structure template
```

## Documentation Links

- [SKILL.md](./SKILL.md) - Complete workflow documentation
- [scripts/README.md](./scripts/README.md) - Script usage details
- [references/seo-checklist.md](./references/seo-checklist.md) - Quality criteria with examples
- [references/keyword-research.md](./references/keyword-research.md) - Keyword strategy guide
- [assets/seo-template.json](./assets/seo-template.json) - Example JSON structure

## Questions?

Refer to the detailed guides:
- **"How do I optimize a title?"** → See seo-checklist.md
- **"What keywords should I use?"** → See keyword-research.md
- **"How do I run the audit?"** → See scripts/README.md
- **"What's the full workflow?"** → See SKILL.md

---

**Status**: ✓ Skill created and tested  
**Next**: Run audit script and start optimizing high-priority tools
