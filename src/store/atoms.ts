import { atom } from 'jotai';
import type { User } from '../domain/entities/User';
import type { Post } from '../domain/entities/Post';
import type { PostGroup } from '../domain/entities/PostGroup';
import type { UserId } from '../domain/value-objects/UserId';
import { getUserIdValue } from '../domain/value-objects/UserId';
import { getPostGroupPathValue } from '../domain/value-objects/PostGroupPath';

// User state
export const currentUserIdAtom = atom<UserId | null>(null);
export const usersAtom = atom<Map<string, User>>(new Map());
export const currentUserAtom = atom<User | null>((get) => {
  const userId = get(currentUserIdAtom);
  if (!userId) return null;
  return get(usersAtom).get(getUserIdValue(userId)) || null;
});

// Post state
export const postsAtom = atom<Map<string, Post>>(new Map());
export const selectedPostIdAtom = atom<string | null>(null);

// PostGroup state
export const postGroupsAtom = atom<PostGroup[]>([]);
export const selectedGroupPathAtom = atom<string>('/tech');

// UI state
export const isCreatePostDialogOpenAtom = atom(false);
export const isEditPostDialogOpenAtom = atom(false);
export const editingPostAtom = atom<Post | null>(null);

// Derived atoms
export const filteredPostsAtom = atom<Post[]>((get) => {
  const posts = Array.from(get(postsAtom).values());
  const selectedGroupPath = get(selectedGroupPathAtom);
  
  if (!selectedGroupPath || selectedGroupPath === '/') {
    return posts;
  }
  
  return posts.filter(post => getPostGroupPathValue(post.groupPath) === selectedGroupPath);
});

export const postsByGroupAtom = atom<Map<string, Post[]>>((get) => {
  const posts = Array.from(get(postsAtom).values());
  const postsByGroup = new Map<string, Post[]>();
  
  posts.forEach(post => {
    const groupPath = getPostGroupPathValue(post.groupPath);
    if (!postsByGroup.has(groupPath)) {
      postsByGroup.set(groupPath, []);
    }
    postsByGroup.get(groupPath)!.push(post);
  });
  
  return postsByGroup;
});