import React from "react";
import Gradient from "javascript-color-gradient";
import DayPicker from 'react-day-picker';
import 'react-day-picker/lib/style.css';

import { LoadingOverlay } from "../layout/LoadingOverlay";
// import * as colours from "../sass/base.scss";

declare const Urls: any;

interface waterCalendarProps {
    month?: Date;
    warningThreshold: number;
    dangerThreshold: number;
    plantId: number;
}

interface waterCalendarState {
    loading: boolean;
    month: Date;
    wateredOnDays: number[];
}

const GREEN = "#4bc800";
const YELLOW = "#ffdd57";
const RED = "#ff3860";

export default class WaterCalendar extends React.Component<waterCalendarProps, waterCalendarState> {
    constructor(props: waterCalendarProps) {
        super(props);

        this.state = {
            loading: false,
            month: props.month === undefined ? new Date() : props.month,
            wateredOnDays: []
        }
    }

    componentDidMount = () => this.getWaterDays();


    onMonthChange = (month: Date) => {
        this.setState(
            { month: month },
            this.getWaterDays
        );
    }

    getWaterUrl = () => {
        const url = Urls.plantWateredDays(this.props.plantId);
        const searchParams = new URLSearchParams();
        searchParams.append("year", this.state.month.getFullYear().toString());
        searchParams.append("month", (this.state.month.getMonth() + 1).toString());
        return url + "?" + searchParams.toString();
    }

    getWaterDays = async () => {
        this.setState({ loading: true });
        console.log(this.state.month);

        try {
            const response = await window.fetch(
                this.getWaterUrl()
            )
            if (response.ok) {
                const responseData = await response.json();
                this.setState({
                    loading: false,
                    wateredOnDays: responseData.wateredOnDays
                });
            } else {
                this.setState({ loading: false })
            }
        } catch (err) {
            console.error(err);
            this.setState({ loading: false });
        }

    }

    getDayColour = (day: Date) => {
        const today = new Date();

        if (day > today) {
            return "#dddddd"
        }

        const dayOfTheMonth = day.getDate();
        const reverseWateredDays = [...this.state.wateredOnDays].reverse();
        const lastWateringDay = reverseWateredDays.find(wateredDay => wateredDay <= dayOfTheMonth)!;

        if (this.state.loading) {
            return "#ffffff";
        }

        if (lastWateringDay !== undefined) {
            const daysSinceWatering = dayOfTheMonth - lastWateringDay;

            if (daysSinceWatering == 0) {
                return GREEN;
            }

            if (daysSinceWatering < this.props.dangerThreshold) {
                const gradient = new Gradient();

                if (daysSinceWatering < this.props.warningThreshold) {
                    gradient.setGradient(
                        GREEN,
                        YELLOW,
                    );
                    gradient.setMidpoint(this.props.warningThreshold);
                } else if (daysSinceWatering === this.props.warningThreshold) {
                    return YELLOW;
                } else {
                    gradient.setGradient(
                        YELLOW,
                        RED,
                    );
                    gradient.setMidpoint(this.props.dangerThreshold);
                }
                return gradient.getColor(daysSinceWatering);
            }
            return RED;
        }
        return RED;
    }

    renderDay = (day: Date) => <div style={{ backgroundColor: this.getDayColour(day) }}>
        {day.getDate()}
    </div>

    render = () => {
        return <div className="water-calendar-wrapper">
            <DayPicker
                month={this.state.month}
                onMonthChange={this.onMonthChange}
                renderDay={this.renderDay}
            />
            {this.state.loading && <LoadingOverlay />}
        </div>
    }
}