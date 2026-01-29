/**
 * Tests for DDL Parser
 */

describe('DDLParser', () => {
    let parser;

    beforeEach(() => {
        parser = null;
    });

    test('should parse simple CREATE TABLE statement', () => {
        const sql = `
            CREATE TABLE users (
                id INT PRIMARY KEY,
                name VARCHAR(100)
            );
        `;
        parser = new DDLParser(sql);
        const schema = parser.parse();

        expect(schema).toHaveProperty('users');
        expect(schema.users.columns).toHaveProperty('id');
        expect(schema.users.columns).toHaveProperty('name');
        expect(schema.users.columns.id.type).toBe('int');
        expect(schema.users.columns.name.type).toBe('varchar(100)');
    });

    test('should handle table names with backticks', () => {
        const sql = `
            CREATE TABLE \`user_profiles\` (
                id INT PRIMARY KEY
            );
        `;
        parser = new DDLParser(sql);
        const schema = parser.parse();

        expect(schema).toHaveProperty('user_profiles');
    });

    test('should handle IF NOT EXISTS clause', () => {
        const sql = `
            CREATE TABLE IF NOT EXISTS users (
                id INT PRIMARY KEY
            );
        `;
        parser = new DDLParser(sql);
        const schema = parser.parse();

        expect(schema).toHaveProperty('users');
    });

    test('should parse columns with complex types', () => {
        const sql = `
            CREATE TABLE products (
                id INT AUTO_INCREMENT PRIMARY KEY,
                price DECIMAL(10, 2) NOT NULL,
                description TEXT,
                status ENUM('active', 'inactive') DEFAULT 'active'
            );
        `;
        parser = new DDLParser(sql);
        const schema = parser.parse();

        expect(schema.products.columns.price.type).toBe('decimal(10, 2)');
        expect(schema.products.columns.description.type).toBe('text');
        expect(schema.products.columns.status.type).toBe("enum('active', 'inactive')");
    });

    test('should extract indexes', () => {
        const sql = `
            CREATE TABLE users (
                id INT PRIMARY KEY,
                email VARCHAR(100),
                username VARCHAR(50),
                UNIQUE KEY uk_email (email),
                INDEX idx_username (username)
            );
        `;
        parser = new DDLParser(sql);
        const schema = parser.parse();

        expect(schema.users.indexes.length).toBeGreaterThan(0);
        expect(schema.users.indexes.some(idx => idx.includes('uk_email'))).toBe(true);
        expect(schema.users.indexes.some(idx => idx.includes('idx_username'))).toBe(true);
    });

    test('should extract foreign keys', () => {
        const sql = `
            CREATE TABLE posts (
                id INT PRIMARY KEY,
                user_id INT,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            );
        `;
        parser = new DDLParser(sql);
        const schema = parser.parse();

        expect(schema.posts.foreignKeys).toBeDefined();
        expect(schema.posts.foreignKeys.length).toBeGreaterThan(0);
        expect(schema.posts.foreignKeys[0]).toContain('FOREIGN KEY');
    });

    test('should handle comments in SQL', () => {
        const sql = `
            -- This is a comment
            CREATE TABLE users (
                id INT PRIMARY KEY -- inline comment
            );
            /* Multi-line
               comment */
        `;
        parser = new DDLParser(sql);
        const schema = parser.parse();

        expect(schema).toHaveProperty('users');
        expect(schema.users.columns).toHaveProperty('id');
    });

    test('should handle multiple tables', () => {
        const sql = `
            CREATE TABLE users (
                id INT PRIMARY KEY
            );
            CREATE TABLE posts (
                id INT PRIMARY KEY
            );
        `;
        parser = new DDLParser(sql);
        const schema = parser.parse();

        expect(Object.keys(schema)).toHaveLength(2);
        expect(schema).toHaveProperty('users');
        expect(schema).toHaveProperty('posts');
    });

    test('should extract default values', () => {
        const sql = `
            CREATE TABLE users (
                id INT DEFAULT 0,
                name VARCHAR(100) DEFAULT 'unknown',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `;
        parser = new DDLParser(sql);
        const schema = parser.parse();

        expect(schema.users.columns.id.default).toBe('0');
        expect(schema.users.columns.name.default).toBe("'unknown'");
        expect(schema.users.columns.created_at.default).toBe('CURRENT_TIMESTAMP');
    });

    test('should track column order', () => {
        const sql = `
            CREATE TABLE users (
                id INT,
                name VARCHAR(100),
                email VARCHAR(100)
            );
        `;
        parser = new DDLParser(sql);
        const schema = parser.parse();

        expect(schema.users.columnOrder).toEqual(['id', 'name', 'email']);
    });

    test('should handle nested parentheses in column definitions', () => {
        const sql = `
            CREATE TABLE products (
                id INT PRIMARY KEY,
                price DECIMAL(10, 2),
                coordinates POINT
            );
        `;
        parser = new DDLParser(sql);
        const schema = parser.parse();

        expect(schema.products.columns.price.type).toBe('decimal(10, 2)');
    });
});
