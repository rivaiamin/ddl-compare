# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-01-XX

### Added
- Initial release of DDL Compare tool
- Client-side DDL parsing for MySQL CREATE TABLE statements
- Schema comparison functionality
- Migration script generation
- Support for detecting:
  - Missing tables
  - Missing columns
  - Column type mismatches
  - Missing indexes (Primary Keys, Unique Keys, etc.)
  - Missing foreign keys
- User-friendly web interface with:
  - File upload (drag-and-drop support)
  - Options for detecting drops and preserving column order
  - SQL syntax highlighting
  - Comparison statistics panel
  - Copy to clipboard and download functionality
- Comprehensive error handling and validation
- Unit tests for parser and comparator
- Documentation (README, CONTRIBUTING, LICENSE)
- Example SQL files

### Features
- **Drop Detection:** Optional detection of dropped columns and tables
- **Column Order Preservation:** Option to maintain column positioning when adding new columns
- **Foreign Key Support:** Separate tracking and comparison of foreign key constraints
- **Default Value Comparison:** Detects changes in column default values
- **Statistics Panel:** Shows summary of changes (tables added/dropped, columns added/modified/dropped, indexes added)

### Technical
- Modular JavaScript architecture
- Jest testing framework setup
- Tailwind CSS for styling
- Prism.js for syntax highlighting
- FontAwesome for icons

## [Unreleased]

### Planned
- Support for VIEWS, TRIGGERS, and STORED PROCEDURES
- Side-by-side diff visualization
- Column renaming detection
- Export options (JSON, YAML)
- Command-line interface version
- Support for PostgreSQL and other databases
