import React, { Component } from 'react';
import FontIcon from 'material-ui/FontIcon';
import { BottomNavigation, BottomNavigationItem } from 'material-ui/BottomNavigation';
import Paper from 'material-ui/Paper';
import IconLocationOn from 'material-ui/svg-icons/communication/location-on';
import Favorites from './Favorites/Favorites';
import AddRoute from './AddRoute/AddRoute';
import './App.css'

const favoritesIcon = <FontIcon className="material-icons">favorite</FontIcon>;
const nearbyIcon = <IconLocationOn />;
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
    return (
      <Paper zDepth={1} style={paperStyle}>

        {this.state.selectedIndex == 0 ? <Favorites /> : <AddRoute />}

        <BottomNavigation selectedIndex={this.state.selectedIndex} className='footer' >
          <BottomNavigationItem
            label="Favorites"
            icon={favoritesIcon}
            onTouchTap={() => this.select(0)}
            />
          <BottomNavigationItem
            label="Nearby"
            icon={nearbyIcon}
            onTouchTap={() => this.select(1)}
            />
        </BottomNavigation >
      </Paper >
    );
  }
}


export default App;
