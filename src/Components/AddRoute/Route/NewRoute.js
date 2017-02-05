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
    selectedDestinationId : 0,
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
        axios.get(AppConstants.ApiBaseUrl + this.props.transportType).then(r => {
            this.setState({
                metros: r.data.response[this.props.transportType],
            });
        });
        console.log('snack status : ' + this.state.snackOpened);
    }

    handleChange = (event, index, value) => {
        let {destinations} = this.state.metros[index];
        let stations;

        axios.get(AppConstants.ApiBaseUrl + this.props.transportType + "/" + value + "/stations").then(r => {
            stations = r.data.response.stations;
            this.setState(
                {
                    selectedMetroId: value,
                    destinations: destinations,
                    stations: stations
                }
            );
        })
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
        localStorage.setItem(key,
            this.props.transportType + '/' +
            this.state.selectedMetroId + '/' + 'stations/' +
            this.state.selectedDepartureId + '?destination=' +
            this.state.selectedDestinationId);

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
                    onChange={this.handleChange}
                    >

                    {
                        this.state.metros.map(m => {
                            return <MenuItem key={m.line} value={m.line} primaryText={"Ligne " + m.line} />
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
                                key={d.id}
                                value={d.id}
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