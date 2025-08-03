const fs = require('fs');
const path = require('path');

// Padrões a serem substituídos
const patterns = [
  {
    find: /bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600/g,
    replace: '{gradientClasses.primaryButton}',
    import: true
  },
  {
    find: /bg-gradient-to-r from-purple-500 to-pink-500/g,
    replace: '{gradientClasses.primary}',
    import: true
  },
  {
    find: /bg-gradient-to-br from-purple-500 to-pink-500/g,
    replace: '{gradientClasses.primaryBr}',
    import: true
  },
  {
    find: /hover:from-purple-600 hover:to-pink-600/g,
    replace: '{gradientClasses.primaryHover}',
    import: true
  }
];

// Função para processar arquivo
function processFile(filePath) {
  if (!filePath.endsWith('.tsx') && !filePath.endsWith('.ts')) return;
  
  let content = fs.readFileSync(filePath, 'utf8');
  let hasChanges = false;
  let needsImport = false;

  patterns.forEach(pattern => {
    if (pattern.find.test(content)) {
      content = content.replace(pattern.find, pattern.replace);
      hasChanges = true;
      if (pattern.import) needsImport = true;
    }
  });

  if (hasChanges) {
    // Adicionar import se necessário
    if (needsImport && !content.includes('gradientClasses')) {
      const importLine = "import { gradientClasses } from '@/lib/gradient-classes';\n";
      
      // Encontrar onde inserir o import
      const importIndex = content.lastIndexOf("import");
      if (importIndex !== -1) {
        const nextLineIndex = content.indexOf('\n', importIndex);
        content = content.slice(0, nextLineIndex + 1) + importLine + content.slice(nextLineIndex + 1);
      } else {
        content = importLine + content;
      }
    }

    fs.writeFileSync(filePath, content);
    console.log(`✅ Processed: ${filePath}`);
  }
}

// Função para processar diretório recursivamente
function processDirectory(dirPath) {
  const items = fs.readdirSync(dirPath);
  
  items.forEach(item => {
    const fullPath = path.join(dirPath, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory() && !item.includes('node_modules') && !item.includes('.git')) {
      processDirectory(fullPath);
    } else if (stat.isFile()) {
      processFile(fullPath);
    }
  });
}

// Processar diretórios
console.log('🚀 Starting gradient replacement...');
processDirectory('./app');
processDirectory('./components');
console.log('✅ Gradient replacement completed!');