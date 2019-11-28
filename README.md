![license](https://img.shields.io/github/license/mashape/apistatus.svg)
![language](https://img.shields.io/badge/Language-javascript-green.svg) 
![Node.js](https://img.shields.io/badge/Node.js-v8.9.1-green.svg)
![A-Frame](https://img.shields.io/badge/AFrame-v0.7.0-green.svg)

# A-Frame 3dRudder controller

A-Frame component (v1.0.5) for the 3dRudder controller (v2.0.2)

# Installation
* ```npm install aframe-3drudder```

# Usage

* HTML

```html
<script src="../dist/aframe-3dRudder.js"></script>
...
<a-entity 3drudder-controls="port:0;speed:5 1 10;roll2YawCompensation: 0;rotation: 0.15 1 1">
  <a-camera>
    <a-cursor></a-cursor>
  </a-camera>
</a-entity>
```

* No secure and discovery options

```html
<script>
// get element
var rudder = document.querySelector('#rudder');
// add event to discovery
rudder.addEventListener('discovered', onDiscovery);
// call the discovery
rudder.components['3drudder-controls'].discovery();
// check url
function onDiscovery(event) {
  var urls = event.detail.urls;
  // url is an array of {"ip":"127.0.0.1, "name": "Bridge server"}
  if (urls.length > 0) {
    var rudder = document.querySelector('#rudder').components['3drudder-controls'].connect(urls[0].ip);
  }
}
</script>
<a-entity id="rudder" 3drudder-controls="secu:false;port:0;speed:5 5 5;speedRotation:50;">
    <a-camera>
        <a-cursor></a-cursor>
    </a-camera>
</a-entity>
```

# API

* Properties

```javascript
// Controller 0-3
port: { type: 'number', default: 0, oneOf: [0, 1, 2, 3] },
// Speed Translation
speed: { type: 'vec3', default: { x:10, y:10, z:10 } },
// Speed Rotation
speedRotation: { type: 'number', default: 100 },
// Roll to Yaw compensation
roll2YawCompensation: { type: 'number', default: 0.15 },
// Non Symmetrical Pitch
nonSymmetricalPitch: { default: true },
// Left Right Axes Param
leftright: { deadzone: 0.1, xSat: 1.0, exp: 2.0 },
// Forward Backward Axes Param
forwardbackward: { deadzone: 0.1, xSat: 1.0, exp: 2.0 },
// Up Down Axes Param
updown: { deadzone: 0.1, xSat: 1.0, exp: 2.0 },
// Rotation Axes Param
rotation: { deadzone: 0.1, xSat: 1.0, exp: 2.0 },
// Options for connection, true: use 'wss' and false: 'ws' for websockets
secu: { default: true},
```

# Sample [here](/examples/webvr.html)  

# Build for browser
* ```npm run-script build``` or ```webpack --config ./webpack.config.js src/index.js dist/aframe-3dRudder.js```