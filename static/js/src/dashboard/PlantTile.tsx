import React from 'react';
import { LoadingOverlay } from '../layout/LoadingOverlay';
import WaterCalendar from "./WaterCalendar";
import { Modal } from "../layout/Modal";

interface plantTileProps {
  lastWatered: number | null;
  id: number;
  waterUrl: string;
  onPlantWatered: ((id: number) => any) | null;
  onEdit: ((id: number) => any) | null;
  greenTagThreshold: number;
  yellowTagThreshold: number;
  plantName: string;
}

interface plantTileState {
  isUpdating: boolean;
  lastWatered: number | null;
  showCalendar: boolean;
}

declare const csrftoken: string;

export default class PlantTile extends React.Component<plantTileProps, plantTileState> {
  static defaultProps = {
    onPlantWatered: null,
    greenTagThreshold: 3,
    yellowTagThreshold: 10
  }

  constructor(props) {
    super(props);
    this.state = {
      isUpdating: false,
      lastWatered: this.props.lastWatered,
      showCalendar: false
    };
  }

  water = () => {
    this.setState({ isUpdating: true });
    window
      .fetch(
        this.props.waterUrl,
        {
          method: 'POST',
          body: JSON.stringify({ plantId: this.props.id }),
          headers: {
            'X-CSRFToken': csrftoken,
            'Content-Type': 'application/json'
          }
        },
      )
      .then(response => {
        if (!response.ok) {
          throw new Error("Error watering plant");
        }
      })
      .then(() => {
        this.setState({ isUpdating: false });
        if (this.props.onPlantWatered !== null) {
          this.props.onPlantWatered(this.props.id);
        }
      })
      .catch(err => {
        console.error(err);
        this.setState({ isUpdating: false });
      });
  }

  getDaysSinceLastWatered = () => {
    if (this.props.lastWatered !== null) {
      const lastWatered = new Date(this.props.lastWatered).setHours(0, 0, 0, 0);
      const delta = new Date(Date.now()).setHours(0, 0, 0, 0) - lastWatered;
      return delta / (1000 * 60 * 60 * 24);
    }
    return NaN;
  }

  getWateredTagDangerLevel = (daysSinceLastWatered) => {
    if (daysSinceLastWatered < this.props.greenTagThreshold) {
      return "is-primary";
    } else if (daysSinceLastWatered < this.props.yellowTagThreshold) {
      return "is-warning";
    }
    return "is-danger";
  }

  editPlant = () => {
    if (this.props.onEdit !== null) {
      this.props.onEdit(this.props.id);
    }
  }

  renderLastWateredText = (lastWateredDays: number) => {
    if (isNaN(lastWateredDays)) {
      return <span className="tag is-danger">Never Watered</span>
    } else if (lastWateredDays === 0) {
      return <span className={"tag " + this.getWateredTagDangerLevel(lastWateredDays)}>Today</span>
    } else {
      return <span className={"tag " + this.getWateredTagDangerLevel(lastWateredDays)}>{lastWateredDays} days ago</span>
    }
  }

  toggleCalendar = () => {
    this.setState({ showCalendar: !this.state.showCalendar });
  }

  renderCalendar = () => {
    return <div className="card-content">
      <WaterCalendar
        plantId={this.props.id}
        warningThreshold={this.props.greenTagThreshold}
        dangerThreshold={this.props.yellowTagThreshold}
      />
    </div>
  }

  renderWaterCard = () => {
    const lastWateredDays = this.getDaysSinceLastWatered();
    return <>
      <div className="card-content">
        <div className="notification has-background-primary-dark has-text-white has-text-centered">
          <i className="fas fa-seedling plant-icon"></i>
        </div>
        <div className="tags has-addons">
          <span className="tag">Last Watered</span>
          {this.renderLastWateredText(lastWateredDays)}
        </div>
      </div>
      <div className="card-footer">
        <div className="card-footer-item">
          {
            (lastWateredDays > 0 || isNaN(lastWateredDays)) ?
              <a onClick={this.water}>Water Now</a> :
              <p className="has-text-grey">Water Now</p>
          }
        </div>
      </div>
    </>
  }

  renderCardContent = () => {
    if (this.state.showCalendar) {
      return this.renderCalendar();
    } else {
      return this.renderWaterCard();
    }
  }

  render = () => {
    return <div className="card">
      <header className="card-header">
        <p className="card-header-title">{this.props.plantName}
        </p>
        <a
          className="card-header-icon" aria-label="more options"
          onClick={() => this.toggleCalendar()}
        >
          <span className="icon">
            <i className="far fa-calendar" style={{ position: 'relative' }}></i>
          </span>
        </a>
        <a className="card-header-icon" aria-label="more options" onClick={() => this.editPlant()}>
          <span className="icon">
            <i className="fas fa-edit"></i>
          </span>
        </a>
      </header>
      {this.renderCardContent()}
      {this.state.isUpdating && <LoadingOverlay />}
    </div>
  }
}