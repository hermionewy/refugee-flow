import React from 'react';
// import style from './GlobeVisual.css'
import * as d3 from 'd3';
import * as THREE from 'three';

class GlobeVisual extends React.Component{
  constructor(props){
    super(props);

    // this.init = this.init.bind(this);
    this.animate = this.animate.bind(this);
    this.addPoint = this.addPoint.bind(this);
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
    this.onMouseOut = this.onMouseOut.bind(this);
    this.onMouseWheel = this.onMouseWheel.bind(this);
    this.onDocumentKeyDown = this.onDocumentKeyDown.bind(this);
    this.onWindowResize = this.onWindowResize.bind(this);
    this.zoom = this.zoom.bind(this);
  }

  componentDidMount(){
    console.log("------ GlobeVisual mounted");

    // opts, also passed in on .adddata() from other component
    this.opts = this.props.opts || {
      imgDir : './globe/',
      colorFn: (x) => {
        const c = new THREE.Color();
        c.setHSL( ( 0.6 - ( x * 0.5 ) ), 0.4, 0.4 ); // r,g,b
        // console.log(c);
        return c;
      }
    };

    // shader collection
    this.Shaders = {
        'earth' : {
          uniforms: {
            'texture': { type: 't', value: null }
          },
          vertexShader: [
            'varying vec3 vNormal;',
            'varying vec2 vUv;',
            'void main() {',
              'gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );',
              'vNormal = normalize( normalMatrix * normal );',
              // UV简单的说就是贴图在模型上的坐标位置
              // example: https://threejs.org/examples/?q=uv#misc_uv_tests
              'vUv = uv;',
            '}'
          ].join('\n'),
          fragmentShader: [
            'uniform sampler2D texture;',
            'varying vec3 vNormal;',
            'varying vec2 vUv;',
            'void main() {',
              //diffuse is actually apply texture(apply globe img to geometry)
              'vec3 diffuse = texture2D( texture, vUv ).xyz;',
              // intensity provide lighting
              'float intensity = 1.02 - dot( vNormal, vec3( 0.0, 0.0, 1.0 ) );',
              // color of atmosphere
              'vec3 atmosphere = vec3( 0.423, 0.423, 0.654 ) * pow( intensity, 3.0 );',
              // 这里的atomosphere指的是地球内发光
              'gl_FragColor = vec4( diffuse + atmosphere, 1.0 );',
            '}'
          ].join('\n')
        },

        'atmosphere' : {
          uniforms: {},
          vertexShader: [
            'varying vec3 vNormal;',
            'void main() {',
              'vNormal = normalize( normalMatrix * normal );',
              'gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );',
            '}'
          ].join('\n'),
          fragmentShader: [
            'varying vec3 vNormal;',
            'void main() {',
              //  0.75 provide the best shading (maybe)
              // LAST value 缩小光晕
              'float intensity = pow( 0.75 - dot( vNormal, vec3( 0, 0, 1.0 ) ), 14.0 );',
              // vec4 is the color
              'gl_FragColor = vec4( 0.254, 0.929, 0.721, 1.0 ) * intensity;',

            '}'
          ].join('\n')
        }
      };

    // raycaster & tootips_mouseoverFeedback
    this.raycaster = new THREE.Raycaster();
    this.raycasterMouse = new THREE.Vector2();
    this.tootips_mouseoverFeedback = new THREE.Mesh(new THREE.BoxGeometry(2, 2, 1), new THREE.MeshBasicMaterial({color: 0xffffff}) );
    this.tootips_mouseoverFeedback.name = 'raycast-mouseover';

    //
    this.curZoomSpeed = 0;
    this.zoomSpeed = 50;

    //
    this.mouse = { x: 0, y: 0 };
    this.mouseOnDown = { x: 0, y: 0 };
    this.rotation = { x: 0, y: 0 };
    this.target = { x: Math.PI*3/2, y: Math.PI / 6.0 }
    this.targetOnDown = { x: 0, y: 0 };

    //
    this.distance = 100000
    this.distanceTarget = 100000;
    this.padding = 40;

    //
    const PI_HALF = Math.PI / 2;
    this.PI_HALF = PI_HALF;

    //
    this.init()

  }




