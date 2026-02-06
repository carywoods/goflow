# Claude Code Context for GoFlow

This document provides comprehensive context about the GoFlow project for AI assistants (particularly Claude Code) working on this codebase.

## Project Overview

**Name**: GoFlow - Gene Ontology Visualization Framework
**Version**: 0.1.0 (Unreleased updates in progress)
**Repository**: https://github.com/carywoods/goflow
**Primary Branch**: main
**License**: MIT

### What is GoFlow?

GoFlow is a modern, interactive web application for visualizing Gene Ontology (GO) term enrichment analysis results. It helps bioinformatics researchers and scientists explore experimental data through intuitive tag cloud visualizations where:

- Font size represents enrichment levels (bigger = more enriched)
- Colors indicate GO categories:
  - Blue = Biological Process
  - Green = Cellular Component
  - Red = Molecular Function

### Target Users

- Bioinformatics researchers analyzing RNA-seq or microarray data
- Scientists working with Gene Ontology enrichment results
- Researchers using tools like DESeq2, GOrilla, DAVID, or Enrichr
- Anyone needing to visualize and explore GO enrichment data

## Technical Architecture

### Technology Stack

- **Frontend Framework**: React 18.2.0
- **UI Library**: React Bootstrap 5.3.2
- **Build Tool**: Create React App (react-scripts)
- **State Management**: React Hooks (useState, useEffect, useCallback)
- **Styling**: Bootstrap 5 + Custom CSS
- **Data Format**: JSON (loaded from public/data/)
- **Data Conversion**: Python 3.x (tools/convert_to_goflow.py)

### Key Dependencies

```json
{
  "react": "^18.2.0",
  "react-bootstrap": "^2.10.6",
  "bootstrap": "^5.3.2"
}
```

### Build System

- Development: `npm start` (port 3000)
- Production: `npm run build` (outputs to build/)
- Linting: ESLint with CI mode (warnings = errors)
- Testing: Jest + React Testing Library (minimal tests currently)

## Project Structure

```
goflow/
├── public/
│   ├── data/                          # All data files (JSON format)
│   │   ├── experiments.json           # Experiment registry (7 experiments)
│   │   ├── synthetic_go_terms.json    # GO terms for experiments 1-3
│   │   ├── go_term_genes.json         # Gene mappings for experiments 1-3
│   │   ├── experiment_4_go_terms.json # GO terms for experiment 4 (DNA Damage)
│   │   ├── experiment_4_genes.json    # Genes for experiment 4
│   │   ├── experiment_5_go_terms.json # GO terms for experiment 5 (Cell Cycle)
│   │   ├── experiment_5_genes.json    # Genes for experiment 5
│   │   ├── experiment_6_go_terms.json # GO terms for experiment 6 (ER Stress)
│   │   ├── experiment_6_genes.json    # Genes for experiment 6
│   │   ├── experiment_7_go_terms.json # GO terms for experiment 7 (Glucose)
│   │   └── experiment_7_genes.json    # Genes for experiment 7
│   ├── index.html                     # HTML entry point
│   └── logo.svg                       # GoFlow logo
├── src/
│   ├── components/
│   │   ├── AdminPanel.js              # View experiments, show metadata
│   │   ├── AdminPanel.css
│   │   ├── ExperimentList.js          # Sidebar experiment browser
│   │   ├── ExperimentList.css
│   │   ├── GOTermDetail.js            # Detailed GO term view with genes
│   │   ├── GOTermDetail.css
│   │   ├── TagCloud.js                # Main tag cloud visualization
│   │   └── TagCloud.css
│   ├── App.js                         # Main application component
│   ├── App.css                        # Application styles
│   ├── index.js                       # React entry point
│   └── index.css                      # Global styles
├── tools/
│   ├── convert_to_goflow.py           # Python data conversion script
│   ├── README.md                      # Conversion tool documentation
│   └── examples/                      # Example CSV input files
│       ├── example_enrichment.csv
│       ├── example_genes.csv
│       └── example_mapping.csv
├── build/                             # Production build output (gitignored)
├── node_modules/                      # Dependencies (gitignored)
├── README.md                          # Main project documentation
├── CONTRIBUTING.md                    # Contribution guidelines
├── CHANGELOG.md                       # Version history and changes
├── TESTING.md                         # QA testing checklist
├── ROADMAP.md                         # Development roadmap
├── CLAUDE.md                          # This file - AI assistant context
├── LICENSE                            # MIT License
├── .gitignore                         # Git ignore rules
└── package.json                       # NPM configuration
```

