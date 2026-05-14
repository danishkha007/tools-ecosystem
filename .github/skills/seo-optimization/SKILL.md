---
name: seo-optimization
description: "Optimize SEO titles, meta descriptions, tags, and keywords for better search rankings and discoverability. Use when: adding new tools, improving existing tool pages, bulk updating SEO across categories, or auditing SEO quality across the site."
argument-hint: "Tool name or category to optimize, or 'all' for full site audit"
user-invocable: true
---

# SEO Optimization Skill

## When to Use

- **Adding new tools**: Ensure titles, descriptions, and tags meet quality standards before publishing
- **Improving existing pages**: Audit current SEO fields and identify gaps in keyword coverage
- **Bulk updates**: Update multiple tools in a category systematically
- **SEO audit**: Review entire site for consistency and quality
- **Keyword strategy**: Add relevant tags to improve categorization and discoverability

## Procedure

### Step 1: Audit Current SEO Fields
1. Open [seo-data.json](../../src/app/core/data/seo-data.json) to review current titles, descriptions, tags, and keywords
2. Run the automated audit script to identify issues:
   ```bash
   node .github/skills/seo-optimization/scripts/audit-seo.js
   ```
3. Document gaps by tool (e.g., "pdf-merger: title too long, missing tags")

### Step 2: Identify Gaps & Opportunities
1. Check if page has a main keyword/topic (e.g., "PDF merge", "image compression")
2. Look for related keywords not yet captured in tags
3. Review competitor or related tools to see tag patterns
4. Determine if description accurately represents tool functionality

### Step 3: Update seo-data.json
Edit the tool's SEO object following this structure:
```json
"seo": {
  "h1": "Main Heading - Primary Keyword (60 chars max)",
  "metaDescription": "Short description with 2-3 keywords, 160 chars max. Compelling and action-oriented.",
  "keywords": ["primary-keyword", "secondary-keyword", "use-case"],
  "tags": ["2-word tag", "3-word keyword phrase", "4-word longer keyword"]
}
```

### Step 4: Add/Update Tags for Discoverability
1. Add 2-3 word keyword phrases (e.g., "batch processing", "online converter")
2. Add 3-4 word specific phrases (e.g., "free pdf merger", "image quality control")
3. Ensure tags relate to tool functionality AND user search intent
4. Avoid generic tags; focus on specific pain points/use cases

### Step 5: Validate Changes
Run validation against the [SEO Quality Checklist](./references/seo-checklist.md):
- [ ] Title: 50-60 characters, includes main keyword, unique per page
- [ ] Meta description: 150-160 characters, includes 2-3 keywords, relevant to content
- [ ] Keywords: 3-5 targeted keywords, no stuffing
- [ ] Tags: 2-4 word phrases, searchable, related to functionality

### Step 6: Verify in Context
1. Check the page renders correctly with updated SEO fields
2. Verify breadcrumbs display updated title
3. Confirm title/description don't look truncated in browser
4. Test that tags improve page categorization

## Quality Criteria

### Title Requirements
- **Length**: 50-60 characters (search engines display ~55-60)
- **Keyword**: Include main keyword near the beginning
- **Uniqueness**: Different from all other page titles
- **Format**: "[Action] [Object] - [Benefit/Type]" (e.g., "Merge PDFs Online - Free, Fast & Secure")

### Meta Description Requirements
- **Length**: 150-160 characters (displays fully on desktop, ~130 on mobile)
- **Keywords**: Include 2-3 relevant keywords
- **Relevance**: Accurately describes page content and tool functionality
- **Call-to-action**: Optional but recommended (e.g., "Start merging", "Convert now")
- **No duplication**: Each description should be unique

### Tags Requirements
- **Count**: 2-4 word phrases per tool (target 3-5 tags)
- **Specificity**: Avoid generic terms like "tool", "online", "free" unless combined
- **Phrase examples**:
  - 2-word: "batch processing", "format conversion", "file compression"
  - 3-word: "free pdf merger", "image quality control", "online converter"
  - 4-word: "convert word to pdf", "compress images online free"
- **Searchability**: Tags should match common user queries

## Common SEO Mistakes to Avoid

❌ **Don't**: Use identical titles across multiple pages  
✅ **Do**: Customize each title with unique keywords and benefits

❌ **Don't**: Stuff keywords unnaturally (e.g., "PDF merger PDF merge PDFs")  
✅ **Do**: Write naturally with keywords integrated

❌ **Don't**: Copy descriptions from similar tools  
✅ **Do**: Differentiate based on unique features and use cases

❌ **Don't**: Add vague tags like "online tool", "converter", "free"  
✅ **Do**: Use specific phrases users actually search for

## Tools & Resources

- **SEO Checklist**: [references/seo-checklist.md](./references/seo-checklist.md)
- **SEO Data Template**: [assets/seo-template.json](./assets/seo-template.json)
- **Keyword Research Tips**: [references/keyword-research.md](./references/keyword-research.md)
- **Automated Audit Script**: [scripts/audit-seo.js](./scripts/audit-seo.js)

## Automated Audit Script

Run the included audit script to automatically validate all SEO fields across the site:

```bash
# Full site audit
node .github/skills/seo-optimization/scripts/audit-seo.js

# Audit single tool
node .github/skills/seo-optimization/scripts/audit-seo.js --tool pdf-merge

# Export results to JSON
node .github/skills/seo-optimization/scripts/audit-seo.js --format json --output results.json
```

The script checks:
- ✓ Title length (50-60 chars) and uniqueness
- ✓ Meta description length (150-160 chars) and keywords
- ✓ Keywords count and content
- ✓ Tags structure and word count
- ✓ Duplicate titles/descriptions across site

**Output includes**:
- Color-coded pass/fail for each tool
- Summary statistics (% compliance)
- Specific issues and warnings
- Priority fix recommendations
- Optional JSON export for CI/CD integration

See [scripts/README.md](./scripts/README.md) for detailed usage and integration examples.
