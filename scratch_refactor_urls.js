const fs = require('fs');
const path = require('path');

const targetDir = 'c:/Users/mkuma/Work/portfolio-mern/frontend/src';
const filesToFix = ['admin.jsx', 'home.jsx', 'Login.jsx'];

filesToFix.forEach(file => {
  const filePath = path.join(targetDir, file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Replace single quotes
    content = content.replace(/'https:\/\/portfolio-mern-pvfn\.vercel\.app\/api([^']*)'/g, '`${import.meta.env.VITE_API_URL}$1`');
    
    // Replace backticks
    content = content.replace(/`https:\/\/portfolio-mern-pvfn\.vercel\.app\/api([^`]*)`/g, '`${import.meta.env.VITE_API_URL}$1`');
    
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated API URLs in ${file}`);
  }
});
