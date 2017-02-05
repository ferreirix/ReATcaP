import React, { Component } from 'react';
import axios from 'axios';
import Avatar from 'material-ui/Avatar';
import ActionFlightTakeoff from 'material-ui/svg-icons/action/flight-takeoff';
import { Card, CardActions, CardHeader, CardText } from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import Chip from 'material-ui/Chip';
import './FavoritesStyle.css';
import AppConstants from '../../AppConstants';
import update from 'immutability-helper';
import {
    blue300,
    indigo900,
    orange200,
    deepOrange300,
    pink400,
    gray800,
    purple500,
} from 'material-ui/styles/colors';

const styleTransportType = {
    fontSize: 20,
};

const style = {
    margin: 5,
};

const iconStyles = {
    marginRight: 12,
    marginLeft: 12,
};

const chip = {
    margin: 4,
    display: 'inline-flex',
    marginLeft: 20
};


class Favorites extends Component {
    constructor(props) {
        super(props);
        this.state = {
            favorites: []
        }
    }

    componentWillMount() {

    }

    componentDidMount() {
        let i = 0,
            sKey;

        for (; sKey = window.localStorage.key(i); i++) {
            let storageKey = sKey;
            let url = window.localStorage.getItem(storageKey);
            console.log(AppConstants.ApiBaseUrl + url);
            axios.get(AppConstants.ApiBaseUrl + url).then((r) => {
                let fav = {
                    info: {
                        origin: r.data.response.informations.station.name,
                        destination: r.data.response.informations.destination.name,
                        type: r.data.response.informations.type,
                        line: r.data.response.informations.line,
                        url: url,
                        favKey: storageKey
                    },
                    schedules: r.data.response.schedules
                };
                let {favorites} = this.state;
                favorites.push(fav);
                this.setState(favorites);
            })
        }
    }




    removeRoute(favKey) {
        let {favorites} = this.state;
        let route = favorites.findIndex(f => f.info.favKey === favKey);
        favorites.splice(route, 1);
        this.setState({ favorites });
        localStorage.removeItem(favKey);
    }

    refreshRoute(favKey, url) {
        axios.get(AppConstants.ApiBaseUrl + url).then((r) => {
            let {favorites} = this.state;

            let routeIndex = favorites.findIndex(function (f) {
                return f.info.favKey === favKey;
            });

            let updatedFavorite = update(favorites[routeIndex], { schedules: { $set: r.data.response.schedules } });

            let newData = update(favorites, {
                $splice: [[routeIndex, 1, updatedFavorite]]
            });
            this.setState({ favorites: newData });
        });

    }

    render() {
        return (
            <div >
                {
                    this.state.favorites.map(f => {
                        return (
                            <Card className='cardStyle' key={f.info.favKey}>
                                <CardHeader
                                    actAsExpander={true}
                                    showExpandableButton={true}
                                    >
                                    <Avatar
                                        backgroundColor={gray800}
                                        size={20}
                                        className='fixLeftAlignLineType'
                                        style={styleTransportType}
                                        >
                                        {f.info.type.substr(0, 1).toUpperCase()}
                                    </Avatar>

                                    <Avatar
                                        backgroundColor={purple500}
                                        size={30}
                                        style={style}
                                        >
                                        {f.info.line}
                                    </Avatar>
                                    {f.info.origin}
                                    <br />
                                    {f.info.destination}
                                    <ActionFlightTakeoff style={iconStyles} />
                                    <Chip
                                        style={chip}
                                        >
                                        {
                                            f.schedules.length > 0 ?
                                                f.schedules[0].message : ''
                                        }
                                    </Chip>

                                </CardHeader>
                                <CardText expandable={true}>
                                    <br />
                                    {
                                        f.schedules.map(t => {
                                            return (
                                                <Chip
                                                    style={chip}
                                                    >
                                                    {t.message}
                                                </Chip>
                                            )
                                        })
                                    }
                                </CardText>
                                <CardActions>
                                    <FlatButton
                                        label="Refresh"
                                        onTouchTap={this.refreshRoute.bind(this, f.info.favKey, f.info.url)}
                                        />
                                    <FlatButton label="Remove" onTouchTap={this.removeRoute.bind(this, f.info.favKey)} />
                                </CardActions>
                            </Card>)
                    })
                }
            </div>
        );
    }
}

export default Favorites;