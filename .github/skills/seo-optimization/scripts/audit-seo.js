#!/usr/bin/env node

/**
 * SEO Audit Script for ToolTrove
 * 
 * Validates all SEO fields in tool-seo-data.json against quality criteria:
 * - Title: 50-60 characters, unique, includes main keyword
 * - Meta Description: 150-160 characters, unique, includes keywords
 * - Keywords: 3-5 main keywords
 * - Tags: Multiple 2-4 word phrases
 * 
 * Usage:
 *   node audit-seo.js                    # Run full audit
 *   node audit-seo.js --format json      # Output JSON
 *   node audit-seo.js --tool pdf-merge   # Audit single tool
 */

const fs = require('fs');
const path = require('path');

// Color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  gray: '\x1b[90m',
};

// Quality criteria
const CRITERIA = {
  title: {
    minLength: 50,
    maxLength: 60,
    description: 'Title should be 50-60 characters',
  },
  metaDescription: {
    minLength: 150,
    maxLength: 160,
    description: 'Meta description should be 150-160 characters',
  },
  keywords: {
    minCount: 3,
    maxCount: 5,
    description: 'Should have 3-5 keywords',
  },
  tags: {
    minCount: 3,
    maxCount: 5,
    minWords: 2,
    maxWords: 4,
    description: 'Should have 3-5 tags, each 2-4 words',
  },
};

class SEOAuditor {
  constructor(dataPath) {
    this.dataPath = dataPath;
    this.data = null;
    this.results = {
      tools: [],
      summary: {
        total: 0,
        passed: 0,
        failed: 0,
        warnings: 0,
      },
      duplicates: {
        titles: [],
        descriptions: [],
      },
    };
  }

  /**
   * Load and parse SEO data
   */
  loadData() {
    try {
      const rawData = fs.readFileSync(this.dataPath, 'utf8');
      this.data = JSON.parse(rawData);
      return true;
    } catch (error) {
      console.error(`${colors.red}Error loading data:${colors.reset}`, error.message);
      return false;
    }
  }

  /**
   * Get readable tool name from tool data
   */
  getToolName(tool) {
    // Try to extract name from title (remove " | MyToolTrove" suffix)
    if (tool.title) {
      return tool.title.replace(' | MyToolTrove', '').replace('MyToolTrove', '');
    }
    // Fallback to ID with formatting
    return tool.id.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  }

  /**
   * Run full audit
   */
  audit() {
    if (!this.loadData()) {
      process.exit(1);
    }

    const tools = this.data.tools || [];
    this.results.summary.total = tools.length;

    // Audit each tool
    tools.forEach((tool, index) => {
      this.auditTool(tool);
    });

    // Check for duplicates
    this.checkDuplicates(tools);

    return this.results;
  }

  /**
   * Audit individual tool
   */
  auditTool(tool) {
    const toolResult = {
      id: tool.id,
      name: this.getToolName(tool),
      issues: [],
      warnings: [],
      passed: 0,
      total: 4,
    };

    // Validate title
    this.validateTitle(tool, toolResult);

    // Validate meta description
    this.validateMetaDescription(tool, toolResult);

    // Validate keywords
    this.validateKeywords(tool, toolResult);

    // Validate tags
    this.validateTags(tool, toolResult);

    // Determine pass/fail
    if (toolResult.issues.length === 0) {
      this.results.summary.passed++;
    } else {
      this.results.summary.failed++;
    }

    if (toolResult.warnings.length > 0) {
      this.results.summary.warnings++;
    }

    this.results.tools.push(toolResult);
  }

