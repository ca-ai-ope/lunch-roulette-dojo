#!/usr/bin/env node

/**
 * check-code.mjs — 研修用コード品質チェック
 *
 * AIが書いたコードに蓄積する「よくある問題」を自動検出する。
 * 本番プロジェクトでは harness-gc.mjs（6種以上のチェック）を使うが、
 * 研修では理解しやすい3チェックに絞っている。
 *
 * 検出項目:
 *   1. console.log の残存（本番コードに不要）
 *   2. any 型の使用（型安全性の破壊）
 *   3. 巨大ファイル（200行超 — AIが1ファイルに詰め込む傾向）
 *
 * 使い方:
 *   node scripts/check-code.mjs
 */

import { readFileSync, readdirSync, statSync } from 'fs';
import { join, relative, extname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const PROJECT_ROOT = join(__filename, '..', '..');
const SRC_DIR = join(PROJECT_ROOT, 'src');

const RED = '\x1b[0;31m';
const YELLOW = '\x1b[0;33m';
const GREEN = '\x1b[0;32m';
const CYAN = '\x1b[0;36m';
const NC = '\x1b[0m';

// ─── ユーティリティ ───

function walkDir(dir) {
  const results = [];
  let entries;
  try {
    entries = readdirSync(dir);
  } catch {
    return results;
  }
  for (const entry of entries) {
    if (entry === 'node_modules' || entry.startsWith('.')) continue;
    const fullPath = join(dir, entry);
    let stat;
    try {
      stat = statSync(fullPath);
    } catch {
      continue;
    }
    if (stat.isDirectory()) {
      results.push(...walkDir(fullPath));
    } else if (['.ts', '.tsx'].includes(extname(entry))) {
      results.push(fullPath);
    }
  }
  return results;
}

function readFileSafe(filePath) {
  try {
    return readFileSync(filePath, 'utf-8');
  } catch {
    return null;
  }
}

// ─── チェック1: console.log の残存検出 ───

function checkConsoleLog(files) {
  const findings = [];

  for (const file of files) {
    const code = readFileSafe(file);
    if (!code) continue;
    const relPath = relative(PROJECT_ROOT, file);

    const lines = code.split('\n');
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      // コメント行は除外
      if (line.trimStart().startsWith('//') || line.trimStart().startsWith('*')) continue;
      if (/console\.log\s*\(/.test(line)) {
        findings.push({
          file: relPath,
          line: i + 1,
          text: line.trim().substring(0, 80),
        });
      }
    }
  }

  return findings;
}

// ─── チェック2: any 型の使用検出 ───

function checkAnyType(files) {
  const findings = [];

  for (const file of files) {
    const code = readFileSafe(file);
    if (!code) continue;
    const relPath = relative(PROJECT_ROOT, file);

    const lines = code.split('\n');
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      // コメント行は除外
      if (line.trimStart().startsWith('//') || line.trimStart().startsWith('*')) continue;
      // ": any" または "<any>" または "as any" パターンを検出
      if (/:\s*any\b|<any>|as\s+any\b/.test(line)) {
        findings.push({
          file: relPath,
          line: i + 1,
          text: line.trim().substring(0, 80),
        });
      }
    }
  }

  return findings;
}

// ─── チェック3: 巨大ファイル検出 ───

function checkOversizedFiles(files) {
  const findings = [];
  const THRESHOLD = 200;

  for (const file of files) {
    const code = readFileSafe(file);
    if (!code) continue;
    const relPath = relative(PROJECT_ROOT, file);

    const lineCount = code.split('\n').length;
    if (lineCount > THRESHOLD) {
      findings.push({
        file: relPath,
        lines: lineCount,
      });
    }
  }

  return findings;
}

// ─── メイン ───

function main() {
  console.log('');
  console.log('=========================================');
  console.log(' コード品質チェック（研修版）');
  console.log('=========================================');
  console.log('');

  const allFiles = walkDir(SRC_DIR);

  if (allFiles.length === 0) {
    console.log(`${YELLOW}[SKIP]${NC} src/ ディレクトリにファイルが見つかりません`);
    process.exit(0);
  }

  console.log(`対象ファイル数: ${allFiles.length}`);
  console.log('');

  let hasError = false;

  // ─── チェック1: console.log ───
  console.log(`${CYAN}[1/3] console.log の残存検出...${NC}`);
  const consoleLogs = checkConsoleLog(allFiles);
  if (consoleLogs.length > 0) {
    hasError = true;
    console.log(`  ${RED}[NG]${NC} ${consoleLogs.length}件の console.log を検出`);
    for (const f of consoleLogs) {
      console.log(`       ${f.file}:${f.line} — ${f.text}`);
    }
  } else {
    console.log(`  ${GREEN}[OK]${NC} console.log なし`);
  }

  // ─── チェック2: any 型 ───
  console.log('');
  console.log(`${CYAN}[2/3] any 型の使用検出...${NC}`);
  const anyTypes = checkAnyType(allFiles);
  if (anyTypes.length > 0) {
    hasError = true;
    console.log(`  ${RED}[NG]${NC} ${anyTypes.length}件の any 型を検出`);
    for (const f of anyTypes) {
      console.log(`       ${f.file}:${f.line} — ${f.text}`);
    }
  } else {
    console.log(`  ${GREEN}[OK]${NC} any 型なし`);
  }

  // ─── チェック3: 巨大ファイル ───
  console.log('');
  console.log(`${CYAN}[3/3] 巨大ファイル検出 (>${200}行)...${NC}`);
  const oversized = checkOversizedFiles(allFiles);
  if (oversized.length > 0) {
    console.log(`  ${YELLOW}[WARN]${NC} ${oversized.length}件の巨大ファイルを検出`);
    for (const f of oversized) {
      console.log(`       ${f.file} — ${f.lines}行`);
    }
  } else {
    console.log(`  ${GREEN}[OK]${NC} 巨大ファイルなし`);
  }

  // ─── サマリー ───
  console.log('');
  console.log('=========================================');
  if (hasError) {
    console.log(`${RED} 品質チェック失敗: 上記の問題を修正してください${NC}`);
    console.log('=========================================');
    process.exit(1);
  } else if (oversized.length > 0) {
    console.log(`${YELLOW} 品質チェック通過（警告あり）${NC}`);
    console.log('=========================================');
    process.exit(0);
  } else {
    console.log(`${GREEN} 品質チェック通過！${NC}`);
    console.log('=========================================');
    process.exit(0);
  }
}

main();
