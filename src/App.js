import './App.css'
import { useEffect, useState, useReducer } from 'react'
import Gun from 'gun'
import {faker} from '@faker-js/faker'

// Port 5050 is the port of the gun server we previously created
const gun = Gun({
  peers: [
    'https://web3-vgmh.onrender.com/gun'
  ]
})

// The messages array will hold the chat messages
const currentState = {
  messages: []
}

// This reducer function will edit the messages array
const reducer = (state, message) => {
  return {
    messages: [message, ...state.messages]
  }
}

function App({setIsConnected}) {
  const [messageText, setMessageText] = useState('')
  const [state, dispatch] = useReducer(reducer, currentState)

  // fires immediately the page loads
  useEffect(() => {
    const messagesRef = gun.get('MESSAGES')
    messagesRef.map().on(m => {
      dispatch({
        sender: m.sender,
        avatar: m.avatar,
        content: m.content,
        timestamp: m.timestamp
      })
    })
  }, [])

  // remove duplicate messages
  const newMessagesArray = () => {
    const formattedMessages = state.messages.filter((value, index) => {
      const _value = JSON.stringify(value)
      return (
        index ===
        state.messages.findIndex(obj => {
          return JSON.stringify(obj) === _value
        })
      )
    })

    return formattedMessages
  }

  // save message to gun / send message
  const sendMessage = () => {
    // a reference to the current room
    const messagesRef = gun.get('MESSAGES')

    // the message object to be sent/saved
    const messageObject = {
      sender: localStorage.getItem('name'),
      avatar: localStorage.getItem('avatar'),
      content: messageText,
      timestamp: Date().substring(16, 21)
    }

    // this function sends/saves the message onto the network
    messagesRef.set(messageObject)

    // clear the text field after message has been sent
    setMessageText('')
  }

  const handleLogOut = () => {
    localStorage.clear();
    setIsConnected(false);
  }


  return <div className="App">
    <main>
      <div className='messages'>
        <ul>
          {newMessagesArray().map((msg, index) => [
            <li key={index} className='message'>
              <img alt='avatar' src={msg.avatar} />
              <div>
                {msg.content}
                <span>{msg.sender}</span>
              </div>
            </li>
          ])}
        </ul>
      </div>
      <div className='input-box'>
        <input placeholder='Type a message...' onChange={e => setMessageText(e.target.value)} value={messageText} />
        <button onClick={sendMessage} >Send</button>
        <button onClick={handleLogOut} className="button-24" role="button">Log Out</button>
      </div>
    </main>
  </div>
}

export default App