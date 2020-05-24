
xf = typeof xf != 'undefined' ? xf : {}

/* https://codepen.io/agrimsrud/pen/XBwyOz */

xf.interface = {}

xf.interface.audioClick  = './library/sounds/stapling.mp3'
xf.interface.audioVolume = 0.227

xf.interface.whyValue = `Coders have often expressed themselves via games. With the advent of the MMO scene, multi-player games no longer fascinate the way they have before. They have brought glitz and glamour to the average user but none of the non-traditional expressions of artistry and creativity.

This is a game written with the gamer/coder in mind. It is the hope of this novice that more games like this will continue to be created and achieve a modicum of traction, so the endless puzzles of gaming/coding never die.

<div class="justify-center">Welcome to <span class="italic black">xf-one</span>.</div>
`

xf.interface.aboutValue = `Written in <a target="_blank" href="https://nodejs.org/en/">Node.js</a> & <a target="_blank" href="https://colyseus.io/">Colyseus</a> served from an <a target="_blank" href="https://ubuntu.com/">Ubuntu</a> machine, the <span class="italic black">xf-one</span> server and full client is hosted on <a target="_blank" href="https://www.digitalocean.com/">DigitalOcean</a>. The thin client is hosted with <a target="_blank" href="https://pages.github.com/">Github Pages</a> and serves as a prototype for your own customised viewing port of the <span class="italic black">xf-one</span> game.
`

xf.interface.shutter = function() {
  $('.interface-button').css('transition','all 270ms').css('opacity','0%').css('pointer-events','none')
  $('#interface-template').children().css('transition','all 270ms').css('opacity','0%').css('pointer-events','none')
  $('#interface-template').css('transition','all 450ms').css('height','0px')
  $('#interface').css('transition','all 450ms').css('height','0px')
  setTimeout(function() { xf.interface.svg() }, 470)
  if (typeof radio != 'undefined' && typeof radio.fade == 'function') { radio.fade() }
}

xf.interface.tutorial = function() {
  console.log('(xf): Tutorial')
  xf.interface.shutter()
}

xf.interface.solo = function() {
  console.log('(xf): Solo')
  xf.interface.shutter()
}

xf.interface.host = function() {
  xf.interface.template()
  var str = '<div id="interface-hostValue"><span class="italic">Under development</span></div>'
  $('#interface-template').append(str)
}

xf.interface.join = function() {
  xf.interface.template()
  var str = '<div id="interface-joinValue"><span class="italic">Under development</span></div>'
  $('#interface-template').append(str)
}

xf.interface.compete = function() {
  console.log('(xf): Compete')
  xf.interface.template()
  var str = '<div id="interface-competeValue"><span class="italic">Fetching XF Worlds...</span></div>'
  $('#interface-template').append(str)

  xf.competeGenerate()
}

xf.interface.why = function() {
  xf.interface.template()
  var str = '<div id="interface-whyValue">' + xf.interface.whyValue + '</div>'
  $('#interface-template').append(str)
}

xf.interface.about = function() {
  xf.interface.template()
  var str = '<div id="interface-aboutValue">'
  str += '<div id="interface-aboutValue-content">' + xf.interface.aboutValue
  str += '<br/>Snippets:'
  str += '<br/><div class="lesser">Excellent <a target="_blank" href="https://codepen.io/agrimsrud/pen/XBwyOz">Electricity Animation</a> by <a target="_blank" href="https://codepen.io/agrimsrud">Anders Grimsrud</a></div>'
  if (typeof radio != 'undefined' && typeof radio.attributions != 'undefined') {
    str += '<br/>Music:'
    for (var key in radio.attributions) {
      var item = radio.attributions[key]
      str += '<div class="lesser"><a target="_blank" href="' + item.link + '">' + item.title + '</a> by ' + item.artist + '</div>'
    }
  }
  str += '</div><br/></div>'
  $('#interface-template').append(str)
}

xf.interface.template = function(arg) {
  var exit = '<div id="interface-template-exit" onclick="xf.interface.closeTemplate()">x</div>'
  $('#interface-template').append(exit).css('transition','all 450ms').addClass('full')
}

