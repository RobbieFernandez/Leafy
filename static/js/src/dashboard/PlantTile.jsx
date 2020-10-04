import React from 'react';
import {LoadingOverlay} from './LoadingOverlay';

export default class PlantTile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isUpdating: false,
      lastWatered: this.props.lastWatered
    };
  }

  water = () => {
    this.setState({isUpdating: true});
    window
      .fetch(
        this.props.waterUrl,
        {
          method: 'POST',
          body: JSON.stringify({plantId: this.props.id}),
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
        this.setState({isUpdating: false});
        if (this.props.onPlantWatered !== null) {
          this.props.onPlantWatered(this.props.id);
        }
      })
      .catch(err => {
        console.error(err);
        this.setState({isUpdating: false});
      });
  }

  getDaysSinceLastWatered = () => {
    if (this.props.lastWatered !== null) {
      const lastWatered = new Date(Date.parse(this.props.lastWatered)).setHours(0, 0, 0, 0);
      const delta = new Date(Date.now()).setHours(0, 0, 0, 0) - lastWatered;
      return delta / (1000 * 60 * 60 * 24);
    }
    return NaN;
  }

  getWateredTagDangerLevel = (daysSinceLastWatered) => {
    if (daysSinceLastWatered < this.props.greenTagThreshold) {
      return "is-success";
    } else if (daysSinceLastWatered < this.props.yellowTagThreshold) {
      return "is-warning";
    }
    return "is-danger";
  }

  render = () => {
    const lastWateredDays = this.getDaysSinceLastWatered();
    return <div className="tile is-parent">
      <div className="tile is-child">
        <div className="card">
          <header className="card-header">
            <p className="card-header-title is-centered">{this.props.plantName}</p>
          </header>
          <div className="card-content">
            <div className="notification is-primary has-text-centered">
              <i className="fas fa-seedling plant-icon"></i>
            </div>
            <div className="tags has-addons">
              <span className="tag">Last Watered</span>
              {
                isNaN(lastWateredDays) ?
                  <span className="tag is-danger">Never Watered</span> :
                  <span className={"tag " + this.getWateredTagDangerLevel(lastWateredDays)}>{lastWateredDays} days ago</span>
              }
            </div>
          </div>
          <div className="card-footer">
            <div className="card-footer-item is-unselectable has-text-light">
              <a onClick={this.water}>Water Now</a>
            </div>
          </div>
          {this.state.isUpdating && <LoadingOverlay />}
        </div>
      </div>
    </div>
  }
}

PlantTile.defaultProps = {
  onPlantWatered: null,
  greenTagThreshold: 3,
  yellowTagThreshold: 10
};