## Key Components

### App.js

**Location**: `src/App.js`
**Purpose**: Main application component managing global state and navigation

**Key Responsibilities**:
- Tab navigation (Visualization vs Admin Panel)
- Experiment selection and data fetching
- Filter state management (category, enrichment threshold)
- Dynamic data loading based on experiment ID

**Important Code Pattern**:
```javascript
// Dynamic data file selection based on experiment ID
const fetchTagCloudData = useCallback(async () => {
  if (!selectedExperiment) return;

  const experimentId = selectedExperiment.experiment_id;
  let dataFile = '/data/synthetic_go_terms.json';

  // Experiments 4-7 use dedicated files
  if (experimentId >= 4 && experimentId <= 7) {
    dataFile = `/data/experiment_${experimentId}_go_terms.json`;
  }

  const response = await fetch(dataFile);
  let data = await response.json();
  // Apply filters...
}, [selectedExperiment, selectedCategory, minEnrichment]);
```

**State Variables**:
- `selectedExperiment`: Currently selected experiment object
- `goTerms`: Array of GO terms for tag cloud
- `selectedGoTerm`: GO term selected for detail view
- `selectedCategory`: Filter by GO category ('all', 'biological_process', etc.)
- `minEnrichment`: Minimum enrichment threshold (0-5)
- `activeTab`: 'visualization' or 'admin'

### TagCloud.js

**Location**: `src/components/TagCloud.js`
**Purpose**: Renders the interactive tag cloud visualization

**Key Features**:
- Calculates font sizes proportional to enrichment weight
- Applies color coding by GO category
- Handles click events to show GO term details
- Responsive sizing and layout

**Font Size Calculation**:
```javascript
const minSize = 20;
const maxSize = 80;
const minWeight = Math.min(...goTerms.map(term => term.weight));
const maxWeight = Math.max(...goTerms.map(term => term.weight));
const fontSize = minSize + ((term.weight - minWeight) / (maxWeight - minWeight)) * (maxSize - minSize);
```

### GOTermDetail.js

**Location**: `src/components/GOTermDetail.js`
**Purpose**: Displays detailed information for a selected GO term

**Shows**:
- GO ID, term name, category
- Enrichment score
- List of associated genes with:
  - Gene symbol
  - Description
  - Expression value (fold change)
  - P-value
  - External IDs (Ensembl, UniProt)

### ExperimentList.js

**Location**: `src/components/ExperimentList.js`
**Purpose**: Sidebar showing all available experiments

**Features**:
- Loads experiments from experiments.json
- Highlights selected experiment
- Shows experiment metadata on selection
- Scrollable list for many experiments

### AdminPanel.js

**Location**: `src/components/AdminPanel.js`
**Purpose**: Display experiments and provide guidance for adding new ones

**IMPORTANT - Current Functionality**:
- ✅ Displays all experiments from experiments.json
- ✅ Shows GO term counts for each experiment
- ✅ Provides instructions for using command-line conversion tool
- ✅ Shows example data formats
- ✅ Links to tools/README.md documentation
- ❌ Does NOT support web-based file upload (coming in Phase 2)
- ❌ Does NOT have backend API (coming in Phase 4)

**Key Implementation Details**:
```javascript
// Loads real experiments and calculates GO term counts
const fetchExperiments = async () => {
  const response = await fetch('/data/experiments.json');
  const data = await response.json();

  const experimentsWithCounts = await Promise.all(
    data.experiments.map(async (exp) => {
      // Determine which data file to use
      let dataFile = '/data/synthetic_go_terms.json';
      if (exp.experiment_id >= 4 && exp.experiment_id <= 7) {
        dataFile = `/data/experiment_${exp.experiment_id}_go_terms.json`;
      }

      const goResponse = await fetch(dataFile);
      const goData = await goResponse.json();

      return { ...exp, goTermCount: goData.length };
    })
  );

  setExperiments(experimentsWithCounts);
};
```

## Data Formats

### experiments.json

**Location**: `public/data/experiments.json`
**Purpose**: Central registry of all experiments

**Schema**:
```json
{
  "experiments": [
    {
      "experiment_id": 1,
      "name": "Heat Shock Response",
      "description": "Analysis of S. cerevisiae response to heat shock at 37°C",
      "organism_name": "Saccharomyces cerevisiae",
      "organism_id": "559292",
      "experiment_date": "2025-03-15"
    }
  ]
}
```

