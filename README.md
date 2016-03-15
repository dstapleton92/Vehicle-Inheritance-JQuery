# Inheritance Lab
### Potential Solution

#### Purpose
This lab requires implementation of pseudo-classical inheritance, HTML/CSS knowledge, and basic DOM manipulation competency.

#### Inheritance Structure & Characteristics
* `Vehicle` - moves, can be damaged, can be added to the DOM, can be removed from the DOM
  * `Car` - Can reverse
    * `CopCar` - Inherits from Car, so it can reverse as well
  * `Motorcycle` - Moves twice as fast
  * `Tank` - Moves half as fast

#### Inheritance How-To
Consider `Vehicle`. It embodies the core functionality of every item we put on the screen. Because of this, we try to put all general behavior applicable to all vehicles in the `Vehicle` class. We call this the **base class**.

To adhere to the pseudo-classical inheritence pattern, you must implement constructors. A `constructor` is a special function where you can define and set initial values for an object created from a class.

In my solution, my `Vehicle` constructor looks like this:
```
var Vehicle = function(damageTolerance, speed) {
    this.damagePoints = 0;
    this.damageTolerance = damageTolerance;
    this.speed = speed;
};
```
The function takes in two parameters. This was a decision I made and your parameters will depend on your programming style and how you decided to implement the project. These parameter values are passed into the `Vehicle` constructor from the constructors of the child classes, when they call the super constructor (more on this later).

The body of the constructor function is an opportunity for you to set values for variables for a specific initialization of the `Vehicle` class. To the left of the equal signs, you will see several variables beginning with `this.`. These variables do not exist before this point. They are being created when the constructor runs, and by using `this.`, the values stored in the variables will be specific to 'this' specific `Vehicle` (and by extension, `Car`/`CopCar`/`Motorcycle`/`Tank`).

As we ponder our list of different types of vehicles specified in the README for the assignment, we can start defining different **subclasses (child classes)**.
The first step in doing this is to create a constructor for the child class. For example, my `Car` constructor looks like this:

**Block 1**
```
var Car = function() {
    // Call the constructor for the superclass Vehicle
    // Creates a new base Vehicle with a damage tolerance of 2 and a speed of 5000
    Vehicle.call(this, 2, 5000);
}
```
In the constructor of a child class, it is customary, and often efficient and elegant (and in most languages, required), to call the constructor of the super class (parent class). Doing so takes care of creating and instantiating any common logic and functions from the `Vehicle` class. It also helps reduce typing by not requiring as many variable assignment statements to be written. Simply call the parent constructor, passing in the required values, and the assignment statements you already typed in the parent constructor will run with the data you're passing in now. To accomplish calling the super class, we use `Vehicle.call(...)`.

`[function_name].call(context, arg1, arg2, arg3, ...)` is a function discussed in class and is available in a lecture PowerPoint.

After the constructor, you inherit the prototype from the parent class, as seen in Block 2:

**Block 2**
```
Car.prototype = Object.create(Vehicle.prototype);
Car.prototype.constructor = Car;
```

What would have happened if we had made a rookie mistake and just done what is listed below in block 3?

**Block 3**
```
Car.prototype = Vehicle.prototype;
```

If you do just the basic prototype assignment shown in **Block 3**, then you will notice odd behavior. For example, defining a `reverse()` function on the Car class like this:

**Block 4**
```
Car.prototype.reverse = function() {
    // Some reverse logic
}
```
will cause undesired behavior. Both motorcycles and tanks will also be able to reverse. Why? By writing `Car.prototype = Vehicle.prototype`, you're essentially saying "Hey Car. Just use Vehicle's prototype for your prototype." You then add the `reverse()` function to the Car prototype (so really, the Vehicle prototype). Then, when a Motorcyle or Tank "uses the Vehicle prototype" as their own later, they will have a `reverse()` function sitting on their prototype.

This is why it is **VERY IMPORTANT** to always remember to inherit prototypes using the method listed in **block 2**, not **block 3**.

### Logistics
#### HTML
In my HTML file, I define buttons to toggle reverse, police lights, and one each for adding each of the different types of vehicle.
There is also a DIV that I gave an ID so that I can style it in CSS. Each of the buttons fires the same function in JavaScript, passing in a different vehicle type. This is specified in the `onclick` attribute of the `button` element.

#### CSS
In my CSS file, I define the boundaries and characteristics of my containg div, which I called `crash_derby`. It's important that I set this container to `position: relative;`. This is because when my Vehicles are positioned absolutely on the screen, their coordinates will be based off of their closest relatively positioned ancestor, and I don't want them being positioned off the window.

