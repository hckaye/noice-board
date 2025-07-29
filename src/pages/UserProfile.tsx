import { useParams } from 'react-router-dom'
import { useAtom } from 'jotai'
import { postsAtom, currentUserAtom } from '../contexts/atoms'
import Card from '../components/Card'
import Button from '../components/Button'
import { getPostIdAsString, getPostTitleAsString, getPostContentAsString, getPostAuthorIdAsString, getPostCreatedAt, getPostNoices } from '../domain/entities/Post'
import { getUserIdAsString } from '../domain/entities/User'
import './UserProfile.css'

export default function UserProfile() {
  const { userId } = useParams<{ userId: string }>()
  const [posts] = useAtom(postsAtom)
  const [currentUser] = useAtom(currentUserAtom)
  
  // サンプルユーザーデータ（実際の実装では外部APIから取得）
  const user = {
    id: userId,
    username: userId === 'user-1' ? 'alice_dev' : 'bob_design',
    displayName: userId === 'user-1' ? 'Alice Developer' : 'Bob Designer',
    joinedAt: '2024-01-01',
    totalNoices: 150,
    postsCount: posts.filter(p => getPostAuthorIdAsString(p) === userId).length,
  }
  
  const userPosts = posts.filter(p => getPostAuthorIdAsString(p) === userId)
  const isOwnProfile = currentUser && getUserIdAsString(currentUser) === userId

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  return (
    <div className="user-profile">
      <Card className="user-info-card">
        <div className="user-header">
          <div className="user-avatar">
            {user.displayName.charAt(0).toUpperCase()}
          </div>
          <div className="user-details">
            <h1 className="user-display-name">{user.displayName}</h1>
            <p className="user-username">@{user.username}</p>
            <p className="user-joined">参加日: {formatDate(user.joinedAt)}</p>
          </div>
        </div>
        
        <div className="user-stats">
          <div className="stat-item">
            <div className="stat-value">{user.postsCount}</div>
            <div className="stat-label">投稿数</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">{user.totalNoices}</div>
            <div className="stat-label">獲得いいね</div>
          </div>
        </div>
        
        {isOwnProfile && (
          <div className="profile-actions">
            <Button variant="secondary">プロフィール編集</Button>
          </div>
        )}
      </Card>

      <Card className="user-posts-card">
        <h2>投稿一覧</h2>
        {userPosts.length === 0 ? (
          <div className="no-posts">
            <p>{isOwnProfile ? 'まだ投稿がありません。' : 'この ユーザーの投稿はありません。'}</p>
          </div>
        ) : (
          <div className="posts-list">
            {userPosts.map(post => {
              const postId = getPostIdAsString(post)
              const title = getPostTitleAsString(post)
              const content = getPostContentAsString(post)
              const createdAt = getPostCreatedAt(post).toISOString()
              const noices = getPostNoices(post)
              const totalNoices = noices.length
              
              return (
                <div key={postId} className="post-item">
                  <h3 className="post-item-title">{title}</h3>
                  <p className="post-item-preview">
                    {content.slice(0, 100)}
                    {content.length > 100 ? '...' : ''}
                  </p>
                  <div className="post-item-meta">
                    <span className="post-item-date">
                      {formatDate(createdAt)}
                    </span>
                    <span className="post-item-noices">
                      ❤️ {totalNoices}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </Card>
    </div>
  )
}