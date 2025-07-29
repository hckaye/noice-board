import React from 'react';
import { useAtom, useSetAtom } from 'jotai';
import { currentUserAtom, postGroupsAtom, selectedGroupPathAtom, isCreatePostDialogOpenAtom } from '../store/atoms';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Heart, Plus, LogIn } from 'lucide-react';
import { getNoiceAmountValue } from '../domain/value-objects/NoiceAmount';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [currentUser] = useAtom(currentUserAtom);
  const [postGroups] = useAtom(postGroupsAtom);
  const [selectedGroupPath, setSelectedGroupPath] = useAtom(selectedGroupPathAtom);
  const setIsCreatePostDialogOpen = useSetAtom(isCreatePostDialogOpenAtom);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/70 dark:bg-slate-900/70 border-b border-slate-200 dark:border-slate-700">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-violet-500 bg-clip-text text-transparent">
              Noice Board
            </h1>
            
            {/* Group Navigation */}
            <nav className="hidden md:flex items-center space-x-1">
              {postGroups.map((group) => (
                <Button
                  key={group.name}
                  variant={selectedGroupPath === `/${group.name}` ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setSelectedGroupPath(`/${group.name}`)}
                  className="transition-all duration-200"
                >
                  {group.name}
                  <Badge variant="secondary" className="ml-2">
                    {group.posts.length}
                  </Badge>
                </Button>
              ))}
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            {currentUser ? (
              <>
                <div className="flex items-center space-x-2">
                  <Heart className="w-5 h-5 text-pink-500" />
                  <span className="font-semibold">{getNoiceAmountValue(currentUser.noiceAmount)}</span>
                  <span className="text-sm text-slate-500">Noice</span>
                </div>
                
                <Button 
                  size="sm" 
                  className="bg-gradient-to-r from-pink-500 to-violet-500 hover:from-pink-600 hover:to-violet-600 text-white"
                  onClick={() => setIsCreatePostDialogOpen(true)}
                >
                  <Plus className="w-4 h-4 mr-1" />
                  投稿する
                </Button>
                
                <Avatar className="w-10 h-10 ring-2 ring-offset-2 ring-pink-500/20">
                  <AvatarImage src={currentUser.avatarUrl} alt={currentUser.displayName} />
                  <AvatarFallback>{currentUser.displayName.slice(0, 2)}</AvatarFallback>
                </Avatar>
              </>
            ) : (
              <Button variant="outline" size="sm">
                <LogIn className="w-4 h-4 mr-1" />
                ログイン
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
};