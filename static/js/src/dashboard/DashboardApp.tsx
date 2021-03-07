import React from 'react';
import ReactDOM from 'react-dom';
import { CSSTransitionGroup } from 'react-transition-group';

import PlantTile from './PlantTile';
import Plant from "./Plant";
import AddPlantTile from "./AddPlantTile";
import { LoadingOverlay } from '../layout/LoadingOverlay';
import { Modal } from '../layout/Modal';
import PlantEditForm from './PlantEditForm';

interface dashboardState {
  plants: Plant[];
  loadingPlants: boolean;
  editingPlant: number | null;
  creatingPlant: boolean;
}

interface dashboardProps {
  getPlantsUrl: string;
  waterPlantsUrl: string;
}

interface getPlantsResponse {
  plants: { id: number; name: string; last_watered: string; }[]
}

declare const Urls: any;
declare const csrftoken: string;

export default class DashboardApp extends React.Component<dashboardProps, dashboardState> {
  constructor(props: Readonly<dashboardProps>) {
    super(props);
    this.state = {
      plants: [],
      loadingPlants: false,
      editingPlant: null,
      creatingPlant: false
    };
  }

  componentDidMount = () => {
    this.fetchPlants();
  }

  fetchPlants = async () => {
    this.setState({ loadingPlants: true });
    const res = await window.fetch(this.props.getPlantsUrl);
    try {
      if (res.ok) {
        const data: getPlantsResponse = await res.json();
        const parsedPlants: Plant[] = data.plants.map(p => ({
          name: p.name,
          id: p.id,
          lastWatered: new Date(Date.parse(p.last_watered)).setHours(0, 0, 0, 0)
        }));
        this.setState({ plants: parsedPlants, loadingPlants: false });
      } else {
        this.setState({ loadingPlants: false });
      }
    } catch {
      this.setState({ loadingPlants: false });
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

  deletePlant = async (plantId: number) => {
    const res = await window.fetch(
      Urls.plantDelete(plantId),
      {
        method: 'DELETE',
        headers: {
          'X-CSRFToken': csrftoken,
          'Content-Type': 'application/json'
        }
      },
    )

    if (!res.ok) {
      console.error("Could not delete plant")
    } else {
      this.setState({ editingPlant: null });
      this.fetchPlants();
    }
  }

  editPlant = (plantId: number) => {
    this.setState({ editingPlant: plantId });
  }

  onPlantEdited = () => {
    this.setState({ editingPlant: null });
    this.fetchPlants();
  }

  onPlantCreated = () => {
    this.setState({ creatingPlant: false });
    this.fetchPlants();
  }

  renderModalContent = () => {
    if (this.state.editingPlant !== null) {
      return this.renderPlantEdit(this.state.editingPlant);
    } else if (this.state.creatingPlant) {
      return this.renderPlantCreate();
    } else {
      return <div />
    }
  }

  renderPlantEdit = (plantId: number) => <PlantEditForm
    plantId={plantId}
    submitUrl={Urls.plantUpdate(this.state.editingPlant)}
    updateMethod={"PUT"}
    onSubmit={this.onPlantEdited}
    allowDelete={true}
    onDelete={this.deletePlant}
  />

  renderPlantCreate = () => <PlantEditForm
    submitUrl={Urls.plantCreate()}
    updateMethod={"POST"}
    onSubmit={this.onPlantCreated}
  />


  render = () => <>
    <div className="container">
      <Modal
        close={() => { this.setState({ editingPlant: null, creatingPlant: false }) }}
        title={this.state.editingPlant === null ? "Create Plant" : "Edit Plant"}
        isOpen={this.state.editingPlant !== null || this.state.creatingPlant}
      >
        {this.renderModalContent()}
      </Modal>
      <div className="columns is-multiline">
        <CSSTransitionGroup
          transitionName="card-slide"
          transitionEnterTimeout={300}
          transitionLeaveTimeout={300}
          component={React.Fragment}
          transitionAppear={true}
        >
          {this.state.plants.map(plant =>
            <div className="column is-one-quarter" key={plant.id}>
              <PlantTile
                plantName={plant.name}
                id={plant.id}
                waterUrl={this.props.waterPlantsUrl}
                lastWatered={plant.lastWatered}
                onPlantWatered={this.onPlantWatered}
                onEdit={this.editPlant}
              />
            </div>
          )}
          <div className="column is-one-quarter" key={"add-plant"}>
            <AddPlantTile
              onClick={() => this.setState({ creatingPlant: true })}
            />
          </div>
        </CSSTransitionGroup>
      </div>
    </div>
    {this.state.loadingPlants && <LoadingOverlay />}
  </>
}

export const init = (props: Readonly<dashboardProps>, container) => {
  ReactDOM.render(<DashboardApp {...props} />, container);
}