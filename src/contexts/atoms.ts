import { atom } from 'jotai'
import type { User } from '../domain/entities/User'
import type { Post } from '../domain/entities/Post'
import type { PostGroup } from '../domain/entities/PostGroup'

export const currentUserAtom = atom<User | null>(null)
export const postsAtom = atom<Post[]>([])
export const postGroupsAtom = atom<PostGroup[]>([])
export const loadingAtom = atom<boolean>(false)
export const errorAtom = atom<string | null>(null)

export const filteredPostsAtom = atom((get) => {
  const posts = get(postsAtom)
  return posts.sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )
})

export const postByIdAtom = (postId: string) => atom((get) => {
  const posts = get(postsAtom)
  return posts.find(post => post.id === postId) || null
})