  componentWillUnmount() {
    // TODO: delete stuff after unmount
  }

  init() {
    var shader, uniforms, material;

    const w = this.mount.offsetWidth || window.innerWidth;
    const h = this.mount.offsetHeight || window.innerHeight;

    this.camera = new THREE.PerspectiveCamera(30, w / h, 1, 10000);

    this.camera.position.z = this.distance;


    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color( 0x111116 );

    //if segments are less, the line will go off the surface of the geometry
    var geometry = new THREE.SphereGeometry(200, 100, 100);

    //construct globe
    shader = this.Shaders['earth'];
    uniforms = THREE.UniformsUtils.clone(shader.uniforms);
    uniforms['texture'].value = new THREE.TextureLoader().load(this.opts.imgDir+'world.jpg');
    material = new THREE.ShaderMaterial({
      uniforms: uniforms,
      vertexShader: shader.vertexShader,
      fragmentShader: shader.fragmentShader
    });

    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.rotation.y = Math.PI;
    this.scene.add(this.mesh);

    // switch to "atomosphere"
    shader = this.Shaders['atmosphere'];
    uniforms = THREE.UniformsUtils.clone(shader.uniforms);
    material = new THREE.ShaderMaterial({
          uniforms: uniforms,
          vertexShader: shader.vertexShader,
          fragmentShader: shader.fragmentShader,
          side: THREE.BackSide,
          blending: THREE.AdditiveBlending,
          transparent: true
        });

    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.scale.set( 1.1, 1.1, 1.1 );
    this.scene.add(this.mesh);

    //switch to "data points"
    geometry = new THREE.BoxGeometry(0.75, 0.75, 1);
    // 为了让数据条不往里纵深， 因为boxGeometry在基平面两侧延伸？
    geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0,0,-0.5));
    this.point = new THREE.Mesh(geometry);

    // raycasting
    this.scene.add(this.tootips_mouseoverFeedback);

    this.mount.addEventListener('mousemove', e =>{
      e.preventDefault();

      this.raycasterMouse.x = ( e.clientX / parseInt(this.mount.style.width) ) * 2 - 1;
      this.raycasterMouse.y = - ( e.clientY / parseInt(this.mount.style.height) ) * 2 + 1;

      // console.log(e.clientX , e.clientY);
      // console.log(this.raycasterMouse.x , this.raycasterMouse.y);
      // console.log("---------------");

    })

    this.renderer = new THREE.WebGLRenderer({antialias: true});
    this.renderer.setSize(w, h);
    this.mount.appendChild(this.renderer.domElement);

    this.mount.addEventListener('mousedown', this.onMouseDown, false);
    this.mount.addEventListener('mousewheel', this.onMouseWheel, false);

    this.mount.addEventListener('keydown', this.onDocumentKeyDown, false);

    this.mount.addEventListener('mouseover', () => {
      this.overRenderer = true;
    }, false);

    this.mount.addEventListener('mouseout', ()=> {
      this.overRenderer = false;
    }, false);


  }

  addData(data, _opts) {
    var lat, lng, size, color, step, colorFnWrapper;

    this.opts.animated = _opts.animated;
    this.is_animated = _opts.animated;
    this.opts.format = _opts.format || 'magnitude'; // other option is 'legend'
    this.opts.name = _opts.name;

    if(this.opts.format === 'magnitude'){
      step = 3;
      colorFnWrapper = (data,i) => this.opts.colorFn(data[i+2])
    } else if ( this.opts.format === 'legend') {
      step = 4;
      colorFnWrapper = (data, i) => this.opts.colorFn(data[i+2]);
    } else {
      throw('error: format not supported: '+ this.opts.format);
    }

    if(this.opts.animated) {

      if(this._baseGeometry === undefined) {

        this._baseGeometry = new THREE.Geometry();
        for (let i = 0; i < data.length; i+= step) {
          lat = data[i];
          lng = data[i + 1];
          color = colorFnWrapper(data,i);
          // baseGeo 没有高度
          // merge point to _baseGeometry(_baseGeometry is the one we using to do animation, data bar etc)
          this.addPoint(lat, lng, null, color, this._baseGeometry);
        }
      }
    }


    var subgeo = new THREE.Geometry();

    for (let i = 0; i < data.length; i += step) {
      lat = data[i];
      lng = data[i + 1];
      color = colorFnWrapper(data,i);
      size = data[i + 2];
      // set size of the bar
      size = size*200;
      this.addPoint(lat, lng, size, color, subgeo);
    }

    if (this.opts.animated) {
      // morphTargets use to do animation
      // target to the data contains height value
      // (第一步的addPoint是没高度数据的，第二步的subgeo是有高度数据的)
      this._baseGeometry.morphTargets.push({'name': this.opts.name, vertices: subgeo.vertices});
    }
    else {
      this._baseGeometry = subgeo;
    }

  }// addData

  addPoint(lat, lng, size, color, subgeo) {

    // equirectangular map projection
    const phi = (90 - lat) * Math.PI / 180;
    const theta = (180 - lng) * Math.PI / 180;
    //make point at the surface, but lengh will be extend to both side if no matrix transformation
    this.point.position.x = 200 * Math.sin(phi) * Math.cos(theta);
    this.point.position.y = 200 * Math.cos(phi);
    this.point.position.z = 200 * Math.sin(phi) * Math.sin(theta);

    // Rotates the geometry to face point in space
    this.point.lookAt(this.mesh.position);

    this.point.scale.z = Math.max( size, 0.1 ); // avoid non-invertible matrix

    // point.updateMatrix();

    for (var i = 0; i < this.point.geometry.faces.length; i++) {
      // color for every faces
      this.point.geometry.faces[i].color = color;
    }
    if(this.point.matrixAutoUpdate){
      this.point.updateMatrix();
    }


    subgeo.merge(this.point.geometry, this.point.matrix);

  }

  createPoints(userData) {
    // _baseGeometry is then transform to 'points' to do visualization
    if (this._baseGeometry !== undefined) {
      if (this.is_animated === false) {
        //
        // this.points = new THREE.Mesh(this._baseGeometry, new THREE.MeshBasicMaterial({
        //       color: 0xffffff,
        //       vertexColors: THREE.FaceColors,
        //       morphTargets: false
        //     }));
      } else {
        if (this._baseGeometry.morphTargets.length < 8) {
          console.log('t l',this._baseGeometry.morphTargets.length);

          var padding = 8-this._baseGeometry.morphTargets.length;
          console.log('padding', padding);
          for(var i=0; i<=padding; i++) {
            console.log('padding',i);
            // don't know the reason for padding
            // this._baseGeometry.morphTargets.push({'name': 'morphPadding'+i, vertices: this._baseGeometry.vertices});
          }

        }else{ console.log( "maybe too many data?" ); }

        // points is the ultimate thing used to do visualization
        this.points = new THREE.Mesh(this._baseGeometry, new THREE.MeshBasicMaterial({
              color: 0xffffff,
              vertexColors: THREE.FaceColors,
              // animation
              morphTargets: true,
            }));


        this.points.userData =  {'userData': userData}
      }

      // _points = this.points
      this.scene.add(this.points);
    }
  }


  onMouseDown(event) {
    event.preventDefault();

    this.mount.addEventListener('mousemove', this.onMouseMove, false);
    this.mount.addEventListener('mouseup', this.onMouseUp, false);
    this.mount.addEventListener('mouseout', this.onMouseOut, false);

    this.mouseOnDown.x = - event.clientX;
    this.mouseOnDown.y = event.clientY;

    this.targetOnDown.x = this.target.x;
    this.targetOnDown.y = this.target.y;

    this.mount.style.cursor = 'move';
  }

  onMouseMove(event) {

    // default
    this.mouse.x = - event.clientX;
    this.mouse.y = event.clientY;

    var zoomDamp = this.distance/1000;

    this.target.x = this.targetOnDown.x + (this.mouse.x - this.mouseOnDown.x) * 0.005 * zoomDamp;
    this.target.y = this.targetOnDown.y + (this.mouse.y - this.mouseOnDown.y) * 0.005 * zoomDamp;
    // console.log(this.target.x + '| '+this.target.y);
    this.target.y = this.target.y > this.PI_HALF ? this.PI_HALF : this.target.y;
    this.target.y = this.target.y < - this.PI_HALF ? - this.PI_HALF : this.target.y;

  }

  onMouseUp(event) {

    this.mount.removeEventListener('mousemove', this.onMouseMove, false);
    this.mount.removeEventListener('mouseup', this.onMouseUp, false);
    this.mount.removeEventListener('mouseout', this.onMouseOut, false);
    this.mount.style.cursor = 'auto';
  }

  onMouseOut(event) {
    this.mount.removeEventListener('mousemove', this.onMouseMove, false);
    this.mount.removeEventListener('mouseup', this.onMouseUp, false);
    this.mount.removeEventListener('mouseout', this.onMouseOut, false);
  }

  onMouseWheel(event) {

    event.preventDefault();
    if (this.overRenderer) this.zoom(event.wheelDeltaY * 0.3);
    return false;
  }

  onDocumentKeyDown(event) {
    switch (event.keyCode) {
      case 38:
        this.zoom(100);
        event.preventDefault();
        break;
      case 40:
        this.zoom(-100);
        event.preventDefault();
        break;
    }
  }

  onWindowResize( event ) {
    this.camera.aspect = this.mount.offsetWidth / this.mount.offsetHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize( this.mount.offsetWidth, this.mount.offsetHeight );
  }

  zoom(delta) {
    this.distanceTarget -= delta;
    this.distanceTarget = this.distanceTarget > 1000 ? 1000 : this.distanceTarget;
    this.distanceTarget = this.distanceTarget < 450 ? 450 : this.distanceTarget;
  }


  componentWillReceiveProps(e) {
    // console.log(e);
    //
    // this.cube.material = new THREE.MeshBasicMaterial({ color: e.ss });

  }



  animate() {
    // get frameID, frameID is for cancelling when unmount
    this.frameId = window.requestAnimationFrame(this.animate)

    /****** render code start ******/

    this.zoom(this.curZoomSpeed);

    //旋转时候的缓冲
    this.rotation.x += (this.target.x - this.rotation.x) * 0.1;
    this.rotation.y += (this.target.y - this.rotation.y) * 0.1;
    this.distance += (this.distanceTarget - this.distance) * 0.1;
    // console.log(this.distance);


    this.camera.position.x = this.distance * Math.sin(this.rotation.x) * Math.cos(this.rotation.y);
    this.camera.position.y = this.distance * Math.sin(this.rotation.y);
    this.camera.position.z = this.distance * Math.cos(this.rotation.x) * Math.cos(this.rotation.y);

    this.camera.lookAt(this.mesh.position);
    this.camera.updateProjectionMatrix();

    //raycast
    this.raycaster.setFromCamera( this.raycasterMouse, this.camera );
    const intersects = this.raycaster.intersectObject( this.points );
    // console.log(intersects);
    if ( intersects.length > 0 ) {
      // if()
      const intersect = intersects[ 0 ];

      const face = intersect.face;

      const dataIndex = Math.floor(intersect.faceIndex / 12);

      // console.log("Faceindex: " + intersect.faceIndex);
      // console.log("dataIndex: " + dataIndex);
      // console.log("-------");

      console.log(
        this.points.userData.userData[0][1] [ (dataIndex*4) + 3]
      );
      this.tootips_mouseoverFeedback.position.x = intersect.point.x;
      this.tootips_mouseoverFeedback.position.y = intersect.point.y;
      this.tootips_mouseoverFeedback.position.z = intersect.point.z;

      this.tootips_mouseoverFeedback.lookAt(this.mesh.position);

    }

    this.renderer.render(this.scene, this.camera);

  }



  render() {

    // render is execute ahead of componentDidMount
    console.count("---------- GlobeVisual's render called");

    return(
      <div id="globev"
        style={{ width: window.innerWidth, height: window.innerHeight, backgroundColor: 'red'}}
        ref={(mount) => {return this.mount = mount }}
      />
    )

  }
} // Class

export default GlobeVisual