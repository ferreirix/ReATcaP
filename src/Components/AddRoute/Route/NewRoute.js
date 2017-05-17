import React, { Component } from 'react';
import axios from 'axios';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import Divider from 'material-ui/Divider';
import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton';
import "./NewRoute.css";
import RaisedButton from 'material-ui/RaisedButton';
import AppConstants from '../../../AppConstants';
import Snackbar from 'material-ui/Snackbar';


const styles = {
    block: {
        maxWidth: 250,
    },
    radioButton: {
        marginBottom: 16,
    },
};

const defaultState = {
    metros: [],
    selectedMetroId: 0,
    selectedDepartureId: 0,
    selectedDestinationId: 0,
    selectedDepartureName: '',
    selectedDestinationName: '',
    destinations: [],
    stations: [],
    snackOpened: false
}

class AddMetro extends Component {
    constructor(props) {
        super(props);
        this.state = defaultState;
    }

    componentDidMount() {
        axios.get(AppConstants.ApiBaseUrl + "lines/" + this.props.transportType).then(r => {
            console.log(r);
            this.setState({
                metros: r.data,
            });
        });
        console.log('snack status : ' + this.state.snackOpened);
    }

    handleChangeLine = (event, index, value) => {
        axios.get(AppConstants.ApiBaseUrl + "directions/" + value).then(r => {
            this.setState(
                {
                    destinations: r.data
                }
            );
        });

        axios.get(AppConstants.ApiBaseUrl + "stations/" + value).then(r => {
            this.setState(
                {
                    selectedMetroId: value,
                    stations: r.data
                }
            );
        });
    }

    handleChangeDeparture = (e, i, value) => {
        this.setState(
            {
                selectedDepartureId: value,
            }
        );
    }

    destinationChanged(e, value) {
        this.setState(
            {
                selectedDestinationId: value,
            }
        );
    }

    addToFavorites() {
        let key = 'fav_' + Math.random().toString(36).substring(7);

        let route = {};
        route.url = 'missions/' +
            this.state.selectedMetroId + '/from/' +
            this.state.selectedDepartureId + '/way/' +
            this.state.selectedDestinationId;

            route.origin =
            route.destination = 
            route.type = this.props.transportType;
            route.line = this.state.selectedMetroId;

        localStorage.setItem(key, JSON.stringify(route));

        let newState = defaultState;
        newState.snackOpened = true;
        console.log('snack status : ' + newState.snackOpened);
        this.setState(newState);
        console.log('snack status : ' + this.state.snackOpened);
    };



    handleRequestCloseSnack() {
        this.setState({
            snackOpened: false,
        });
    };

    handleUndoAddRoute() {
        //TODO
    };

    render() {


        return (
            <div className="NewMetroForm">
                <SelectField
                    floatingLabelText="Line"
                    value={this.state.selectedMetroId}
                    onChange={this.handleChangeLine}
                >

                    {
                        this.state.metros.map(m => {
                            return <MenuItem key={m.id} value={m.id} primaryText={"Ligne " + m.shortName} />
                        })
                    }

                </SelectField>

                <br />
                <p>Destination </p>

                <RadioButtonGroup
                    name="notRight"
                    labelPosition="left"
                    onChange={this.destinationChanged.bind(this)}
                    style={styles.block}>
                    {
                        this.state.destinations.map(d => {
                            return <RadioButton
                                key={d.way}
                                value={d.way}
                                label={d.name}
                                style={styles.radioButton}
                            />
                        })
                    }
                </RadioButtonGroup>

                <br />

                <SelectField
                    floatingLabelText="Departure"
                    value={this.state.selectedDepartureId}
                    onChange={this.handleChangeDeparture}
                    maxHeight={200}
                >
                    {
                        this.state.stations.map(s => {
                            return <MenuItem key={s.id} value={s.id} primaryText={s.name} />
                        })
                    }

                </SelectField>

                <RaisedButton
                    onTouchTap={this.addToFavorites.bind(this)}
                    label="Add to favorites"
                    fullWidth={true} />

                <Snackbar
                    open={this.state.snackOpened}
                    message='Route created!'
                    action="Undo"
                    autoHideDuration={4000}
                    onActionTouchTap={this.handleUndoAddRoute.bind(this)}
                    onRequestClose={this.handleRequestCloseSnack.bind(this)}
                />

            </div>
        );
    }
}

export default AddMetro;