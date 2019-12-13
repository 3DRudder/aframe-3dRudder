var Sdk3dRudder = require('3drudder-js');

var parseAxesParam = function(value) {
    data = value.split(' ');
    return {deadzone: parseFloat(data[0], 10), xSat: parseFloat(data[1], 10), exp: parseFloat(data[2], 10)} 
}

// Locomotion 3dRudder a-Frame component
AFRAME.registerComponent('3drudder-controls', {
    schema: {
        // Controller 0-3
        port: { type: 'number', default: 0, oneOf: [0, 1, 2, 3] },
        // Speed Translation
        speed: { type: 'vec3', default: { x:10, y:10, z:10 } }, // roll, up, pitch
        // Speed Rotation
        speedRotation: { type: 'number', default: 100 },
        // Roll to Yaw compensation
        roll2YawCompensation: { type: 'number', default: 0.15 },
        // Non Symmetrical Pitch
        nonSymmetricalPitch: { default: true },
        // Left Right Axes Param
        leftright: { type: 'string', default: "0.1 1.0 2.0", parse: parseAxesParam },        
        // Forward Backward Axes Param
        forwardbackward: { type: 'string', default: "0.1 1.0 2.0", parse: parseAxesParam },
        // Up Down Axes Param
        updown: { type: 'string', default: "0.1 1.0 2.0", parse: parseAxesParam },
        // Rotation Axes Param
        rotation: { type: 'string', default: "0.1 1.0 2.0", parse: parseAxesParam },
        // Options for connection
        secu: { default: true},
    },

    discovery: function() {        
        this.SDK.startDiscovery();
        this.SDK.on('discovery', (urls) => {
            this.el.emit('discovered', {"urls":urls});
        });
    },

    connect: function(ip) {
        this.disconnect();
        this.SDK.host = ip;
        this.SDK.init();
    },

    disconnect: function() {
        this.SDK.stop();
    },
    
    init: function() {
        var options;
        if (this.data.secu)
            options = {"schemeWs":"wss"};
        else
            options = {"schemeWs":"ws"};
        this.SDK = new Sdk3dRudder(options);        
        this.SDK.init();
        console.log('controller ' + this.data.port + ' speed ' + this.data.speed.y);  
        this.SDK.on('connectedDevice' , (device) => {             
            this.el.emit('connected', device);
            var controller = this.SDK.controllers[device.port];            
            controller.setAxesParam({
                roll2YawCompensation: this.data.roll2YawCompensation,
                nonSymmetricalPitch: this.data.nonSymmetricalPitch,
                curves: {
                    leftright: this.data.leftright,
                    forwardbackward: this.data.forwardbackward,					
                    updown: this.data.updown,
                    rotation: this.data.rotation
                }
            });
        });
        this.SDK.on('end', () => {
            this.el.emit('close', null);
        });      
    },

    tick: function(time, timeDelta) {
        var rudder = this.SDK.controllers[this.data.port];
        if (rudder.connected) {     
            
            var deltaTime = timeDelta / 1000;

            var roll = rudder.axis.leftright * this.data.speed.x;
            var pitch = -rudder.axis.forwardbackward * this.data.speed.z;
            var updown = rudder.axis.updown *  this.data.speed.y; // Y inverted
            var yaw = -rudder.axis.rotation * this.data.speedRotation;

            // Rotate
            var rotation = this.el.getAttribute('rotation');
            rotation.y += deltaTime * yaw ;            
            var rotationQuat = new THREE.Quaternion();
            rotationQuat.setFromEuler(new THREE.Euler(THREE.Math.degToRad(rotation.x), THREE.Math.degToRad(rotation.y), THREE.Math.degToRad(rotation.z)));                       

            // Translate
            var position = this.el.getAttribute('position');
            var vec3 = new THREE.Vector3(position.x, position.y, position.z);
            var translation = new THREE.Vector3(roll, updown, pitch);
            // Transform
            translation.applyQuaternion(rotationQuat);
            vec3.addScaledVector(translation, deltaTime);            

            // Apply rotation to orientation            
            this.el.setAttribute('rotation', rotation);            
            this.el.setAttribute('position', vec3);
        }
    },
})