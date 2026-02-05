# GoFlow Testing Checklist

Use this checklist to verify all functionality works correctly.

## Pre-Deployment Testing

### Build Verification
- [x] `npm install` completes without errors
- [x] `npm run build` completes successfully
- [x] No ESLint errors or warnings
- [x] Build size is reasonable (< 100KB gzipped)
- [x] All data files copied to build/data/ directory

### Code Quality
- [x] No console errors in development mode
- [x] No React warnings
- [x] Code follows style guidelines
- [x] All imports are used
- [x] No unused variables

## Functional Testing

### Experiment Selection
- [ ] Experiment list loads on page load
- [ ] All 7 experiments appear in sidebar:
  - [ ] Heat Shock Response
  - [ ] Oxidative Stress Response
  - [ ] Nutrient Starvation
  - [ ] DNA Damage Response
  - [ ] Cell Cycle Arrest
  - [ ] ER Stress Response
  - [ ] Glucose Starvation
- [ ] Clicking an experiment highlights it
- [ ] Experiment metadata displays correctly (name, description, organism, date)
- [ ] Welcome message shows when no experiment selected

### Tag Cloud Visualization
- [ ] Tag cloud renders for each experiment
- [ ] GO terms display with varying font sizes
- [ ] Colors are correct:
  - [ ] Blue for Biological Process
  - [ ] Green for Cellular Component
  - [ ] Red for Molecular Function
- [ ] Font sizes correlate with enrichment values
- [ ] Terms are readable and well-spaced
- [ ] Hovering over terms shows pointer cursor
- [ ] Clicking a term shows detail view

### Filtering
- [ ] Category filter buttons work:
  - [ ] "All" shows all categories
  - [ ] "Biological Process" shows only blue terms
  - [ ] "Cellular Component" shows only green terms
  - [ ] "Molecular Function" shows only red terms
- [ ] Active filter button is highlighted
- [ ] Minimum enrichment slider works:
  - [ ] Slider moves smoothly
  - [ ] Value displays correctly
  - [ ] Terms filter based on threshold
  - [ ] Setting to 0 shows all terms
- [ ] Filters work together correctly
- [ ] Changing filters updates tag cloud immediately

### GO Term Details
- [ ] Clicking a term shows detail view
- [ ] "Back to Tag Cloud" button works
- [ ] GO term information displays:
  - [ ] GO ID (e.g., GO:0006950)
  - [ ] Term name
  - [ ] Category
  - [ ] Enrichment score
- [ ] Gene list displays correctly:
  - [ ] Gene symbols
  - [ ] Descriptions
  - [ ] Expression values
  - [ ] P-values
  - [ ] External IDs (Ensembl, UniProt)
- [ ] Genes are sorted properly
- [ ] All gene data is complete

### Tab Navigation
- [ ] Visualization tab is active by default
- [ ] Clicking Admin Panel tab switches view
- [ ] Clicking Visualization tab switches back
- [ ] Active tab is highlighted
- [ ] Tab content displays correctly

### Admin Panel
- [ ] Form displays correctly
- [ ] All form fields are present:
  - [ ] Experiment Name
  - [ ] Description
  - [ ] Organism selector
  - [ ] File upload
- [ ] Organism dropdown has options
- [ ] File upload accepts CSV/TSV files
- [ ] "Upload and Process" button is clickable
- [ ] Mock upload simulation works:
  - [ ] Progress bar animates
  - [ ] Status messages update
  - [ ] Success message displays
- [ ] Existing experiments table shows data
- [ ] Help section is readable

### Error Handling
- [ ] Invalid data files show error message
- [ ] Missing files handled gracefully
- [ ] Network errors display user-friendly messages
- [ ] Console shows helpful error information (dev mode)

## Cross-Experiment Testing

Test each experiment individually:

### Experiment 1: Heat Shock Response
- [ ] Tag cloud loads
- [ ] Expected GO terms present (translation, ribosome, protein folding)
- [ ] Gene details work
- [ ] All filters work

### Experiment 2: Oxidative Stress Response
- [ ] Tag cloud loads
- [ ] Expected GO terms present
- [ ] Gene details work
- [ ] All filters work

### Experiment 3: Nutrient Starvation
- [ ] Tag cloud loads
- [ ] Expected GO terms present
- [ ] Gene details work
- [ ] All filters work

### Experiment 4: DNA Damage Response (NEW)
- [ ] Tag cloud loads
- [ ] Expected GO terms present (DNA repair, damage checkpoint)
- [ ] Gene details show RAD51, RAD52, etc.
- [ ] All filters work
- [ ] Uses experiment_4_go_terms.json file
- [ ] Uses experiment_4_genes.json file

### Experiment 5: Cell Cycle Arrest (NEW)
- [ ] Tag cloud loads
- [ ] Expected GO terms present (cell cycle, G1/S transition)
- [ ] Gene details show CDC28, CLN2, etc.
- [ ] All filters work
- [ ] Uses experiment_5_go_terms.json file
- [ ] Uses experiment_5_genes.json file

