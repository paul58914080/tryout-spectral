const fs = require('fs');
const path = require('path');
const { join } = require('path');
const { bundleAndLoadRuleset } = require('@stoplight/spectral-ruleset-bundler/with-loader');
const { Spectral } = require('@stoplight/spectral-core');
const { fetch } = require('@stoplight/spectral-runtime');

(async () => {
  // Use __filename directly for CommonJS
  const rulesetPath = join(
    path.dirname(__filename),
    'spectral.yaml'
  );

  const spectral = new Spectral();
  spectral.setRuleset(await bundleAndLoadRuleset(rulesetPath, { fs, fetch }));

  const rules = spectral.ruleset.rules;

  for (const [ruleName, rule] of Object.entries(rules)) {
    console.log(`Rule name: ${ruleName}`);
    console.log('Rule message: ', rule.message);
    console.log('Rule description: ', rule.description);
    console.log('Is active: ', rule.enabled);
    console.log('Rule severity: ', rule.severity);
  }
})();
