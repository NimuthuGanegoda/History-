const fs = require('fs');
const path = require('path');

const currentKings = JSON.parse(fs.readFileSync(path.join(__dirname, '../src/data/kings.json'), 'utf8'));

// Manual assignments based on biography analysis
const manualAssignments = {
  'aggabodhi-iv': 'anuradhapura',
  'alagakkonara': 'jaffna',
  'bhuvanaikabahu-iii': 'kurunegala',
  'cinkaiariyan': 'jaffna',
  'dathopatissa-ii': 'anuradhapura',
  'ethirimana-cinkam': 'jaffna',
  'gunabharnam-pandaram': 'jaffna',
  'jaya-bahu-pandaram': 'jaffna',
  'jaya-sinha': 'jaffna',
  'jayabahu-ii': 'kotte',
  'jayavira-bandara': 'kandyan',
  'kalinga-magha-polonnaruwa': 'polonnaruwa',
  'kanakasuriya-cinkaiariyan': 'jaffna',
  'karaliyadde-bandara': 'kandyan',
  'kasi-nayinar-cinkaiariyan': 'jaffna',
  'khallatanaga': 'anuradhapura',
  'kulasekhara': 'jaffna',
  'kulasekhara-cinkaiariyan': 'jaffna',
  'moggallana-ii': 'anuradhapura',
  'parakramabahu-iii': 'polonnaruwa',
  'puviraja-pandaram-ii': 'jaffna',
  'puviraja-pandaram-iii': 'jaffna',
  'rajasinha-i-kandyan': 'kandyan',
  'silakala': 'anuradhapura',
  'siva-ii': 'anuradhapura',
  'tissa': 'anuradhapura',
  'vattagamani-abhaya': 'anuradhapura',
  'vira-alakesvara-jaffna': 'jaffna',
  'vira-narendra-sinha': 'kandyan',
  'vira-pandya': 'jaffna'
};

let updated = 0;
currentKings.forEach(king => {
  if (!king.kingdom && manualAssignments[king.slug]) {
    king.kingdom = manualAssignments[king.slug];
    updated++;
    console.log(`Assigned ${king.title} to ${king.kingdom}`);
  }
});

// Write back to file
fs.writeFileSync(
  path.join(__dirname, '../src/data/kings.json'),
  JSON.stringify(currentKings, null, 2),
  'utf8'
);

console.log(`\nUpdated ${updated} kings with kingdom information`);
console.log(`Total kings: ${currentKings.length}`);
console.log(`Kings without kingdom: ${currentKings.filter(k => !k.kingdom).length}`);
