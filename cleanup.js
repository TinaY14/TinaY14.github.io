const fs = require('fs');
const path = require('path');

// Directories containing generated HTML files
const generatedDirs = [
    'night_stall_food',
    'projects'
];

// Index/main pages to keep (these are NOT generated from templates)
const keepFiles = [
    'night_stall_food/night_stall_food.html'
];

let deletedCount = 0;

generatedDirs.forEach(dir => {
    const dirPath = path.join(__dirname, dir);

    if (!fs.existsSync(dirPath)) {
        console.log(`Directory not found: ${dir}`);
        return;
    }

    const files = fs.readdirSync(dirPath);

    files.forEach(file => {
        if (!file.endsWith('.html')) return;

        const relativePath = path.join(dir, file);
        const fullPath = path.join(dirPath, file);

        // Skip files we want to keep
        if (keepFiles.includes(relativePath)) {
            console.log(`Keeping: ${relativePath}`);
            return;
        }

        // Delete the generated HTML file
        try {
            fs.unlinkSync(fullPath);
            console.log(`Deleted: ${relativePath}`);
            deletedCount++;
        } catch (err) {
            console.error(`Error deleting ${relativePath}: ${err.message}`);
        }
    });
});

console.log(`\nCleanup complete! Deleted ${deletedCount} generated HTML file(s).`);