  /**
   * Validate title field
   */
  validateTitle(tool, result) {
    const title = tool.title || '';

    if (!title) {
      result.issues.push('❌ Title: Missing');
      return;
    }

    const length = title.length;
    const { minLength, maxLength } = CRITERIA.title;

    if (length < minLength) {
      result.issues.push(
        `❌ Title: Too short (${length} chars, need ${minLength}-${maxLength})`
      );
    } else if (length > maxLength) {
      result.issues.push(
        `⚠️  Title: Too long (${length} chars, need ${minLength}-${maxLength})`
      );
    } else {
      result.passed++;
    }

    // Check for keyword
    const titleWords = title.toLowerCase().split(/\s+/);
    if (titleWords.length < 2) {
      result.warnings.push('⚠️  Title: Very short, may lack main keyword');
    }
  }

  /**
   * Validate meta description field
   */
  validateMetaDescription(tool, result) {
    const description = tool.metaDescription || '';

    if (!description) {
      result.issues.push('❌ Meta Description: Missing');
      return;
    }

    const length = description.length;
    const { minLength, maxLength } = CRITERIA.metaDescription;

    if (length < minLength) {
      result.issues.push(
        `❌ Meta Description: Too short (${length} chars, need ${minLength}-${maxLength})`
      );
    } else if (length > maxLength) {
      result.issues.push(
        `⚠️  Meta Description: Too long (${length} chars, need ${minLength}-${maxLength})`
      );
    } else {
      result.passed++;
    }
  }

  /**
   * Validate keywords array
   */
  validateKeywords(tool, result) {
    const keywords = tool.keywords || [];

    if (!Array.isArray(keywords)) {
      result.issues.push('❌ Keywords: Not an array');
      return;
    }

    if (keywords.length === 0) {
      result.issues.push('❌ Keywords: Missing');
      return;
    }

    const { minCount, maxCount } = CRITERIA.keywords;

    if (keywords.length < minCount) {
      result.issues.push(
        `❌ Keywords: Too few (${keywords.length}, need ${minCount}-${maxCount})`
      );
    } else if (keywords.length > maxCount) {
      result.warnings.push(
        `⚠️  Keywords: Too many (${keywords.length}, recommend ${minCount}-${maxCount})`
      );
      result.passed++;
    } else {
      result.passed++;
    }

    // Check for duplicates within keywords
    const uniqueKeywords = new Set(keywords);
    if (uniqueKeywords.size !== keywords.length) {
      result.warnings.push('⚠️  Keywords: Contains duplicates');
    }
  }

  /**
   * Validate tags array
   */
  validateTags(tool, result) {
    const tags = tool.tags || [];

    if (!Array.isArray(tags)) {
      result.issues.push('❌ Tags: Not an array');
      return;
    }

    if (tags.length === 0) {
      result.warnings.push('⚠️  Tags: Missing (optional but recommended)');
      result.passed++; // Still pass since tags are optional
      return;
    }

    const { minCount, maxCount, minWords, maxWords } = CRITERIA.tags;

    if (tags.length < minCount) {
      result.warnings.push(
        `⚠️  Tags: Too few (${tags.length}, recommend ${minCount}-${maxCount})`
      );
      result.passed++;
    } else if (tags.length > maxCount) {
      result.warnings.push(
        `⚠️  Tags: Too many (${tags.length}, recommend ${minCount}-${maxCount})`
      );
      result.passed++;
    } else {
      result.passed++;
    }

    // Check word count for each tag
    const invalidTags = tags.filter((tag) => {
      const wordCount = tag.trim().split(/\s+/).length;
      return wordCount < minWords || wordCount > maxWords;
    });

    if (invalidTags.length > 0) {
      result.warnings.push(
        `⚠️  Tags: ${invalidTags.length} tag(s) not ${minWords}-${maxWords} words: "${invalidTags.join(', ')}"`
      );
    }
  }

