import React, { Component } from 'react';
import axios from 'axios';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import Divider from 'material-ui/Divider';
import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton';
import "./NewMetro.css";
import RaisedButton from 'material-ui/RaisedButton';
import AppConstants from '../../../AppConstants';


const styles = {
    block: {
        maxWidth: 250,
    },
    radioButton: {
        marginBottom: 16,
    },
};

class AddMetro extends Component {
    constructor(props) {
        super(props);
        this.state = {
            metros: [],
            selectedMetroId: 0,
            selectedDestinationId: 0,
            destinations: [],
            stations: [],
        }
    }

    componentDidMount() {
        axios.get(AppConstants.ApiBaseUrl + this.props.transportType).then(r => {
            this.setState({ metros: r.data.response[this.props.transportType] });
        })
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

    handleChangeDestination = (e, i, value) => {
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
            this.state.selectedDestinationId + '?destination=' +
            this.state.destinations[0].id);
    }

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

                <RadioButtonGroup name="notRight" labelPosition="left" style={styles.block}>
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
                    value={this.state.selectedDestinationId}
                    onChange={this.handleChangeDestination}
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

            </div>
        );
    }
}

export default AddMetro;