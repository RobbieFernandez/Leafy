import React from 'react';

interface addPlantProps {
  onClick: () => any;
}

const AddPlantTile = (props: addPlantProps) => <div className="card add-plant-card" onClick={props.onClick}>
  <header className="card-header">
    <p className="card-header-title">Add Plant</p>
  </header>
  <div className="card-content">
    <div className="notification has-text-centered">
      <i className="fas fa-plus plant-icon"></i>
    </div>
  </div>
</div>

export default AddPlantTile;