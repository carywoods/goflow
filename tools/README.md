# GoFlow Data Conversion Tools

This directory contains tools to convert standard bioinformatics data formats into GoFlow's JSON format.

## Quick Start for Scientists

### Prerequisites

```bash
pip install pandas
```

### Basic Workflow

1. **Get your gene expression data** (from RNA-seq, microarray, etc.)
2. **Perform GO enrichment analysis** (using GOrilla, DAVID, Enrichr, etc.)
3. **Prepare three CSV files** (see formats below)
4. **Run the converter**

```bash
python convert_to_goflow.py \
    --enrichment my_enrichment.csv \
    --genes my_genes.csv \
    --mapping my_go_mapping.csv \
    --experiment-id 8 \
    --experiment-name "Heat Shock 42°C" \
    --experiment-desc "Yeast response to 42°C for 1 hour" \
    --output-dir ../public/data
```

## Input File Formats

### 1. Enrichment Results (`enrichment.csv`)

This file contains GO term enrichment analysis results.

**Required columns:**
- `go_id` - GO term identifier (e.g., GO:0006950)
- `term` - GO term name (e.g., "response to stress")
- `category` - One of: `biological_process`, `cellular_component`, `molecular_function`
- `p_value` - Statistical significance (will be converted to enrichment score)

**OR instead of p_value:**
- `enrichment_score` - Pre-calculated enrichment score
- `fold_enrichment` - Fold enrichment value

**Example:**
```csv
go_id,term,category,p_value
GO:0006950,response to stress,biological_process,0.00001
GO:0006457,protein folding,biological_process,0.00005
GO:0005783,endoplasmic reticulum,cellular_component,0.0001
GO:0051082,unfolded protein binding,molecular_function,0.0002
```

**How to get this file:**

- **From GOrilla**: Download results as TSV, convert to CSV
- **From DAVID**: Download "Functional Annotation Chart", extract GO terms
- **From Enrichr**: Download results table
- **From R (topGO/GOseq)**: Export results data frame to CSV

```r
# Example in R with topGO
library(topGO)
# ... run enrichment analysis ...
write.csv(results, "enrichment.csv", row.names=FALSE)
```

### 2. Gene Expression Data (`genes.csv`)

This file contains your differentially expressed genes.

**Required columns:**
- `gene_symbol` - Gene symbol (e.g., SSA2, HSP82)
- `expression_value` - Log2 fold change or expression value
- `p_value` - Statistical significance of differential expression

**Optional columns:**
- `gene_id` - Gene identifier (defaults to gene_symbol)
- `description` - Gene description
- `ensembl_id` - Ensembl gene ID
- `uniprot_id` - UniProt protein ID

**Example:**
```csv
gene_symbol,description,expression_value,p_value,ensembl_id,uniprot_id
SSA2,HSP70 family ATP-binding protein,5.23,0.0001,YLL024C,P10592
HSP82,Hsp90 chaperone,4.87,0.0002,YPL240C,P02829
HAC1,bZIP transcription factor,6.45,0.00002,YBR003W,P41682
```

**How to get this file:**

- **From DESeq2 (R)**:
```r
library(DESeq2)
# ... run differential expression analysis ...
results <- as.data.frame(res)
results$gene_symbol <- rownames(results)
colnames(results)[colnames(results) == "log2FoldChange"] <- "expression_value"
colnames(results)[colnames(results) == "padj"] <- "p_value"
write.csv(results[, c("gene_symbol", "expression_value", "p_value")],
          "genes.csv", row.names=FALSE)
```

- **From edgeR (R)**:
```r
library(edgeR)
# ... run analysis ...
write.csv(topTags(results, n=Inf)$table, "genes.csv")
```

- **From Excel/Spreadsheet**: Just save your results table as CSV

### 3. GO-Gene Mapping (`go_gene_mapping.csv`)

This file maps GO terms to the genes that belong to them.

**Required columns:**
- `go_id` - GO term identifier
- `gene_symbols` - Comma-separated list of gene symbols

**Example:**
```csv
go_id,gene_symbols
GO:0006950,"SSA2,HSP82,HSP78,HSP104"
GO:0006457,"SSA2,HSP82,SSB2"
GO:0005783,"KAR2,SEC61,SEC62"
```

**How to get this file:**

**Option 1: From your enrichment tool output**
Most tools provide this information. For example:
- GOrilla: Shows genes in each term
- DAVID: Provides gene list per term
- Enrichr: Lists overlapping genes

**Option 2: Query GO database**
```python
# Using goatools (Python)
from goatools import obo_parser
from goatools.anno.idtofamiliar import id_to_symbol

# Download GO OBO file
# wget http://geneontology.org/ontology/go-basic.obo

go = obo_parser.GODag("go-basic.obo")
# ... map genes to GO terms from your organism's annotation ...
```

**Option 3: Use organism-specific databases**
- **Yeast (SGD)**: Download GO annotations from SGD
- **Human**: Use biomaRt or org.Hs.eg.db in R
- **Mouse**: Use org.Mm.eg.db in R

