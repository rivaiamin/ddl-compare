# Contributing to DDL Compare

Thank you for your interest in contributing to DDL Compare! This document provides guidelines and instructions for contributing.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/your-username/ddl-compare.git`
3. Install dependencies: `npm install`
4. Create a new branch: `git checkout -b feature/your-feature-name`

## Development Guidelines

### Code Style

- Use ES6+ JavaScript features
- Follow existing code style and formatting
- Use meaningful variable and function names
- Add comments for complex logic
- Keep functions focused and single-purpose

### Testing

- Write tests for new features
- Ensure all existing tests pass: `npm test`
- Aim for good test coverage
- Test edge cases and error conditions

### File Structure

- Keep JavaScript modular (one class/concern per file)
- Place new utilities in `js/utils.js` or create new files as needed
- Update tests in the `tests/` directory
- Add example SQL files to `examples/` if demonstrating new features

## Submitting Changes

1. **Write clear commit messages**
   - Use present tense ("Add feature" not "Added feature")
   - Reference issues if applicable

2. **Test your changes**
   - Run `npm test` to ensure all tests pass
   - Test manually in the browser
   - Test with various SQL file formats

3. **Update documentation**
   - Update README.md if adding new features
   - Update CHANGELOG.md with your changes
   - Add examples if introducing new functionality

4. **Create a Pull Request**
   - Provide a clear description of changes
   - Reference any related issues
   - Include screenshots for UI changes

## Feature Requests

- Open an issue describing the feature
- Explain the use case and benefits
- Discuss implementation approach before coding

## Bug Reports

When reporting bugs, please include:

- Browser and version
- Steps to reproduce
- Expected behavior
- Actual behavior
- Sample SQL files (if applicable)

## Code Review Process

- All contributions require review
- Address review comments promptly
- Be open to feedback and suggestions

## Questions?

Feel free to open an issue for questions or discussions.

Thank you for contributing! 🎉
