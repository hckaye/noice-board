import { useEffect } from 'react';
import { useSetAtom } from 'jotai';
import { 
  usersAtom, 
  postsAtom, 
  postGroupsAtom, 
  currentUserIdAtom 
} from '../store/atoms';
import { MockNoiceBoardDataStoreApi } from '../infrastructure/mock/MockNoiceBoardDataStoreApi';

export const useInitializeApp = () => {
  const setUsers = useSetAtom(usersAtom);
  const setPosts = useSetAtom(postsAtom);
  const setPostGroups = useSetAtom(postGroupsAtom);
  const setCurrentUserId = useSetAtom(currentUserIdAtom);

  useEffect(() => {
    const initializeData = async () => {
      const api = new MockNoiceBoardDataStoreApi();

      // Load users
      const usersResult = await api.listUsers();
      if (usersResult.success) {
        const usersMap = new Map();
        usersResult.value.forEach(user => {
          usersMap.set(user.id as string, user);
        });
        setUsers(usersMap);
        
        // Set first user as current user
        if (usersResult.value.length > 0) {
          setCurrentUserId(usersResult.value[0].id);
        }
      }

      // Load posts
      const postsMap = new Map();
      const groupsResult = await api.listPostGroups();
      
      if (groupsResult.success) {
        for (const group of groupsResult.value) {
          const groupPath = `/${group.name}` as unknown as Parameters<typeof api.listPosts>[0];
          
          const postsResult = await api.listPosts(groupPath);
          if (postsResult.success) {
            postsResult.value.forEach(post => {
              postsMap.set(post.id as string, post);
            });
          }
        }
        
        setPosts(postsMap);
        setPostGroups(groupsResult.value);
      }
    };

    initializeData();
  }, [setUsers, setPosts, setPostGroups, setCurrentUserId]);
};