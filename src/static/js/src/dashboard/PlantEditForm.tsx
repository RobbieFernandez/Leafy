import React from 'react';
import TooltipLabel from "../forms/TooltipLabel";

interface plantFormOptionalProps {
  allowDelete: boolean;
  onDelete: (plantId: number) => any;
  plantId: number | null;
}

interface plantFormProps extends plantFormOptionalProps {
  submitUrl: string;
  updateMethod: string;
  onSubmit: (plantId: number) => any;
}

interface plantFormState {
  isLoading: boolean;
  name: string;
  warningThreshold: number;
  dangerThreshold: number;
  isSubmitting: boolean;
  isDeleting: boolean;
}

interface plantResponse {
  message: string;
  plantId: number;
}

declare const Urls: any;
declare const csrftoken: string;

export default class PlantEditForm extends React.Component<plantFormProps, plantFormState> {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: this.props.plantId !== null,
      name: "",
      warningThreshold: 0,
      dangerThreshold: 0,
      isSubmitting: false,
      isDeleting: false
    }
  }

  public static defaultProps: plantFormOptionalProps = {
    plantId: null,
    allowDelete: false,
    onDelete: () => null
  }


  fetchForm = () => {
    this.setState({ isLoading: true });
    window
      .fetch(Urls.plantDetails(this.props.plantId))
      .then(res => res.json())
      .then(data => this.setState(
        {
          name: data.name,
          warningThreshold: data.warning_threshold,
          dangerThreshold: data.danger_threshold,
          isLoading: false
        }
      ))
      .catch(() => this.setState({ isLoading: false }));
  }

  componentDidMount = () => {
    if (this.props.plantId !== null) {
      this.fetchForm();
    }
  }

  addLoadingClass = (className: string) => className + (this.state.isLoading ? " is-loading" : "")

  setWarningThreshold = (value: number) => {
    let danger = this.state.dangerThreshold;
    if (value > danger) {
      danger = value;
    }
    this.setState({ warningThreshold: value, dangerThreshold: danger })
  }

  setDangerThreshold = (value: number) => {
    let warning = this.state.warningThreshold;
    if (value < warning) {
      warning = value;
    }
    this.setState({ warningThreshold: warning, dangerThreshold: value })
  }

  submitForm = () => {
    this.setState({ isSubmitting: true })
    window
      .fetch(
        this.props.submitUrl,
        {
          method: this.props.updateMethod,
          body: JSON.stringify({
            name: this.state.name,
            warning_threshold: this.state.warningThreshold,
            danger_threshold: this.state.dangerThreshold
          }),
          headers: {
            'X-CSRFToken': csrftoken,
            'Content-Type': 'application/json'
          }
        },
      )
      .then(response => {
        this.setState({ isSubmitting: false })
        if (!response.ok) {
          throw new Error("Error updating plant");
        }
        return response.json();
      }).then((data: plantResponse) => {
        this.props.onSubmit(data.plantId);
      })
      .catch(err => {
        console.error(err);
      });
  }

  deletePlant = async () => {
    this.setState({ isDeleting: true });
    await this.props.onDelete(this.props.plantId!);
    this.setState({ isDeleting: false });
  }

  confirmDelete = () => {
    if (confirm("Are you sure you want to delete this plant?")) {
      this.deletePlant()
    }
  }

  formIsValid = () => {
    return (
      this.state.name !== "" &&
      this.state.warningThreshold > 0 &&
      this.state.dangerThreshold >= this.state.warningThreshold
    )
  }

  render = () => <div>
    <label className="label">Name:</label>
    <div className="field">
      <div className={this.addLoadingClass("control")}>
        <input
          className="input"
          type="text"
          value={this.state.name}
          onChange={event => this.setState({ name: event.target.value })}
        />
      </div>
    </div>
    <TooltipLabel
      label={"Warning Threshold:"}
      tooltipText={"The plant will enter a 'warning' state after not being watered for this many days."}
    />
    <div className="field is-grouped">
      <div className={this.addLoadingClass("control")}>
        <input
          className="input"
          type="number"
          min="1"
          max="30"
          value={this.state.warningThreshold}
          onChange={event => this.setWarningThreshold(parseInt(event.target.value))}
        />
      </div>
      <div className={"control is-expanded"}>
        <input
          className="slider is-warning is-fullwidth"
          type="range"
          step="1"
          min="1"
          max="30"
          disabled={this.state.isLoading}
          value={this.state.warningThreshold}
          onChange={event => this.setWarningThreshold(parseInt(event.target.value))}
        />
      </div>
    </div>
    <TooltipLabel
      label={"Danger Threshold:"}
      tooltipText={"The plant will enter a 'danger' state after not being watered for this many days."}
    />
    <div className="field is-grouped">
      <div className={this.addLoadingClass("control")}>
        <input
          className="input"
          type="number"
          min="1"
          max="30"
          value={this.state.dangerThreshold}
          onChange={event => this.setDangerThreshold(parseInt(event.target.value))}
        />
      </div>
      <div className={"control is-expanded"}>
        <input
          className="slider is-danger is-fullwidth"
          type="range"
          step="1"
          min="1"
          max="30"
          value={this.state.dangerThreshold}
          disabled={this.state.isLoading}
          onChange={event => this.setDangerThreshold(parseInt(event.target.value))}
        />
      </div>
    </div>
    <div className="field is-grouped is-grouped-centered">
      <div className="control">
        <button
          disabled={this.state.isLoading || !this.formIsValid()}
          className={"button is-link " + (this.state.isSubmitting ? " is-loading" : "")}
          onClick={() => this.submitForm()}
        >
          Submit
        </button>
      </div>
      {this.props.allowDelete && this.props.plantId !== null && <div className="control">
        <button
          disabled={this.state.isLoading}
          className={"button is-danger" + (this.state.isDeleting ? " is-loading" : "")}
          onClick={this.confirmDelete}
        >
          Delete
        </button>
      </div>}
    </div>
  </div>
}