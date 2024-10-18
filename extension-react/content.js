if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", afterDOMLoaded)
} else {
  afterDOMLoaded()
}

function createReactRoot () {
  
  const player = document.getElementById("ytd-player") // Adjust if the ID is different
  if (player) {
    console.log("checked the player")
    const infoBox = document.createElement("div")
    infoBox.className = "my-cool-box"
    infoBox.textContent = "Healthy UI video feed"
    infoBox.style.cssText = "margin-bottom: 100px; display: block; height: 100px; color: white; border: 1px solid #ccc; padding: 10px; margin-top: 40px;"
    player.prepend(infoBox)
  }
  
}

function afterDOMLoaded() {
  createReactRoot()
  
  setTimeout(() => {
    const player = document.getElementById("ytd-player") // Adjust if the ID is different
    if (player) {
      console.log("checked the player")
      const infoBox = document.createElement("div")
      infoBox.className = "my-cool-box"
      infoBox.textContent = "Healthy UI video feed"
      infoBox.style.cssText = "margin-bottom: 100px; display: block; height: 100px; color: white; border: 1px solid #ccc; padding: 10px; margin-top: 40px;"
      player.prepend(infoBox)
    }
    
    const sidebar = document.getElementById("secondary")
    if(sidebar && sidebar.style) {sidebar.style.cssText = "display: none;"}
    
    const video = player.querySelector("video")
    if (video) {
      // Add an event listener for 'timeupdate'
      video.addEventListener("timeupdate", function() {
        // This function will be called every time the playback position changes
        console.log("Current playback time: " + video.currentTime + " seconds")
        
        // You can perform actions here based on the currentTime
        // For example, doing something every specific number of seconds
        if (Math.floor(video.currentTime) % 5 === 0) { // Every 5 seconds
          console.log("5 second mark reached")
        }
      })
    }
    
  }, 1000)
  
  //Everything that needs to happen after the DOM has initially loaded.
}