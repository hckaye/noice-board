import { useAtom } from 'jotai'
import { postsAtom, loadingAtom, errorAtom } from '../contexts/atoms'
import { createPost } from '../domain/entities/Post'
import { createPostId } from '../domain/value-objects/PostId'
import { createPostTitle } from '../domain/value-objects/PostTitle'
import { createPostContent } from '../domain/value-objects/PostContent'
import { createUserId } from '../domain/value-objects/UserId'
import { createDefaultPostGroupPath } from '../domain/value-objects/PostGroupPath'
import { createEmptyHashtagList } from '../domain/value-objects/Hashtag'
import { createPendingReviewStatus } from '../domain/value-objects/ReviewStatus'

export function usePosts() {
  const [, setPosts] = useAtom(postsAtom)
  const [, setLoading] = useAtom(loadingAtom)
  const [, setError] = useAtom(errorAtom)

  const loadPosts = async () => {
    setLoading(true)
    setError(null)
    
    try {
      // サンプルデータを使用（実際の実装では外部APIを呼び出す）
      const sampleData = [
        {
          id: 'post-1',
          title: 'はじめての投稿',
          content: 'いいね掲示板へようこそ！この投稿はサンプルです。実際の投稿機能を使って、あなたの考えや意見を共有してみてください。',
          authorId: 'user-1',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          totalNoices: 5,
        },
        {
          id: 'post-2',
          title: 'TypeScriptについて',
          content: 'TypeScriptを使った開発について話し合いましょう。型安全性がもたらすメリットや、開発効率の向上について議論できればと思います。',
          authorId: 'user-2',
          createdAt: new Date(Date.now() - 3600000).toISOString(),
          updatedAt: new Date(Date.now() - 3600000).toISOString(),
          totalNoices: 12,
        },
        {
          id: 'post-3',
          title: 'React hooks の活用',
          content: 'useState、useEffect、useContext などの React hooks を効果的に使う方法について共有したいと思います。',
          authorId: 'user-1',
          createdAt: new Date(Date.now() - 7200000).toISOString(),
          updatedAt: new Date(Date.now() - 7200000).toISOString(),
          totalNoices: 8,
        },
      ]
      
      // ドメインオブジェクトに変換
      const posts = sampleData.map(data => {
        const postIdResult = createPostId(data.id)
        const titleResult = createPostTitle(data.title)
        const contentResult = createPostContent(data.content)
        const authorIdResult = createUserId(data.authorId)
        
        if (
          postIdResult.success && 
          titleResult.success && 
          contentResult.success && 
          authorIdResult.success
        ) {
          return createPost(
            postIdResult.data,
            titleResult.data,
            contentResult.data,
            authorIdResult.data,
            createDefaultPostGroupPath(),
            createEmptyHashtagList(),
            createPendingReviewStatus(),
            [],
            [],
            [],
            new Date(data.createdAt),
            new Date(data.updatedAt)
          )
        }
        throw new Error('Invalid post data')
      })
      
      setPosts(posts)
    } catch (error) {
      setError(error instanceof Error ? error.message : '投稿の読み込みに失敗しました')
    } finally {
      setLoading(false)
    }
  }

  return {
    loadPosts,
  }
}