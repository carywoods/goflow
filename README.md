# GoFlow - Gene Ontology Visualization Framework

A modern, interactive web application for visualizing Gene Ontology (GO) term enrichment using dynamic tag clouds. GoFlow provides researchers with an intuitive interface to explore experimental data and discover biological insights through enrichment analysis.

[![React](https://img.shields.io/badge/React-18.2.0-blue.svg)](https://reactjs.org/)
[![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3.2-purple.svg)](https://getbootstrap.com/)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

## Overview

GoFlow is a semantic web visualization framework designed to help bioinformatics researchers analyze and visualize Gene Ontology enrichment data. The application transforms complex enrichment data into intuitive tag clouds where font size represents enrichment levels, making it easy to identify the most significant biological processes, cellular components, and molecular functions in experimental datasets.

## Features

### Visualization
- **Interactive Tag Clouds**: Dynamic visualization with font sizes proportional to GO term enrichment values
- **Color-Coded Categories**:
  - 🔵 **Blue**: Biological Process terms
  - 🟢 **Green**: Cellular Component terms
  - 🔴 **Red**: Molecular Function terms
- **Real-time Filtering**: Filter by GO category and minimum enrichment threshold
- **Drill-down Functionality**: Click any term to view detailed information and associated genes

### Data Management
- **Admin Panel**: Upload and manage experimental datasets
- **Experiment Browser**: Browse and select from multiple experiments
- **Experiment Details**: View metadata including organism, date, and description
- **Gene Mapping**: View genes associated with each GO term

### User Experience
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Fast Performance**: Optimized React components for smooth interactions
- **Intuitive Interface**: Clean, modern UI built with Bootstrap

## Technology Stack

- **Frontend Framework**: React 18.2.0
- **UI Library**: React Bootstrap 5.3.2
- **Build Tool**: Create React App
- **Styling**: Bootstrap 5 + Custom CSS
- **State Management**: React Hooks (useState, useEffect, useCallback)

## Installation

### Prerequisites
- Node.js 14.x or higher
- npm 6.x or higher

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/carywoods/goflow.git
   cd goflow
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

   The application will open at [http://localhost:3000](http://localhost:3000)

## Development

### Available Scripts

- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner in interactive watch mode
- `npm run build` - Creates an optimized production build
- `npm run eject` - Ejects from Create React App (⚠️ one-way operation)

### Project Structure

```
goflow/
├── public/
│   ├── data/
│   │   ├── experiments.json        # Experiment metadata
│   │   ├── go_term_genes.json      # Gene-GO term mappings
│   │   └── synthetic_go_terms.json # GO term enrichment data
│   ├── index.html
│   └── logo.svg
├── src/
│   ├── components/
│   │   ├── AdminPanel.js           # Data upload and management
│   │   ├── AdminPanel.css
│   │   ├── ExperimentList.js       # Experiment browser sidebar
│   │   ├── ExperimentList.css
│   │   ├── GOTermDetail.js         # Detailed GO term view
│   │   ├── GOTermDetail.css
│   │   ├── TagCloud.js             # Tag cloud visualization
│   │   └── TagCloud.css
│   ├── App.js                      # Main application component
│   ├── App.css
│   ├── index.js                    # Application entry point
│   └── index.css
├── package.json
└── README.md
```

### Component Overview

#### App.js
Main application component that manages:
- Tab navigation (Visualization/Admin Panel)
- Experiment selection
- Data fetching and state management
- Filter controls

#### TagCloud.js
Renders the interactive tag cloud visualization:
- Calculates font sizes based on enrichment values
- Applies color coding by GO category
- Handles term selection events

#### GOTermDetail.js
Displays detailed information for selected GO terms:
- Term name and GO ID
- Category and enrichment score
- Associated genes list
- Experimental and genome-wide term counts

#### ExperimentList.js
Sidebar component for browsing experiments:
- Lists all available experiments
- Highlights selected experiment
- Shows experiment metadata

#### AdminPanel.js
Admin interface for data management:
- Upload experimental data files
- View existing experiments
- Monitor processing status

## Data Format

### Experiments (experiments.json)
```json
{
  "experiments": [
    {
      "experiment_id": 1,
      "name": "Heat Shock Response",
      "description": "Analysis of heat shock response",
      "organism_name": "Saccharomyces cerevisiae",
      "experiment_date": "2025-03-15"
    }
  ]
}
```

### GO Terms (synthetic_go_terms.json)
```json
[
  {
    "go_id": "GO:0006950",
    "term": "response to stress",
    "category": "biological_process",
    "weight": 25.5
  }
]
```

### Gene Mappings (go_term_genes.json)
```json
[
  {
    "go_id": "GO:0006950",
    "genes": ["HSP104", "HSP82", "SSA1"]
  }
]
```

## Building for Production

### Local Build

Create an optimized production build:

```bash
npm run build
```

The build artifacts will be stored in the `build/` directory. The build is minified and optimized for best performance.

### Static File Deployment

Serve the production build with any static file server:

```bash
npm install -g serve
serve -s build
```

## Deployment

### GitHub Pages

1. Add the homepage field to `package.json`:
   ```json
   "homepage": "https://yourusername.github.io/goflow"
   ```

2. Install gh-pages:
   ```bash
   npm install --save-dev gh-pages
   ```

3. Add deployment scripts to `package.json`:
   ```json
   "scripts": {
     "predeploy": "npm run build",
     "deploy": "gh-pages -d build"
   }
   ```

4. Deploy:
   ```bash
   npm run deploy
   ```

### Coolify Deployment

GoFlow is ready to deploy on Coolify:

1. **Connect Repository**: Link your GitHub repository in Coolify
2. **Configure Build**: Coolify will auto-detect the Node.js app
3. **Environment Variables**: Set `NIXPACKS_NODE_VERSION=22` if needed
4. **Deploy**: Coolify will run `npm install` and `npm run build` automatically

The build process treats ESLint warnings as errors in CI mode. All code quality issues have been resolved for production deployment.

### Docker Deployment

Create a `Dockerfile`:

```dockerfile
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

Build and run:
```bash
docker build -t goflow .
docker run -p 80:80 goflow
```

## Browser Support

GoFlow supports all modern browsers:

### Production
- \>0.2% market share
- Not dead browsers
- Not Opera Mini

### Development
- Last Chrome version
- Last Firefox version
- Last Safari version

## Troubleshooting

### Build Failures

**Problem**: ESLint errors during build
```
Failed to compile.
[eslint] src/App.js
  Line 2:56: 'Alert' is defined but never used
```

**Solution**: The codebase has been updated to fix all ESLint issues. Pull the latest changes:
```bash
git pull origin main
npm install
npm run build
```

### Module Not Found Errors

**Problem**: `Module not found: Can't resolve 'react-bootstrap'`

**Solution**: Reinstall dependencies:
```bash
rm -rf node_modules package-lock.json
npm install
```

### Port Already in Use

**Problem**: `Something is already running on port 3000`

**Solution**: Kill the process or use a different port:
```bash
# Find and kill the process
lsof -ti:3000 | xargs kill -9

# Or use a different port
PORT=3001 npm start
```

## Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Ensure all tests pass and code is linted
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

### Code Style

- Follow the existing code style
- Use meaningful variable and function names
- Add comments for complex logic
- Keep components small and focused
- Write descriptive commit messages

## Security Vulnerabilities

GoFlow uses several dependencies with known vulnerabilities (9 total: 3 moderate, 6 high). These are primarily in development dependencies and do not affect production security. To address:

```bash
npm audit fix
```

Note: Some vulnerabilities may require breaking changes. Review carefully before applying fixes.

## Future Enhancements

- [ ] Backend API integration for data storage
- [ ] User authentication and authorization
- [ ] Export functionality (PDF, PNG, CSV)
- [ ] Advanced filtering and search
- [ ] Comparison mode for multiple experiments
- [ ] Statistical significance indicators
- [ ] Integration with GO database for term hierarchies
- [ ] Batch upload processing
- [ ] Real-time collaboration features

## License

This project is open source and available under the MIT License.

## Acknowledgments

- Gene Ontology Consortium for GO term data and structure
- React and Bootstrap communities for excellent tools and documentation
- All contributors who have helped improve GoFlow

## Contact

For questions, issues, or suggestions:
- Open an issue on GitHub
- Visit the repository: [https://github.com/carywoods/goflow](https://github.com/carywoods/goflow)

---

**Built with ❤️ for the bioinformatics community**
