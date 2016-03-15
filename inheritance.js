var derbyWidth = 800;
var derbyHeight = 600;
var Vehicle = function(damageTolerance, speed) {
    this.damagePoints = 0;
    this.damageTolerance = damageTolerance;
    this.speed = speed;
    this.vehicleElement = null;
};

Vehicle.prototype.moveRight = function() {
    $(this.vehicleElement).animate({
        left: derbyWidth
    }, {
        duration: this.speed,
        queue: false,
        complete: function() {
            $(this.vehicleElement).css({left: -50});
            this.moveRight();
        }.bind(this)
    });
}
    
Vehicle.prototype.moveLeft = function() {
    $(this.vehicleElement).animate({
        left: -50
    }, {
        duration: this.speed,
        queue: false,
        complete: function() {
            $(this.vehicleElement).css({left: derbyWidth});
            this.moveLeft();
        }.bind(this)
    });
}
    
Vehicle.prototype.moveUp = function() {
    $(this.vehicleElement).animate({
        top: -50
    }, {
        duration: this.speed,
        queue: false,
        complete: function() {
            $(this.vehicleElement).css({top: derbyHeight});
            this.moveUp();
        }.bind(this)
    });
}
    
Vehicle.prototype.moveDown = function() {
    $(this.vehicleElement).animate({
        top: derbyHeight
    }, {
        duration: this.speed,
        queue: false,
        complete: function() {
            $(this.vehicleElement).css({top: 0});
            this.moveDown();
        }.bind(this)
    });
}


Vehicle.prototype.damage = function() {
    this.damagePoints++;
    if (this.damagePoints >= this.damageTolerance) {
        this.remove();
    }
}

Vehicle.prototype.remove = function() {
    document.getElementById('crash_derby').removeChild(this.vehicleElement);
    var target = vehicles.indexOf(this);
    if (target !== -1) {
        vehicles.splice(target, 1);
    }
}

Vehicle.prototype.add = function() {
    this.vehicleElement = document.createElement('div');
    this.vehicleElement.style.top = Math.floor(Math.random() * derbyHeight);
    this.vehicleElement.style.left = Math.floor(Math.random() * derbyWidth);
    this.vehicleElement.classList.add('vehicle', this.className);
    document.getElementById('crash_derby').appendChild(this.vehicleElement);
}

Vehicle.prototype.hasCollidedWith = function(anotherVehicle) {
    var $thisDiv = $(this.vehicleElement);
    var $anotherDiv = $(anotherVehicle.vehicleElement);
    var thisTop = $thisDiv.position().top;
    var thisLeft = $thisDiv.position().left;
    var anotherTop = $anotherDiv.position().top;
    var anotherLeft = $anotherDiv.position().left;
    
    // IF this vehicle is not in the exact position as another vehicle (which means most likely itself)
    // AND it is NOT the case that one of the tell-tale signs of non-intersection is true
    if (
            (thisTop !== anotherTop && thisLeft !== anotherLeft) &&
            !(
                ((thisTop + $thisDiv.height()) < anotherTop) ||
                (thisTop > (anotherTop + $anotherDiv.height())) ||
                ((thisLeft + $thisDiv.width()) < anotherLeft) ||
                (thisLeft > (anotherLeft + $anotherDiv.width()))
            )
        )
        {
            return true;
        } else {
            return false;
        }
}

var Car = function() {
    // Call the constructor for the superclass Vehicle
    // Creates a new base Vehicle with a damage tolerance of 2 and a speed of 5000
    Vehicle.call(this, 2, 5000);
    this.className = 'car';
    this.isInReverse = false;
}

// Set Car to inherit from Vehicle
Car.prototype = Object.create(Vehicle.prototype);
Car.prototype.constructor = Car;

Car.prototype.move = function() {
    this.moveRight();
}

Car.prototype.reverse = function() {
    $(this.vehicleElement).stop();
    if (this.isInReverse) {
        this.move();
    } else {
        this.moveLeft();
    }
    this.isInReverse = !this.isInReverse;
}

var CopCar = function() {
    // Call the superclass Car (which calls its superclass Vehicle)
    // Override the default Car values to damage tolerance 3 and className=cop
    Car.call(this);
    this.damageTolerance = 3;
    this.className = 'cop';
}

// Set CopCar to inherit from Car
CopCar.prototype = Object.create(Car.prototype);
CopCar.prototype.constructor = CopCar;

CopCar.prototype.move = function() {
    this.moveDown();
}

CopCar.prototype.reverse = function() {
    $(this.vehicleElement).stop();
    if (this.isInReverse) {
        this.move();
    } else {
        this.moveUp();
    }
    this.isInReverse = !this.isInReverse;
}

CopCar.prototype.startSiren = function() {
    this.vehicleElement.classList.add('blinking');
}

CopCar.prototype.stopSiren = function() {
    this.vehicleElement.classList.remove('blinking');
}

var Motorcycle = function() {
    // Call superclass Vehicle
    // Sets damage tolerance to 1, speed of 2500
    Vehicle.call(this, 1, 2500);
    this.className = 'motorcycle';
}

// Set Motorcycle to inherit from Vehicle
Motorcycle.prototype = Object.create(Vehicle.prototype);
Motorcycle.prototype.constructor = Motorcycle;

Motorcycle.prototype.move = function() {
    this.moveRight();
    this.moveDown();
}

var Tank = function() {
    // Call superclass Vehicle
    // Sets damage tolerance to 10, speed of 10,000
    Vehicle.call(this, 10, 10000);
    this.className = 'tank';
}

// Set Tank to inherit from Vehicle
Tank.prototype = Object.create(Vehicle.prototype);
Tank.prototype.constructor = Tank;

Tank.prototype.move = function() {
    this.moveUp();
    this.moveLeft();
}

var vehicles = [];
var sirensBlinking = false;

function createButtonClicked(type) {
    var vehicle;
    switch (type) {
        case 'car':
            vehicle = new Car();
            break;
        case 'cop':
            vehicle = new CopCar();
            break;
        case 'moto':
            vehicle = new Motorcycle();
            break;
        case 'tank':
            vehicle = new Tank();
            break;
    }
    vehicle.add();
    vehicle.move();
    if (sirensBlinking && vehicle instanceof CopCar) {
        vehicle.vehicleElement.classList.add('blinking');
    }
    vehicles.push(vehicle);
}

function shiftGears() {
    for (var l = 0; l < vehicles.length; l++) {
        var vehicle = vehicles[l];
        if (vehicle instanceof Car) {
            vehicle.reverse();
        }
    }
}

function toggleSirens() {
    for (var i = 0; i < vehicles.length; i++) {
        var vehicle = vehicles[i];
        if (vehicle instanceof CopCar) {
            if (sirensBlinking) {
                vehicle.stopSiren();
            } else {
                vehicle.startSiren();
            }
        }
    }
    sirensBlinking = !sirensBlinking;
}

function checkCollisions() {
    for (var k = 0; k < vehicles.length; k++) {
        var vehicle = vehicles[k];
        // Check if this current vehicle has collided with any other vehicle in the game
        for (var m = 0; m < vehicles.length; m++) {
            var anotherVehicle = vehicles[m];
            if (vehicle.hasCollidedWith(anotherVehicle)) {
                vehicle.damage();
                anotherVehicle.damage();
            }
        }
    }
}

setInterval(checkCollisions, 750);