/**
 * DDL Parser - Parses MySQL DDL SQL files and extracts schema information
 */
class DDLParser {
    constructor(sqlContent) {
        this.sql = sqlContent;
        this.schema = {};
    }

    cleanSql() {
        let sql = this.sql;
        // Remove /* ... */ comments
        sql = sql.replace(/\/\*[\s\S]*?\*\//g, '');
        // Remove -- comments
        sql = sql.replace(/--.*$/gm, '');
        // Remove # comments
        sql = sql.replace(/#.*$/gm, '');
        return sql;
    }

    parse() {
        const cleanedSql = this.cleanSql();

        // Matches: CREATE TABLE [IF NOT EXISTS] `tableName` (
        const startPattern = /CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?[`"]?(\w+)[`"]?\s*\(/gi;

        let match;
        while ((match = startPattern.exec(cleanedSql)) !== null) {
            const tableName = match[1];
            const startBodyIndex = match.index + match[0].length;

            // Parenthesis Balancing
            let balance = 1;
            let currentIndex = startBodyIndex;
            let inQuote = false;
            let quoteChar = '';

            while (currentIndex < cleanedSql.length && balance > 0) {
                const char = cleanedSql[currentIndex];

                if (['\'', '"', '`'].includes(char)) {
                    if (!inQuote) {
                        inQuote = true;
                        quoteChar = char;
                    } else if (char === quoteChar) {
                        inQuote = false;
                    }
                }

                if (!inQuote) {
                    if (char === '(') balance++;
                    else if (char === ')') balance--;
                }
                currentIndex++;
            }

            // Extract inner body (removing the last closing paren)
            const body = cleanedSql.substring(startBodyIndex, currentIndex - 1);

            // Find full statement end (;)
            let endStmtIndex = currentIndex;
            while (endStmtIndex < cleanedSql.length) {
                if (cleanedSql[endStmtIndex] === ';') {
                    endStmtIndex++;
                    break;
                }
                endStmtIndex++;
            }

            const fullStmt = cleanedSql.substring(match.index, endStmtIndex).trim();

            this.schema[tableName] = this._parseTableBody(body);
            this.schema[tableName].full_create_stmt = fullStmt;

            // Move regex index to prevent infinite loop or re-matching overlap
            startPattern.lastIndex = endStmtIndex;
        }

        return this.schema;
    }

    _splitDefinitions(bodyStr) {
        const definitions = [];
        let current = [];
        let parenDepth = 0;
        let inQuote = false;
        let quoteChar = '';

        for (let i = 0; i < bodyStr.length; i++) {
            const char = bodyStr[i];

            if (['\'', '"', '`'].includes(char)) {
                if (!inQuote) {
                    inQuote = true;
                    quoteChar = char;
                } else if (char === quoteChar) {
                    inQuote = false;
                }
            }

            if (!inQuote) {
                if (char === '(') parenDepth++;
                else if (char === ')') parenDepth--;
                else if (char === ',' && parenDepth === 0) {
                    definitions.push(current.join('').trim());
                    current = [];
                    continue;
                }
            }
            current.push(char);
        }

        if (current.length > 0) {
            definitions.push(current.join('').trim());
        }

        return definitions;
    }

    _parseTableBody(body) {
        const columns = {};
        const indexes = [];
        const foreignKeys = [];
        const columnOrder = [];

        const lines = this._splitDefinitions(body);

        for (let line of lines) {
            line = line.trim();
            if (!line) continue;

            // Normalize spaces
            line = line.replace(/\s+/g, ' ');
            const upperLine = line.toUpperCase();

            if (upperLine.startsWith('FOREIGN KEY')) {
                foreignKeys.push(line);
                indexes.push(line); // Also keep in indexes for backward compatibility
            } else if (upperLine.startsWith('PRIMARY KEY') ||
                upperLine.startsWith('KEY') ||
                upperLine.startsWith('INDEX') ||
                upperLine.startsWith('UNIQUE') ||
                upperLine.startsWith('CONSTRAINT') ||
                upperLine.startsWith('FULLTEXT')) {
                indexes.push(line);
            } else {
                // Column Parsing
                // Regex: `col_name` column_definition
                const colMatch = line.match(/^[`"]?(\w+)[`"]?\s+(.*)/);
                if (colMatch) {
                    const colName = colMatch[1];
                    const colDef = colMatch[2];

                    // Extract pure type for comparison
                    const typeMatch = colDef.match(/^([^\s(]+(?:\(.*?\))?)/);
                    const colType = typeMatch ? typeMatch[1].toLowerCase() : 'unknown';

                    // Extract default value
                    const defaultMatch = colDef.match(/DEFAULT\s+([^\s,]+)/i);
                    const defaultValue = defaultMatch ? defaultMatch[1] : null;

                    columns[colName] = {
                        definition: colDef,
                        type: colType,
                        full_line: line,
                        default: defaultValue,
                        order: columnOrder.length
                    };
                    columnOrder.push(colName);
                }
            }
        }
        return { columns, indexes, foreignKeys, columnOrder };
    }
}

// Export for Node.js/CommonJS environments
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { DDLParser };
}
