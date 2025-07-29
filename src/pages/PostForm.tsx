import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAtom } from 'jotai'
import { postsAtom, currentUserAtom } from '../contexts/atoms'
import Card from '../components/Card'
import Button from '../components/Button'
// Simple validation functions
const validateTitle = (title: string) => {
  if (!title.trim()) return 'タイトルは必須です'
  if (title.length > 100) return 'タイトルは100文字以内で入力してください'
  return null
}

const validateContent = (content: string) => {
  if (!content.trim()) return '本文は必須です'
  if (content.length > 1000) return '本文は1000文字以内で入力してください'
  return null
}
import './PostForm.css'

export default function PostForm() {
  const { postId } = useParams<{ postId: string }>()
  const navigate = useNavigate()
  const [posts] = useAtom(postsAtom)
  const [currentUser] = useAtom(currentUserAtom)
  
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [errors, setErrors] = useState<{ title?: string; content?: string }>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const isEdit = !!postId
  const post = isEdit ? posts.find(p => p.id === postId) : null
  
  useEffect(() => {
    if (isEdit && post) {
      setTitle(post.title)
      setContent(post.content)
    }
  }, [isEdit, post])
  
  // 認証チェック
  if (!currentUser) {
    return (
      <Card>
        <div className="auth-required">
          <h2>ログインが必要です</h2>
          <p>投稿を作成・編集するにはログインしてください。</p>
          <Button onClick={() => navigate('/')}>戻る</Button>
        </div>
      </Card>
    )
  }
  
  // 編集権限チェック
  if (isEdit && post && post.authorId !== currentUser.id) {
    return (
      <Card>
        <div className="permission-denied">
          <h2>権限がありません</h2>
          <p>この投稿を編集する権限がありません。</p>
          <Button onClick={() => navigate('/')}>戻る</Button>
        </div>
      </Card>
    )
  }
  
  // 編集時に投稿が見つからない場合
  if (isEdit && !post) {
    return (
      <Card>
        <div className="not-found">
          <h2>投稿が見つかりません</h2>
          <p>指定された投稿は存在しないか、削除された可能性があります。</p>
          <Button onClick={() => navigate('/')}>戻る</Button>
        </div>
      </Card>
    )
  }

  const validate = () => {
    const newErrors: { title?: string; content?: string } = {}
    
    const titleError = validateTitle(title)
    if (titleError) {
      newErrors.title = titleError
    }
    
    const contentError = validateContent(content)
    if (contentError) {
      newErrors.content = contentError
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validate()) {
      return
    }
    
    setIsSubmitting(true)
    
    try {
      // ここで実際の投稿作成・更新処理を実装
      await new Promise(resolve => setTimeout(resolve, 1000)) // 模擬的な遅延
      
      if (isEdit) {
        console.log('Updating post:', { postId, title, content })
      } else {
        console.log('Creating post:', { title, content, authorId: currentUser.id })
      }
      
      // 成功時は投稿一覧に戻る
      navigate('/')
    } catch (error) {
      console.error('Failed to save post:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="post-form">
      <div className="post-form-header">
        <h1>{isEdit ? '投稿を編集' : '新しい投稿を作成'}</h1>
        <Button variant="secondary" onClick={() => navigate('/')}>
          キャンセル
        </Button>
      </div>

      <Card>
        <form onSubmit={handleSubmit} className="form">
          <div className="form-group">
            <label htmlFor="title" className="form-label">
              タイトル *
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={`form-input ${errors.title ? 'form-input--error' : ''}`}
              placeholder="投稿のタイトルを入力してください"
              maxLength={100}
            />
            {errors.title && (
              <div className="form-error">{errors.title}</div>
            )}
            <div className="form-hint">
              {title.length}/100文字
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="content" className="form-label">
              本文 *
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className={`form-textarea ${errors.content ? 'form-input--error' : ''}`}
              placeholder="投稿の内容を入力してください"
              rows={10}
              maxLength={1000}
            />
            {errors.content && (
              <div className="form-error">{errors.content}</div>
            )}
            <div className="form-hint">
              {content.length}/1000文字
            </div>
          </div>

          <div className="form-actions">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate('/')}
            >
              キャンセル
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !title.trim() || !content.trim()}
            >
              {isSubmitting ? '保存中...' : (isEdit ? '更新する' : '投稿する')}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}