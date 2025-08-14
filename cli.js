#!/usr/bin/env node

const inquirer = require('inquirer');
const fs = require('fs');
const path = require('path');

// 🚀 Welcome message
console.log("🚀 Welcome to NodeBoilerx!");

const MERN_STRUCTURE = {
    'server': {
        'controllers': ['userController.js'],
        'models': ['userModel.js'],
        'routes': ['userRoutes.js'],
        'config': ['db.js'],
        'middleware': ['authMiddleware.js'],
        'server.js': `const express = require('express');
const dotenv = require('dotenv');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => res.send('API is running...'));

app.listen(PORT, () => console.log(\`Server started on port \${PORT}\`));`
    },
    'client': {
        'src': {
            'components': [],
            'pages': [],
            'App.js': '',
            'index.js': ''
        },
        'public': ['index.html']
    },
    '.env': 'PORT=5000\nMONGO_URI=',
    'package.json': '{ "name": "mern-app", "version": "1.0.0" }',
    '.gitignore': 'node_modules\n.env'
};

const MEAN_STRUCTURE = {
    ...MERN_STRUCTURE,
    'client': {
        'src': {
            'app': {
                'components': [],
                'services': [],
                'app.module.ts': '',
                'app.component.ts': ''
            },
            'assets': [],
            'environments': [],
            'index.html': '',
            'main.ts': '',
            'styles.css': ''
        },
        'angular.json': ''
    }
};

function createProjectStructure(basePath, structure) {
    for (const [name, content] of Object.entries(structure)) {
        const fullPath = path.join(basePath, name);
        if (typeof content === 'string') {
            fs.writeFileSync(fullPath, content);
            console.log(`✅ Created file: ${fullPath}`);
        } else if (Array.isArray(content)) {
            fs.mkdirSync(fullPath, { recursive: true });
            console.log(`📁 Created directory: ${fullPath}`);
            content.forEach(file => {
                const filePath = path.join(fullPath, file);
                fs.writeFileSync(filePath, `// ${file} placeholder`);
                console.log(`✅ Created file: ${filePath}`);
            });
        } else {
            fs.mkdirSync(fullPath, { recursive: true });
            console.log(`📁 Created directory: ${fullPath}`);
            createProjectStructure(fullPath, content);
        }
    }
}

async function run() {
    const { stack } = await inquirer.prompt([
        {
            type: 'list',
            name: 'stack',
            message: 'Which tech stack would you like to set up?',
            choices: ['MERN', 'MEAN', 'Basic Node Server (from original tool)'],
        },
    ]);

    const projectDir = process.cwd();

    console.log(`\nSetting up a ${stack} project in ${projectDir}...\n`);

    switch (stack) {
        case 'MERN':
            createProjectStructure(projectDir, MERN_STRUCTURE);
            break;
        case 'MEAN':
            createProjectStructure(projectDir, MEAN_STRUCTURE);
            break;
        case 'Basic Node Server (from original tool)':
            const serverCode = `const http = require('http');
const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello, World!\\n');
});
server.listen(3000, '127.0.0.1', () => {
  console.log('Server running at http://127.0.0.1:3000/');
});`;
            fs.writeFileSync(path.join(projectDir, 'server.js'), serverCode);
            break;
    }

    console.log('\n\x1b[32m%s\x1b[0m', '🚀 Project setup complete!');
    console.log('Next steps:');
    console.log('  1. Run `npm install` in the root directory.');
    console.log('  2. For MERN/MEAN, `cd client` and run `npm install` there too.');
}

run().catch(err => {
    console.error('An error occurred:', err);
});
