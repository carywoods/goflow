import React, { useState, useEffect, useCallback } from 'react';
import { Container, Row, Col, Nav, Form, Button, Card } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import TagCloud from './components/TagCloud';
import ExperimentList from './components/ExperimentList';
import GOTermDetail from './components/GOTermDetail';
import AdminPanel from './components/AdminPanel';

function App() {
  const [activeTab, setActiveTab] = useState('visualization');
  const [experiments, setExperiments] = useState([]);
  const [selectedExperiment, setSelectedExperiment] = useState(null);
  const [tagCloudData, setTagCloudData] = useState([]);
  const [selectedGOTerm, setSelectedGOTerm] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [minEnrichment, setMinEnrichment] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [goTermGenes, setGoTermGenes] = useState({});

  const fetchExperiments = async () => {
    try {
      setLoading(true);
      // Fetch from local JSON file
      const response = await fetch('/data/experiments.json');
      const data = await response.json();
      setExperiments(data.experiments);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch experiments');
      setLoading(false);
      console.error(err);
    }
  };

  const fetchTagCloudData = useCallback(async () => {
    if (!selectedExperiment) return;

    try {
      setLoading(true);
      // Determine which data file to load based on experiment
      const experimentId = selectedExperiment.experiment_id;
      let dataFile = '/data/synthetic_go_terms.json'; // Default for experiments 1-3

      // Use experiment-specific files for experiments 4-7
      if (experimentId >= 4 && experimentId <= 7) {
        dataFile = `/data/experiment_${experimentId}_go_terms.json`;
      }

      const response = await fetch(dataFile);
      let data = await response.json();

      // Apply filters
      if (selectedCategory !== 'all') {
        data = data.filter(term => term.category === selectedCategory);
      }

      if (minEnrichment > 0) {
        data = data.filter(term => term.weight >= minEnrichment);
      }

      setTagCloudData(data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch tag cloud data');
      setLoading(false);
      console.error(err);
    }
  }, [selectedExperiment, selectedCategory, minEnrichment]);

  // Fetch experiments on component mount
  useEffect(() => {
    fetchExperiments();
  }, []);

  // Fetch tag cloud data when experiment or filters change
  useEffect(() => {
    if (selectedExperiment) {
      fetchTagCloudData();
    }
  }, [selectedExperiment, fetchTagCloudData]);

  const fetchGoTermGenes = async (goId) => {
    if (!selectedExperiment) return {};

    try {
      // Fetch from local JSON file if not already loaded
      if (Object.keys(goTermGenes).length === 0) {
        const experimentId = selectedExperiment.experiment_id;
        let dataFile = '/data/go_term_genes.json'; // Default for experiments 1-3

        // Use experiment-specific files for experiments 4-7
        if (experimentId >= 4 && experimentId <= 7) {
          dataFile = `/data/experiment_${experimentId}_genes.json`;
        }

        const response = await fetch(dataFile);
        const data = await response.json();

        // Convert array to object with go_id as key for easier lookup
        const genesMap = {};
        data.forEach(item => {
          genesMap[item.go_id] = item.genes;
        });

        setGoTermGenes(genesMap);
        return genesMap;
      }
      return goTermGenes;
    } catch (err) {
      console.error('Failed to fetch GO term genes', err);
      return {};
    }
  };

  const handleExperimentSelect = (experiment) => {
    setSelectedExperiment(experiment);
    setSelectedGOTerm(null); // Reset selected GO term when changing experiments
    setGoTermGenes({}); // Reset genes cache to load new experiment's gene data
  };

  const handleGOTermSelect = async (goTerm) => {
    try {
      setLoading(true);
      
      // Fetch genes for this GO term
      const genesMap = await fetchGoTermGenes();
      const genes = genesMap[goTerm.go_id] || [];
      
      setSelectedGOTerm({
        ...goTerm,
        genes: genes,
        experimental_term_count: genes.length,
        genome_wide_term_count: Math.round(genes.length / (goTerm.weight / 100))
      });
      
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch GO term details');
      setLoading(false);
      console.error(err);
    }
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const handleMinEnrichmentChange = (event) => {
    setMinEnrichment(parseFloat(event.target.value) || 0);
  };

  const handleBackToCloud = () => {
    setSelectedGOTerm(null);
  };

  const handleNewExperimentAdded = (newExperiment) => {
    setExperiments([...experiments, newExperiment]);
  };

  return (
    <Container fluid className="app-container">
      <header className="app-header">
        <h1>GoFlow: Gene Ontology Visualization Framework</h1>
        <Nav variant="tabs" className="main-nav">
          <Nav.Item>
            <Nav.Link 
              active={activeTab === 'visualization'} 
              onClick={() => setActiveTab('visualization')}
            >
              Visualization
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link 
              active={activeTab === 'admin'} 
              onClick={() => setActiveTab('admin')}
            >
              Admin Panel
            </Nav.Link>
          </Nav.Item>
        </Nav>
      </header>
      
      <div className="tab-content">
        <div className={`tab-pane ${activeTab === 'visualization' ? 'active' : ''}`}>
          <Row className="main-content">
            <Col md={3} className="sidebar">
              <h3>Experiments</h3>
              <ExperimentList 
                experiments={experiments} 
                onExperimentSelect={handleExperimentSelect}
                selectedExperiment={selectedExperiment}
              />
            </Col>
            
            <Col md={9} className="content-area">
              {selectedExperiment ? (
                <>
                  <div className="experiment-header">
                    <h2>{selectedExperiment.name}</h2>
                    <p>{selectedExperiment.description}</p>
                    <p><strong>Organism:</strong> {selectedExperiment.organism_name}</p>
                    <p><strong>Date:</strong> {new Date(selectedExperiment.experiment_date).toLocaleDateString()}</p>
                  </div>
                  
                  <div className="filters">
                    <Row>
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label>Category Filter:</Form.Label>
                          <Nav variant="pills" className="category-nav">
                            <Nav.Item>
                              <Nav.Link 
                                active={selectedCategory === 'all'} 
                                onClick={() => handleCategoryChange('all')}
                              >
                                All
                              </Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                              <Nav.Link 
                                active={selectedCategory === 'biological_process'} 
                                onClick={() => handleCategoryChange('biological_process')}
                              >
                                Biological Process
                              </Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                              <Nav.Link 
                                active={selectedCategory === 'cellular_component'} 
                                onClick={() => handleCategoryChange('cellular_component')}
                              >
                                Cellular Component
                              </Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                              <Nav.Link 
                                active={selectedCategory === 'molecular_function'} 
                                onClick={() => handleCategoryChange('molecular_function')}
                              >
                                Molecular Function
                              </Nav.Link>
                            </Nav.Item>
                          </Nav>
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label>Minimum Enrichment: {minEnrichment.toFixed(1)}</Form.Label>
                          <Form.Control 
                            type="range" 
                            min="0" 
                            max="30" 
                            step="0.5"
                            value={minEnrichment}
                            onChange={handleMinEnrichmentChange}
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                  </div>
                  
                  {loading ? (
                    <div className="loading">Loading...</div>
                  ) : error ? (
                    <div className="error">{error}</div>
                  ) : (
                    <div className="visualization-area">
                      {selectedGOTerm ? (
                        <div className="go-term-detail">
                          <Button 
                            variant="link" 
                            onClick={handleBackToCloud}
                            className="back-button"
                          >
                            &larr; Back to Tag Cloud
                          </Button>
                          <GOTermDetail 
                            goTerm={selectedGOTerm} 
                            experiment={selectedExperiment}
                          />
                        </div>
                      ) : (
                        <div className="tag-cloud-container">
                          <h3>GO Term Tag Cloud</h3>
                          <p>Font size indicates enrichment level. Click on a term for details.</p>
                          <TagCloud 
                            data={tagCloudData} 
                            onTermSelect={handleGOTermSelect}
                          />
                        </div>
                      )}
                    </div>
                  )}
                </>
              ) : (
                <div className="select-experiment-prompt">
                  <Card>
                    <Card.Body>
                      <Card.Title>Welcome to GoFlow</Card.Title>
                      <Card.Text>
                        Please select an experiment from the sidebar to view its GO term enrichment analysis.
                      </Card.Text>
                      <Card.Text>
                        GoFlow visualizes Gene Ontology term enrichment using tag clouds, where font size indicates the level of enrichment.
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </div>
              )}
            </Col>
          </Row>
        </div>
        
        <div className={`tab-pane ${activeTab === 'admin' ? 'active' : ''}`}>
          <AdminPanel onExperimentAdded={handleNewExperimentAdded} />
        </div>
      </div>
      
      <footer className="app-footer">
        <p>GoFlow: A Semantic Web visualization framework for Gene Ontology</p>
      </footer>
    </Container>
  );
}

export default App;
