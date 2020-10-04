import React from 'react';
import Immutable from 'immutable';
import ReactDOM, { render } from 'react-dom';

import PlantTile from './PlantTile';
import { LoadingOverlay } from './LoadingOverlay';

export default class DashboardApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      plants: Immutable.List(),
      loadingPlants: false,
    };
  }

  componentDidMount = () => {
    this.fetchPlants();
  }

  fetchPlants = () => {
    this.setState({loadingPlants: true});
    window
      .fetch(this.props.getPlantsUrl)
      .then(res => res.json())
      .then(data => this.setState({plants: Immutable.List(data.plants.map(Immutable.Map)), loadingPlants: false}))
      .catch(() => this.setState({loadingPlants: false}));
  }

  onPlantWatered = (plantId) => {
    const plantIndex = this.state.plants.findIndex(plant => plant.get('id') === plantId);
    const plant = this.state.plants.get(plantIndex).set("last_watered", new Date(Date.now()).toISOString());
    this.setState({plants: this.state.plants.set(plantIndex, plant)});
  }

  render = () => {
    if (this.state.loadingPlants) {
      return <LoadingOverlay/>
    } else {
      return <div className='container'>
        <div className="tile is-ancestor">
          {this.state.plants.map(plant =>
            <PlantTile
              plantName={plant.get('name')}
              key={plant.get('id')}
              id={plant.get('id')}
              waterUrl={this.props.waterPlantsUrl}
              lastWatered={plant.get('last_watered')}
              onPlantWatered={this.onPlantWatered}
            />
          )}
        </div>
      </div>
    }
  }
}

export const init = (props, container) => {
  ReactDOM.render(<DashboardApp {...props}/>, container);
}