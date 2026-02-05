import React from 'react';
import { Container, Row, Col, Form, Button, Card, Alert, ProgressBar, Table } from 'react-bootstrap';
import './AdminPanel.css';

const AdminPanel = ({ onExperimentAdded }) => {
  const [file, setFile] = React.useState(null);
  const [experimentName, setExperimentName] = React.useState('');
  const [experimentDescription, setExperimentDescription] = React.useState('');
  const [organism, setOrganism] = React.useState('');
  const [uploading, setUploading] = React.useState(false);
  const [uploadProgress, setUploadProgress] = React.useState(0);
  const [uploadSuccess, setUploadSuccess] = React.useState(false);
  const [uploadError, setUploadError] = React.useState(null);
  const [processingStatus, setProcessingStatus] = React.useState(null);
  
  // Mock data for existing experiments
  const [experiments, setExperiments] = React.useState([
    {
      id: 1,
      name: 'Heat Shock Response in S. cerevisiae',
      description: 'Analysis of gene expression changes in yeast cells exposed to heat shock (37°C for 30 minutes)',
      organism: 'Saccharomyces cerevisiae',
      date: '2025-03-15',
      status: 'Completed',
      goTermCount: 30
    },
    {
      id: 2,
      name: 'Oxidative Stress Response in S. cerevisiae',
      description: 'Analysis of gene expression changes in yeast cells exposed to hydrogen peroxide (0.4 mM for 45 minutes)',
      organism: 'Saccharomyces cerevisiae',
      date: '2025-03-20',
      status: 'Completed',
      goTermCount: 28
    },
    {
      id: 3,
      name: 'Nutrient Starvation in S. cerevisiae',
      description: 'Analysis of gene expression changes in yeast cells under nitrogen starvation conditions (24 hours)',
      organism: 'Saccharomyces cerevisiae',
      date: '2025-03-25',
      status: 'Completed',
      goTermCount: 32
    }
  ]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!file || !experimentName || !organism) {
      setUploadError('Please fill in all required fields and select a file');
      return;
    }
    
    // Reset states
    setUploading(true);
    setUploadProgress(0);
    setUploadSuccess(false);
    setUploadError(null);
    setProcessingStatus('Uploading file...');
    
    // Simulate file upload with progress
    const uploadInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(uploadInterval);
          return 100;
        }
        return prev + 10;
      });
    }, 300);
    
    // Simulate upload completion
    setTimeout(() => {
      clearInterval(uploadInterval);
      setUploadProgress(100);
      setProcessingStatus('Processing data...');
      
      // Simulate data processing
      setTimeout(() => {
        setProcessingStatus('Calculating GO term enrichment...');
        
        // Simulate enrichment calculation
        setTimeout(() => {
          setProcessingStatus('Generating visualization...');
          
          // Simulate completion
          setTimeout(() => {
            setUploading(false);
            setUploadSuccess(true);
            setProcessingStatus('Completed');
            
            // Add the new experiment to the list
            const newExperiment = {
              id: experiments.length + 1,
              name: experimentName,
              description: experimentDescription,
              organism: organism,
              date: new Date().toISOString().split('T')[0],
              status: 'Completed',
              goTermCount: Math.floor(Math.random() * 10) + 25 // Random number between 25-34
            };
            
            setExperiments([...experiments, newExperiment]);
            
            // Notify parent component
            if (onExperimentAdded) {
              onExperimentAdded({
                experiment_id: Date.now(),
                name: experimentName,
                description: experimentDescription,
                organism_name: organism,
                experiment_date: new Date().toISOString().split('T')[0]
              });
            }
            
            // Reset form
            setFile(null);
            setExperimentName('');
            setExperimentDescription('');
            setOrganism('');
            
            // Reset file input
            document.getElementById('formFile').value = '';
          }, 1000);
        }, 1500);
      }, 1500);
    }, 3000);
  };

  return (
    <Container className="admin-panel">
      <h1 className="admin-header">GoFlow Admin Panel</h1>
      
      <Row>
        <Col md={6}>
          <Card className="upload-card">
            <Card.Header as="h5">Upload Experimental Data</Card.Header>
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Experiment Name *</Form.Label>
                  <Form.Control 
                    type="text" 
                    value={experimentName}
                    onChange={(e) => setExperimentName(e.target.value)}
                    placeholder="e.g., Heat Shock Response in S. cerevisiae"
                    required
                  />
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Description</Form.Label>
                  <Form.Control 
                    as="textarea" 
                    rows={3}
                    value={experimentDescription}
                    onChange={(e) => setExperimentDescription(e.target.value)}
                    placeholder="Brief description of the experiment"
                  />
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Organism *</Form.Label>
                  <Form.Select 
                    value={organism}
                    onChange={(e) => setOrganism(e.target.value)}
                    required
                  >
                    <option value="">Select an organism</option>
                    <option value="Saccharomyces cerevisiae">Saccharomyces cerevisiae</option>
                    <option value="Mus musculus">Mus musculus</option>
                    <option value="Rattus norvegicus">Rattus norvegicus</option>
                    <option value="Homo sapiens">Homo sapiens</option>
                  </Form.Select>
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Data File *</Form.Label>
                  <Form.Control 
                    type="file" 
                    id="formFile"
                    onChange={handleFileChange}
                    accept=".csv,.tsv,.txt"
                    required
                  />
                  <Form.Text className="text-muted">
                    Upload a CSV or TSV file with gene expression data. The file should contain columns for gene symbol, expression value, and p-value.
                  </Form.Text>
                </Form.Group>
                
                <Button 
                  variant="primary" 
                  type="submit"
                  disabled={uploading}
                >
                  {uploading ? 'Processing...' : 'Upload and Process'}
                </Button>
              </Form>
              
              {uploadError && (
                <Alert variant="danger" className="mt-3">
                  {uploadError}
                </Alert>
              )}
              
              {uploading && (
                <div className="mt-3">
                  <p>{processingStatus}</p>
                  <ProgressBar 
                    animated 
                    now={uploadProgress} 
                    label={`${uploadProgress}%`} 
                  />
                </div>
              )}
              
              {uploadSuccess && (
                <Alert variant="success" className="mt-3">
                  Data successfully uploaded and processed! The new experiment is now available in the visualization.
                </Alert>
              )}
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={6}>
          <Card className="experiments-card">
            <Card.Header as="h5">Existing Experiments</Card.Header>
            <Card.Body>
              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Organism</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>GO Terms</th>
                  </tr>
                </thead>
                <tbody>
                  {experiments.map(exp => (
                    <tr key={exp.id}>
                      <td>{exp.name}</td>
                      <td>{exp.organism}</td>
                      <td>{exp.date}</td>
                      <td>
                        <span className={`status-badge status-${exp.status.toLowerCase()}`}>
                          {exp.status}
                        </span>
                      </td>
                      <td>{exp.goTermCount}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
          
          <Card className="mt-4 help-card">
            <Card.Header as="h5">Help & Information</Card.Header>
            <Card.Body>
              <h6>File Format Requirements</h6>
              <p>
                The uploaded file should be in CSV or TSV format with the following columns:
              </p>
              <ul>
                <li><strong>gene_symbol</strong>: Symbol of the gene (e.g., RPL1A)</li>
                <li><strong>expression_value</strong>: Expression value in the experiment</li>
                <li><strong>p_value</strong>: P-value for statistical significance</li>
              </ul>
              
              <h6>Processing Steps</h6>
              <ol>
                <li>File upload and validation</li>
                <li>Data processing and normalization</li>
                <li>GO term mapping</li>
                <li>Enrichment calculation</li>
                <li>Visualization generation</li>
              </ol>
              
              <p>
                After processing is complete, the experiment will be available in the main visualization interface.
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AdminPanel;
