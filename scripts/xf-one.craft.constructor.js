
class Craft extends Item {
  constructor(world, id, x, y, parentGrid, r, g, b, a) {
    super(world, id, x, y, r || 245, g || 33, b || 33, a)
    this.class      = 'Craft'
    this.size       = xu.random(2,3)
    
    /* Craft geometrics */
    this.geometrics.vx = 0
    this.geometrics.vy = 0
    
    /* Craft technicals */
    this.specifications = {}
    this.specifications.healthCap     = 4000
    this.specifications.initiativeCap = 100  /* Decision-making Frequency Cap, lower is better */

    this.specifications.dethrustGain      = 0.004
    this.specifications.dethrustIncrement = 0.001
    this.specifications.thrustCap         = 1.120
    this.specifications.thrustGain        = 0.006
    this.specifications.thrustIncrement   = 0.001

    this.specifications.turnCap       = 0.230 /* Degrees per loop() */
    this.specifications.turnIncrement = 0.001
    this.specifications.turnPrecision = 15    /* Degrees before precision turning */
    this.specifications.turnEmergency = 3.3
    this.specifications.craftRadius   = 14    /* Craft radius of influence */
    
    this.specifications.radarFrequency= 34   /* Frequency of identifying external objects & updating internal enemy map */
    
    this.specifications.opticalFrequency = 24
    this.specifications.opticalAngle     = 65  /* x 2 = 130 degrees */
    this.specifications.opticalDistance  = 240
    this.specifications.opticalMemory    = 18
    
    /* Craft status */
    this.status = {}
    this.status.health     = this.specifications.healthCap
    this.status.initiative = this.specifications.initiativeCap
    this.status.thrust     = 0
    this.status.turn       = 1
    this.status.nose       = 0
    this.status.radar      = this.specifications.radarFrequency
    this.status.optics     = this.specifications.opticalFrequency
    
    /* Craft decision bank */
    this.decision = {}

    this.decision.turn = ''
    this.decision.turnDelta = 0
    this.decision.turnDate = null

    this.decision.speed = ''
    this.decision.speedTarget = 0.2

    this.decision.squeeze = ''
    
    this.decision.target = {}
    this.decision.target.x = 0
    this.decision.target.y = 0
    this.decision.target.estimatedVelocity = 0
    this.decision.target.estimatedDirection = 0
    this.decision.target.reference = {}

    this.decision.geometricHistory = {
      cap: 7,
      memory: [],
      memoize: function() {
        var sum = [];
        for (var i = 0; i < this.memory.length; i++) {
          sum[0] = sum[0] || 0
          sum[1] = sum[1] || 0
          sum[0] += this.memory[i][0]
          sum[1] += this.memory[i][1]
        }
        sum[0] = sum[0] / this.cap
        sum[1] = sum[1] / this.cap
        return sum
      }
    }
    
    this.decision.targetHistory = {
      memory: [],
    }
    
    /* Craft memory bank */
    this.memory = []
  }
  
  think() {
    if (false) { console.log(this.id + ' plans its next move.') }

    /* Calculate turn/yaw required */
    // Add squeeze
    var dX = this.decision.target.x - this.geometrics.rx
    var dY = (this.decision.target.y - this.geometrics.ry) * 1
    var theta = correctNose(Math.atan2(dY, dX) * 180 / Math.PI) // !important
    var deltaTheta = correctNose(theta - this.status.nose)
    var distance = Math.sqrt(dX * dX + dY * dY)
    this.decision.distance = distance // estimated distance, can introduce some judgement failure here

    if (false && this.id == 'player') {
      console.log(theta)
      console.log(this.status.nose)
      console.log(deltaTheta)
    }

    if (deltaTheta <= 0.05 && deltaTheta >= -0.05) { deltaTheta = 0 }
    this.decision.turnDelta = deltaTheta

    var g = this.decision.geometricHistory
    g.memory.unshift([this.geometrics.rx, this.geometrics.ry])
    if (g.memory.length > g.cap) { g.memory.pop() }
    var recent = this.decision.geometricHistory.memoize()
    var mX = this.geometrics.rx - recent[0]
    var mY = this.geometrics.ry - recent[1]
    var history = Math.sqrt(mX * mX + mY * mY)

    this.routine(deltaTheta, distance, history)
    this.fireRoutine(deltaTheta, distance, history)
  }

