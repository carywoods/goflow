# Changelog

All notable changes to GoFlow will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Planned
- Backend API integration for data persistence
- User authentication and authorization
- Export functionality (PDF, PNG, CSV)
- Advanced filtering and search capabilities
- Comparison mode for multiple experiments
- Statistical significance indicators
- Integration with GO database for term hierarchies
- Batch upload processing
- Real-time collaboration features

## [0.1.0] - 2025-02-04

### Added
- Initial release of GoFlow
- Interactive tag cloud visualization of GO term enrichment
- Color-coded GO categories (Biological Process, Cellular Component, Molecular Function)
- Real-time filtering by GO category and enrichment threshold
- Experiment browser sidebar
- GO term detail view with gene associations
- Admin panel for data upload and experiment management
- Responsive design supporting desktop, tablet, and mobile
- Sample datasets for three experiments:
  - Heat Shock Response in S. cerevisiae
  - Oxidative Stress Response in S. cerevisiae
  - Nutrient Starvation in S. cerevisiae

### Fixed
- ESLint errors preventing CI/CD builds
  - Removed unused Alert import from App.js
  - Removed unused Nav import from AdminPanel.js
  - Fixed React Hooks dependency warnings with useCallback
  - Reordered function definitions to prevent use-before-define errors

### Documentation
- Comprehensive README.md with installation and deployment instructions
- CONTRIBUTING.md with contribution guidelines and code style
- LICENSE file (MIT)
- Data format documentation
- Component architecture overview
- Troubleshooting guide
- Deployment instructions for GitHub Pages, Coolify, and Docker

### Technical
- React 18.2.0 with modern hooks (useState, useEffect, useCallback)
- Bootstrap 5.3.2 for UI components
- Create React App build system
- ESLint configuration for code quality
- Production-ready build configuration

### Security
- Identified and documented 9 known vulnerabilities in dependencies
  - 3 moderate severity
  - 6 high severity
  - Primarily in development dependencies
  - No impact on production security

## Version History

### Version Numbering

GoFlow follows semantic versioning (MAJOR.MINOR.PATCH):

- **MAJOR**: Incompatible API changes
- **MINOR**: Backwards-compatible functionality additions
- **PATCH**: Backwards-compatible bug fixes

### Release Tags

- `v0.1.0` - Initial release (2025-02-04)

## Migration Guides

### Migrating from Pre-release

If you were using an earlier version:

1. Pull the latest changes from main branch
2. Remove old dependencies: `rm -rf node_modules package-lock.json`
3. Install fresh dependencies: `npm install`
4. Rebuild the project: `npm run build`

### Breaking Changes

None yet - this is the initial release.

## Support

For questions about specific versions or changes:
- Check the [README](README.md) for current documentation
- Review [closed issues](https://github.com/carywoods/goflow/issues?q=is%3Aissue+is%3Aclosed) for historical context
- Open a [new issue](https://github.com/carywoods/goflow/issues/new) for unresolved questions

## Contributing to Changelog

When contributing to GoFlow:
- Add your changes to the `[Unreleased]` section
- Use the appropriate category: Added, Changed, Deprecated, Removed, Fixed, Security
- Keep descriptions concise but informative
- Reference issue numbers when applicable

Example:
```markdown
### Fixed
- Fix tag cloud overflow on mobile devices (#42)
- Resolve memory leak in useEffect cleanup (#43)
```

---

**Note**: This changelog follows the format from [Keep a Changelog](https://keepachangelog.com/).
