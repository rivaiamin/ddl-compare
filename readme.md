# **MySQL DDL Schema Comparator**

A lightweight, client-side tool to compare two MySQL database schema files (DDL) and generate a migration script. This tool runs entirely in your browser using JavaScript—no data is uploaded to any server.

## **Features**

* **Client-Side Execution:** Secure and private. Your SQL files are processed locally in your browser.  
* **DDL Parsing:** Custom parser supports complex nested structures like ENUM(...) and DECIMAL(p,s).  
* **Migration Generation:** Automatically creates SQL scripts to:  
  * Create missing tables.  
  * Add missing columns.  
  * Modify columns with mismatched data types.  
  * Add missing indexes (Primary Keys, Unique Keys, Foreign Keys, etc.).  
  * Optionally detect and drop removed columns/tables.
* **User-Friendly Interface:**  
  * Simple file upload for Source (Target State) and Destination (Current State).  
  * Drag-and-drop file support.
  * One-click script generation.  
  * Copy to clipboard or download as .sql file.
  * Syntax highlighting for generated SQL.
  * Comparison statistics panel.
* **Advanced Options:**
  * Detect dropped columns and tables.
  * Preserve column order when adding new columns.

## **Installation/Setup**

### **Quick Start**

1. Clone or download this repository.
2. Open `index.html` in any modern web browser (Chrome, Firefox, Safari, Edge).
3. No server or build process required!

### **Development Setup**

For development and testing:

```bash
# Install dependencies
pnpm install

# Run tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Generate test coverage
pnpm test:coverage
```

## **How to Use**

1. **Open the Tool:** Open `index.html` in any modern web browser.  
2. **Upload Source Schema:** Select the .sql file that contains the *new* or *desired* database structure (Target State).  
3. **Upload Destination Schema:** Select the .sql file that contains the *old* or *current* database structure (To Be Updated).  
4. **Configure Options (Optional):**
   - Enable "Detect dropped columns/tables" to generate DROP statements.
   - Enable "Preserve column order" to maintain column positioning.
5. **Generate:** Click the **Generate Migration Script** button.  
6. **Review & Export:** The tool will display the generated SQL commands with statistics. You can review them, copy them to your clipboard, or download the migration_script.sql file.

## **Examples**

### **Example 1: Adding a New Column**

**Source Schema (Target):**
```sql
CREATE TABLE users (
    id INT PRIMARY KEY,
    username VARCHAR(50),
    email VARCHAR(100)
);
```

**Destination Schema (Current):**
```sql
CREATE TABLE users (
    id INT PRIMARY KEY,
    username VARCHAR(50)
);
```

**Generated Migration:**
```sql
-- Changes for table `users`
ALTER TABLE `users`
  ADD COLUMN `email` VARCHAR(100);
```

### **Example 2: Modifying Column Type**

**Source Schema:**
```sql
CREATE TABLE products (
    id INT PRIMARY KEY,
    price DECIMAL(10, 2)
);
```

**Destination Schema:**
```sql
CREATE TABLE products (
    id INT PRIMARY KEY,
    price INT
);
```

**Generated Migration:**
```sql
-- Changes for table `products`
ALTER TABLE `products`
  MODIFY COLUMN `price` DECIMAL(10, 2);
```

### **Example 3: Adding Foreign Key**

**Source Schema:**
```sql
CREATE TABLE posts (
    id INT PRIMARY KEY,
    user_id INT,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

**Destination Schema:**
```sql
CREATE TABLE posts (
    id INT PRIMARY KEY,
    user_id INT
);
```

**Generated Migration:**
```sql
-- Changes for table `posts`
ALTER TABLE `posts`
  ADD FOREIGN KEY (user_id) REFERENCES users(id);
```

See the `examples/` directory for more complete examples.

## **Technical Details**

### **Architecture**

The project is organized into modular JavaScript files:

- `js/ddl-parser.js` - Parses MySQL DDL files and extracts schema information
- `js/schema-comparator.js` - Compares schemas and generates migration scripts
- `js/ui-handler.js` - Manages user interface interactions
- `js/utils.js` - Utility functions for file handling, validation, and notifications

### **Logic**

The tool uses a robust Javascript-based parser that:

1. **Cleans SQL:** Removes comments (\--, /\* \*/, \#) to ensure clean parsing.  
2. **Balances Parentheses:** Correctly identifies table bodies even when columns contain nested parentheses (e.g., DECIMAL(10, 2\)).  
3. **Compares Schemas:**  
   * **Tables:** Checks for existence. If missing, extracts the full original CREATE TABLE statement.  
   * **Columns:** Compares names, types, and default values. Normalizes whitespace and casing to prevent false positives.  
   * **Indexes:** Checks if specific index definitions exist in the destination.
   * **Foreign Keys:** Separately tracks and compares foreign key constraints.

### **Limitations**

* **Renaming:** The tool cannot detect renamed tables or columns; it will treat them as "Missing" (and try to add new ones) rather than "Renamed".  
* **Complex Constraints:** Extremely complex CONSTRAINT clauses or specific trigger definitions might require manual review.  
* **Data Preservation:** The generated script focuses on structure (ALTER, CREATE). It does not handle data migration or transformation.
* **Views, Triggers, Procedures:** Currently only CREATE TABLE statements are supported. Views, triggers, and stored procedures are not parsed.

## **Development**

### **Project Structure**

```
ddl-compare/
├── index.html          # Main HTML file
├── readme.md           # This file
├── LICENSE             # MIT License
├── package.json        # NPM configuration and scripts
├── js/
│   ├── ddl-parser.js      # DDL parsing logic
│   ├── schema-comparator.js # Schema comparison logic
│   ├── ui-handler.js       # UI event handlers
│   └── utils.js            # Utility functions
├── css/
│   └── styles.css          # Custom styles
├── tests/
│   ├── parser.test.js      # Parser unit tests
│   ├── comparator.test.js  # Comparator unit tests
│   └── test-fixtures/      # Test SQL files
└── examples/
    ├── example-source.sql  # Example source schema
    └── example-dest.sql    # Example destination schema
```

### **Technologies**

This project is built with:

* **HTML5 & JavaScript (ES6+)**  
* **Tailwind CSS** (via CDN) for styling.  
* **FontAwesome** (via CDN) for icons.
* **Prism.js** (via CDN) for SQL syntax highlighting.
* **Jest** for testing.

### **Running Tests**

```bash
pnpm test
```

## **Contributing**

Contributions are welcome! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## **Troubleshooting**

### **Common Issues**

1. **"File does not appear to contain SQL DDL statements"**
   - Ensure your file contains CREATE TABLE statements.
   - Check that the file is not corrupted.

2. **"No schema differences found"**
   - Verify that both files contain valid CREATE TABLE statements.
   - Check that table names match (case-sensitive).

3. **Syntax highlighting not working**
   - Ensure you have an internet connection (Prism.js is loaded from CDN).
   - Try refreshing the page.

4. **Large files are slow to process**
   - This is expected for very large schema files (>10MB).
   - Consider splitting large schema files.

## **License**

This project is open-source and available under the MIT License. See [LICENSE](LICENSE) file for details.

## **Deployment**

### **GitHub Pages (Automated)**

The project includes a GitHub Actions workflow that automatically deploys to GitHub Pages on every push to the `main` or `master` branch.

**Setup:**
1. Push your code to a GitHub repository
2. Go to repository Settings > Pages
3. Under "Source", select "GitHub Actions"
4. The workflow will automatically deploy on the next push

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment instructions for other hosting platforms.

## **Changelog**

See [CHANGELOG.md](CHANGELOG.md) for version history and changes.
