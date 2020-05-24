
class Item {
  constructor(world, id, x, y, r, g, b, a) {
    this.id  = id || xu.uuid()
    this.egocentricity = typeof world.egocentric == 'boolean' ? world.egocentric : false
    
    this.geometrics = {}
    this.geometrics.rx = x || 0
    this.geometrics.ry = y || 0
    this.geometrics.x = x
    this.geometrics.y = y
    this.geometrics.vx = 0
    this.geometrics.vy = 0

    this.colours = {}
    this.colours.red   = r || 188
    this.colours.green = g || 188
    this.colours.blue  = b || 188
    this.colours.alpha = a || 1
    this.updateColour()

    this.birthday = new Date().getTime()
  }

  colour() { return this.colours.rgba }
  
  updateColour() { this.colours.rgba = 'rgba(' + this.colours.red + ', ' + this.colours.green + ', ' + this.colours.blue + ', ' + this.colours.alpha + ')' }
  
  updatePosition() {
    if (typeof this.notPlayer == 'undefined') {
      if (typeof Player !== 'undefined' && typeof player !== 'undefined' &&
          Player instanceof Item &&
          player instanceof Player) {
        if (!(this instanceof Player)) {
          this.notPlayer = true
        } else {
          this.notPlayer = false
        }
      } else {
        this.notPlayer = true
      }
    }
    if (this.egocentricity && this.notPlayer && typeof player != 'undefined' && player instanceof Item) {
      this.geometrics.x += player.geometrics.vx * -1 + this.geometrics.vx
      this.geometrics.y += -1 * (player.geometrics.vy - this.geometrics.vy)
      this.geometrics.rx += this.geometrics.vx
      this.geometrics.ry += this.geometrics.vy
    } else if (this.notPlayer && typeof player != 'undefined' && player instanceof Item) {
    
    } else if (!this.egocentricity && this.notPlayer) {
      this.geometrics.x += this.geometrics.vx
      this.geometrics.y += this.geometrics.vy
      this.geometrics.rx += this.geometrics.vx
      this.geometrics.ry += this.geometrics.vy
    }
  }

  draw() {
    var size = this.size || 2
    context.fillStyle = this.colours.rgba
    context.beginPath()
    context.arc((this.geometrics.x + ow), (-this.geometrics.y + oh), size, 0, 2 * Math.PI)
    context.fill()
    context.closePath()
  }
  
  update(){}
}

class Asteroid extends Item {
  constructor(world, id, x, y, r, g, b, a) {
    super(world, id, x, y, 100, 65, 35, a)
    this.class = 'Asteroid'
    this.size  = xu.random(1, 4)
  }
}

class Star extends Item {
  constructor(world, id, x, y, parentGrid, r, g, b, a) {
    super(world, id, x, y, 255, 255, 234, 0.67)
    this.class = 'Star'
    this.size  = xu.random(1, 2)
    this.tilt  = correctNose(xu.random(0, 360))
    
    if (parentGrid instanceof Array && parentGrid[y] instanceof Array && parentGrid[y][x] instanceof Array) {
      parentGrid[y][x].push(this)
    }
  }
  
  draw() {
    var size = this.size || 2
    context.closePath()
    context.beginPath()

    var rx = ow + this.geometrics.x
    var ry = oh - this.geometrics.y
    
    // calculate geometry
    var length     = 1.35 * size
    var tailAngle  = correctNose(this.tilt - 180) * Math.PI/180
    var leftAngle  = correctNose(this.tilt -  90) * Math.PI/180
    var rightAngle = correctNose(this.tilt +  90) * Math.PI/180
    var noseAngle  = correctNose(this.tilt) * Math.PI/180

    var x = Math.cos(tailAngle)
    var y = Math.sin(tailAngle) * -1
    context.moveTo(x * length + rx, y * length + ry)
        x = Math.cos(leftAngle)
        y = Math.sin(leftAngle) * -1
    context.arcTo(x * length + rx, y * length + ry, x * length + rx, y * length + ry, 3)
        x = Math.cos(noseAngle)
        y = Math.sin(noseAngle) * -1
    context.arcTo(x * length + rx, y * length + ry, x * length + rx, y * length + ry, 3)
        x = Math.cos(rightAngle)
        y = Math.sin(rightAngle) * -1
    context.arcTo(x * length + rx, y * length + ry, x * length + rx, y * length + ry, 3)
    context.closePath()

    context.fillStyle = this.colours.rgba
    context.fill()
    context.lineWidth = 1.2
    context.strokeStyle = 'rgba( 45, 45, 13, 1.00)'
    context.stroke()
  }
}
