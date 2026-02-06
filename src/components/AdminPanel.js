import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Alert, Table } from 'react-bootstrap';
import './AdminPanel.css';

const AdminPanel = () => {
  const [experiments, setExperiments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchExperiments();
  }, []);

  const fetchExperiments = async () => {
    try {
      setLoading(true);
      const response = await fetch('/data/experiments.json');
      const data = await response.json();

      // Calculate GO term count for each experiment
      const experimentsWithCounts = await Promise.all(
        data.experiments.map(async (exp) => {
          let goTermCount = 0;

          try {
            // Determine which data file to use
            const experimentId = exp.experiment_id;
            let dataFile = '/data/synthetic_go_terms.json';

            if (experimentId >= 4 && experimentId <= 7) {
              dataFile = `/data/experiment_${experimentId}_go_terms.json`;
            }

            const goResponse = await fetch(dataFile);
            const goData = await goResponse.json();
            goTermCount = goData.length;
          } catch (err) {
            console.error(`Failed to count GO terms for experiment ${exp.experiment_id}`, err);
          }

          return {
            ...exp,
            goTermCount
          };
        })
      );

      setExperiments(experimentsWithCounts);
      setLoading(false);
    } catch (err) {
      setError('Failed to load experiments');
      setLoading(false);
      console.error(err);
    }
  };

  return (
    <Container className="admin-panel">
      <h1 className="admin-header">GoFlow Admin Panel</h1>

      <Row>
        <Col md={12}>
          <Alert variant="info" className="mb-4">
            <Alert.Heading>About This Panel</Alert.Heading>
            <p>
              This admin panel displays all experiments currently available in GoFlow.
              To add new experiments, use the data conversion tool.
            </p>
          </Alert>
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          <Card className="experiments-card">
            <Card.Header as="h5">Current Experiments ({experiments.length})</Card.Header>
            <Card.Body>
              {loading ? (
                <p>Loading experiments...</p>
              ) : error ? (
                <Alert variant="danger">{error}</Alert>
              ) : (
                <Table striped bordered hover responsive>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Organism</th>
                      <th>Date</th>
                      <th>GO Terms</th>
                    </tr>
                  </thead>
                  <tbody>
                    {experiments.map(exp => (
                      <tr key={exp.experiment_id}>
                        <td>{exp.experiment_id}</td>
                        <td>
                          <strong>{exp.name}</strong>
                          <br />
                          <small className="text-muted">{exp.description}</small>
                        </td>
                        <td><em>{exp.organism_name}</em></td>
                        <td>{exp.experiment_date}</td>
                        <td className="text-center">
                          <span className="badge bg-primary">{exp.goTermCount}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card className="help-card mb-4">
            <Card.Header as="h5">How to Add New Experiments</Card.Header>
            <Card.Body>
              <Alert variant="warning" className="mb-3">
                <strong>Note:</strong> Web-based file upload is not yet implemented.
                Use the command-line tool to add experiments.
              </Alert>

              <h6>Step 1: Prepare Your Data</h6>
              <p>You need three CSV files:</p>
              <ol>
                <li><strong>Enrichment results</strong> - GO terms with p-values</li>
                <li><strong>Gene expression data</strong> - Genes with fold changes</li>
                <li><strong>GO-gene mapping</strong> - Which genes belong to which GO terms</li>
              </ol>

              <h6>Step 2: Run Conversion Tool</h6>
              <pre className="bg-light p-2 rounded">
{`cd tools

python convert_to_goflow.py \\
  --enrichment enrichment.csv \\
  --genes genes.csv \\
  --mapping mapping.csv \\
  --experiment-id 8 \\
  --experiment-name "My Experiment" \\
  --experiment-desc "Description" \\
  --output-dir ../public/data`}
              </pre>

              <h6>Step 3: Rebuild & Deploy</h6>
              <pre className="bg-light p-2 rounded">
{`npm run build`}
              </pre>

              <p className="mb-0">
                See <a href="https://github.com/carywoods/goflow/blob/main/tools/README.md" target="_blank" rel="noopener noreferrer">
                  tools/README.md
                </a> for detailed instructions.
              </p>
            </Card.Body>
          </Card>

          <Card className="help-card">
            <Card.Header as="h5">Required Data Format</Card.Header>
            <Card.Body>
              <h6>Enrichment Results CSV</h6>
              <pre className="bg-light p-2 rounded">
{`go_id,term,category,p_value
GO:0006950,response to stress,biological_process,0.00001
GO:0006457,protein folding,biological_process,0.00005`}
              </pre>

              <h6>Gene Expression CSV</h6>
              <pre className="bg-light p-2 rounded">
{`gene_symbol,description,expression_value,p_value
SSA2,HSP70 family protein,5.23,0.0001
HSP82,Hsp90 chaperone,4.87,0.0002`}
              </pre>

              <h6>GO-Gene Mapping CSV</h6>
              <pre className="bg-light p-2 rounded">
{`go_id,gene_symbols
GO:0006950,"SSA2,HSP82,HSP104"
GO:0006457,"SSA2,HSP82,SSB2"`}
              </pre>

              <p className="text-muted mb-0">
                <small>Example files are in <code>tools/examples/</code></small>
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mt-4">
        <Col>
          <Card className="border-primary">
            <Card.Header as="h5" className="bg-primary text-white">
              Future Features (Coming Soon)
            </Card.Header>
            <Card.Body>
              <h6>Planned Enhancements:</h6>
              <ul>
                <li>✨ Web-based file upload (no command line required)</li>
                <li>✨ Automatic format detection and validation</li>
                <li>✨ Real-time data processing with progress indicator</li>
                <li>✨ Edit and delete existing experiments</li>
                <li>✨ Preview data before saving</li>
                <li>✨ Direct integration with GOrilla, DAVID, and Enrichr</li>
              </ul>
              <p className="text-muted mb-0">
                See <a href="https://github.com/carywoods/goflow/blob/main/ROADMAP.md" target="_blank" rel="noopener noreferrer">
                  ROADMAP.md
                </a> for the full development plan.
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AdminPanel;
