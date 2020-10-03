import React from 'react';
import Immutable from 'immutable';
import ReactDOM, { render } from 'react-dom';

import PlantTile from './PlantTile';

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

  render = () => {
    if (this.state.loadingPlants) {
      return <div/>; // TODO
    } else {
      return <div className='container'>
        <div className="tile is-ancestor">
          {this.state.plants.map(plant =>
            <PlantTile
              plantName={plant.get('name')}
              key={plant.get('id')}
              id={plant.get('id')}
              waterUrl={this.props.waterPlantsUrl}
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