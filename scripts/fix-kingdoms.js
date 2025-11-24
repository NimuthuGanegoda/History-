const fs = require('fs');
const path = require('path');

// Read the files
const backupKings = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/kings-backup.json'), 'utf8'));
const currentKings = JSON.parse(fs.readFileSync(path.join(__dirname, '../src/data/kings.json'), 'utf8'));

// Create a map of slug -> kingdom from backup
const kingdomMap = {};
backupKings.forEach(king => {
  kingdomMap[king.slug] = king.kingdom;
});

// Update current kings with kingdom info
let updated = 0;
currentKings.forEach(king => {
  if (kingdomMap[king.slug]) {
    king.kingdom = kingdomMap[king.slug];
    updated++;
  }
});

// Write back to file
fs.writeFileSync(
  path.join(__dirname, '../src/data/kings.json'),
  JSON.stringify(currentKings, null, 2),
  'utf8'
);

console.log(`Updated ${updated} kings with kingdom information`);
console.log(`Total kings: ${currentKings.length}`);
console.log(`Kings without kingdom: ${currentKings.filter(k => !k.kingdom).length}`);
