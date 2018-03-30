import React from 'react';
// import './Globe.css';

import GlobeVisual from './GlobeVisual';
import GlobeController from './GlobeController';

import * as THREE from 'three';
import * as d3 from 'd3';

var data = require('../data/t');
var data2 = require('../data/d');


class Globe extends React.Component {

  constructor(props){

    super(props);
    this.state = {

      color: new THREE.Color(0xffffff),
      imgDir: '../data/globe/',
      colorFn: (x) => {
        const c = new THREE.Color();
        c.setHSL( ( 0.6 - ( x * 0.5 ) ), 0.4, 0.4 ); // r,g,b
        // console.log(c);
        return c;
      },
      format: 'legend',
      name: null,
      animated: true,

    }

  }

  componentDidMount(){
    console.log("------ Globe mounted");

      const data_dict = data.map( (d) =>d[0] );

      for (let i=0;i<data.length;i++) {

        // TODO: data (fetched from API)
        // data add here
        this.gv.addData(data[i][1], {format: 'legend', name: data[i][0], animated: true} );
        // TODO interactive between data
        //addEventListener
        // $('#year'+data[i][0]).mouseover(data_transition(i));
      }

      this.gv.createPoints(data);
      this.gv.animate();

  }

  renderGlobeVisual(){
    console.count("---------- Globe's render called");

    return(
      <GlobeVisual
        opts = {{
          imgDir : this.state.imgDir,
          colorFn : this.state.colorFn,
          format: this.state.format,
          name: this.state.name,
          animated: this.state.animated,
        }}
        // using ref to accsss method from GlobeVisual
        ref = {(gv) => {
          console.log("------ Globe Got reference for GlobeVisual");
          return this.gv = gv;
        }}
      />
    )
  }

  renderGlobeController(){
    return (
      <GlobeController
          onClickFn = {() => this.controllerClicked()}
      />
    )
  }

  controllerClicked(){

    // console.log(this);
  }

  render(){
    return(
      <div className = 'globe'>
          {this.renderGlobeController()}
          {this.renderGlobeVisual()}
      </div>
    )
  }
}

export default Globe;