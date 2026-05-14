# SEO Audit Scripts

Automated scripts for validating and improving SEO fields in ToolTrove.

## audit-seo.js

Comprehensive SEO audit script that validates all SEO fields against quality criteria.

### Usage

```bash
# Run full site audit
node .github/skills/seo-optimization/scripts/audit-seo.js

# Audit single tool
node .github/skills/seo-optimization/scripts/audit-seo.js --tool pdf-merge

# Export results to JSON
node .github/skills/seo-optimization/scripts/audit-seo.js --format json --output results.json

# Combine options
node .github/skills/seo-optimization/scripts/audit-seo.js --tool image --format json
```

### Command-line Options

| Option | Description | Example |
|--------|-------------|---------|
| `--tool <name>` | Filter results for specific tool | `--tool pdf` (matches "pdf-*") |
| `--format <type>` | Output format: `console` or `json` | `--format json` |
| `--output <path>` | Save JSON results to file | `--output audit.json` |

### Output

The script produces:
- **Color-coded console output** with pass/fail status for each tool
- **Summary statistics** showing overall compliance percentage
- **Detailed issues** for each tool (titles too short/long, missing fields, etc.)
- **Warnings** for optimization opportunities
- **Duplicate detection** for titles and descriptions
- **Recommendations** for priority fixes

### Quality Criteria Checked

✓ **Title**: 50-60 characters, unique, main keyword present  
✓ **Meta Description**: 150-160 characters, unique, keywords present  
✓ **Keywords**: 3-5 main keywords  
✓ **Tags**: 3-5 tags, each 2-4 words  
✓ **Duplicates**: No duplicate titles/descriptions across tools

## File Structure

The script validates SEO data from `src/app/core/data/seo-data.json` with this structure:

```json
{
  "tools": [
    {
      "id": "tool-id",
      "title": "Page Title | MyToolTrove",
      "metaDescription": "Description text...",
      "keywords": ["keyword1", "keyword2"],
      "tags": ["tag1", "tag2"] // Optional
    }
  ]
}
```

**Note**: SEO fields are direct properties (not nested under `seo` object).

### Example Output

```
╔══════════════════════════════════════════╗
║  SEO AUDIT REPORT - ToolTrove             ║
╚══════════════════════════════════════════╝

Summary
──────────────────────────────────────────
Total tools: 25
✓ Passed: 23/25 (92%)
✗ Failed: 2/25
⚠️  Warnings: 5

Tool Details
──────────────────────────────────────────
✓ PDF Merger (pdf-merge)
  All SEO fields are optimized!

✗ Image Compressor (image-compressor)
  ❌ Title: Too short (48 chars, need 50-60)
  ⚠️  Meta Description: Too long (162 chars, need 150-160)
  ⚠️  Tags: 1 tag(s) not 2-4 words: "compress"

...
```

### Integration

**Pre-commit Hook**: Add to `.husky/pre-commit`
```bash
#!/bin/sh
node .github/skills/seo-optimization/scripts/audit-seo.js || exit 1
```

**CI/CD Pipeline**: Add to GitHub Actions workflow
```yaml
- name: Audit SEO
  run: node .github/skills/seo-optimization/scripts/audit-seo.js --format json --output audit-report.json
  
- name: Comment on PR
  uses: actions/github-script@v6
  with:
    script: |
      const report = require('./audit-report.json');
      // Process report and comment on PR
```

**NPM Script**: Add to `package.json`
```json
{
  "scripts": {
    "audit:seo": "node .github/skills/seo-optimization/scripts/audit-seo.js",
    "audit:seo:json": "node .github/skills/seo-optimization/scripts/audit-seo.js --format json"
  }
}
```

## JSON Output Format

When using `--format json`, output contains:

```json
{
  "tools": [
    {
      "id": "pdf-merge",
      "name": "PDF Merger",
      "issues": ["❌ Title: Missing"],
      "warnings": ["⚠️  Keywords: Contains duplicates"],
      "passed": 3,
      "total": 4
    }
  ],
  "summary": {
    "total": 25,
    "passed": 23,
    "failed": 2,
    "warnings": 5
  },
  "duplicates": {
    "titles": [],
    "descriptions": []
  }
}
```

## Troubleshooting

**Script not finding seo-data.json:**
- Ensure you're running from project root
- Check file location matches one of the default paths
- Manually specify path if needed

**Node not found:**
- Ensure Node.js is installed: `node --version`
- Use absolute path if `node` not in PATH

**Permission denied:**
- Make script executable: `chmod +x scripts/audit-seo.js`
- Or run with `node` explicitly: `node scripts/audit-seo.js`
