#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Remove console statements from production build
function removeConsoleStatements(dir) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory() && !file.includes('node_modules') && !file.includes('.git')) {
      removeConsoleStatements(filePath);
    } else if (file.endsWith('.js') || file.endsWith('.ts') || file.endsWith('.tsx')) {
      let content = fs.readFileSync(filePath, 'utf8');
      
      // Remove console statements but keep error handling
      content = content.replace(/console\.(log|info|debug|warn)\([^)]*\);?\s*/g, '');
      
      fs.writeFileSync(filePath, content);
    }
  });
}

// Fix critical production issues
function fixProductionIssues() {
  console.log('🔧 Fixing production issues...');
  
  // Remove console statements from src directory
  const srcDir = path.join(__dirname, 'src');
  if (fs.existsSync(srcDir)) {
    removeConsoleStatements(srcDir);
    console.log('✅ Removed console statements');
  }
  
  console.log('✅ Production fixes applied successfully!');
}

if (require.main === module) {
  fixProductionIssues();
}

module.exports = { fixProductionIssues };