import React from 'react';
import { ListGroup } from 'react-bootstrap';
import './ExperimentList.css';

const ExperimentList = ({ experiments, onExperimentSelect, selectedExperiment }) => {
  return (
    <div className="experiment-list">
      {experiments.length > 0 ? (
        <ListGroup>
          {experiments.map(experiment => (
            <ListGroup.Item 
              key={experiment.experiment_id}
              action
              active={selectedExperiment && selectedExperiment.experiment_id === experiment.experiment_id}
              onClick={() => onExperimentSelect(experiment)}
              className="experiment-item"
            >
              <div className="experiment-name">{experiment.name}</div>
              <div className="experiment-organism">{experiment.organism_name}</div>
              <div className="experiment-date">
                {new Date(experiment.experiment_date).toLocaleDateString()}
              </div>
            </ListGroup.Item>
          ))}
        </ListGroup>
      ) : (
        <div className="no-experiments">No experiments available</div>
      )}
    </div>
  );
};

export default ExperimentList;
