## [1.1.0] - 2026-01-31

### Fixed
- **Critical:** Fixed PRIMARY KEY handling bug that caused duplicate PRIMARY KEY errors
  - Now properly detects when PRIMARY KEY definitions differ (not just missing)
  - Automatically drops existing PRIMARY KEY before adding a new one when definitions change
  - Prevents SQL execution errors from duplicate PRIMARY KEY constraints
- Fixed regex escape character warning in DDL parser

### Added
- Enhanced drop detection for indexes and foreign keys
  - When "Detect dropped columns/tables" is enabled, now also detects and drops:
    - Indexes that exist in destination but not in source
    - Foreign keys that exist in destination but not in source
    - PRIMARY KEYs that exist in destination but not in source
- Added comprehensive test coverage for PRIMARY KEY change scenarios

### Changed
- Improved PRIMARY KEY comparison logic to handle definition changes correctly
- Enhanced index comparison to properly separate PRIMARY KEY from regular indexes
- Code quality improvements and ESLint configuration updates

### Technical
- Updated ESLint configuration to properly handle global functions
- Fixed scope issues in UI handler functions
- Improved code maintainability with better variable naming conventions

## [1.0.0] - 2026-01-30

### Added
- **Initial Release** - First public release of MySQL DDL Schema Comparator
- **Client-Side DDL Parser** - Custom JavaScript parser for MySQL CREATE TABLE statements
  - Supports complex nested structures (ENUM, DECIMAL with precision/scale)
  - Handles comments, quotes, and special characters
  - Robust parenthesis balancing for nested definitions
- **Schema Comparison Engine** - Intelligent schema diffing functionality
  - Compares table structures between source and destination schemas
  - Normalizes whitespace and casing for accurate comparisons
  - Handles character set and collation differences
- **Migration Script Generation** - Automatic SQL migration script creation
  - Generates CREATE TABLE statements for missing tables
  - Generates ALTER TABLE statements for schema changes
  - Supports multiple changes in a single ALTER TABLE statement
- **Schema Difference Detection** - Comprehensive change detection
  - Missing tables detection
  - Missing columns detection
  - Column type and default value mismatch detection
  - Missing indexes detection (PRIMARY KEY, UNIQUE, INDEX, FULLTEXT)
  - Missing foreign key constraints detection
- **User Interface** - Modern, responsive web interface
  - Drag-and-drop file upload support
  - Dual file input (Source/Target vs Destination/Current)
  - Real-time file validation and status indicators
  - SQL syntax highlighting using Prism.js
  - Comparison statistics dashboard
  - One-click copy to clipboard functionality
  - Download migration script as .sql file
  - Toast notifications for user feedback
  - Error handling with clear messages
- **Advanced Options** - Configurable comparison behavior
  - Optional drop detection for removed columns and tables
  - Column order preservation when adding new columns
- **Testing Infrastructure** - Comprehensive test suite
  - Unit tests for DDL parser
  - Unit tests for schema comparator
  - Jest testing framework integration
  - Test coverage reporting
- **Documentation** - Complete project documentation
  - README with usage examples
  - CONTRIBUTING guidelines
  - MIT License
  - Example SQL files for testing

### Features
- **Privacy-First Design:** All processing happens client-side in the browser
  - No server required
  - No data uploads
  - Complete privacy and security
- **Zero Dependencies (Runtime):** Works with just a web browser
  - No build process required
  - No npm/pnpm installation needed for end users
  - Can be used offline after initial load
- **Cross-Platform:** Works on any modern browser
  - Chrome, Firefox, Safari, Edge support
  - Desktop and mobile compatible
- **Robust Parsing:** Handles edge cases and complex SQL structures
  - Nested parentheses in column definitions
  - Multiple character sets and collations
  - Various index types and constraints
  - Complex default value expressions

### Technical
- **Architecture:** Modular JavaScript design
  - Separation of concerns (parser, comparator, UI, utilities)
  - ES6+ JavaScript features
  - Class-based object-oriented design
- **Development Tools:**
  - Jest for testing
  - ESLint for code quality
  - Prettier for code formatting
  - Babel for JavaScript transpilation
- **Styling:**
  - Tailwind CSS for utility-first styling
  - Responsive design patterns
  - Modern UI/UX principles
- **Third-Party Libraries:**
  - Prism.js for SQL syntax highlighting
  - FontAwesome for icons
  - Tailwind CSS via CDN

### Security
- Client-side only execution ensures no data leaves the user's machine
- No external API calls or data transmission
- File processing entirely in browser memory