**Current Experiments**:
1. Heat Shock Response (synthetic data)
2. Oxidative Stress Response (synthetic data)
3. Nutrient Starvation (synthetic data)
4. DNA Damage Response (UV radiation)
5. Cell Cycle Arrest (alpha-factor)
6. ER Stress Response (tunicamycin)
7. Glucose Starvation (glycerol shift)

### GO Terms JSON

**Examples**: `synthetic_go_terms.json`, `experiment_4_go_terms.json`

**Schema**:
```json
[
  {
    "go_id": "GO:0006950",
    "text": "response to stress",
    "category": "biological_process",
    "weight": 4.9,
    "font_size": 250
  }
]
```

**Fields**:
- `go_id`: GO term identifier (e.g., "GO:0006950")
- `text`: Human-readable term name
- `category`: "biological_process", "cellular_component", or "molecular_function"
- `weight`: Enrichment score (typically -log10(p-value))
- `font_size`: Pre-calculated font size (optional)

### Genes JSON

**Examples**: `go_term_genes.json`, `experiment_4_genes.json`

**Schema**:
```json
[
  {
    "go_id": "GO:0006950",
    "genes": [
      {
        "gene_symbol": "HSP104",
        "description": "Heat shock protein 104",
        "expression_value": 5.2,
        "p_value": 0.0001,
        "ensembl_id": "YLL026W",
        "uniprot_id": "P31539"
      }
    ]
  }
]
```

## Data Conversion Pipeline

### For Scientists Using GoFlow

**Current Workflow** (Command-line):

1. **Prepare three CSV files**:
   - Enrichment results (GO terms with p-values)
   - Gene expression data (genes with fold changes)
   - GO-gene mapping (which genes belong to which GO terms)

2. **Run conversion tool**:
```bash
cd tools
python convert_to_goflow.py \
  --enrichment my_enrichment.csv \
  --genes my_genes.csv \
  --mapping my_mapping.csv \
  --experiment-id 8 \
  --experiment-name "My Experiment" \
  --experiment-desc "Description" \
  --output-dir ../public/data
```

3. **Rebuild application**:
```bash
npm run build
```

4. **Deploy**:
   - Deploy to Coolify, GitHub Pages, or other hosting

**See**: `tools/README.md` for detailed instructions

### Integration with Common Tools

The conversion tool supports output from:
- **DESeq2**: RNA-seq differential expression analysis
- **edgeR**: RNA-seq differential expression analysis
- **GOrilla**: GO enrichment analysis tool
- **DAVID**: Functional annotation tool
- **Enrichr**: Gene set enrichment analysis
- **ShinyGO**: GO enrichment visualization
- **clusterProfiler**: R package for enrichment analysis

## Development Workflow

### Setting Up Development Environment

```bash
# Clone repository
git clone https://github.com/carywoods/goflow.git
cd goflow

# Install dependencies
npm install

# Start development server
npm start
```

### Making Changes

1. **Create a feature branch** (if adding significant features)
2. **Make changes** to src/ files
3. **Test locally** with `npm start`
4. **Check for errors** with `npm run build`
5. **Update documentation** if needed
6. **Commit with co-authorship**:
```bash
git add [files]
git commit -m "Your commit message

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```
7. **Push to GitHub**: `git push origin main`

### Code Quality Standards

- **ESLint**: Must pass with zero warnings in CI mode
- **No unused imports**: Clean up all unused variables and imports
- **React Hooks**: Follow hooks rules (dependencies, order, etc.)
- **TypeScript**: Not currently used, but could be added
- **Testing**: Limited test coverage currently (see ROADMAP Phase 1)

### Common ESLint Issues to Avoid

1. **Unused imports**: Remove any imports not used in the file
2. **React Hook dependencies**: Include all dependencies in useEffect/useCallback arrays
3. **Use-before-define**: Define functions before using them or use useCallback
4. **No-unused-vars**: Remove or prefix unused variables with underscore

## Deployment

### Coolify (Primary Deployment Target)

GoFlow is designed for Coolify deployment:

1. **Connect repository** in Coolify dashboard
2. **Auto-detection**: Coolify detects Node.js project
3. **Environment variables** (optional):
   - `NIXPACKS_NODE_VERSION=22`
4. **Build command**: `npm install && npm run build`
5. **Static files**: Served from `build/` directory

### GitHub Pages

1. Add `"homepage": "https://username.github.io/goflow"` to package.json
2. Install gh-pages: `npm install --save-dev gh-pages`
3. Add deploy scripts to package.json
4. Deploy: `npm run deploy`

### Docker

