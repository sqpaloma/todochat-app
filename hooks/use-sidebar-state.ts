import { useState, useEffect, useCallback, useMemo } from 'react';
import { usePathname } from 'next/navigation';
import { useResponsiveSSR } from './use-responsive-ssr';

interface UseSidebarStateProps {
  isOpen: boolean;
  onClose: () => void;
}

export function useSidebarState({ isOpen, onClose }: UseSidebarStateProps) {
  const pathname = usePathname();
  const { isMobile, isMounted } = useResponsiveSSR();
  
  // Estados locais do sidebar
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showTeamDropdown, setShowTeamDropdown] = useState(false);
  const [activeMemberMenu, setActiveMemberMenu] = useState<string | null>(null);

  // Memoized handlers
  const toggleCollapse = useCallback(() => {
    setIsCollapsed(prev => !prev);
  }, []);

  const toggleTeamDropdown = useCallback(() => {
    setShowTeamDropdown(prev => !prev);
    setActiveMemberMenu(null); // Close member menu when opening team dropdown
  }, []);

  const toggleMemberMenu = useCallback((memberId: string) => {
    setActiveMemberMenu(prev => prev === memberId ? null : memberId);
  }, []);

  const closeMemberMenu = useCallback(() => {
    setActiveMemberMenu(null);
  }, []);

  // Efeito unificado para sidebar behavior
  useEffect(() => {
    if (!isMounted) return; // Wait for client-side mounting

    // Close sidebar on mobile when route changes
    if (isMobile && isOpen) {
      onClose();
    }

    // Manage body scroll on mobile
    if (isOpen && isMobile) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [pathname, isMobile, isOpen, onClose, isMounted]);

  // Memoized state object
  const sidebarState = useMemo(() => ({
    isCollapsed,
    showTeamDropdown,
    activeMemberMenu,
    isMobile: isMounted ? isMobile : false,
  }), [isCollapsed, showTeamDropdown, activeMemberMenu, isMobile, isMounted]);

  // Memoized actions object
  const sidebarActions = useMemo(() => ({
    toggleCollapse,
    toggleTeamDropdown,
    toggleMemberMenu,
    closeMemberMenu,
  }), [toggleCollapse, toggleTeamDropdown, toggleMemberMenu, closeMemberMenu]);

  return {
    state: sidebarState,
    actions: sidebarActions,
  };
}