xf.interface.closeTemplate = function() {
  var a = new Audio(xf.interface.audioClick)
      a.volume = xf.interface.audioVolume * 0.16
      a.play()
  $('#interface-template').empty().removeClass('full')
  xf.interface.behaviours()
}

xf.interface.draw = function() {
  var str = `
   <div id="interface">
    <div id="interface-border-left"><div id="interface-border-left-element"></div><div id="interface-border-top-element"></div></div>
    <div id="interface-border-right"><div id="interface-border-right-element"></div><div id="interface-border-bottom-element"></div></div>
    <div class="interface-button" id="interface-tutorial">Tutorial</div>
    <div class="interface-button" id="interface-solo"    >Solo</div>
    <div class="interface-button" id="interface-host"    >Host</div>
    <div class="interface-button" id="interface-join"    >Join</div>
    <div class="interface-button" id="interface-compete" >Compete</div>
    <div class="interface-button" id="interface-why"     >Why?</div>
    <div class="interface-button" id="interface-about"     >About</div>
    <div id="interface-label">
      <span class="interface-xf">xf</span>
      <span class="interface-one"><span class="one">o</span><span class="two">n</span><span class="three">e</span></span></div>
   <div id="interface-template">
   </div>

   <svg><defs><filter id="glow" x="-100%" y="-100%" width="300%" height="300%"><feDropShadow dx="0" dy="0" stdDeviation="3"></feDropShadow></filter></defs><path style="filter:url(#glow)" d="M10,0 L100,0"/></svg>

   </div>
   `
  $('body').append(str)
  xf.interface.behaviours()
}

xf.interface.behaviours = function() {
  /* Button click noises */
  $('.interface-button').on('click', function(e, v) {
    var a = new Audio(xf.interface.audioClick)
        a.volume = xf.interface.audioVolume * 0.618
        a.play()
    var i = this.id.replace('interface-','')
    if (typeof xf.interface[i] == 'function') {
      xf.interface.unclick()
      xf.interface[i]()
    }
  })

  /* More styling */
  $('.interface-button').on('mouseenter', function() {
    $('.interface-button').addClass('muted')
    $(this).removeClass('muted')
    // $('.interface-button', this).siblings('.interface-button').addClass('muted')
  }).on('mouseleave', function() {
    $('.interface-button').removeClass('muted')
  })
}

xf.interface.unclick = function() {
  $('.interface-button').off('click')
}

xf.interface.svgStop = function() {

}

/* https://codepen.io/agrimsrud/pen/XBwyOz */
xf.interface.svg = function() {
  let options = {
    fixedWidth    : 84,
    lineWidth     : 1,

    numberOfPoints: 11,

    amplitude     : 1,
    amplitudeCap  : 13,

    spacing       : 25, /* Not used in fixed width */
    margin        : 10,

    /* Speed of arcs */
    frequency     : 3,
    count         : 0,
  }
  var svg = $('#interface svg')
  var w = options.fixedWidth || (options.numberOfPoints - 1) * options.spacing + options.margin * 2
  var h = options.amplitude + options.margin * 2
  svg.width(w)
  svg.height(h)
  
  var points = []
  for (var i = options.numberOfPoints; i--;) { points.push(i) }

  let svgAnimate = () => {
    if (options.count >= options.frequency) {
      options.count = 0
      if (options.amplitude < options.amplitudeCap) { options.amplitude += 1 }
      let coordinates = points.map(n => {
        let first = n == 0
        let last = n == options.numberOfPoints - 1
        let x = (w - options.margin * 2) / (options.numberOfPoints - 1) * n + options.margin
        let y = (first || last) ? h / 2 : (h - options.amplitude) / 2 + Math.random() * options.amplitude
        return {x, y}
      })
      let path = $('#interface path')
      path.attr('d', 'M' + coordinates.map(c => c.x + ',' + c.y).join(' L'))

      let deviation = Math.random() * (5 - 2) + 2
      path.css('opacity', deviation / 5 + 0.2)
      path.css('strokeWidth', options.lineWidth)
    
      let glow = $('#glow feDropShadow')
      glow.attr('stdDeviation', deviation)
    } else {
      options.count += 1
    }
    requestAnimationFrame(svgAnimate)
  }
  // Initiate animation
  requestAnimationFrame(svgAnimate)
}
