import React from 'react';
import ReactDOM from 'react-dom';

import PlantTile from './PlantTile';
import Plant from "./Plant";
import { LoadingOverlay } from '../layout/LoadingOverlay';
import { Modal } from '../layout/Modal';
import PlantEditForm from './PlantEditForm';

interface dashboardState {
  plants: Plant[];
  loadingPlants: boolean;
  editingPlant: number|null;
}

interface dashboardProps {
  getPlantsUrl: string;
  waterPlantsUrl: string;
}

interface getPlantsResponse {
  plants: {id: number; name: string; last_watered: string;}[]
}

declare const Urls: any;

export default class DashboardApp extends React.Component<dashboardProps, dashboardState> {
  constructor(props: Readonly<dashboardProps>) {
    super(props);
    this.state = {
      plants: [],
      loadingPlants: false,
      editingPlant: null
    };
  }

  componentDidMount = () => {
    this.fetchPlants();
  }

  fetchPlants = async () => {
    this.setState({loadingPlants: true});
    const res = await window.fetch(this.props.getPlantsUrl);
    try {
      if (res.ok) {
        const data: getPlantsResponse = await res.json();
        const parsedPlants: Plant[] = data.plants.map(p => ({
            name: p.name,
            id: p.id,
            lastWatered: new Date(Date.parse(p.last_watered)).setHours(0, 0, 0, 0)
        }));
        this.setState({plants: parsedPlants, loadingPlants: false});
      } else {
        this.setState({loadingPlants: false});
      }
    } catch {
      this.setState({loadingPlants: false});
    }
  }

  onPlantWatered = (plantId: number) => {
    const plantIndex = this.state.plants.findIndex(plant => plant.id === plantId);
    const plant = this.state.plants[plantIndex];
    if (plant !== undefined) {
      this.setState({
        plants: [
          ...this.state.plants.slice(0, plantIndex),
          {
            ...plant,
            lastWatered: Date.now()
          },
          ...this.state.plants.slice(plantIndex + 1)
        ]
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
                plantName={plant.name}
                key={plant.id}
                id={plant.id}
                waterUrl={this.props.waterPlantsUrl}
                lastWatered={plant.lastWatered}
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