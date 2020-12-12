import React from 'react';

interface plantFormProps {
    plantId: number;
    submitUrl: string;
    updateMethod: string;
    onSubmit?: (plantId: number) => any;
}

interface plantFormState {
    isLoading: boolean;
    name: string;
    warningThreshold: number;
    dangerThreshold: number;
    isSubmitting: boolean;
}

declare const Urls: any;
declare const csrftoken: string;

export default class PlantEditForm extends React.Component<plantFormProps, plantFormState> {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            name: "",
            warningThreshold: 0,
            dangerThreshold: 0,
            isSubmitting: false
        }
    }

    public static defaultProps = {
        onSubmit: plantId => null
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

    componentDidMount = () => { this.fetchForm() }

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
                    throw new Error("Error watering plant");
                }
            })
            .then(() => {
                this.props.onSubmit!(this.props.plantId);
            })
            .catch(err => {
                console.error(err);
            });
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
        <label className="label">Warning Threshold:</label>
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
            <div className={this.addLoadingClass("control is-expanded")}>
                <input
                    className="slider is-warning is-fullwidth"
                    type="range"
                    step="1"
                    min="1"
                    max="30"
                    value={this.state.warningThreshold}
                    onChange={event => this.setWarningThreshold(parseInt(event.target.value))}
                />
            </div>
        </div>
        <label className="label">Danger Threshold:</label>
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
            <div className={this.addLoadingClass("control is-expanded")}>
                <input
                    className="slider is-danger is-fullwidth"
                    type="range"
                    step="1"
                    min="1"
                    max="30"
                    value={this.state.dangerThreshold}
                    onChange={event => this.setDangerThreshold(parseInt(event.target.value))}
                />
            </div>
        </div>
        <div className="field is-grouped is-grouped-centered">
            <div className="control">
                <button
                    className={"button is-link " + (this.state.isSubmitting ? " is-loading" : "")}
                    onClick={() => this.submitForm()}
                >
                    Submit
                </button>
            </div>
        </div>
    </div>
}