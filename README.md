# GoFlow - Gene Ontology Visualization Framework

This is a modern implementation of the GoFlow system, a semantic web visualization framework for Gene Ontology.

## Overview

GoFlow provides a visual representation of Gene Ontology (GO) term enrichment using tag clouds, where font size indicates the level of enrichment. The system allows researchers to upload experimental data, process it against GO terms, and visualize the results.

## Features

- Tag cloud visualization with font sizes proportional to enrichment values
- Color-coding for different GO categories:
  - Blue: Biological Process terms
  - Green: Cellular Component terms
  - Red: Molecular Function terms
- Filtering by GO category and minimum enrichment threshold
- Drill-down functionality to view genes associated with GO terms
- Admin panel for data uploads and experiment management

## Installation

1. Clone this repository
2. Install dependencies:
   ```
   npm install
   ```
3. Start the development server:
   ```
   npm start
   ```

## Building for Production

To create a production build:

```
npm run build
```

The build folder will be ready to be deployed.

## GitHub Deployment

To deploy this project to GitHub Pages:

1. Add the `homepage` field to your package.json:
   ```json
   "homepage": "https://yourusername.github.io/goflow"
   ```

2. Install the gh-pages package:
   ```
   npm install --save-dev gh-pages
   ```

3. Add deployment scripts to package.json:
   ```json
   "scripts": {
     "predeploy": "npm run build",
     "deploy": "gh-pages -d build",
     ...
   }
   ```

4. Deploy to GitHub Pages:
   ```
   npm run deploy
   ```

## Technology Stack

- React.js for the frontend
- Bootstrap for UI components
- Create React App for project configuration and build process

## License

This project is open source and available under the MIT License.
