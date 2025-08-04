import { useState } from "react";

/**
 * Hook for managing modal state
 */
export function useModalManager() {
  const [showAddMemberDialog, setShowAddMemberDialog] = useState(false);
  const [showEditMemberDialog, setShowEditMemberDialog] = useState(false);
  const [selectedMember, setSelectedMember] = useState<any>(null);

  const openAddMemberDialog = () => setShowAddMemberDialog(true);
  const closeAddMemberDialog = () => setShowAddMemberDialog(false);

  const openEditMemberDialog = (member: any) => {
    setSelectedMember(member);
    setShowEditMemberDialog(true);
  };
  const closeEditMemberDialog = () => {
    setSelectedMember(null);
    setShowEditMemberDialog(false);
  };

  return {
    showAddMemberDialog,
    showEditMemberDialog,
    selectedMember,
    openAddMemberDialog,
    closeAddMemberDialog,
    openEditMemberDialog,
    closeEditMemberDialog,
  };
}
