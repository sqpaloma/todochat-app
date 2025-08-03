import { useState, useCallback, useMemo } from 'react';

// Tipos de modal suportados
type ModalType = 'add' | 'edit' | 'details' | 'delete' | 'confirm';

interface ModalState<T = any> {
  isOpen: boolean;
  data?: T;
}

// Hook para gerenciar múltiplos modais de forma eficiente
export function useModalManager<T = any>() {
  const [modals, setModals] = useState<Record<ModalType, ModalState<T>>>({
    add: { isOpen: false },
    edit: { isOpen: false },
    details: { isOpen: false },
    delete: { isOpen: false },
    confirm: { isOpen: false },
  });

  // Abrir modal com dados opcionais
  const openModal = useCallback((type: ModalType, data?: T) => {
    setModals(prev => ({
      ...prev,
      [type]: { isOpen: true, data }
    }));
  }, []);

  // Fechar modal específico
  const closeModal = useCallback((type: ModalType) => {
    setModals(prev => ({
      ...prev,
      [type]: { isOpen: false, data: undefined }
    }));
  }, []);

  // Fechar todos os modais
  const closeAllModals = useCallback(() => {
    setModals({
      add: { isOpen: false },
      edit: { isOpen: false },
      details: { isOpen: false },
      delete: { isOpen: false },
      confirm: { isOpen: false },
    });
  }, []);

  // Helpers memoizados para tipos específicos
  const modalHelpers = useMemo(() => ({
    // Modal de adicionar
    add: {
      isOpen: modals.add.isOpen,
      open: () => openModal('add'),
      close: () => closeModal('add'),
    },
    // Modal de editar
    edit: {
      isOpen: modals.edit.isOpen,
      data: modals.edit.data,
      open: (data?: T) => openModal('edit', data),
      close: () => closeModal('edit'),
    },
    // Modal de detalhes
    details: {
      isOpen: modals.details.isOpen,
      data: modals.details.data,
      open: (data?: T) => openModal('details', data),
      close: () => closeModal('details'),
    },
    // Modal de confirmação
    confirm: {
      isOpen: modals.confirm.isOpen,
      data: modals.confirm.data,
      open: (data?: T) => openModal('confirm', data),
      close: () => closeModal('confirm'),
    },
  }), [modals, openModal, closeModal]);

  return {
    modals,
    openModal,
    closeModal,
    closeAllModals,
    ...modalHelpers,
  };
}