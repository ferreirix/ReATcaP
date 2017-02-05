import React, { Component } from 'react';
import { BottomNavigation, BottomNavigationItem } from 'material-ui/BottomNavigation';
import Paper from 'material-ui/Paper';
import IconTrain from 'material-ui/svg-icons/maps/directions-subway';
import IconFavorite from 'material-ui/svg-icons/action/favorite';
import IconServiceStatus from 'material-ui/svg-icons/alert/error';
import Favorites from './Favorites/Favorites';
import MainAddRoute from './AddRoute/MainAddRoute';
import ServiceStatus from './ServiceStatus/ServiceStatus';
import './App.css'

const nearbyIcon = <IconTrain />;
const favoriteIcon = <IconFavorite />;
const serviceStatus = <IconServiceStatus />;
const paperStyle = {
  backgroundColor: 'transparent'
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedIndex: 0,
    }
  }

  select = (index) => this.setState({ selectedIndex: index });

  render() {

    let viewToDisplay = null;
    switch (this.state.selectedIndex) {
      case 0:
        viewToDisplay = <Favorites />;
        break;
      case 1:
        viewToDisplay = <MainAddRoute />
        break;
      case 2:
        viewToDisplay = <ServiceStatus />
        break;
      default:
        break;
    }


    return (
      <Paper zDepth={1} style={paperStyle}>
        {viewToDisplay}
        <BottomNavigation selectedIndex={this.state.selectedIndex} className='footer' >
          <BottomNavigationItem
            label="Favorites"
            icon={favoriteIcon}
            onTouchTap={() => this.select(0)}
            />
          <BottomNavigationItem
            label="Routes"
            icon={nearbyIcon}
            onTouchTap={() => this.select(1)}
            />

          <BottomNavigationItem
            label="Status"
            icon={serviceStatus}
            onTouchTap={() => this.select(2)}
            />
        </BottomNavigation>
      </Paper>
    );
  }
}


export default App;
