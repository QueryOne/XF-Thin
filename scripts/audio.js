
radio = {}
radio.prefix = './library/background/'
radio.tracks = {
  ambient: [
    '/daedalus.mp3',
    '/globalwarming.mp3',
    '/knowingnothing.mp3',
    '/salue.mp3',
    '/shakeit.mp3',
    '/skygod.mp3',
    '/wall.mp3',
  ],
  combat: [
    '/Echelon.mp3',
    '/hourUponHour.mp3',
  ],
}
radio.attributions = {
 'daedalus'      : {artist:'Kai Engel', title:'Daedalus', link:'https://freemusicarchive.org/music/Kai_Engel/20170816135236518/Kai_Engel_-_caeli_-_06_daedalus'},
 'globalwarming' : {artist:'Kai Engel', title:'Global Warming', link:'https://freemusicarchive.org/music/Kai_Engel/Sustains/Kai_Engel_-_Sustains_-_08_Global_Warming'},
 'knowingnothing': {artist:'Mid-Air Machine', title:'Knowing Nothing {140 & 4/4}', link:'https://freemusicarchive.org/music/Ask%20Again/Drama_King_Action_Orchestra/Knowing_Nothing'},
 'salue'         : {artist:'Kai Engel', title:'Salue', link:'https://freemusicarchive.org/music/Kai_Engel/Brume/Kai_Engel_-_Brume_-_04_Salue'},
 'shakeit'       : {artist:'Jahzzar', title:'Shake It', link:'https://freemusicarchive.org/music/Jahzzar/Super_1222/01_Shake_It'},
 'skygod'        : {artist:'Nathaniel Wyvern', title:'Sanctuary of the Sky Gods', link:'https://freemusicarchive.org/music/Nathaniel_Wyvern/Sanctuary_of_the__Sky_Gods/Nathaniel_Wyvern_-_Sanctuary_Of_The_Sky_Gods'},
 'wall'          : {artist:'Jahzzar', title:'Wall', link:'https://freemusicarchive.org/music/Jahzzar/Super_1222/06_Wall_1748'},
}

radio.mode     = 'normal'
radio.style    = 'ambient'
radio.position = -1
radio.current  = null

radio.start = function(url) {
  radio.active = new Audio(url)
  console.log('(radio): Playing ' + url + '.')
  radio.active.volume = 0.07
  radio.active.onended = radio.next
  radio.active.play()
}

radio.next = function() {
  radio.position += 1
  if (radio.position > radio.tracks[radio.style].length - 1) {
    radio.position = 0
  }
  radio.current = radio.prefix + radio.style + radio.tracks[radio.style][radio.position]
  radio.start(radio.current)
}

radio.random = function() {
  radio.position = Math.floor(Math.random() * radio.tracks[radio.style].length)
  radio.current = radio.prefix + radio.style + radio.tracks[radio.style][radio.position]
  radio.start(radio.current)
}

radio.initiate = function() {
  radio.position = Math.floor(Math.random() * radio.tracks[radio.style].length)
  switch(radio.mode) {
    case 'random': radio.random(); break;
    default      : radio.next();   break;
  }
}

radio.fade = function() {
  radio.fadeTime = new Date().getTime()
  if (typeof radio.fader != 'undefined') { clearInterval(radio.fader) }
  radio.fader = setInterval(function() {
    radio.active.volume *= 0.925 * 0.925
    if (radio.active.volume < 0.0022) {
      clearInterval(radio.fader)
      radio.active.pause()
      radio.active.currentTime = 0
      var now = new Date().getTime()
      console.log('Fade time: ' + (now - radio.fadeTime))
    }
  }, 140)
}
