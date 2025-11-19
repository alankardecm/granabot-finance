const fs = require('fs');
const path = require('path');

const schemaPath = path.join(__dirname, 'prisma', 'schema.prisma');
let schema = fs.readFileSync(schemaPath, 'utf8');

// Troca 'sqlite' por 'postgresql'
schema = schema.replace('provider = "sqlite"', 'provider = "postgresql"');

fs.writeFileSync(schemaPath, schema);
console.log('✅ Prisma schema updated to use PostgreSQL for deployment');
