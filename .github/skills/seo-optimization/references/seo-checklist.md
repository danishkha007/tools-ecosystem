# SEO Quality Checklist

Use this checklist to validate all SEO fields before publishing or committing changes.

## Title (H1 / Page Title)

- [ ] **Length**: 50-60 characters (count both letters and spaces)
- [ ] **Keyword**: Main keyword appears in first 10 words
- [ ] **Unique**: Doesn't duplicate titles of other tools
- [ ] **Clear**: Readers understand what the tool does
- [ ] **Benefit-driven**: Includes value proposition (free, fast, secure, etc.) if applicable
- [ ] **No special chars**: Avoid symbols unless necessary (e.g., "/" OK, "&" OK, emojis NOT OK)
- [ ] **Capitalization**: Title case preferred (capitalize first letter of each major word)

**Examples:**
✅ "Merge PDFs Online - Free, Fast & Secure" (52 chars)  
✅ "Compress Images Online - Reduce Size Without Quality Loss" (57 chars)  
❌ "PDF Merger Tool Online" (22 chars - too short)  
❌ "Free Online PDF Merge Tool to Merge Multiple PDF Files Quickly" (63 chars - too long)

## Meta Description

- [ ] **Length**: 150-160 characters (ideal: 155-160 for full display)
- [ ] **Keywords**: Includes 2-3 relevant keywords
- [ ] **Accuracy**: Matches actual page content and functionality
- [ ] **Action-oriented**: Contains a call-to-action (optional but recommended)
- [ ] **Unique**: Doesn't duplicate descriptions of other tools
- [ ] **No keyword stuffing**: Keywords feel natural, not forced
- [ ] **Mobile-friendly**: First 130 characters convey main message

**Examples:**
✅ "Merge multiple PDFs into one file online for free. No signup required. Fast, secure, and works on all devices. Start merging PDFs now!" (141 chars)  
✅ "Compress images online without losing quality. Reduce file size up to 90%. Support JPG, PNG, WebP and more. Try free image compressor." (141 chars)  
❌ "Tool for PDFs" (13 chars - too short)  
❌ "merge PDF merge PDFs online free PDF merger tool merge files PDFs" (66 chars - keyword stuffing)

## Keywords Array

- [ ] **Count**: 3-5 main keywords
- [ ] **Relevance**: All keywords relate to tool functionality
- [ ] **Variation**: Mix of singular/plural, base forms
- [ ] **No duplication**: Each keyword appears once
- [ ] **Format**: Lowercase, hyphenated for multi-word terms
- [ ] **Searchability**: Keywords match common user queries

**Example:**
```json
"keywords": ["merge pdfs", "combine pdfs", "pdf merger", "online pdf tool", "free pdf conversion"]
```

## Tags Array

- [ ] **Count**: 3-5 tags total (mix of 2-3-4 word phrases)
- [ ] **2-word tags**: Include 1-2 common operations (e.g., "batch processing", "format conversion")
- [ ] **3-word tags**: Include 1-2 specific use cases (e.g., "free pdf merger", "online converter")
- [ ] **4-word tags**: Include 1-2 detailed phrases (e.g., "convert word to pdf")
- [ ] **Searchability**: Tags match actual user search queries
- [ ] **No generic filler**: Avoid overuse of "online", "free", "tool" unless specified
- [ ] **Relevance**: All tags directly relate to tool functionality

**Example:**
```json
"tags": ["batch processing", "file compression", "free pdf merger", "document conversion tool", "compress images online"]
```

## Cross-page Consistency

- [ ] **Title pattern**: Similar tools follow consistent title format
- [ ] **Description tone**: Descriptions match site voice/style
- [ ] **Keyword variation**: Keywords don't heavily overlap across tools
- [ ] **Tag coverage**: Related tools share complementary tags

## Tools & Quick Tests

**Character Count:**
- Paste title/description into online word counter
- Aim for exact ranges (title: 50-60, description: 150-160)

**Search Preview:**
- Use Google's SERP preview tool: https://www.serpsim.com
- Verify title/description render correctly on desktop and mobile

**Uniqueness Check:**
- Search seo-data.json for similar titles/descriptions
- Use find (Ctrl+F / Cmd+F) to check for duplicates

**Keyword Relevance:**
- Search Google for your keywords to verify search volume
- Check if competitors use these keywords for similar tools

## Status: Ready to Commit

Once all items are checked, your SEO updates are ready:
- [ ] All quality criteria met
- [ ] Changes tested in browser
- [ ] No duplicate titles or descriptions
- [ ] Keyword/tag strategy aligns with site goals
