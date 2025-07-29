import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { useAtom } from 'jotai'
import { currentUserAtom } from '../contexts/atoms'
import './Layout.css'

interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const [currentUser] = useAtom(currentUserAtom)

  return (
    <div className="layout">
      <header className="header">
        <div className="header-content">
          <Link to="/" className="logo">
            いいね掲示板
          </Link>
          <nav className="nav">
            <Link to="/" className="nav-link">投稿一覧</Link>
            <Link to="/posts/new" className="nav-link">新規投稿</Link>
            {currentUser && (
              <Link to={`/users/${currentUser.id}`} className="nav-link">
                マイページ
              </Link>
            )}
          </nav>
          <div className="user-info">
            {currentUser ? (
              <span className="user-name">{currentUser.username}</span>
            ) : (
              <span className="guest">ゲスト</span>
            )}
          </div>
        </div>
      </header>
      <main className="main">{children}</main>
      <footer className="footer">
        <p>&copy; 2025 いいね掲示板</p>
      </footer>
    </div>
  )
}