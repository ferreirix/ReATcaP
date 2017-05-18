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
import CircularProgress from 'material-ui/CircularProgress';
import GetRouteColor from '../../RouteColor';
import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';
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
            favorites: [],
            deleteFavoriteOpen: false,
        }
    }

    componentWillMount() {

    }

    componentDidMount() {
        let i = 0,
            sKey;

        for (; sKey = window.localStorage.key(i); i++) {
            let storageKey = sKey;
            let route = JSON.parse(window.localStorage.getItem(storageKey));

            console.log(AppConstants.ApiBaseUrl + route.url);

            axios.get(AppConstants.ApiBaseUrl + route.url).then((r) => {
                route.schedules = r.data;
                route.isRefreshing = false;
                let { favorites } = this.state;
                favorites.push(route);
                this.setState(favorites);
            })
        }
    }

    handleOpenDeleteModal() {
        this.setState({ deleteFavoriteOpen: true });
    };

    handleClose() {
        this.setState({ deleteFavoriteOpen: false });
    };

    handleDelete(favKey) {
        let { favorites } = this.state;
        let route = favorites.findIndex(f => f.favKey === favKey);
        favorites.splice(route, 1);
        this.setState({ favorites, "deleteFavoriteOpen": false });
        localStorage.removeItem(favKey);
    }

    removeRoute() {
        this.handleOpenDeleteModal();
    }

    refreshRoute(favKey, url) {
        let { favorites } = this.state;
        let routeIndex = favorites.findIndex(function (f) {
            return f.favKey === favKey;
        });
        let updatedFavoriteLoading = update(favorites[routeIndex], { isRefreshing: { $set: true } });

        let newDataRefresh = update(favorites, {
            $splice: [[routeIndex, 1, updatedFavoriteLoading]]
        });
        this.setState({ favorites: newDataRefresh });

        axios.get(AppConstants.ApiBaseUrl + url).then((r) => {

            let updatedFavorite = update(favorites[routeIndex], { schedules: { $set: r.data.response.schedules } });
            updatedFavorite.isRefreshing = false;
            let newData = update(favorites, {
                $splice: [[routeIndex, 1, updatedFavorite]]
            });
            this.setState({ favorites: newData });
        });

    }

    render() {

        const modalActions = [
            <FlatButton
                label="Cancel"
                primary={true}
                onTouchTap={this.handleClose.bind(this)}
            />,
            <FlatButton
                label="Delete"
                secondary={true}
                onTouchTap={this.handleDelete.bind(this)}
            />,
        ];

        return (
            <div >
                {
                    this.state.favorites.map(f => {
                        return (
                            <Card className='cardStyle' key={f.favKey}>
                                <CardHeader
                                    actAsExpander={true}
                                    showExpandableButton={true}
                                >
                                    <Avatar
                                        size={20}
                                        src={AppConstants.ApiBaseUrl + f.image}
                                        className='fixLeftAlignLineType'
                                        style={styleTransportType}
                                    >
                                    </Avatar>
                                    {f.origin}
                                    <br />
                                    {f.destination}
                                    <ActionFlightTakeoff style={iconStyles} />
                                    <Chip
                                        style={chip}
                                    >
                                        {
                                            f.schedules.length > 0 ?
                                                f.schedules[0].message : ''
                                        }
                                    </Chip>
                                    {
                                        f.isRefreshing ?
                                            <CircularProgress size={30} className="refreshCircular" /> : ''
                                    }
                                </CardHeader>
                                <CardText expandable={true}>
                                    <br />
                                    {
                                        f.schedules.map(t => {
                                            return (
                                                <Chip
                                                    style={chip}
                                                >
                                                    {t}
                                                </Chip>
                                            )
                                        })
                                    }
                                </CardText>
                                <CardActions>
                                    <FlatButton
                                        label="Refresh"
                                        onTouchTap={this.refreshRoute.bind(this, f.favKey, f.url)}
                                    />
                                    <FlatButton label="Remove" onTouchTap={this.removeRoute.bind(this, f.favKey)} />
                                </CardActions>
                            </Card>)
                    })
                }
                <Dialog
                    actions={modalActions}
                    modal={false}
                    open={this.state.deleteFavoriteOpen}
                    onRequestClose={this.handleClose}
                >
                    Delete favorite route?
        </Dialog>

            </div>
        );
    }
}

export default Favorites;