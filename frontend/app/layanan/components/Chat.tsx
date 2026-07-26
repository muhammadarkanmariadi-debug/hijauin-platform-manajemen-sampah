import React, { useState } from 'react'
import { MessageCircle, Send } from 'lucide-react'

const Chat = () => {
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'agent',
      text: 'Halo! Selamat datang di layanan pelanggan Hijauin. Ada yang bisa kami bantu?',
      time: '10:30'
    },
    {
      id: 2,
      type: 'user',
      text: 'Halo, saya ingin menanyakan tentang status pesanan saya',
      time: '10:31'
    },
    {
      id: 3,
      type: 'agent',
      text: 'Baik, saya siap membantu Anda. Bisa berikan nomor pesanan atau email yang terdaftar?',
      time: '10:31'
    }
  ])

  const handleSendMessage = () => {
    if (message.trim()) {
      setMessages([
        ...messages,
        {
          id: messages.length + 1,
          type: 'user',
          text: message,
          time: new Date().toLocaleTimeString('id-ID', {
            hour: '2-digit',
            minute: '2-digit'
          })
        }
      ])
      setMessage('')

      setTimeout(() => {
        setMessages(prev => [
          ...prev,
          {
            id: prev.length + 1,
            type: 'agent',
            text: 'Terima kasih atas pertanyaan Anda. Tim kami akan segera memproses dan memberikan informasi yang Anda butuhkan.',
            time: new Date().toLocaleTimeString('id-ID', {
              hour: '2-digit',
              minute: '2-digit'
            })
          }
        ])
      }, 1500)
    }
  }
  return (
    <section className='bg-white py-16'>
      <div className='mx-auto px-4 max-w-5xl'>
        <div className='bg-white shadow-lg border border-gray-200 rounded-lg overflow-hidden'>
          {/* Chat Header - Green */}
          <div className='flex items-center space-x-3 bg-emerald-600 p-4'>
            <div className='flex justify-center items-center bg-white rounded-full w-10 h-10'>
              <MessageCircle className='w-6 h-6 text-emerald-600' />
            </div>
            <div>
              <h3 className='font-bold text-white'>Main Title</h3>
              <p className='text-emerald-100 text-sm'>
                Online - Siap membantu Anda
              </p>
            </div>
          </div>

          {/* Chat Messages */}
          <div className='bg-gray-50 p-6 h-96 overflow-y-auto'>
            {messages.map(msg => (
              <div
                key={msg.id}
                className={`mb-4 flex ${
                  msg.type === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-xs lg:max-w-md ${
                    msg.type === 'user' ? 'order-2' : 'order-1'
                  }`}
                >
                  {msg.type === 'agent' && (
                    <div className='flex items-center space-x-2 mb-2'>
                      <div className='flex justify-center items-center bg-emerald-600 rounded-full w-8 h-8'>
                        <span className='font-bold text-white text-xs'>CS</span>
                      </div>
                    </div>
                  )}
                  <div
                    className={`rounded-2xl p-4 ${
                      msg.type === 'user'
                        ? 'bg-emerald-600 text-white'
                        : 'bg-white border border-gray-200 text-gray-800'
                    }`}
                  >
                    <p className='text-sm'>{msg.text}</p>
                    <span
                      className={`text-xs mt-2 block ${
                        msg.type === 'user'
                          ? 'text-emerald-100'
                          : 'text-gray-500'
                      }`}
                    >
                      {msg.time}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Chat Input */}
          <div className='bg-white p-4 border-gray-200 border-t'>
            <div className='flex space-x-3'>
              <input
                type='text'
                value={message}
                onChange={e => setMessage(e.target.value)}
                onKeyPress={e => e.key === 'Enter' && handleSendMessage()}
                placeholder='Type your message here...'
                className='flex-1 px-4 py-3 border border-gray-300 focus:border-emerald-500 rounded-lg focus:outline-none'
              />
              <button
                onClick={handleSendMessage}
                className='bg-emerald-600 hover:bg-emerald-700 px-6 py-3 rounded-lg text-white transition'
              >
                <Send className='w-5 h-5' />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Chat
