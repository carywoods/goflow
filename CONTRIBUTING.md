# Contributing to GoFlow

Thank you for your interest in contributing to GoFlow! This document provides guidelines and instructions for contributing to the project.

## Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment for all contributors.

## How to Contribute

### Reporting Bugs

If you find a bug, please create an issue on GitHub with:

- **Clear title**: Summarize the issue in one line
- **Description**: Detailed description of the bug
- **Steps to reproduce**: Numbered steps to reproduce the behavior
- **Expected behavior**: What you expected to happen
- **Actual behavior**: What actually happened
- **Environment**: Browser, OS, Node version
- **Screenshots**: If applicable

Example:
```markdown
**Title**: Tag cloud not rendering on Safari 15

**Description**: The tag cloud component fails to render on Safari 15 but works fine on Chrome and Firefox.

**Steps to reproduce**:
1. Open the app in Safari 15
2. Select an experiment
3. Observe the visualization area

**Expected behavior**: Tag cloud should render with colored GO terms
**Actual behavior**: Empty white space where tag cloud should be
**Environment**: Safari 15.0, macOS 12.0, Node 18.0.0
```

### Suggesting Enhancements

We welcome feature suggestions! Please create an issue with:

- **Clear title**: Brief description of the enhancement
- **Use case**: Why is this feature needed?
- **Proposed solution**: How should it work?
- **Alternatives**: Other approaches you've considered
- **Additional context**: Screenshots, mockups, or examples

### Pull Requests

#### Before You Start

1. **Check existing issues**: Make sure your contribution hasn't already been addressed
2. **Discuss major changes**: For significant changes, open an issue first to discuss
3. **One feature per PR**: Keep pull requests focused on a single feature or fix

#### Development Setup

1. **Fork the repository**
   ```bash
   # Fork via GitHub UI, then clone your fork
   git clone https://github.com/YOUR_USERNAME/goflow.git
   cd goflow
   ```

2. **Add upstream remote**
   ```bash
   git remote add upstream https://github.com/carywoods/goflow.git
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Create a branch**
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/your-bug-fix
   ```

#### Making Changes

1. **Follow the code style**
   - Use 2 spaces for indentation
   - Use meaningful variable names
   - Add comments for complex logic
   - Keep functions small and focused

2. **Write good commit messages**
   ```bash
   # Good
   git commit -m "Add export to CSV functionality"
   git commit -m "Fix tag cloud rendering on mobile devices"

   # Bad
   git commit -m "fix stuff"
   git commit -m "updates"
   ```

3. **Test your changes**
   ```bash
   # Run the development server
   npm start

   # Run tests
   npm test

   # Build for production
   npm run build
   ```

4. **Ensure no ESLint errors**
   ```bash
   npm run build
   # Should complete without errors
   ```

#### Submitting Your Pull Request

1. **Update your branch with latest changes**
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

2. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

3. **Create Pull Request**
   - Go to your fork on GitHub
   - Click "New Pull Request"
   - Select `main` branch of `carywoods/goflow` as base
   - Select your feature branch as compare
   - Fill in the PR template

4. **PR Description Template**
   ```markdown
   ## Description
   Brief description of changes

   ## Type of Change
   - [ ] Bug fix
   - [ ] New feature
   - [ ] Breaking change
   - [ ] Documentation update

   ## Testing
   - [ ] Tested locally
   - [ ] All tests pass
   - [ ] No ESLint errors
   - [ ] Tested on multiple browsers

   ## Screenshots (if applicable)
   Add screenshots of the changes

   ## Related Issues
   Closes #123
   ```

5. **Respond to feedback**
   - Address review comments
   - Push additional commits if needed
   - Keep the discussion focused and professional

## Code Style Guidelines

### JavaScript/React

```javascript
// Good: Descriptive names, proper spacing
const calculateEnrichmentScore = (geneCount, totalGenes) => {
  return (geneCount / totalGenes) * 100;
};

// Bad: Unclear names, poor formatting
const calc=(x,y)=>{return x/y*100;}
```

