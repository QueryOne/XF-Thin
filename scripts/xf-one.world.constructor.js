
class World {
  constructor(id, timeEngine, span, canvas, context) {
    this.egocentric = false  /* true when centered on the player */
  
    this.id    = id
    this.span  = span
    
    this.grid  = this.constructGrid(span)
    this.items = {}
    
    this.engine= timeEngine
    this.body  = $('body')
    this.body.on('TimeEngine-update-' + this.engine.uuid, this.tick.bind(this))
    
    this.setCanvas(canvas, context)
  }
  
  constructGrid(n) {
    var perf = new Date().getTime()
    var grid = []
    for (var i = -n; i < n; i++) {
      var a = []
      for (var j = -n; j < n; j++) {
        a.push([])
      }
      grid.push(a)
    }
    if (true) { console.log('(xf-one): ' + (new Date().getTime() - perf) + 'ms to generate world with ' + n + ' span.') }
    return grid
  }
  
  tick(e) {
    // var items = e.data
    for (var item of Object.values(this.items)) {
      if (item.geometrics.vx == 0 && item.geometrics.vy == 0) {
        // stationary
      } else {
        item.updatePosition()
      }
      item.update()
    }
    this.draw()
  }
  
  draw = function() {
    context.clearRect(0, 0, this.cw, this.ch)
    context.fillStyle = 'rgba(255,255,255,1)'
    for (var item of Object.values(this.items)) {
      item.draw()
    }
  }
  
  setCanvas = function(canvas, context) {
    this.canvas  = canvas
    this.context = context
    this.cw      = canvas.property('width')
    this.ch      = canvas.property('height')
  }
}
