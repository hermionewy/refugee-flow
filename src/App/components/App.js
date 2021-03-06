import React from 'react';
import * as THREE from 'three';
import * as d3 from 'd3';
import { injectGlobal } from 'styled-components';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

import Navbar from './Navbar'
import ModalButton from './ModalButton'
import Landing from './Landing'
import War from './War'
import RefugeeRoute from './RefugeeRoute'

class App extends React.Component {

  render(){
    injectGlobal`
      html  body {
        width: 100%;
        height: 100%;
        margin: 0;
        background-color: #1b1f3a;
        font-size: 100%;
        overflow-y: hidden;
        overflow-x: hidden;
      }
    `;

    return (
            <Router>
              <div>
                <Navbar />
                <Switch>
                  <Route exact path='/' component={Landing} />
                  <Route path='/war' component={War} />
                  <Route path='/route' component={RefugeeRoute} />
                </Switch>
              </div>
            </Router>

    );
  }
}

export default App;
