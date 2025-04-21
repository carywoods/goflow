import React from 'react';
import { Table, Badge, Card, Row, Col, Alert } from 'react-bootstrap';
import './GOTermDetail.css';

const GOTermDetail = ({ goTerm, experiment }) => {
  // Define category colors and labels
  const categoryColors = {
    'biological_process': 'primary',
    'molecular_function': 'danger',
    'cellular_component': 'success'
  };
  
  const categoryLabels = {
    'biological_process': 'biological process',
    'molecular_function': 'molecular function',
    'cellular_component': 'cellular component'
  };
  
  return (
    <Card className="go-term-card">
      <Card.Header>
        <h3>{goTerm.text}</h3>
        <div className="go-term-id">{goTerm.go_id}</div>
        <Badge 
          bg={categoryColors[goTerm.category] || 'secondary'} 
          className="category-badge"
        >
          {categoryLabels[goTerm.category] || goTerm.category}
        </Badge>
      </Card.Header>
      
      <Card.Body>
        <div className="enrichment-info">
          <Row>
            <Col md={4}>
              <div className="enrichment-value">
                <span className="label">Enrichment:</span> 
                <span className="value">{goTerm.weight.toFixed(2)}%</span>
              </div>
            </Col>
            <Col md={4}>
              <div className="term-counts">
                <span className="label">Experimental Term Count:</span> 
                <span className="value">{goTerm.experimental_term_count}</span>
              </div>
            </Col>
            <Col md={4}>
              <div className="term-counts">
                <span className="label">Genome-wide Term Count:</span> 
                <span className="value">{goTerm.genome_wide_term_count}</span>
              </div>
            </Col>
          </Row>
        </div>
        
        <h4>Associated Genes</h4>
        {goTerm.genes && goTerm.genes.length > 0 ? (
          <Table striped bordered hover className="genes-table">
            <thead>
              <tr>
                <th>Symbol</th>
                <th>Description</th>
                <th>Expression Value</th>
                <th>P-Value</th>
                <th>External Links</th>
              </tr>
            </thead>
            <tbody>
              {goTerm.genes.map(gene => (
                <tr key={gene.gene_id}>
                  <td>{gene.symbol}</td>
                  <td>{gene.description}</td>
                  <td className={gene.expression_value > 0 ? 'positive-value' : 'negative-value'}>
                    {gene.expression_value.toFixed(2)}
                  </td>
                  <td>{gene.p_value.toFixed(4)}</td>
                  <td>
                    {gene.ensembl_id && (
                      <a 
                        href={`https://ensembl.org/id/${gene.ensembl_id}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="external-link"
                      >
                        Ensembl
                      </a>
                    )}
                    {gene.uniprot_id && (
                      <a 
                        href={`https://www.uniprot.org/uniprot/${gene.uniprot_id}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="external-link"
                      >
                        UniProt
                      </a>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <Alert variant="info" className="no-genes">
            No genes found for this GO term
          </Alert>
        )}
        
        <div className="mt-4">
          <h5>Experiment Information</h5>
          <p><strong>Name:</strong> {experiment.name}</p>
          <p><strong>Organism:</strong> {experiment.organism_name}</p>
          <p><strong>Date:</strong> {new Date(experiment.experiment_date).toLocaleDateString()}</p>
        </div>
      </Card.Body>
    </Card>
  );
};

export default GOTermDetail;
