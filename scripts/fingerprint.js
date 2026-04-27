const { createFingerprintAsync, diffFingerprints } = require('@expo/fingerprint');
const fs = require('fs');

const FINGERPRINT_FILE = '.fingerprint.json';

async function main() {
  const command = process.argv[2];
  const fingerprint = await createFingerprintAsync(process.cwd());

  if (command === 'generate') {
    fs.writeFileSync(FINGERPRINT_FILE, JSON.stringify(fingerprint, null, 2));
    console.log(`Generated: ${fingerprint.hash}`);
  }

  if (command === 'check') {
    if (!fs.existsSync(FINGERPRINT_FILE)) {
      process.stdout.write('true'); // No cache → must build
      return;
    }
    const previous = JSON.parse(fs.readFileSync(FINGERPRINT_FILE, 'utf-8'));
    const diff = diffFingerprints(previous, fingerprint);
    process.stdout.write(diff.length > 0 ? 'true' : 'false');
  }
}

main().catch(console.error);