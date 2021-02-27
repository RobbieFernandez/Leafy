import React from 'react';
import "./AddPlantTile.scss";

interface addPlantProps {
    onClick: () => any;
}

const AddPlantTile = (props: addPlantProps) => <div className="card add-plant-card" onClick={props.onClick}>
      <header className="card-header">
        <p className="card-header-title">Add Plant</p>
      </header>
    <div className="card-content">
        <div className="notification has-text-centered">
            <a className="far fa-plus-square plant-icon"></a>
        </div>
    </div>
</div>

export default AddPlantTile;