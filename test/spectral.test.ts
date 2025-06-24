import { Spectral } from '@stoplight/spectral-core';
import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
const { bundleAndLoadRuleset } = require('@stoplight/spectral-ruleset-bundler/with-loader');

async function runSpectral(file: string) {
  const apiRulesetPath = path.join(process.cwd(), 'spectral.yaml');
  const ruleset = await bundleAndLoadRuleset(apiRulesetPath, { fs, fetch });
  const spectral = new Spectral();
  spectral.setRuleset(ruleset);
  const content = fs.readFileSync(file, 'utf8');
  const parsed = yaml.load(content);
  return spectral.run(parsed as Record<string, unknown>);
}

describe('Spectral custom rules', () => {
  test('info-title positive passes', async () => {
    const results = await runSpectral(path.join(__dirname, 'info-title/positive.yaml'));
    expect(results.length).toBe(0);
  });

  test('info-title negative fails', async () => {
    const results = await runSpectral(path.join(__dirname, 'info-title/negative.yaml'));
    expect(results.some((r: any) => r.code === 'info-title-not-empty')).toBe(true);
  });

  test('operation-description positive passes', async () => {
    const results = await runSpectral(path.join(__dirname, 'operation-description/positive.yaml'));
    expect(results.length).toBe(0);
  });

  test('operation-description negative fails', async () => {
    const results = await runSpectral(path.join(__dirname, 'operation-description/negative.yaml'));
    expect(results.some((r: any) => r.code === 'operation-description-required')).toBe(true);
  });
});