Use provided Dockerfile for containerized deployment.

## Current Status

### What's Working ✅

- Interactive tag cloud visualization
- 7 sample experiments with realistic biological data
- Filtering by GO category and enrichment threshold
- GO term detail view with gene information
- Experiment browser and selection
- Admin panel displays real experiments
- Dynamic data loading based on experiment ID
- Command-line data conversion tool
- Comprehensive documentation
- Production build with zero errors

### What's Not Working Yet ❌

- Web-based file upload (Admin Panel is view-only)
- Backend API / database persistence
- User authentication
- Export functionality (PDF, PNG, CSV)
- Automated testing (minimal test coverage)
- Comparison mode for multiple experiments
- Advanced search and filtering

### Current Development Phase

**Phase 1: Testing & Validation** (In Progress)

Next steps:
1. Deploy to Coolify and test live
2. Complete testing checklist (TESTING.md)
3. Gather user feedback
4. Fix any discovered bugs

See ROADMAP.md for detailed development plan.

## Important Notes for AI Assistants

### Do's ✅

- **Always read files before editing**: Use Read tool before Edit tool
- **Update documentation**: Keep README, CHANGELOG, TESTING in sync
- **Test builds**: Run `npm run build` after significant changes
- **Follow existing patterns**: Match code style in existing components
- **Use proper commit messages**: Include co-authorship attribution
- **Be honest about capabilities**: Don't claim features that don't exist
- **Check ROADMAP**: Understand what's planned vs. what's implemented

### Don'ts ❌

- **Don't add features not requested**: Keep changes focused
- **Don't skip testing**: Always verify builds compile
- **Don't guess about data**: Read actual data files to understand structure
- **Don't add dependencies lightly**: Discuss before adding new packages
- **Don't create mock/fake functionality**: Be transparent about limitations
- **Don't ignore ESLint errors**: Fix all linting issues before committing
- **Don't commit build/ directory**: It's auto-generated and gitignored

### When Working on AdminPanel

**CRITICAL**: The AdminPanel is currently **view-only**. It:
- Shows real experiments from experiments.json
- Displays GO term counts
- Provides instructions for command-line tool
- Links to documentation

It does **NOT**:
- Accept file uploads
- Process data in the browser
- Connect to a backend API
- Save experiments

Web-based upload is planned for Phase 2 (see ROADMAP.md).

### Common Tasks

**Adding a new experiment**:
1. Use `tools/convert_to_goflow.py` to create JSON files
2. Files should be named `experiment_X_go_terms.json` and `experiment_X_genes.json`
3. Update `public/data/experiments.json` with new experiment metadata
4. App.js will automatically load experiment-specific files for IDs 4+

**Fixing ESLint errors**:
1. Read the error message carefully
2. Check which file and line number
3. Common fixes: remove unused imports, add hook dependencies, reorder functions
4. Run `npm run build` to verify fix

**Updating documentation**:
1. Identify which docs need updates (README, CHANGELOG, TESTING, ROADMAP)
2. Make changes consistent across all files
3. Update version dates
4. Commit all documentation together

## Resources

### Internal Documentation

- **README.md**: User-facing documentation and installation
- **CONTRIBUTING.md**: Contributor guidelines
- **CHANGELOG.md**: Version history and changes
- **ROADMAP.md**: Development plans and phases
- **TESTING.md**: QA testing checklist
- **tools/README.md**: Data conversion documentation

### External Resources

- **React Documentation**: https://react.dev/
- **React Bootstrap**: https://react-bootstrap.github.io/
- **Gene Ontology Consortium**: http://geneontology.org/
- **Create React App**: https://create-react-app.dev/

### Repository

- **GitHub**: https://github.com/carywoods/goflow
- **Issues**: https://github.com/carywoods/goflow/issues
- **License**: MIT (see LICENSE file)

## Questions to Ask

When working on GoFlow, consider asking:

1. **For new features**: "Is this in the ROADMAP? What phase?"
2. **For data changes**: "How does this affect existing experiments?"
3. **For UI changes**: "Does this work on mobile/tablet?"
4. **For API changes**: "Is this a breaking change?"
5. **For documentation**: "Have I updated all relevant docs?"

## Version Information

**Document Version**: 1.0
**Last Updated**: 2025-02-05
**GoFlow Version**: 0.1.0 (with unreleased updates)
**Maintained By**: Cary Woods (carywoods)

---

**This document is maintained for AI assistants working on GoFlow. If you're a human contributor, see CONTRIBUTING.md instead.**
