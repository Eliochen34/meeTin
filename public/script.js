const socket = io('/')
const videoGrid = document.getElementById('video-grid')
const myVideo = document.createElement('video')
myVideo.muted = true

const peer = new Peer(undefined, {
  path: '/peerjs',
  host: '/',
  port: '3000'
})

let myVideoStream
navigator.mediaDevices.getUserMedia({
  video: true,
  audio: true
})
  .then(stream => {
    myVideoStream = stream
    addVideoStream(myVideo, stream)

    peer.on('call', call => {
      call.answer(stream)
      const video = document.createElement('video')
      call.on('stream', userVideoStream => {
        addVideoStream(video, userVideoStream)
      })
    })
    
    socket.on('user-connected', (userId) => {
      connecToNewUser(userId, stream)
    })
  })


peer.on('open', id => {
  socket.emit('join-room', ROOM_ID, id) // 從room.ejs header裡面來的ROOM_ID以及進入的使用者的ID
})

const connecToNewUser = (userId, stream) => {
  console.log(userId)
  const call = peer.call(userId, stream) // 呼叫他人id，提供自己的stream
  const video = document.createElement('video') // 創建一個元素
  call.on('stream', userVideoStream => {
    addVideoStream(video, userVideoStream)
  })
}


const addVideoStream = (video, stream) => {
  video.srcObject = stream
  video.addEventListener('loadedmetadata', () => {
    video.play()
  })
  videoGrid.append(video) // 把video放進去videoGrid這個元素當中
}