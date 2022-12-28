const socket = io('/')
const videoGrid = document.getElementById('video-grid')
const myVideo = document.createElement('video')
myVideo.muted = true


let myVideoStream
navigator.mediaDevices.getUserMedia({
  video: true,
  audio: true
})
  .then(stream => {
    myVideoStream = stream
    addVideoStream(myVideo, stream)
  })

socket.emit('join-room', ROOM_ID) // 從room.ejs header裡面來的ROOM_ID
socket.on('user-connected', () => {
  connecToNewUser()
})

const connecToNewUser = () => {
  console.log('new user')
}


const addVideoStream = (video, stream) => {
  video.srcObject = stream
  video.addEventListener('loadedmetadata', () => {
    video.play()
  })
  videoGrid.append(video) // 把video放進去videoGrid這個元素當中
}