  /**
   * Check for duplicate titles and descriptions
   */
  checkDuplicates(tools) {
    const titleMap = {};
    const descriptionMap = {};

    tools.forEach((tool) => {
      const title = tool.title || '';
      const description = tool.metaDescription || '';

      if (title) {
        if (titleMap[title]) {
          this.results.duplicates.titles.push({
            title,
            tools: [titleMap[title], tool.id],
          });
        } else {
          titleMap[title] = tool.id;
        }
      }

      if (description) {
        if (descriptionMap[description]) {
          this.results.duplicates.descriptions.push({
            description: description.substring(0, 50) + '...',
            tools: [descriptionMap[description], tool.id],
          });
        } else {
          descriptionMap[description] = tool.id;
        }
      }
    });
  }

  /**
   * Print results to console
   */
  printResults() {
    console.log(
      `\n${colors.bright}${colors.blue}╔══════════════════════════════════════════╗${colors.reset}`
    );
    console.log(
      `${colors.bright}${colors.blue}║  SEO AUDIT REPORT - ToolTrove             ║${colors.reset}`
    );
    console.log(
      `${colors.bright}${colors.blue}╚══════════════════════════════════════════╝${colors.reset}\n`
    );

    // Summary statistics
    this.printSummary();

    // Per-tool results
    this.printToolResults();

    // Duplicates
    this.printDuplicates();

    // Recommendations
    this.printRecommendations();
  }

  /**
   * Print summary statistics
   */
  printSummary() {
    const { total, passed, failed, warnings } = this.results.summary;
    const passPercentage = Math.round((passed / total) * 100);

    console.log(`${colors.bright}Summary${colors.reset}`);
    console.log('─'.repeat(50));
    console.log(`Total tools: ${total}`);
    console.log(
      `${colors.green}✓ Passed:${colors.reset} ${passed}/${total} (${passPercentage}%)`
    );
    console.log(`${colors.red}✗ Failed:${colors.reset} ${failed}/${total}`);
    console.log(`${colors.yellow}⚠️  Warnings:${colors.reset} ${warnings}`);
    console.log();
  }

  /**
   * Print per-tool results
   */
  printToolResults() {
    console.log(`${colors.bright}Tool Details${colors.reset}`);
    console.log('─'.repeat(50));

    this.results.tools.forEach((tool) => {
      const statusIcon = tool.issues.length === 0 ? '✓' : '✗';
      const statusColor = tool.issues.length === 0 ? colors.green : colors.red;

      console.log(
        `${statusColor}${statusIcon}${colors.reset} ${colors.bright}${tool.name}${colors.reset} (${tool.id})`
      );

      if (tool.issues.length > 0) {
        tool.issues.forEach((issue) => {
          console.log(`  ${issue}`);
        });
      }

      if (tool.warnings.length > 0) {
        tool.warnings.forEach((warning) => {
          console.log(`  ${warning}`);
        });
      }

      if (tool.issues.length === 0 && tool.warnings.length === 0) {
        console.log(`  ${colors.green}All SEO fields are optimized!${colors.reset}`);
      }

      console.log();
    });
  }

  /**
   * Print duplicate findings
   */
  printDuplicates() {
    const hasDuplicates =
      this.results.duplicates.titles.length > 0 ||
      this.results.duplicates.descriptions.length > 0;

    if (!hasDuplicates) {
      console.log(`${colors.green}✓ No duplicate titles or descriptions${colors.reset}\n`);
      return;
    }

    console.log(`${colors.bright}Duplicates Found${colors.reset}`);
    console.log('─'.repeat(50));

    if (this.results.duplicates.titles.length > 0) {
      console.log(`${colors.red}Duplicate Titles:${colors.reset}`);
      this.results.duplicates.titles.forEach((dup) => {
        console.log(`  "${dup.title}"`);
        console.log(`  Tools: ${dup.tools.join(', ')}`);
      });
    }

    if (this.results.duplicates.descriptions.length > 0) {
      console.log(`${colors.red}Duplicate Descriptions:${colors.reset}`);
      this.results.duplicates.descriptions.forEach((dup) => {
        console.log(`  "${dup.description}"`);
        console.log(`  Tools: ${dup.tools.join(', ')}`);
      });
    }

    console.log();
  }

