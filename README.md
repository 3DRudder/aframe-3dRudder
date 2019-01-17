![license](https://img.shields.io/github/license/mashape/apistatus.svg)
![language](https://img.shields.io/badge/Language-javascript-green.svg) 
![Node.js](https://img.shields.io/badge/Node.js-v8.9.1-green.svg)
![A-Frame](https://img.shields.io/badge/AFrame-v0.7.0-green.svg)

# A-Frame 3dRudder controller

A-Frame component (v1.0.3) for the 3dRudder controller (v2.0.2)

# Installation
* ```npm install aframe-3drudder```

# Usage
* HTML
```html
<script src="../dist/aframe-3dRudder.js"></script>
...
<a-entity 3drudder-controls="port:0;speed:5 1 10">
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
```

# Sample [here](/examples/webvr.html)  

# Build for browser
* ```npm run-script build``` or ```webpack --config ./webpack.config.js src/index.js dist/aframe-3dRudder.js```