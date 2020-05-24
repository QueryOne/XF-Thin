xf = typeof xf != 'undefined' ? xf : {}

xf.competeGenerate = function() {
  // const client = new Colyseus.Client('ws://localhost:3000')
  // client = typeof client != 'undefined' ? client : new Colyseus.Client('ws://localhost:3000')
  client = typeof client != 'undefined' ? client : new Colyseus.Client('ws://198.199.80.29')
  // client = typeof client != 'undefined' ? client : new Colyseus.Client('ws://xf-one.com/')

  // client.joinOrCreate('Xenius')
  
  var p = $.when(1)

  p = p.then(function() {
    return client.joinOrCreate('XF-Lobby')
  }).then(function(v) {
    lobby = v
  }).then(function() {
    return client.getAvailableRooms()
  }).then(function(v) {
    xf.renderWorlds(v)
  }).then(function() {

  })
}

xf.renderWorlds = function(list) {
  console.log(list)
  var str = '<div id="interface-world-list">'
  str += '<div id="interface-multiplayer">'
  str += '<div id="interface-multiplayer-user"><div id="interface-multiplayer-user-label">Username: </div><input id="interface-user"></input></div>'
  str += '<div id="interface-multiplayer-token"><div id="interface-multiplayer-token-label">Token: </div><input id="github-identifier"></input></div>'
  str += '<div id="interface-multiplayer-encryption"><div id="interface-multiplayer-encryption-label">Password: </div><input id="github-encryption"></input></div>'
  str += '<div id="github-save">Save</div>'
  str += '</div>'
  str += '<div id="interface-world-header" class="interface-world">'
  str += '<div id="interface-world-header-label" class="interface-world-label">World</div>'
  str += '<div id="interface-world-header-count" class="interface-world-count">Players</div>'
  str += '</div>'
  for (var i = 0; i < list.length; i++) {
    var world = list[i]
    str += '<div id="interface-world-' + world.roomId + '" class="interface-world" onclick="xf.joinWorld(\'' + world.roomId + '\')">'
    str += '<div id="interface-world-' + world.roomId + '-label" class="interface-world-label">' + world.name + '</div>'
    str += '<div id="interface-world-' + world.roomId + '-count" class="interface-world-count">' + world.clients + '</div></div>'
  }
  str += '</div>'
  $('#interface-competeValue').empty().append(str)

  var name = namegen.name()
  if ($('#interface-user').val() == '') { $('#interface-user').val(name) }
}

xf.joinWorld = function(roomId) {
  console.log('Trying to join ' + roomId)
  var p = $.when(1)
 
  p = p.then(function() {
    return client.joinById(roomId, {roomId: roomId, token:''})
  }).then(c => {
    world = c
    if (c.hasJoined == true) {
      xf.interface.shutter()
    }
  }).catch(error => {
    console.log('Failed to authorise connection to ' + roomId + '.')
    switch(error.message) {
      case '9333':
        console.log('Github account already logged in.')
        break;
      default:
        console.error(error)
        break;
    }
  })
}
