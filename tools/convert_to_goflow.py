#!/usr/bin/env python3
"""
GoFlow Data Converter
Converts GO enrichment analysis results into GoFlow JSON format

Usage:
    python convert_to_goflow.py --enrichment enrichment.csv --genes genes.csv --output-dir ../public/data

Input Format:
    enrichment.csv: GO term enrichment results
        Required columns: go_id, term, category, p_value or enrichment_score

    genes.csv: Gene expression data
        Required columns: gene_symbol, description, expression_value, p_value
        Optional columns: gene_id, ensembl_id, uniprot_id

Output:
    - experiment_N_go_terms.json
    - experiment_N_genes.json
"""

import pandas as pd
import json
import argparse
import math
from pathlib import Path


def calculate_font_size(weight, min_weight, max_weight, min_size=70, max_size=250):
    """Calculate font size based on enrichment weight"""
    if max_weight == min_weight:
        return (min_size + max_size) / 2

    # Linear scaling
    normalized = (weight - min_weight) / (max_weight - min_weight)
    font_size = min_size + (normalized * (max_size - min_size))
    return round(font_size)


def convert_enrichment_to_go_terms(enrichment_df, output_file):
    """
    Convert enrichment analysis results to GoFlow GO terms format

    Args:
        enrichment_df: DataFrame with columns [go_id, term, category, p_value/enrichment_score]
        output_file: Path to output JSON file
    """
    # Determine weight column (enrichment score or convert p-value)
    if 'enrichment_score' in enrichment_df.columns:
        weight_col = 'enrichment_score'
    elif 'fold_enrichment' in enrichment_df.columns:
        weight_col = 'fold_enrichment'
    elif 'p_value' in enrichment_df.columns:
        # Convert p-value to enrichment score: -log10(p_value)
        enrichment_df['weight'] = enrichment_df['p_value'].apply(lambda x: -math.log10(x) if x > 0 else 50)
        weight_col = 'weight'
    else:
        raise ValueError("No enrichment score or p-value column found")

    # If we didn't create weight column, rename existing column
    if weight_col != 'weight':
        enrichment_df['weight'] = enrichment_df[weight_col]

    # Sort by weight descending
    enrichment_df = enrichment_df.sort_values('weight', ascending=False)

    # Calculate font sizes
    min_weight = enrichment_df['weight'].min()
    max_weight = enrichment_df['weight'].max()

    enrichment_df['font_size'] = enrichment_df['weight'].apply(
        lambda w: calculate_font_size(w, min_weight, max_weight)
    )

    # Create output structure
    go_terms = []
    for _, row in enrichment_df.iterrows():
        go_term = {
            "go_id": row['go_id'],
            "text": row['term'] if 'term' in row else row.get('go_term', 'Unknown'),
            "category": row['category'],
            "weight": round(row['weight'], 1),
            "font_size": int(row['font_size'])
        }
        go_terms.append(go_term)

    # Write JSON
    with open(output_file, 'w') as f:
        json.dump(go_terms, f, indent=2)

    print(f"✓ Created {output_file} with {len(go_terms)} GO terms")
    return go_terms


def map_genes_to_go_terms(genes_df, enrichment_df, go_gene_mapping, output_file):
    """
    Create gene mappings for GO terms

    Args:
        genes_df: DataFrame with gene expression data
        enrichment_df: DataFrame with GO term data
        go_gene_mapping: Dict mapping go_id to list of gene symbols
        output_file: Path to output JSON file
    """
    gene_mappings = []

    for go_id in enrichment_df['go_id']:
        if go_id not in go_gene_mapping:
            print(f"Warning: No genes found for {go_id}")
            continue

        gene_symbols = go_gene_mapping[go_id]
        genes_in_term = []

        for symbol in gene_symbols:
            # Find gene in genes_df
            gene_row = genes_df[genes_df['gene_symbol'] == symbol]

            if gene_row.empty:
                # Gene not in expression data, skip
                continue

            gene_row = gene_row.iloc[0]

            gene_entry = {
                "gene_id": gene_row.get('gene_id', gene_row['gene_symbol']),
                "symbol": gene_row['gene_symbol'],
                "description": gene_row.get('description', 'No description'),
                "expression_value": round(float(gene_row['expression_value']), 2),
                "p_value": float(gene_row['p_value']),
                "ensembl_id": gene_row.get('ensembl_id', gene_row.get('gene_id', gene_row['gene_symbol'])),
                "uniprot_id": gene_row.get('uniprot_id', 'Unknown')
            }
            genes_in_term.append(gene_entry)

        if genes_in_term:
            gene_mappings.append({
                "go_id": go_id,
                "genes": genes_in_term
            })

    # Write JSON
    with open(output_file, 'w') as f:
        json.dump(gene_mappings, f, indent=2)

    print(f"✓ Created {output_file} with mappings for {len(gene_mappings)} GO terms")


