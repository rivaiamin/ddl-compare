/**
 * Jest setup file - Loads classes into global scope for testing
 */

// Use require-like approach by creating a module context
const fs = require('fs');
const path = require('path');
const Module = require('module');

// Create a custom require function for our JS files
function requireScript(filePath) {
    const code = fs.readFileSync(filePath, 'utf8');
    const module = new Module(filePath);
    module._compile(code, filePath);
    return module.exports;
}

// Load DDL Parser
const ddlParserModule = requireScript(path.join(__dirname, '../js/ddl-parser.js'));
global.DDLParser = ddlParserModule.DDLParser;

// Load Schema Comparator
const schemaComparatorModule = requireScript(path.join(__dirname, '../js/schema-comparator.js'));
global.SchemaComparator = schemaComparatorModule.SchemaComparator;
