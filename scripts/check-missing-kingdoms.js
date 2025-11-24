const fs = require('fs');
const path = require('path');

const currentKings = JSON.parse(fs.readFileSync(path.join(__dirname, '../src/data/kings.json'), 'utf8'));

const missingKingdom = currentKings.filter(k => !k.kingdom);

console.log('Kings without kingdom assignment:');
console.log('=================================');
missingKingdom.forEach(king => {
  console.log(`- ${king.title} (${king.slug}) - ${king.reign}`);
  // Print first 200 chars of biography to help identify the kingdom
  const bio = king.biography.replace(/<[^>]*>/g, '').substring(0, 200);
  console.log(`  Bio: ${bio}...`);
  console.log('');
});
