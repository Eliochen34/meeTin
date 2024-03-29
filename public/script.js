const socket = io('/')
const videoGrid = document.getElementById('video-grid')
const myPeer = new Peer(undefined, {
  host: '/',
  port: '3001'
})
const myVideo = document.createElement('video')
myVideo.muted = true
const peers = {}

const messageForm = document.getElementById('main__message__container')
const messageShow = document.getElementById('messages')
const messageInput = document.getElementById('message-input')
const userName = prompt('What is your name?')
// appendMessage('You joined')

navigator.mediaDevices.getUserMedia({ // 取得影像做為stream傳入下一個then
  video: true,
  audio: true
}).then(stream => {
  addVideoStream(myVideo, stream) // 傳入myVideo元素與stream串流內容

  myPeer.on('call', call => { // 監聽一個call event：監聽其他人進來我們的room，其他人call我們
    call.answer(stream) // 監聽到這個call，並把我們的stream給他人
    const video = document.createElement('video')

    call.on('stream', userVideoStream => { // 監聽一個stream事件
      addVideoStream(video, userVideoStream) // 傳給別人我們的video element和我們的video stream
    })
  })

  socket.on('user-connected', (userId, userName) => { // 有人加入時
    connectToNewUser(userId, stream) // 將自己的串流影像給別人
    appendMessage(`${userName} is joined.`)
  })
})

socket.on('user-disconnected', (name, userId) => {
  appendMessage(`${name} is disconnected.`)
  console.log(peers)
  if (peers[userId]) peers[userId].close() // 當user離開房間時將userId這個連線馬上關掉
})

socket.on('chat-message', data => {
  appendMessage(`${data.name}: ${data.message}`)
})

messageForm.addEventListener('submit', e => {
  e.preventDefault()
  const message = messageInput.value
  socket.emit('send-chat-message', message)
  messageInput.value = ''
})

myPeer.on('open', id => {
  socket.emit('join-room', ROOM_ID, id, userName)
})

// 建立函式，處理有人加入自己的房間時的情境
const connectToNewUser = (userId, stream) => {
  const call = myPeer.call(userId, stream) // 呼叫進來的人的userId，給該user我們的影像stream
  const video = document.createElement('video') // 其他人的影像元素
  call.on('stream', userVideoStream => { // 監聽他人stream event
    addVideoStream(video, userVideoStream) // 把其他人的stream放到我們的頁面的一個video元素
  })
  call.on('close', () => { // 監聽close event：其他使用者離開時，將video移除
    video.remove()
  })
  peers[userId] = call // peers這個物件的userId這個屬性，讓入call這個物件
}

// 建立函式處理取得的stream，插入網頁中並撥放
const addVideoStream = (video, stream) => { // video參數為要撥放的區塊元素，stream參數為串流來源
  video.srcObject = stream // 來源設置為stream
  video.addEventListener('loadedmetadata', () => { // 監聽事件，從metadata來
    video.play() // 播放串流內容
  })
  videoGrid.append(video) // 將串流影像放入videoGrid中
}

const appendMessage = message => {
  const messageElement = document.createElement('div')
  messageElement.innerText = message
  messageShow.append(messageElement)
}
