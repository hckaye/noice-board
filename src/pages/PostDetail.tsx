import { useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useAtom } from 'jotai'
import { postsAtom, currentUserAtom, loadingAtom, errorAtom } from '../contexts/atoms'
import Card from '../components/Card'
import Button from '../components/Button'
import Loading from '../components/Loading'
import NoiceButton from '../components/NoiceButton'
import { getPostIdAsString, getPostTitleAsString, getPostContentAsString, getPostAuthorIdAsString, getPostCreatedAt, getPostUpdatedAt, getPostNoices } from '../domain/entities/Post'
import { getUserIdAsString } from '../domain/entities/User'
import './PostDetail.css'

export default function PostDetail() {
  const { postId } = useParams<{ postId: string }>()
  const navigate = useNavigate()
  const [posts] = useAtom(postsAtom)
  const [currentUser] = useAtom(currentUserAtom)
  const [loading] = useAtom(loadingAtom)
  const [error] = useAtom(errorAtom)
  
  const post = posts.find(p => getPostIdAsString(p) === postId)

  useEffect(() => {
    if (!post && posts.length > 0) {
      navigate('/')
    }
  }, [post, posts, navigate])

  if (loading) {
    return <Loading />
  }

  if (error) {
    return (
      <Card>
        <div className="error">
          <h2>エラーが発生しました</h2>
          <p>{error}</p>
          <Button onClick={() => navigate('/')}>戻る</Button>
        </div>
      </Card>
    )
  }

  if (!post) {
    return (
      <Card>
        <div className="not-found">
          <h2>投稿が見つかりません</h2>
          <p>指定された投稿は存在しないか、削除された可能性があります。</p>
          <Button onClick={() => navigate('/')}>投稿一覧に戻る</Button>
        </div>
      </Card>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const postIdStr = getPostIdAsString(post)
  const title = getPostTitleAsString(post)
  const content = getPostContentAsString(post)
  const authorId = getPostAuthorIdAsString(post)
  const createdAt = getPostCreatedAt(post)
  const updatedAt = getPostUpdatedAt(post)
  const noices = getPostNoices(post)
  const totalNoices = noices.length
  
  const isAuthor = currentUser && getUserIdAsString(currentUser) === authorId

  return (
    <div className="post-detail">
      <div className="post-detail-header">
        <Button variant="secondary" onClick={() => navigate('/')}>
          ← 一覧に戻る
        </Button>
        {isAuthor && (
          <div className="post-actions">
            <Link to={`/posts/${postIdStr}/edit`}>
              <Button variant="secondary" size="small">編集</Button>
            </Link>
            <Button variant="danger" size="small">削除</Button>
          </div>
        )}
      </div>

      <Card className="post-content-card">
        <div className="post-header">
          <h1 className="post-title">{title}</h1>
          <div className="post-meta">
            <span className="post-author">投稿者: {authorId}</span>
            <span className="post-date">投稿日時: {formatDate(createdAt.toISOString())}</span>
            {updatedAt.getTime() !== createdAt.getTime() && (
              <span className="post-updated">更新日時: {formatDate(updatedAt.toISOString())}</span>
            )}
          </div>
        </div>
        
        <div className="post-content">
          <p>{content}</p>
        </div>
        
        <div className="post-footer">
          <div className="noice-section">
            <div className="noice-count">
              ❤️ {totalNoices} いいね
            </div>
            {currentUser && !isAuthor && (
              <NoiceButton postId={postIdStr} />
            )}
          </div>
        </div>
      </Card>

      <Card className="comments-section">
        <h3>コメント</h3>
        <p className="coming-soon">コメント機能は近日公開予定です。</p>
      </Card>
    </div>
  )
}