  /**
   * Print recommendations
   */
  printRecommendations() {
    console.log(`${colors.bright}Recommendations${colors.reset}`);
    console.log('─'.repeat(50));

    const failedTools = this.results.tools.filter((t) => t.issues.length > 0);

    if (failedTools.length === 0) {
      console.log(`${colors.green}All tools passed validation!${colors.reset}`);
      console.log(
        `${colors.gray}Consider running quarterly audits to maintain SEO quality.${colors.reset}`
      );
    } else {
      console.log(`Priority fixes needed for ${failedTools.length} tool(s):`);
      failedTools.slice(0, 5).forEach((tool) => {
        console.log(`  1. ${tool.name}`);
        console.log(
          `     → ${tool.issues[0]}`
        );
      });

      if (failedTools.length > 5) {
        console.log(`  ... and ${failedTools.length - 5} more`);
      }
    }

    console.log(
      `\n${colors.gray}See .github/skills/seo-optimization/references/seo-checklist.md for detailed criteria.${colors.reset}\n`
    );
  }

  /**
   * Export results as JSON
   */
  exportJSON(outputPath) {
    try {
      fs.writeFileSync(outputPath, JSON.stringify(this.results, null, 2));
      console.log(`${colors.green}✓ Results exported to: ${outputPath}${colors.reset}`);
      return true;
    } catch (error) {
      console.error(`${colors.red}Error exporting JSON:${colors.reset}`, error.message);
      return false;
    }
  }
}

/**
 * Main execution
 */
function main() {
  // Parse command-line arguments
  const args = process.argv.slice(2);
  let format = 'console';
  let toolFilter = null;
  let outputPath = null;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--format' && args[i + 1]) {
      format = args[i + 1];
      i++;
    }
    if (args[i] === '--tool' && args[i + 1]) {
      toolFilter = args[i + 1];
      i++;
    }
    if (args[i] === '--output' && args[i + 1]) {
      outputPath = args[i + 1];
      i++;
    }
  }

  // Find seo-data.json
  let dataPath = path.join(
    __dirname,
    '../../../tools-ecosystem/src/app/core/data/seo-data.json'
  );

  // Try alternative paths
  if (!fs.existsSync(dataPath)) {
    const altPaths = [
      path.join(__dirname, '../../../src/app/core/data/seo-data.json'),
      path.join(process.cwd(), 'tools-ecosystem/src/app/core/data/seo-data.json'),
      path.join(process.cwd(), 'src/app/core/data/seo-data.json'),
      path.join(process.cwd(), 'calculators-data/tool-seo-data.json'),
    ];

    for (const altPath of altPaths) {
      if (fs.existsSync(altPath)) {
        dataPath = altPath;
        break;
      }
    }
  }

  if (!fs.existsSync(dataPath)) {
    console.error(`${colors.red}Error: Could not find seo-data.json${colors.reset}`);
    console.error(`Searched: ${dataPath}`);
    process.exit(1);
  }

  // Run audit
  const auditor = new SEOAuditor(dataPath);
  const results = auditor.audit();

  // Filter by tool if specified
  if (toolFilter) {
    results.tools = results.tools.filter((t) => t.id.includes(toolFilter));
  }

  // Output results
  if (format === 'json') {
    const output = outputPath || 'seo-audit-results.json';
    auditor.exportJSON(output);
  } else {
    // Apply filter and print
    if (toolFilter) {
      const filtered = results.tools.filter((t) =>
        t.id.toLowerCase().includes(toolFilter.toLowerCase())
      );
      if (filtered.length === 0) {
        console.log(`${colors.yellow}No tools found matching: ${toolFilter}${colors.reset}`);
      } else {
        console.log(
          `${colors.blue}Filtering results for: ${toolFilter}${colors.reset}\n`
        );
        results.tools = filtered;
        auditor.printToolResults();
      }
    } else {
      auditor.printResults();
    }
  }
}

main();