### React Components

```javascript
// Good: Clear component structure
import React, { useState, useEffect } from 'react';

const MyComponent = ({ data, onUpdate }) => {
  const [state, setState] = useState(null);

  useEffect(() => {
    // Effect logic
  }, [data]);

  const handleClick = () => {
    // Handler logic
  };

  return (
    <div>
      {/* Component JSX */}
    </div>
  );
};

export default MyComponent;
```

### CSS

```css
/* Good: Organized, with comments */
.tag-cloud {
  display: flex;
  flex-wrap: wrap;
  padding: 20px;
}

.tag-cloud-item {
  margin: 10px;
  cursor: pointer;
  transition: transform 0.2s;
}

.tag-cloud-item:hover {
  transform: scale(1.1);
}

/* Bad: No organization, unclear names */
.tc{display:flex;}
.i{margin:10px;}
```

## Component Guidelines

### Creating New Components

1. **File structure**
   ```
   src/components/
   ├── MyNewComponent.js
   └── MyNewComponent.css
   ```

2. **Component template**
   ```javascript
   import React from 'react';
   import './MyNewComponent.css';

   const MyNewComponent = ({ prop1, prop2 }) => {
     return (
       <div className="my-new-component">
         {/* Component content */}
       </div>
     );
   };

   export default MyNewComponent;
   ```

3. **Props validation**
   - Document expected props in comments
   - Use descriptive prop names
   - Provide default values when appropriate

### State Management

- Use `useState` for local component state
- Use `useCallback` for functions passed as dependencies
- Use `useEffect` for side effects
- Keep state as close to where it's needed as possible

## Documentation

### Code Comments

```javascript
// Good: Explains WHY, not WHAT
// Calculate enrichment using Fisher's exact test
const enrichment = calculateFisher(a, b, c, d);

// Bad: States the obvious
// Call calculateFisher function
const enrichment = calculateFisher(a, b, c, d);
```

### JSDoc for Complex Functions

```javascript
/**
 * Calculates GO term enrichment score
 * @param {number} termCount - Number of genes with this term
 * @param {number} totalGenes - Total genes in experiment
 * @param {number} genomeTerm - Genes with this term genome-wide
 * @param {number} genomeTotal - Total genes in genome
 * @returns {number} Enrichment p-value
 */
const calculateEnrichment = (termCount, totalGenes, genomeTerm, genomeTotal) => {
  // Implementation
};
```

### Updating Documentation

When making changes that affect:
- User-facing features → Update README.md
- APIs or component props → Update component documentation
- Data formats → Update data format section

## Testing

### Manual Testing Checklist

Before submitting a PR, test:

- [ ] Development mode (`npm start`)
- [ ] Production build (`npm run build`)
- [ ] Multiple browsers (Chrome, Firefox, Safari)
- [ ] Responsive design (mobile, tablet, desktop)
- [ ] Different experiment selections
- [ ] All filter combinations
- [ ] GO term detail views
- [ ] Admin panel functionality

### Writing Tests

```javascript
import { render, screen } from '@testing-library/react';
import MyComponent from './MyComponent';

test('renders component with correct text', () => {
  render(<MyComponent text="Hello World" />);
  const element = screen.getByText(/hello world/i);
  expect(element).toBeInTheDocument();
});
```

## Release Process

Maintainers follow this process for releases:

1. Update version in `package.json`
2. Update `CHANGELOG.md`
3. Create release tag: `git tag v1.0.0`
4. Push tags: `git push --tags`
5. Create GitHub release
6. Deploy to production

## Questions?

If you have questions about contributing:

1. Check existing issues for similar questions
2. Review this contributing guide
3. Open a new issue with your question
4. Tag it with `question` label

## Recognition

Contributors will be:
- Listed in the GitHub contributors page
- Mentioned in release notes for significant contributions
- Thanked in the project README

Thank you for contributing to GoFlow! Your efforts help advance bioinformatics research and make tools more accessible to the scientific community.
