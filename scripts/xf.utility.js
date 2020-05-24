xf = typeof xf != 'undefined' ? xf : {}

xf.correctNose = function(angle) {
  var a = (angle % 360 + 360) % 360
  if (a > 180) { a -= 360 }
  return a
}
