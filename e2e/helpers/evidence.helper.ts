import { Page } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

export interface EvidenceStep {
  suite: string;
  stepNumber: number;
  name: string;
  description: string;
  screenshotPath: string;
  timestamp: string;
  status: 'passed' | 'failed';
}

const EVIDENCE_DIR = path.resolve(process.cwd(), 'e2e-evidence');
const METADATA_FILE = path.join(EVIDENCE_DIR, 'evidence-metadata.json');

export class EvidenceCollector {
  private static steps: EvidenceStep[] = [];

  static init() {
    if (!fs.existsSync(EVIDENCE_DIR)) {
      fs.mkdirSync(EVIDENCE_DIR, { recursive: true });
    }
    this.steps = [];
    if (fs.existsSync(METADATA_FILE)) {
      try {
        this.steps = JSON.parse(fs.readFileSync(METADATA_FILE, 'utf-8'));
      } catch {
        this.steps = [];
      }
    }
  }

  static async capture(
    page: Page,
    suite: string,
    stepNumber: number,
    name: string,
    description: string
  ): Promise<string> {
    const suiteDir = path.join(EVIDENCE_DIR, suite.toLowerCase().replace(/[^a-z0-9]/g, '_'));
    if (!fs.existsSync(suiteDir)) {
      fs.mkdirSync(suiteDir, { recursive: true });
    }

    const paddedNum = String(stepNumber).padStart(2, '0');
    const safeName = name.toLowerCase().replace(/[^a-z0-9]/g, '_');
    const filename = `${paddedNum}_${safeName}.png`;
    const fullPath = path.join(suiteDir, filename);
    const relPath = path.relative(process.cwd(), fullPath).replace(/\\/g, '/');

    // Allow UI animation to settle
    await page.waitForTimeout(300);

    await page.screenshot({
      path: fullPath,
      fullPage: false,
    });

    const step: EvidenceStep = {
      suite,
      stepNumber,
      name,
      description,
      screenshotPath: relPath,
      timestamp: new Date().toISOString(),
      status: 'passed',
    };

    // Replace if exists, else append
    const idx = this.steps.findIndex(s => s.suite === suite && s.stepNumber === stepNumber);
    if (idx >= 0) {
      this.steps[idx] = step;
    } else {
      this.steps.push(step);
    }

    fs.writeFileSync(METADATA_FILE, JSON.stringify(this.steps, null, 2));
    return relPath;
  }

  static getSteps(): EvidenceStep[] {
    return this.steps;
  }
}

EvidenceCollector.init();