I also define a `.vehicle` CSS rule, where I put the styles that will apply to all vehicles on the screen. One of the most important here is `position: absolute;`. This allows us to absolutely position an element an exact number of pixels from the `top`, `left`, `right`, and `bottom` edges of the nearest parent element that is relatively positioned (hence why `crash_derby` was set to `position: relative;`.

#### JavaScript
The code is commented throughout to try to explain what's going on. I will provide some clarifying information, but feel free to ask me any questions you may have.

1. Each time a vehicle creation button is clicked, I create a new object from the appropriate class, add it to the screen, and store a reference to it for later. Specifically, that process entails:
  1. ex: `var vehicle = new Car();`
  2. `vehicle.add();`
  3. `vehicle.move();`
  4. Add the new vehicle (`Car`, `CopCar`, `Motorcycle`, or `Tank`) to an array of all vehicles created so far.
2. When the page is loaded, one repeating function starts firing. This is done using the `setInterval(function(){}, millis)` function built into JavaScript. It fires the function passed as the first argument every `millis` milliseconds. This function is as follows:
  * `checkCollisions()` - Perform a nested loop iteration on the array of vehicles on the screen calling `hasCollidedWith(...)`, defined in the Vehicle base class, on every object in the array, passing in every other object in the array to check against. Basically, you're checking each item in the array, to see if it has collided with each other item in the array. This is an easy and naive approach, but keep note that it can become costly and slow, because if there are `n` items in the array, the nested loops will have a total of `n * n` iterations.
    * `hasCollidedWith(...)` returns true if `this` vehicle is intersecting the vehicle that is passed into the function (`anotherVehicle`). It returns false otherwise. If an intersection occurs, we damage both vehicles by calling `damage()` on this `vehicle` and `anotherVehicle`.
3. `damage()`, defined in the `Vehicle` base class, will increment the damage count, check if the new damage count exceeds the damage tolerance (i.e. it's totaled), and call `this.remove()` if that is the case.
4. `remove()`, defined in the `Vehicle` base class, removes the DIV associated with this vehicle (stored as `this.vehicleElement`) from the `crash_derby` container div in the DOM. It then locates and removes the current vehicle object from the array of vehicles (the one that is being checked for collisions. If we didn't remove the vehicle from this array, you would start seeing phantom collisions, because vehicles would be colliding with vehicles that still exist in code, but no longer exist in the DOM as on-screen vehicles).
5. `move()`, defined in each class, determines the movement direction of `this` vehicle (the vehicle that will be moved. It calls some combination of `this.moveLeft()`, `this.moveRight()`, `this.moveDown()`, and `this.moveUp()` to accomplish the final goal movement for that type of vehicle. For example, a car would just call `this.moveRight()` because it only moves horizontally, whereas a motorcyle may call `this.moveDown()` AND `this.moveRight()` because it moves diagonally.
6. Auxillary Move Functions: `moveUp()`, `moveDown()`, `moveLeft()`, and `moveRight()` are defined on the Vehicle base class. They use JQuery animations to move the Vehicle's div off the edge of the crash derby. We use the `speed` property defined in the Vehicle constructor and passed by all the child constructors. Higher "speed" values actually mean a slower moving vehicle, because it is actually a duration for the animation. (i.e. Cars should take 5000ms to move off the screen, whereas tanks should take 10000ms to move off the screen).

##### Implementing Reverse
I loop through every vehicle in the array, check if it is a `Car` (which includes `CopCar`s). If it is, then I call `reverse()` on it.

`reverse()` is implemented differently on the `Car` and `CopCar` prototypes out of necessity, because they have different behavior.

A `Car`, and by extension a `CopCar` have a boolean variable I set in the `Car` constructor called `isInReverse`. Every car starts out not in reverse.

When `reverse()` is called, I first stop whatever animation is on the vehicle element div. Then, I check and see if the car is "in reverse" by checking that variable. If it is in reverse, I can just call `this.move()` to get it moving in the correct direction(s) again. If it is not in reverse, I call `this.moveLeft()` for a `Car` and `this.moveUp()` for a `CopCar` (moving them in the opposite direction they normally move).

The final step in `reverse()` is to switch the value of `isInReverse`. This reads as "Set `isInReverse` equal to what it is not. (false becomes true, true becomes false).

##### Implementing Blinking Lights for CopCars
This was a simple use of CSS Animation. In the CSS file, you will see I defined a set of `keyframes` called `blink`. A *keyframe* is a *key* state you want your element to be in at a specific point in time. In my case, I specified I wanted each loop of the animation to start with a blue glow, go to a red glow by half way, and then go back to a blue glow by 100% completion. I then declared a class called `.blinking` where I apply the `blink` keyframe set, specify a duration of 1 second, and set it to repeat infinitely. You will notice the `-webkit-...` prefixes on these CSS styles. That is because Safari and Chrome have not yet implemented the standard `@keyframe` and `animate` features yet, so they require the use of a *vendor prefix*.

In my `toggleSirens()` function, I loop through my array of vehicle objects that are on screen, and for every vehicle, if it is a `CopCar`, I call `startSiren()` on the vehicle if sirens are currently off, or `stopSiren()` if sirens are currently on. These two functions respectively add or remove the `blinking` css class to the vehicle's `vehicleElement` object (the DIV representing the vehicle in the DOM).