def load_go_gene_mapping(mapping_file):
    """
    Load GO term to gene mapping file

    Expected format (CSV):
        go_id,gene_symbols
        GO:0006950,"SSA2,HSP82,HSP78"

    Or (TSV/tab-delimited):
        go_id    gene_symbols
        GO:0006950    SSA2,HSP82,HSP78
    """
    # Try to detect delimiter
    with open(mapping_file, 'r') as f:
        first_line = f.readline()
        delimiter = '\t' if '\t' in first_line else ','

    df = pd.read_csv(mapping_file, delimiter=delimiter)

    mapping = {}
    for _, row in df.iterrows():
        go_id = row['go_id']
        # Split gene symbols (handle both comma and semicolon)
        genes = row['gene_symbols'].replace(';', ',').split(',')
        genes = [g.strip() for g in genes if g.strip()]
        mapping[go_id] = genes

    return mapping


def main():
    parser = argparse.ArgumentParser(
        description='Convert GO enrichment results to GoFlow format',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
    # Basic conversion
    python convert_to_goflow.py \\
        --enrichment enrichment_results.csv \\
        --genes gene_expression.csv \\
        --mapping go_gene_mapping.csv \\
        --experiment-id 8 \\
        --output-dir ../public/data

    # With experiment metadata
    python convert_to_goflow.py \\
        --enrichment enrichment.csv \\
        --genes genes.csv \\
        --mapping mapping.csv \\
        --experiment-id 8 \\
        --experiment-name "My Experiment" \\
        --experiment-desc "Description of experiment" \\
        --organism "Saccharomyces cerevisiae" \\
        --output-dir ../public/data
        """
    )

    parser.add_argument('--enrichment', required=True, help='GO enrichment results CSV file')
    parser.add_argument('--genes', required=True, help='Gene expression data CSV file')
    parser.add_argument('--mapping', required=True, help='GO term to gene mapping CSV file')
    parser.add_argument('--experiment-id', type=int, required=True, help='Experiment ID number')
    parser.add_argument('--output-dir', default='../public/data', help='Output directory')

    # Optional experiment metadata
    parser.add_argument('--experiment-name', help='Name of experiment')
    parser.add_argument('--experiment-desc', help='Description of experiment')
    parser.add_argument('--organism', default='Saccharomyces cerevisiae', help='Organism name')
    parser.add_argument('--date', help='Experiment date (YYYY-MM-DD)')

    args = parser.parse_args()

    # Create output directory
    output_dir = Path(args.output_dir)
    output_dir.mkdir(parents=True, exist_ok=True)

    print(f"\n{'='*60}")
    print(f"GoFlow Data Converter")
    print(f"{'='*60}\n")

    # Load data
    print("Loading input files...")
    enrichment_df = pd.read_csv(args.enrichment)
    genes_df = pd.read_csv(args.genes)
    go_gene_mapping = load_go_gene_mapping(args.mapping)

    print(f"  • Loaded {len(enrichment_df)} GO terms")
    print(f"  • Loaded {len(genes_df)} genes")
    print(f"  • Loaded mappings for {len(go_gene_mapping)} GO terms\n")

    # Validate required columns
    required_enrichment_cols = ['go_id', 'category']
    missing = set(required_enrichment_cols) - set(enrichment_df.columns)
    if missing:
        raise ValueError(f"Missing required columns in enrichment file: {missing}")

    required_gene_cols = ['gene_symbol', 'expression_value', 'p_value']
    missing = set(required_gene_cols) - set(genes_df.columns)
    if missing:
        raise ValueError(f"Missing required columns in genes file: {missing}")

    # Convert data
    print("Converting data to GoFlow format...\n")

    # GO terms
    go_terms_file = output_dir / f'experiment_{args.experiment_id}_go_terms.json'
    go_terms = convert_enrichment_to_go_terms(enrichment_df, go_terms_file)

    # Gene mappings
    genes_file = output_dir / f'experiment_{args.experiment_id}_genes.json'
    map_genes_to_go_terms(genes_df, enrichment_df, go_gene_mapping, genes_file)

    # Update experiments.json if metadata provided
    if args.experiment_name:
        experiments_file = output_dir / 'experiments.json'

        # Load existing experiments
        if experiments_file.exists():
            with open(experiments_file, 'r') as f:
                data = json.load(f)
                experiments = data.get('experiments', [])
        else:
            experiments = []

        # Add new experiment
        import datetime
        new_experiment = {
            "experiment_id": args.experiment_id,
            "name": args.experiment_name,
            "description": args.experiment_desc or "",
            "organism_name": args.organism,
            "experiment_date": args.date or datetime.date.today().isoformat()
        }

        # Check if experiment already exists
        existing_ids = [e['experiment_id'] for e in experiments]
        if args.experiment_id in existing_ids:
            # Update existing
            for i, exp in enumerate(experiments):
                if exp['experiment_id'] == args.experiment_id:
                    experiments[i] = new_experiment
                    print(f"✓ Updated experiment {args.experiment_id} in experiments.json")
                    break
        else:
            # Add new
            experiments.append(new_experiment)
            print(f"✓ Added experiment {args.experiment_id} to experiments.json")

        # Write back
        with open(experiments_file, 'w') as f:
            json.dump({"experiments": experiments}, f, indent=2)

    print(f"\n{'='*60}")
    print(f"✓ Conversion complete!")
    print(f"{'='*60}\n")
    print(f"Files created:")
    print(f"  • {go_terms_file}")
    print(f"  • {genes_file}")
    if args.experiment_name:
        print(f"  • {experiments_file} (updated)")
    print(f"\nYou can now use these files in GoFlow!")


if __name__ == '__main__':
    main()
