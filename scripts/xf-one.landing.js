xf = typeof xf != 'undefined' ? xf : {}
xf.landing = typeof xf.landing != 'undefined' ? xf.landing : {}

xf.landing.generate = function() {
  var p = $.when(1)
  p = p.then(function() {
    return new TimeEngine('landing-page')
  }).then(function(e) {
    xf.landing.engine = e
    return new World('landing-page', xf.landing.engine, window.innerWidth/2, canvas, context)
  }).then(function(e) {
    xf.landing.world = e
    return xf.landing.background()
  }).then(function(e) {
    console.log(xf.landing.world)
    xf.landing.world.engine.start()
  })
}

xf.landing.background = function() {
  var w = $('canvas').width()
  var h = $('canvas').height()
  var f = 1
  
  /* Add Stars */
  var v = 140
  var n = Math.floor(Math.min(0.45, Math.max(0.07, Math.random())) * v)
  for (var i = 0; i < n; i++) {
    var a = new Star(xf.landing.world, xu.uuid(), xu.random(-w/2 * f, w/2 * f), xu.random(-h/2 * f, h/2 * f), xf.landing.world.grid)
    xf.landing.world.items[a.id] = a
  }
  console.log('Generated ' + n + ' stars.')
  
  /* Add Asteroids */
  var v = 16
  var n = Math.floor(Math.min(0.45, Math.max(0.07, Math.random())) * v)
  for (var i = 0; i < n; i++) {
    var a = new Asteroid(xf.landing.world, xu.uuid(), xu.random(-w/2 * f, w/2 * f), xu.random(-h/2 * f, h/2 * f), xf.landing.world.grid)
    xf.landing.world.items[a.id] = a
  }
  console.log('Generated ' + n + ' asteroids.')
  
  var c = new Craft(xf.landing.world, 'player', 550, 10, xf.landing.world.grid)
  c.geometrics.vx = -0.44
  c.geometrics.vy = -0.01
  c.status.nose = -179.3
  xf.landing.world.items[c.id] = c
  
  return true
}
