import React from 'react';

export default class PlantTile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isUpdating: false
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
          this.props.onPlantWatered();
        }
      })
      .catch(err => {
        console.error(err);
        this.setState({isUpdating: false});
      });
  }

  render = () => <div className="tile is-parent">
    <div className="tile is-child">
      <div className="card">
        <header className="card-header">
          <p className="card-header-title is-centered">{this.props.plantName}</p>
        </header>
        <div className="card-content">
          <div className="notification is-danger has-text-centered">
            <i className="fas fa-seedling plant-icon"></i>
          </div>
        </div>
        <div className="card-footer">
          <div className="card-footer-item is-unselectable has-text-light">
            <a onClick={this.water}>Water</a>
          </div>
          <div className="card-footer-item is-unselectable">
            <a>Edit</a>
          </div>
        </div>
        {this.state.isUpdating && <div className="is-overlay level has-text-centered disabled-overlay" style={{display: 'flex'}}>
            <div className="container has-text-centered" style={{display: 'flex', flexDirection: 'column', margin: 'auto'}}>
              <i class="fas fa-circle-notch fa-spin is-size-1 has-text-info"></i>
            </div>
        </div>}
      </div>
    </div>
  </div>
}

PlantTile.defaultProps = {onPlantWatered: null};