  update() {
  }

  updateOptics() {
    if (this.decision.target.reference instanceof Item) {
      if (Math.abs(this.decision.turnDelta) > this.specifications.opticalAngle) {
        // Not within optical angle

      } else {
        var k = {
          id: this.decision.target.reference.id,
          x : this.decision.target.reference.geometrics.rx,
          y : this.decision.target.reference.geometrics.ry,
          t : new Date().getTime(),
        }
        if (this.decision.targetHistory.memory.length >= 1) {
          var n = this.decision.targetHistory.memory[0]
          var x = n.x - k.x
          var y = n.y - k.y
          var r = correctNose(Math.atan2(y, x) * 180 / Math.PI)
          k.nose = r
        }
        this.decision.targetHistory.memory.unshift(k)
        if (this.decision.targetHistory.memory.length > this.specifications.opticalMemory) {
          this.decision.targetHistory.memory.pop()
        }
      }
    }
  }

  updateScan() {
    this.updateTarget(this.decision.target.reference)
  }

  updateTarget(item) {
    if (item.id != this.decision.target.id) {
      body.trigger('new-target', [this])
    }
    this.decision.target.reference = item
    this.decision.target.id = item.id
    this.decision.target.x  = item.geometrics.rx;
    this.decision.target.y  = item.geometrics.ry; 
    // if (item.id == 'player') { this.decision.target.x = item.geometrics.rx };
    // if (item.id == 'player') { this.decision.target.y = item.geometrics.ry };
    if (item instanceof Craft) {
      // introduce uncertainty
      this.decision.target.estimatedVelocity  = item.status.thrust
      this.decision.target.estimatedDirection = item.status.nose
    }
  }

  draw() {
    var size = this.size || 2
    context.closePath()
    context.beginPath()
    context.moveTo((this.geometrics.x + ow), (this.geometrics.y + oh))

    // calculate geometry
    var tailLength = 1.4
    var tailAngle  = correctNose(this.status.nose - 180) * Math.PI/180
    var wingLength = tailLength * 2.3
    var leftAngle  = correctNose(this.status.nose -  90) * Math.PI/180
    var rightAngle = correctNose(this.status.nose +  90) * Math.PI/180
    var noseLength = tailLength * 6.2
    var noseAngle  = correctNose(this.status.nose) * Math.PI/180
    
    var rx = ow + this.geometrics.x
    var ry = oh - this.geometrics.y

    var x = Math.cos(noseAngle)
    var y = Math.sin(noseAngle) * -1
    context.moveTo(x * tailLength + rx, y * tailLength + ry)
        x = Math.cos(leftAngle)
        y = Math.sin(leftAngle) * -1
    context.lineTo(x * wingLength + rx, y * wingLength + ry)
        x = Math.cos(noseAngle)
        y = Math.sin(noseAngle) * -1
    context.lineTo(x * noseLength + rx, y * noseLength + ry)
        x = Math.cos(rightAngle)
        y = Math.sin(rightAngle) * -1
    context.lineTo(x * wingLength + rx, y * wingLength + ry)
    context.closePath()

    context.fillStyle = this.colours.rgba
    context.fill()
    context.lineWidth = 1.2
    context.strokeStyle = 'rgba(145,31,31,1)'
    context.stroke()
  }
  
  FlyStandard(deltaTheta, distance) {
    // Turning decision
    var turn = this.decision.turn
    if (deltaTheta > 0) { // turn left
      this.decision.turn = 'L'
      if (turn == '') { body.trigger('craft-initiate-turning', [this]) }
      if (turn == 'R') { body.trigger('craft-reverse-turning', [this]) }
    } else if (deltaTheta < 0) { // turn right
      this.decision.turn = 'R'
      if (turn == '') { body.trigger('craft-initiate-turning', [this]) }
      if (turn == 'L') { body.trigger('craft-reverse-turning', [this]) }
    } else {
      if (this.decision.turn != '') { let n = this.decision.turnDate; body.trigger('craft-stop-turning', [this, n])}
      this.decision.turn = ''
      this.decision.turnDate = null
    }
   
    this.status.thrust = 0.2
  }
}
