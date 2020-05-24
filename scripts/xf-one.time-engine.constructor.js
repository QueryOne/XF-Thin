
class TimeEngine {
  constructor(id) {
    this.id = id
    this.uuid = xu.uuid()
    this.discontinue = false
    this.body = $('body')
  }
  
  loop = function() {
    if (this.discontinue) { return }
    body.trigger('TimeEngine-update-' + this.uuid)
    window.requestAnimationFrame(this.loop.bind(this)) /* https://stackoverflow.com/a/6065221 */
  }
  
  stop = function() { this.discontinue = true }
  start = function() { this.discontinue = false; this.loop() }
  toggle = function() {
    if (this.discontinue) {
      this.start(); $('body').trigger('TimeEngine-start', [this]);
    } else {
      this.stop(); $('body').trigger('TimeEngine-stop', [this]);
    }
  }
}
