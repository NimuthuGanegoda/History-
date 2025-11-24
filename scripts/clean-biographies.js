const fs = require('fs');
const path = require('path');

const kingsFile = path.join(__dirname, '../src/data/kings.json');
const kings = JSON.parse(fs.readFileSync(kingsFile, 'utf8'));

let cleanedCount = 0;

kings.forEach(king => {
  let originalBio = king.biography;
  let cleanedBio = originalBio;
  
  // Remove HTML tags
  cleanedBio = cleanedBio.replace(/<[^>]+>/g, '');
  
  // Extract the name without "King " prefix for pattern matching
  const nameWithoutKing = king.title.replace(/^King\s+/i, '');
  
  // Fix the redundant name repetition pattern: "Name (dates) – Name (dates) rest of text"
  // We want to remove the FIRST occurrence and keep the second + rest
  // Example: "Abhaya Naga (215–237 CE) – Abhaya Naga (215–237 CE) governed..." 
  // Should become: "Abhaya Naga (215–237 CE) governed..."
  const escapedName = nameWithoutKing.replace(/[()]/g, '\\$&').replace(/\s+/g, '\\s+');
  const redundantPattern = new RegExp(`^(${escapedName})\\s*\\([^)]+\\)\\s*–\\s*`, 'i');
  
  cleanedBio = cleanedBio.replace(redundantPattern, '');
  
  // Update biography if changed
  if (cleanedBio !== originalBio) {
    king.biography = cleanedBio;
    cleanedCount++;
    console.log(`Cleaned: ${king.title}`);
  }
  
  // Clean sections too
  king.sections.forEach(section => {
    section.content = section.content.map(text => {
      let cleanedText = text.replace(/<[^>]+>/g, '');
      
      // Fix redundant name pattern in sections too
      cleanedText = cleanedText.replace(redundantPattern, '');
      
      return cleanedText;
    });
  });
});

fs.writeFileSync(kingsFile, JSON.stringify(kings, null, 2), 'utf8');

console.log(`\n✓ Cleaned ${cleanedCount} biographies`);
console.log(`✓ Total kings processed: ${kings.length}`);