```r
# Example for yeast
library(org.Sc.sgd.db)
library(GO.db)

# Get genes for a GO term
genes <- select(org.Sc.sgd.db,
                keys="GO:0006950",
                columns="GENENAME",
                keytype="GOALL")
```

## Complete Example

### Step-by-Step Tutorial

Let's say you have yeast RNA-seq data after heat shock treatment.

**1. You have differential expression results:**

File: `my_deseq_results.csv`
```csv
gene,log2FoldChange,pvalue,padj
SSA2,5.23,1.2e-10,2.3e-08
HSP82,4.87,3.4e-09,4.5e-07
HSP104,6.45,8.9e-12,1.2e-09
```

**2. You ran GO enrichment (using GOrilla) and got:**

File: `gorilla_results.txt` (TSV format)
```
GO Term    Description                P-value    FDR
GO:0006950 response to stress         1.2e-05    0.0001
GO:0006457 protein folding           5.6e-05    0.0004
```

**3. Create your input files:**

**a. Format genes.csv:**
```csv
gene_symbol,expression_value,p_value,description
SSA2,5.23,2.3e-08,HSP70 family ATP-binding protein
HSP82,4.87,4.5e-07,Hsp90 chaperone
HSP104,6.45,1.2e-09,Disaggregase
```

**b. Format enrichment.csv:**
```csv
go_id,term,category,p_value
GO:0006950,response to stress,biological_process,1.2e-05
GO:0006457,protein folding,biological_process,5.6e-05
```

**c. Create go_gene_mapping.csv:**

(Extract from GOrilla output or SGD database)
```csv
go_id,gene_symbols
GO:0006950,"SSA2,HSP82,HSP104,HSP78"
GO:0006457,"SSA2,HSP82,SSB2"
```

**4. Run converter:**

```bash
python convert_to_goflow.py \
    --enrichment enrichment.csv \
    --genes genes.csv \
    --mapping go_gene_mapping.csv \
    --experiment-id 8 \
    --experiment-name "Heat Shock 42°C Response" \
    --experiment-desc "S. cerevisiae exposed to 42°C for 60 minutes" \
    --organism "Saccharomyces cerevisiae" \
    --date "2025-04-20" \
    --output-dir ../public/data
```

**5. Done!** Your files are now in `public/data/` ready for GoFlow.

## Common Issues

### Issue: "Missing required columns"

**Problem**: Your CSV doesn't have the right column names.

**Solution**: Rename columns to match requirements:
```python
import pandas as pd
df = pd.read_csv('your_file.csv')
df.rename(columns={
    'Gene': 'gene_symbol',
    'logFC': 'expression_value',
    'adj.P.Val': 'p_value'
}, inplace=True)
df.to_csv('genes.csv', index=False)
```

### Issue: "No genes found for GO:XXXXXXX"

**Problem**: GO terms in enrichment file don't match mapping file.

**Solution**: Make sure GO IDs are exactly the same (including zero-padding):
- Correct: `GO:0006950`
- Wrong: `GO:6950`

### Issue: P-values too small (scientific notation issues)

**Solution**: The converter handles scientific notation automatically. But if you see errors:
```python
import pandas as pd
df = pd.read_csv('file.csv')
df['p_value'] = pd.to_numeric(df['p_value'], errors='coerce')
df.to_csv('file_fixed.csv', index=False)
```

## Advanced Usage

### Converting from R directly

```r
library(jsonlite)

# Your GO enrichment results
enrichment <- data.frame(
  go_id = c("GO:0006950", "GO:0006457"),
  term = c("response to stress", "protein folding"),
  category = c("biological_process", "biological_process"),
  p_value = c(0.00001, 0.00005)
)

# Your gene data
genes <- data.frame(
  gene_symbol = c("SSA2", "HSP82"),
  expression_value = c(5.23, 4.87),
  p_value = c(0.0001, 0.0002),
  description = c("HSP70 protein", "Hsp90 chaperone")
)

# Save
write.csv(enrichment, "enrichment.csv", row.names=FALSE)
write.csv(genes, "genes.csv", row.names=FALSE)
```

### Batch processing multiple experiments

```bash
# Process multiple experiments
for exp in exp1 exp2 exp3; do
    python convert_to_goflow.py \
        --enrichment ${exp}_enrichment.csv \
        --genes ${exp}_genes.csv \
        --mapping ${exp}_mapping.csv \
        --experiment-id ${exp#exp} \
        --experiment-name "Experiment ${exp#exp}" \
        --output-dir ../public/data
done
```

## Getting Help

If you encounter issues:

1. Check example files in `tools/examples/`
2. Verify CSV formatting (proper commas, quoted strings if needed)
3. Ensure GO IDs are properly formatted (GO:XXXXXXX)
4. Check that gene symbols match between all three files

For questions or issues: Open an issue on GitHub

## Example Files

See `tools/examples/` directory for:
- `example_enrichment.csv`
- `example_genes.csv`
- `example_mapping.csv`

These demonstrate the correct format for all input files.
