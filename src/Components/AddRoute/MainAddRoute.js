import React, { Component } from 'react';
import { Tabs, Tab } from 'material-ui/Tabs';
import SwipeableViews from 'react-swipeable-views';
import NewRoute from './Route/NewRoute';

const styles = {
    headline: {
        fontSize: 24,
        paddingTop: 16,
        marginBottom: 12,
        fontWeight: 400,
    },
    slide: {
        padding: 10,
    },
};

class MainAddRoute extends Component {
    constructor(props) {
        super(props);
        this.state = {
            slideIndex: 0,
        };
    }

    handleChange = (value) => {
        this.setState({
            slideIndex: value,
        });
    };

    render() {
        return (
            <div>
                <Tabs
                    onChange={this.handleChange}
                    value={this.state.slideIndex}
                    >
                    <Tab label="Metro" value={0} />
                    <Tab label="RER" value={1} />
                    <Tab label="Tram" value={2} />
                    <Tab label="Bus" value={3} />
                </Tabs>
                <SwipeableViews
                    index={this.state.slideIndex}
                    onChangeIndex={this.handleChange}
                    >
                    <div style={styles.slide}>
                        <NewRoute transportType='metros'/>
                    </div>
                    <div style={styles.slide}>
                        <NewRoute transportType='rers'/>                        
                    </div>
                    <div style={styles.slide}>
                        <NewRoute transportType='tramways'/>                        
                    </div>
                    <div style={styles.slide}>
                        <NewRoute transportType='bus'/>                        
                    </div>
                </SwipeableViews>
            </div>
        );
    }
}

export default MainAddRoute;