var Sdk3dRudder = require('3drudder-js');

// Locomotion 3dRudder a-Frame component
AFRAME.registerComponent('3drudder-controls', {
    schema: {
        // Controller 0-3
        port: { type: 'number', default: 0, oneOf: [0, 1, 2, 3] },
        // Speed Translation
        speed: { type: 'vec3', default: { x:10, y:10, z:10 } },
        // Speed Rotation
        speedRotation: { type: 'number', default: 100 },        
    },

    init: function() {
        this.SDK = new Sdk3dRudder();
        this.SDK.init();      
        console.log('init 3dRudder controls');
        console.log('controller ' + this.data.port + ' speed ' + this.data.speed.y + ' mode ' + this.data.mode);  
        this.SDK.on('connectedDevice' , function(device) { 
            var controller = this.controllers[device.port];            
            controller.setAxesParam({
                roll2YawCompensation: 0.15,
                nonSymmetricalPitch: true,
                curves: {
                    leftright: {deadzone: 0.1, xSat: 1.0, exp: 2.0},
                    forwardbackward: {deadzone: 0.1, xSat: 1.0, exp: 2.0},					
                    updown: {deadzone: 0.1, xSat: 1.0, exp: 2.0},
                    rotation: {deadzone: 0.1, xSat: 1.0, exp: 1.0}
                }
            });
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