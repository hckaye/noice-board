import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AppProvider } from './contexts/AppProvider'
import Layout from './components/Layout'
import PostList from './pages/PostList'
import PostDetail from './pages/PostDetail'
import PostForm from './pages/PostForm'
import UserProfile from './pages/UserProfile'
import './App.css'

function App() {
  return (
    <AppProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<PostList />} />
            <Route path="/posts/:postId" element={<PostDetail />} />
            <Route path="/posts/new" element={<PostForm />} />
            <Route path="/posts/:postId/edit" element={<PostForm />} />
            <Route path="/users/:userId" element={<UserProfile />} />
          </Routes>
        </Layout>
      </Router>
    </AppProvider>
  )
}

export default App;
