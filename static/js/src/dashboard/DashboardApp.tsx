import React from 'react';
import Immutable from 'immutable';
import ReactDOM from 'react-dom';

import PlantTile from './PlantTile';
import { LoadingOverlay } from '../layout/LoadingOverlay';
import { Modal } from '../layout/Modal';
import PlantEditForm from './PlantEditForm';

interface dashboardState {
  plants: Immutable.List<Immutable.Map<string, any>>;
  loadingPlants: boolean;
  editingPlant: number|null;
}

interface dashboardProps {
  getPlantsUrl: string;
  waterPlantsUrl: string;
}

declare const Urls: any;

export default class DashboardApp extends React.Component<dashboardProps, dashboardState> {
  constructor(props: Readonly<dashboardProps>) {
    super(props);
    this.state = {
      plants: Immutable.List(),
      loadingPlants: false,
      editingPlant: null
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

  onPlantWatered = (plantId: number) => {
    const plantIndex = this.state.plants.findIndex(plant => plant.get('id') === plantId);
    const plant = this.state.plants.get(plantIndex);
    if (plant !== undefined) {
      this.setState({
        plants: this.state.plants.set(
          plantIndex,
          plant.set("last_watered", new Date(Date.now()).toISOString())
        )
      });
    }
  }

  editPlant = (plantId: number) => {
    this.setState({editingPlant: plantId});
  }

  onPlantEdited = (plantId: number) => {
    this.setState({editingPlant: null});
    this.fetchPlants();
  }

  render = () => {
    if (this.state.loadingPlants) {
      return <LoadingOverlay/>
    } else {
      return <>
        <Modal
          close={() => {this.setState({editingPlant: null})}}
          title={"Edit Plant"}
          isOpen={this.state.editingPlant !== null}
        >
          {this.state.editingPlant !== null && <PlantEditForm
            plantId={this.state.editingPlant}
            submitUrl={Urls.plantUpdate(this.state.editingPlant)}
            updateMethod={"PUT"}
            onSubmit={this.onPlantEdited}
          />}
        </Modal>
        <div className='container'>
          <div className="tile is-ancestor">
            {this.state.plants.map(plant =>
              <PlantTile
                plantName={plant.get('name')}
                key={plant.get('id')}
                id={plant.get('id')}
                waterUrl={this.props.waterPlantsUrl}
                lastWatered={plant.get('last_watered')}
                onPlantWatered={this.onPlantWatered}
                onEdit={this.editPlant}
              />
            )}
          </div>
        </div>
      </>
    }
  }
}

export const init = (props: Readonly<dashboardProps>, container) => {
  ReactDOM.render(<DashboardApp {...props}/>, container);
}