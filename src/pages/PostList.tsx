import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAtom } from 'jotai'
import { filteredPostsAtom, loadingAtom, errorAtom } from '../contexts/atoms'
import Card from '../components/Card'
import Button from '../components/Button'
import Loading from '../components/Loading'
import { usePosts } from '../hooks/usePosts'
import { useAuth } from '../hooks/useAuth'
import type { Post } from '../domain/entities/Post'
import { getPostIdAsString, getPostTitleAsString, getPostContentAsString, getPostAuthorIdAsString, getPostCreatedAt, getPostNoices } from '../domain/entities/Post'
import './PostList.css'

export default function PostList() {
  const [posts] = useAtom(filteredPostsAtom)
  const [loading] = useAtom(loadingAtom)
  const [error] = useAtom(errorAtom)
  const { loadPosts } = usePosts()
  const { initializeAuth } = useAuth()

  useEffect(() => {
    initializeAuth()
    loadPosts()
  }, [loadPosts, initializeAuth])

  if (loading) {
    return <Loading />
  }

  if (error) {
    return (
      <Card>
        <div className="error">
          <h2>エラーが発生しました</h2>
          <p>{error}</p>
          <Button onClick={() => loadPosts()}>再試行</Button>
        </div>
      </Card>
    )
  }

  return (
    <div className="post-list">
      <div className="post-list-header">
        <h1>投稿一覧</h1>
        <Link to="/posts/new">
          <Button>新規投稿</Button>
        </Link>
      </div>

      {posts.length === 0 ? (
        <Card>
          <div className="empty-state">
            <h2>投稿がありません</h2>
            <p>最初の投稿を作成してみましょう！</p>
            <Link to="/posts/new">
              <Button>新規投稿</Button>
            </Link>
          </div>
        </Card>
      ) : (
        <div className="posts-grid">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  )
}

interface PostCardProps {
  post: Post
}

function PostCard({ post }: PostCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const postId = getPostIdAsString(post)
  const title = getPostTitleAsString(post)
  const content = getPostContentAsString(post)
  const authorId = getPostAuthorIdAsString(post)
  const createdAt = getPostCreatedAt(post).toISOString()
  const noices = getPostNoices(post)
  const totalNoices = noices.length

  return (
    <Card className="post-card">
      <div className="post-card-header">
        <Link to={`/posts/${postId}`} className="post-title">
          {title}
        </Link>
        <div className="post-meta">
          <span className="post-author">by {authorId}</span>
          <span className="post-date">{formatDate(createdAt)}</span>
        </div>
      </div>
      
      <div className="post-content">
        <p>{content.slice(0, 150)}{content.length > 150 ? '...' : ''}</p>
      </div>
      
      <div className="post-card-footer">
        <div className="noice-count">
          ❤️ {totalNoices || 0}
        </div>
        <Link to={`/posts/${postId}`}>
          <Button variant="secondary" size="small">詳細を見る</Button>
        </Link>
      </div>
    </Card>
  )
}