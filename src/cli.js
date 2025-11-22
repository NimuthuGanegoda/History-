#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const kingdoms = JSON.parse(fs.readFileSync(path.join(__dirname,'..','data','kingdoms.json'),'utf8'));
const kings = JSON.parse(fs.readFileSync(path.join(__dirname,'..','data','kings.json'),'utf8'));

const kingdomById = new Map(kingdoms.map(k=>[k.id,k]));
const kingsByKingdom = kings.reduce((acc,k)=>{(acc[k.kingdom]=acc[k.kingdom]||[]).push(k);return acc;},{});

function padRight(str,len){return (str + ' '.repeat(len)).slice(0,len);} // simple column formatting

function listKingdoms(){
  console.log('Kingdoms:\n');
  for(const k of kingdoms){
    console.log(`- ${k.id} | ${k.name} | ${k.era}`);
  }
}

function listKings(kingdom){
  if(!kingdomById.has(kingdom)){
    console.error(`Unknown kingdom: ${kingdom}`);
    process.exit(1);
  }
  const list = (kingsByKingdom[kingdom]||[]);
  console.log(`Kings of ${kingdomById.get(kingdom).name} (${list.length}):\n`);
  for(const k of list){
    console.log(`- ${padRight(k.slug,24)} ${padRight(k.reign,15)} ${k.name}`);
  }
}

function findKing(term){
  const lc = term.toLowerCase();
  const matches = kings.filter(k=>k.name.toLowerCase().includes(lc) || k.slug.includes(lc));
  if(!matches.length){
    console.log('No matches.');
    return;
  }
  for(const k of matches){
    console.log(`${k.name} (${k.reign}) [${k.kingdom}] slug=${k.slug}`);
  }
}

function exportMarkdown(dir){
  if(!fs.existsSync(dir)) fs.mkdirSync(dir,{recursive:true});

  // kingdoms summary
  const kingdomIndex = ['# Kingdoms',''];
  for(const k of kingdoms){
    kingdomIndex.push(`- **[${k.name}](${k.id}/index.md)** (${k.period}) — ${k.description||''}`);
  }
  fs.writeFileSync(path.join(dir,'kingdoms.md'), kingdomIndex.join('\n')+'\n');

  // per kingdom
  for(const k of kingdoms){
    const kingdomDir = path.join(dir, k.id);
    if(!fs.existsSync(kingdomDir)) fs.mkdirSync(kingdomDir, {recursive:true});
    const list = kingsByKingdom[k.id]||[];
    const lines = [`# ${k.name}`, '', `*${k.period}*`, '', k.description, '', '## Kings', ''];
    for(const king of list){
      lines.push(`- [${king.name}](${king.slug}.md) (${king.reign})`);
      const kingFile = path.join(kingdomDir, `${king.slug}.md`);
      const kingLines = [
        `# ${king.name}`,
        '',
        `**Reign:** ${king.reign}`,
        ''
      ];
      if(king.biography){
        kingLines.push(king.biography);
      }
      fs.writeFileSync(kingFile, kingLines.join('\n') + '\n');
    }
    fs.writeFileSync(path.join(kingdomDir, `index.md`), lines.join('\n')+'\n');
  }
  console.log(`Markdown exported to ${dir}`);
}

function help(){
  console.log(`Sri Lanka History Data CLI\n\nCommands:\n  list-kingdoms\n  list-kings <kingdomSlug>\n  find-king <search-term>\n  export-markdown <outputDir>\n`);
}

const [, , cmd, arg1, arg2] = process.argv;

switch(cmd){
  case 'list-kingdoms': listKingdoms(); break;
  case 'list-kings': listKings(arg1); break;
  case 'find-king': findKing(arg1||''); break;
  case 'export-markdown': exportMarkdown(arg1||'output-md'); break;
  default: help(); break;
}
