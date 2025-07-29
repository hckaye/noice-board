import { useState } from 'react'
import Button from './Button'
import './NoiceButton.css'

interface NoiceButtonProps {
  postId: string
}

export default function NoiceButton({ postId }: NoiceButtonProps) {
  const [isGiving, setIsGiving] = useState(false)
  const [amount, setAmount] = useState(1)

  const handleGiveNoice = async () => {
    setIsGiving(true)
    try {
      // ここで実際のいいね送信処理を実装
      await new Promise(resolve => setTimeout(resolve, 500)) // 模擬的な遅延
      console.log(`Giving ${amount} noice to post ${postId}`)
      // 成功時の処理
    } catch (error) {
      console.error('Failed to give noice:', error)
    } finally {
      setIsGiving(false)
    }
  }

  return (
    <div className="noice-button-container">
      <div className="noice-input-group">
        <label htmlFor="noice-amount">いいね数:</label>
        <input
          id="noice-amount"
          type="number"
          min="1"
          max="10"
          value={amount}
          onChange={(e) => setAmount(parseInt(e.target.value) || 1)}
          className="noice-amount-input"
        />
      </div>
      <Button
        onClick={handleGiveNoice}
        disabled={isGiving}
        variant="primary"
      >
        {isGiving ? '送信中...' : `❤️ ${amount}いいね送る`}
      </Button>
    </div>
  )
}