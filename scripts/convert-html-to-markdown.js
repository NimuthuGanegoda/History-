const fs = require('fs');
const path = require('path');

// Simple HTML to Markdown converter
function htmlToMarkdown(htmlContent, type = 'page') {
  let markdown = '';
  
  // Extract title
  const titleMatch = htmlContent.match(/<title>(.*?)<\/title>/);
  const title = titleMatch ? titleMatch[1].replace(' - Sri Lanka History', '') : '';
  
  // Extract hero/header content
  const heroMatch = htmlContent.match(/<h1[^>]*>(.*?)<\/h1>/);
  const mainTitle = heroMatch ? heroMatch[1] : title;
  
  // Extract reign info if present
  const reignMatch = htmlContent.match(/Reign:\s*([^<]+)/);
  const reign = reignMatch ? reignMatch[1].trim() : '';
  
  // Extract kingdom info if present
  const kingdomMatch = htmlContent.match(/Kingdom:\s*<\/span>\s*<\/div>\s*<div><span>[^<]*<\/span>\s*([^<]+)/);
  const kingdom = kingdomMatch ? kingdomMatch[1].trim() : '';
  
  // Build frontmatter
  markdown += '---\n';
  markdown += `title: "${mainTitle}"\n`;
  if (reign) markdown += `reign: "${reign}"\n`;
  if (kingdom) markdown += `kingdom: "${kingdom}"\n`;
  markdown += `layout: ${type}\n`;
  markdown += '---\n\n';
  
  // Add main title
  markdown += `# ${mainTitle}\n\n`;
  
  // Extract all content sections
  const contentSections = htmlContent.match(/<div class="content-section">(.*?)<\/div>\s*<\/div>/gs);
  
  if (contentSections) {
    contentSections.forEach(section => {
      // Extract section title
      const sectionTitleMatch = section.match(/<h2>(.*?)<\/h2>/);
      if (sectionTitleMatch) {
        markdown += `## ${sectionTitleMatch[1]}\n\n`;
      }
      
      // Extract paragraphs
      const paragraphs = section.match(/<p>(.*?)<\/p>/gs);
      if (paragraphs) {
        paragraphs.forEach(p => {
          const text = p.replace(/<\/?p>/g, '').trim();
          if (text) {
            markdown += `${text}\n\n`;
          }
        });
      }
      
      // Extract info boxes
      const infoBoxes = section.match(/<div class="info-box">.*?<\/div>/gs);
      if (infoBoxes) {
        infoBoxes.forEach(box => {
          const strongMatch = box.match(/<strong>(.*?)<\/strong>/);
          const pMatch = box.match(/<p>(.*?)<\/p>/);
          if (strongMatch && pMatch) {
            markdown += `### ${strongMatch[1]}\n\n`;
            markdown += `${pMatch[1]}\n\n`;
          }
        });
      }
    });
  }
  
  return markdown;
}

// Convert all HTML files
function convertDirectory(inputDir, outputDir) {
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  const files = fs.readdirSync(inputDir);
  
  files.forEach(file => {
    const inputPath = path.join(inputDir, file);
    const stat = fs.statSync(inputPath);
    
    if (stat.isDirectory()) {
      // Recursively convert subdirectories
      convertDirectory(inputPath, path.join(outputDir, file));
    } else if (file.endsWith('.html') && file !== 'index.html') {
      // Convert HTML to Markdown
      const htmlContent = fs.readFileSync(inputPath, 'utf8');
      const markdown = htmlToMarkdown(htmlContent);
      
      const mdFileName = file.replace('.html', '.md');
      const outputPath = path.join(outputDir, mdFileName);
      
      fs.writeFileSync(outputPath, markdown);
      console.log(`Converted: ${file} -> ${mdFileName}`);
    }
  });
}

// Main execution
const htmlOutputDir = path.join(__dirname, '..', 'html-output');
const markdownOutputDir = path.join(__dirname, '..', 'markdown-output');

console.log('Converting HTML files to Markdown...\n');

// Convert kings
convertDirectory(path.join(htmlOutputDir, 'kings'), path.join(markdownOutputDir, 'kings'));

// Convert kingdoms
convertDirectory(path.join(htmlOutputDir, 'kingdoms'), path.join(markdownOutputDir, 'kingdoms'));

console.log('\n✅ Conversion complete!');
console.log(`Markdown files saved to: ${markdownOutputDir}`);
