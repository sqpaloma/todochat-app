"use client";

import React, { createContext, useContext, useReducer, useMemo, ReactNode } from 'react';

// Estado global da aplicação
interface AppState {
  selectedTeam: string;
  sidebarOpen: boolean;
  theme: 'light' | 'dark' | 'system';
  notifications: Notification[];
  // Layout state (consolidando com LayoutContext)
  isCollapsed: boolean;
}

interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  message: string;
  timestamp: number;
}

// Ações possíveis
type AppAction =
  | { type: 'SET_SELECTED_TEAM'; payload: string }
  | { type: 'TOGGLE_SIDEBAR' }
  | { type: 'SET_SIDEBAR_OPEN'; payload: boolean }
  | { type: 'TOGGLE_COLLAPSE' }
  | { type: 'SET_COLLAPSED'; payload: boolean }
  | { type: 'SET_THEME'; payload: 'light' | 'dark' | 'system' }
  | { type: 'ADD_NOTIFICATION'; payload: Omit<Notification, 'id' | 'timestamp'> }
  | { type: 'REMOVE_NOTIFICATION'; payload: string }
  | { type: 'CLEAR_NOTIFICATIONS' };

// Estado inicial
const initialState: AppState = {
  selectedTeam: 'team-1',
  sidebarOpen: false,
  theme: 'system',
  notifications: [],
  isCollapsed: false,
};

// Reducer para gerenciar estado
function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_SELECTED_TEAM':
      return { ...state, selectedTeam: action.payload };
    
    case 'TOGGLE_SIDEBAR':
      return { ...state, sidebarOpen: !state.sidebarOpen };
    
    case 'SET_SIDEBAR_OPEN':
      return { ...state, sidebarOpen: action.payload };
    
    case 'TOGGLE_COLLAPSE':
      return { ...state, isCollapsed: !state.isCollapsed };
    
    case 'SET_COLLAPSED':
      return { ...state, isCollapsed: action.payload };
    
    case 'SET_THEME':
      return { ...state, theme: action.payload };
    
    case 'ADD_NOTIFICATION':
      return {
        ...state,
        notifications: [
          ...state.notifications,
          {
            ...action.payload,
            id: `notification-${Date.now()}-${Math.random()}`,
            timestamp: Date.now(),
          },
        ],
      };
    
    case 'REMOVE_NOTIFICATION':
      return {
        ...state,
        notifications: state.notifications.filter(n => n.id !== action.payload),
      };
    
    case 'CLEAR_NOTIFICATIONS':
      return { ...state, notifications: [] };
    
    default:
      return state;
  }
}

// Context types
interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  // Helper functions
  setSelectedTeam: (teamId: string) => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  toggleCollapse: () => void;
  setCollapsed: (collapsed: boolean) => void;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
}

// Create context
const AppContext = createContext<AppContextType | undefined>(undefined);

// Provider component
interface AppProviderProps {
  children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Memoized helper functions
  const contextValue = useMemo(() => ({
    state,
    dispatch,
    setSelectedTeam: (teamId: string) => dispatch({ type: 'SET_SELECTED_TEAM', payload: teamId }),
    toggleSidebar: () => dispatch({ type: 'TOGGLE_SIDEBAR' }),
    setSidebarOpen: (open: boolean) => dispatch({ type: 'SET_SIDEBAR_OPEN', payload: open }),
    toggleCollapse: () => dispatch({ type: 'TOGGLE_COLLAPSE' }),
    setCollapsed: (collapsed: boolean) => dispatch({ type: 'SET_COLLAPSED', payload: collapsed }),
    setTheme: (theme: 'light' | 'dark' | 'system') => dispatch({ type: 'SET_THEME', payload: theme }),
    addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => 
      dispatch({ type: 'ADD_NOTIFICATION', payload: notification }),
    removeNotification: (id: string) => dispatch({ type: 'REMOVE_NOTIFICATION', payload: id }),
    clearNotifications: () => dispatch({ type: 'CLEAR_NOTIFICATIONS' }),
  }), [state, dispatch]);

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
}

// Custom hook para usar o context
export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}

// Hooks específicos para partes do estado
export function useSelectedTeam() {
  const { state, setSelectedTeam } = useAppContext();
  return [state.selectedTeam, setSelectedTeam] as const;
}

export function useSidebar() {
  const { state, toggleSidebar, setSidebarOpen } = useAppContext();
  return {
    isOpen: state.sidebarOpen,
    toggle: toggleSidebar,
    setOpen: setSidebarOpen,
  };
}

export function useNotifications() {
  const { state, addNotification, removeNotification, clearNotifications } = useAppContext();
  return {
    notifications: state.notifications,
    add: addNotification,
    remove: removeNotification,
    clear: clearNotifications,
  };
}