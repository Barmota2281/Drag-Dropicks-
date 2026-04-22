const fs = require('fs');
const path = require('path');

const regex = /(text|bg|border|ring|from|to|checked:bg|focus:border|focus:ring|peer-checked:bg|peer-checked:ring|group-hover:text|hover:bg|hover:text|group-hover:bg)-blue-/g;

function walk(dir) {
  fs.readdirSync(dir).forEach(file => {
    const full = path.join(dir, file);
    if(fs.statSync(full).isDirectory()) {
      walk(full);
    } else if(['.vue', '.js'].includes(path.extname(full))) {
      const content = fs.readFileSync(full, 'utf8');
      const newContent = content.replace(regex, '$1-accent-');
      if (content !== newContent) {
        fs.writeFileSync(full, newContent);
        console.log('Updated ' + full);
      }
    }
  });
}

walk('src');
