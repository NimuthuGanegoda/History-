const fs = require('fs');
const path = require('path');

const kingsFile = path.join(__dirname, '../src/data/kings.json');
const kings = JSON.parse(fs.readFileSync(kingsFile, 'utf8'));

// Keywords indicating international connections
const connectionKeywords = [
  'china', 'chinese', 'india', 'indian', 'chola', 'pandya', 'pallava',
  'rome', 'roman', 'portugal', 'portuguese', 'dutch', 'british',
  'kalinga', 'burma', 'burmese', 'thailand', 'siam',
  'embassy', 'envoy', 'diplomatic', 'trade', 'merchant',
  'colonial', 'invasion', 'invaded', 'alliance'
];

let updated = 0;

kings.forEach(king => {
  const bio = king.biography.toLowerCase();
  const allText = king.sections.map(s => s.content.join(' ')).join(' ').toLowerCase();
  
  // Check if biography mentions international connections
  const hasConnection = connectionKeywords.some(keyword => 
    bio.includes(keyword) || allText.includes(keyword)
  );
  
  if (hasConnection && !king.internationalConnections) {
    // Extract relevant sentences
    const sentences = king.biography.split(/\. /);
    const relevantSentences = sentences.filter(s => 
      connectionKeywords.some(kw => s.toLowerCase().includes(kw))
    );
    
    if (relevantSentences.length > 0) {
      king.internationalConnections = relevantSentences.slice(0, 2).join('. ') + '.';
      updated++;
      console.log(`Added connection for ${king.title}`);
    }
  }
});

fs.writeFileSync(kingsFile, JSON.stringify(kings, null, 2), 'utf8');

console.log(`\n✓ Added international connections to ${updated} kings`);
