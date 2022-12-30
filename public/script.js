const socket = io('/')
const videoGrid = document.getElementById('video-grid')
const myPeer = new Peer(undefined, {
  host:'/',
  port: '3001',
})
const myVideo = document.createElement('video')
myVideo.muted = true
const peers = {}

const messageInput = document.getElementById('chat_message')


navigator.mediaDevices.getUserMedia({ // 取得影像做為stream傳入下一個then
  video: true,
  audio: true
}).then(stream => {
  addVideoStream(myVideo, stream) // 傳入myVideo元素與stream串流內容

  myPeer.on('call', call => { // 監聽其他人進來我們的room，其他人call我們
    call.answer(stream) // 第一個user可以get到第二個user的畫面了
    const video = document.createElement('video')
    call.on('stream', userVideoStream => {
      addVideoStream(video, userVideoStream) // 傳給別人我們的video element和我們的video stream
    })
  }) 

  socket.on('user-connected', userId => { // 允許自己的影像其他人看的到
    connectToNewUser(userId, stream) // 將自己的串流影像給別人
  })
})

socket.on('user-disconnected', userId => {
  if (peers[userId]) peers[userId].close() // 當user離開房間時將userId這個連線馬上關掉
})


myPeer.on('open', id => {
  socket.emit('join-room', ROOM_ID, id)
})


const connectToNewUser = (userId, stream) => {
  const call = myPeer.call(userId, stream) // 呼叫他人的userId，給他我們的影像stream
  const video = document.createElement('video') // 其他人的影像元素
  call.on('stream', userVideoStream => {
    addVideoStream(video, userVideoStream) // 把其他人的stream放到我們的頁面
  })
  call.on('close', () => { // 其他使用者離開時，將video移除
    video.remove()
  })
  peers[userId] = call // peers這個物件的userId這個屬性，讓入call這個物件
}

const addVideoStream = (video, stream) => { // video參數為要撥放的區塊元素，stream參數為串流來源
  video.srcObject = stream // 來源設置為stream
  video.addEventListener('loadedmetadata', () => { // 監聽事件，從metadata來
    video.play() // 播放串流內容
  })
  videoGrid.append(video) // 將串流影像放入videoGrid中
}

// console.log(req.body)

// const input = document.querySelector('input')

// input.keydown(e => {
//   if(e.which == 13 && text.val().length !== 0) {
//     console.log(text.val())
//     socket.emit('message', text.val())
//     text.val('')
//   }
// })