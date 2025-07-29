import { useAtom } from 'jotai'
import { currentUserAtom } from '../contexts/atoms'
import { createUser } from '../domain/entities/User'
import { createUserId } from '../domain/value-objects/UserId'
import { createUsername } from '../domain/value-objects/Username'
// UserDisplayNameは未実装のため、string型で代用
const createUserDisplayName = (name: string) => ({ success: true, value: name as any })
import { createNoiceAmount } from '../domain/value-objects/NoiceAmount'

export function useAuth() {
  const [currentUser, setCurrentUser] = useAtom(currentUserAtom)

  const login = (userId: string) => {
    // デモ用のログイン実装
    const userIdResult = createUserId(userId)
    const usernameResult = createUsername(userId === 'user-1' ? 'alice_dev' : 'bob_design')
    const displayNameResult = createUserDisplayName(userId === 'user-1' ? 'Alice Developer' : 'Bob Designer')
    const noiceAmountResult = createNoiceAmount(100)
    
    if (
      userIdResult.success && 
      usernameResult.success && 
      displayNameResult.success && 
      noiceAmountResult.success
    ) {
      const user = createUser(
        userIdResult.data,
        usernameResult.data,
        displayNameResult.value,
        noiceAmountResult.data,
        new Date(),
        ''
      )
      setCurrentUser(user)
    }
  }

  const logout = () => {
    setCurrentUser(null)
  }

  // デモ用：自動ログイン
  const initializeAuth = () => {
    if (!currentUser) {
      login('user-1') // デフォルトでuser-1としてログイン
    }
  }

  return {
    currentUser,
    login,
    logout,
    initializeAuth,
  }
}