### Experiment 6: ER Stress Response (NEW)
- [ ] Tag cloud loads
- [ ] Expected GO terms present (UPR, protein folding, ER)
- [ ] Gene details show HAC1, SSA2, etc.
- [ ] All filters work
- [ ] Uses experiment_6_go_terms.json file
- [ ] Uses experiment_6_genes.json file

### Experiment 7: Glucose Starvation (NEW)
- [ ] Tag cloud loads
- [ ] Expected GO terms present (TCA cycle, gluconeogenesis)
- [ ] Gene details show MDH1, FBP1, etc.
- [ ] All filters work
- [ ] Uses experiment_7_go_terms.json file
- [ ] Uses experiment_7_genes.json file

## Responsive Design Testing

### Desktop (1920x1080)
- [ ] Layout looks good
- [ ] Tag cloud has adequate spacing
- [ ] Sidebar is appropriate width
- [ ] All text is readable

### Laptop (1366x768)
- [ ] Layout adjusts appropriately
- [ ] No horizontal scrolling
- [ ] Tag cloud readable
- [ ] Sidebar doesn't crowd content

### Tablet (768x1024)
- [ ] Responsive layout kicks in
- [ ] Navigation works
- [ ] Touch interactions work
- [ ] Tag cloud usable on touchscreen

### Mobile (375x667)
- [ ] Mobile layout displays
- [ ] Navigation accessible
- [ ] Tag cloud readable
- [ ] Filters accessible
- [ ] Scrolling works smoothly

## Browser Compatibility

### Chrome/Chromium
- [ ] Latest version works
- [ ] All features functional
- [ ] No console errors

### Firefox
- [ ] Latest version works
- [ ] All features functional
- [ ] No console errors

### Safari
- [ ] Latest version works (macOS/iOS)
- [ ] All features functional
- [ ] No console errors

### Edge
- [ ] Latest version works
- [ ] All features functional
- [ ] No console errors

## Performance Testing

### Load Time
- [ ] Page loads in < 3 seconds on 4G
- [ ] First contentful paint < 1.5 seconds
- [ ] Time to interactive < 3 seconds

### Runtime Performance
- [ ] Switching experiments is instant
- [ ] Filtering is smooth (no lag)
- [ ] Tag cloud renders quickly
- [ ] No memory leaks (check dev tools)
- [ ] Animations are smooth (60fps)

### Data Loading
- [ ] Experiments load on demand
- [ ] GO term data loads correctly
- [ ] Gene data loads when needed
- [ ] No unnecessary data fetching

## Accessibility

### Keyboard Navigation
- [ ] Can tab through all controls
- [ ] Enter key activates buttons
- [ ] Focus indicators visible
- [ ] Logical tab order

### Screen Reader
- [ ] Page structure makes sense
- [ ] Buttons have labels
- [ ] Images have alt text
- [ ] Links are descriptive

### Color Contrast
- [ ] Text is readable
- [ ] Meets WCAG AA standards
- [ ] Color isn't the only indicator

## Documentation Testing

### README.md
- [ ] Installation instructions work
- [ ] All links are valid
- [ ] Examples are accurate
- [ ] Screenshots/badges display

### CONTRIBUTING.md
- [ ] Instructions are clear
- [ ] Code examples work
- [ ] Links are valid

### tools/README.md
- [ ] Conversion tool instructions work
- [ ] Example files are correct
- [ ] Command examples are accurate

### CHANGELOG.md
- [ ] Version information accurate
- [ ] All changes documented
- [ ] Format is consistent

## Conversion Tool Testing

### Basic Conversion
- [ ] Example files work with converter
- [ ] Output JSON is valid
- [ ] GO terms file format correct
- [ ] Genes file format correct
- [ ] Experiments.json updates correctly

### Error Handling
- [ ] Missing columns detected
- [ ] Invalid GO IDs caught
- [ ] File not found handled
- [ ] Helpful error messages

### Edge Cases
- [ ] Scientific notation in p-values works
- [ ] Empty gene lists handled
- [ ] Special characters in descriptions work
- [ ] Large files process without errors

## Deployment Testing

### Coolify Deployment
- [ ] Build succeeds in Coolify environment
- [ ] Environment variables set correctly
- [ ] Static files served properly
- [ ] Data files accessible

### Production Build
- [ ] No development warnings
- [ ] Assets properly minified
- [ ] Source maps available (optional)
- [ ] Cache headers appropriate

## Known Issues

Document any issues found:

1. **Issue:** [Description]
   - **Severity:** Critical / High / Medium / Low
   - **Steps to Reproduce:**
   - **Expected Behavior:**
   - **Actual Behavior:**
   - **Workaround:**

## Sign-Off

### Pre-Production Checklist
- [ ] All functional tests pass
- [ ] All browsers tested
- [ ] Performance is acceptable
- [ ] Documentation is accurate
- [ ] No critical bugs
- [ ] Deployment tested

### Reviewer
- **Name:**
- **Date:**
- **Version Tested:**
- **Deployment URL:**

### Approval
- [ ] Approved for production deployment
- [ ] Requires fixes (see Known Issues)

---

**Testing Completed:** [Date]
**Tested By:** [Name]
**Version:** 0.1.0
**Environment:** Development / Staging / Production
