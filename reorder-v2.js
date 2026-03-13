#!/usr/bin/env node
/**
 * Reorder sections by line-number slicing (precise, no regex ambiguity).
 * Run from site root.
 */
const fs = require('fs');
const path = require('path');

function reorderByLines(filePath, sectionDefs) {
  const lines = fs.readFileSync(filePath, 'utf8').split('\n');
  
  // Extract header (everything before first section)
  const firstStart = Math.min(...sectionDefs.map(s => s.start));
  const header = lines.slice(0, firstStart - 1); // 1-indexed to 0-indexed
  
  // Extract footer (everything after last section)
  const lastEnd = Math.max(...sectionDefs.map(s => s.end));
  const footer = lines.slice(lastEnd); // line after last section end
  
  // Extract each named section
  const sections = {};
  for (const s of sectionDefs) {
    sections[s.name] = lines.slice(s.start - 1, s.end); // 1-indexed
  }
  
  // Rebuild in desired order
  const orderedNames = sectionDefs.map(s => s.name);
  // Sort by desired order (provided in sectionDefs already ordered)
  const result = [...header];
  for (const name of s.newOrder) {
    if (sections[name]) {
      result.push(...sections[name]);
    }
  }
  result.push(...footer);
  
  fs.writeFileSync(filePath, result.join('\n'));
}

// Actually, let me do it simpler - just read file, split into named chunks, reassemble

function processFile(filePath, sectionRanges, newOrder) {
  const lines = fs.readFileSync(filePath, 'utf8').split('\n');
  const totalLines = lines.length;
  
  // Sort ranges by start line
  const sorted = [...sectionRanges].sort((a, b) => a.start - b.start);
  
  // Header = lines before first section
  const header = lines.slice(0, sorted[0].start - 1);
  
  // Footer = lines after last section
  const lastEnd = sorted[sorted.length - 1].end;
  const footer = lines.slice(lastEnd);
  
  // Extract sections
  const sections = {};
  for (const s of sorted) {
    sections[s.name] = lines.slice(s.start - 1, s.end);
  }
  
  // Rebuild
  const result = [...header];
  for (const name of newOrder) {
    if (sections[name]) {
      result.push(...sections[name]);
    }
  }
  result.push(...footer);
  
  fs.writeFileSync(filePath, result.join('\n'));
  console.log(`✅ ${filePath} reordered: ${newOrder.join(' → ')}`);
}

const DIR = __dirname;

// === EN ===
processFile(path.join(DIR, 'en/index.html'), [
  { name: 'hero',         start: 134, end: 148 },
  { name: 'hosting',      start: 150, end: 217 },
  { name: 'tutorial',     start: 219, end: 248 },
  { name: 'free',         start: 250, end: 270 },
  { name: 'products',     start: 272, end: 347 },
  { name: 'managed',      start: 349, end: 367 },
  { name: 'articles',     start: 369, end: 386 },
  { name: 'seo',          start: 388, end: 430 },
  { name: 'industry',     start: 432, end: 460 },
  { name: 'integrations', start: 462, end: 485 },
  { name: 'comparisons',  start: 487, end: 510 },
], ['hero', 'free', 'products', 'tutorial', 'industry', 'integrations', 'comparisons', 'articles', 'seo', 'hosting', 'managed']);

console.log('Done');
