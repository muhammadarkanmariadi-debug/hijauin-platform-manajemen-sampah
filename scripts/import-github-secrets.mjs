#!/usr/bin/env node

/**
 * Bulk GitHub Actions Secrets Importer for Hijauin
 *
 * Automatically reads .env.production, encrypts secrets using LibSodium / GitHub Public Key,
 * and uploads them directly to your GitHub repository secrets via the GitHub REST API.
 *
 * Usage:
 *   node scripts/import-github-secrets.mjs [path-to-env-file]
 *
 * Example:
 *   GH_PAT=github_pat_xxxx node scripts/import-github-secrets.mjs .env.production
 */

import fs from 'fs';
import path from 'path';
import readline from 'readline';
import sodium from 'libsodium-wrappers';

// Target repository from git remote or default
const DEFAULT_REPO = 'muhammadarkanmariadi-debug/hijauin-platform-manajemen-sampah';

function parseEnvFile(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`Environment file not found at: ${filePath}`);
  }

  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split(/\r?\n/);
  const secrets = {};

  let currentKey = null;
  let currentValue = [];
  let inQuotes = false;
  let quoteChar = '';

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const trimmed = rawLine.trim();

    // Skip comments and empty lines when not inside multiline string
    if (!inQuotes && (trimmed.startsWith('#') || trimmed === '')) {
      continue;
    }

    if (!inQuotes) {
      const match = rawLine.match(/^([A-Za-z0-9_]+)=(.*)$/);
      if (!match) continue;

      currentKey = match[1];
      let val = match[2];

      if (val.startsWith('"') || val.startsWith("'")) {
        quoteChar = val[0];
        val = val.slice(1);
        if (val.endsWith(quoteChar) && (val.length === 1 || val[val.length - 2] !== '\\')) {
          // Single line quoted value
          secrets[currentKey] = val.slice(0, -1).replace(/\\n/g, '\n');
          currentKey = null;
        } else {
          // Start of multiline quoted value
          inQuotes = true;
          currentValue = [val];
        }
      } else {
        // Unquoted value
        secrets[currentKey] = val.trim();
        currentKey = null;
      }
    } else {
      // Inside multiline quote
      if (rawLine.endsWith(quoteChar)) {
        currentValue.push(rawLine.slice(0, -1));
        secrets[currentKey] = currentValue.join('\n').replace(/\\n/g, '\n');
        inQuotes = false;
        currentKey = null;
        currentValue = [];
      } else {
        currentValue.push(rawLine);
      }
    }
  }

  return secrets;
}

async function promptToken() {
  if (process.env.GH_PAT || process.env.GITHUB_TOKEN) {
    return process.env.GH_PAT || process.env.GITHUB_TOKEN;
  }

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    console.log('\n🔑 GitHub Personal Access Token (PAT) required with "repo" or "secrets" scope.');
    console.log('👉 Create one at: https://github.com/settings/tokens (classic token with "repo" scope)\n');
    rl.question('Enter your GitHub PAT: ', (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

async function fetchPublicKey(repo, token) {
  const url = `https://api.github.com/repos/${repo}/actions/secrets/public-key`;
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'User-Agent': 'Hijauin-Secret-Importer',
    },
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Failed to get public key for ${repo} (${response.status}): ${errText}`);
  }

  return response.json();
}

async function uploadSecret(repo, token, secretName, encryptedValue, keyId) {
  const url = `https://api.github.com/repos/${repo}/actions/secrets/${secretName}`;
  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'Content-Type': 'application/json',
      'User-Agent': 'Hijauin-Secret-Importer',
    },
    body: JSON.stringify({
      encrypted_value: encryptedValue,
      key_id: keyId,
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Failed to upload secret ${secretName} (${response.status}): ${errText}`);
  }

  return response.status;
}

async function main() {
  console.log('╔══════════════════════════════════════════════════════════════╗');
  console.log('║       Hijauin 2.0 — Bulk GitHub Actions Secrets Importer      ║');
  console.log('╚══════════════════════════════════════════════════════════════╝\n');

  const envFile = process.argv[2] || '.env.production';
  const repo = process.env.GITHUB_REPOSITORY || DEFAULT_REPO;

  console.log(`📁 Source file: ${envFile}`);
  console.log(`🎯 Target repository: ${repo}\n`);

  if (!fs.existsSync(envFile)) {
    if (fs.existsSync('.env.production.example')) {
      console.log(`⚠️  "${envFile}" not found. Creating from .env.production.example...`);
      fs.copyFileSync('.env.production.example', envFile);
      console.log(`✅ Created "${envFile}". Please populate your actual secret values and rerun.\n`);
      process.exit(1);
    } else {
      console.error(`❌ Error: File "${envFile}" does not exist.`);
      process.exit(1);
    }
  }

  const secrets = parseEnvFile(envFile);
  const secretEntries = Object.entries(secrets).filter(([k, v]) => {
    // Exclude purely empty strings unless specifically needed
    return v !== undefined && v !== null && v.trim() !== '';
  });

  if (secretEntries.length === 0) {
    console.log('⚠️  No secrets found with non-empty values in ' + envFile);
    process.exit(0);
  }

  console.log(`📦 Found ${secretEntries.length} secrets to upload:`);
  secretEntries.forEach(([key]) => console.log(`   • ${key}`));

  const token = await promptToken();
  if (!token) {
    console.error('❌ Error: GitHub token is required.');
    process.exit(1);
  }

  console.log('\n🔒 Initializing LibSodium cryptographic engine...');
  await sodium.ready;

  console.log('🔑 Fetching repository public encryption key from GitHub...');
  const { key: publicKeyBase64, key_id: keyId } = await fetchPublicKey(repo, token);
  const publicKeyBytes = sodium.from_base64(publicKeyBase64, sodium.base64_variants.ORIGINAL);

  console.log(`✅ Public key acquired (Key ID: ${keyId})\n`);
  console.log('🚀 Uploading secrets to GitHub Actions...');
  console.log('──────────────────────────────────────────────────────────────');

  let successCount = 0;
  let failCount = 0;

  for (const [name, value] of secretEntries) {
    process.stdout.write(`   Uploading ${name.padEnd(35)} `);
    try {
      // Encrypt using LibSodium crypto_box_seal
      const secretBytes = sodium.from_string(value);
      const encryptedBytes = sodium.crypto_box_seal(secretBytes, publicKeyBytes);
      const encryptedBase64 = sodium.to_base64(encryptedBytes, sodium.base64_variants.ORIGINAL);

      const status = await uploadSecret(repo, token, name, encryptedBase64, keyId);
      console.log(`✅ [${status === 201 ? 'CREATED' : 'UPDATED'}]`);
      successCount++;
    } catch (err) {
      console.log(`❌ FAILED`);
      console.error(`      └─ ${err.message}`);
      failCount++;
    }
  }

  console.log('──────────────────────────────────────────────────────────────');
  console.log(`\n🎉 Completed! Successfully synced ${successCount}/${secretEntries.length} secrets to GitHub.`);
  if (failCount > 0) {
    console.log(`⚠️  ${failCount} secrets encountered errors.`);
  }
}

main().catch((err) => {
  console.error('\n❌ Fatal error:', err.message);
  process.exit(1);
});
