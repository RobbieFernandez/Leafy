import React from 'react';

export const PlantTile = props => <div className="tile is-parent">
  <div className="tile is-child card">
    <header className="card-header">
      <p className="card-header-title is-centered">{props.plantName}</p>
    </header>
    <div className="card-content">
      <div className="notification is-primary has-text-centered">
        <i class="fas fa-seedling plant-icon"></i>
      </div>
    </div>
    <div className="card-footer">
      <div className="card-footer-item">
        <a>Water</a>
      </div>
      <div className="card-footer-item">
        <a>Edit</a>
      </div>
    </div>
  </div>
</div>
