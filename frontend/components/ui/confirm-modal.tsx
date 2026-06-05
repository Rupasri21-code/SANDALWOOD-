import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean;
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = 'Continue',
  cancelText = 'Cancel',
  isDestructive = true,
}: ConfirmModalProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="bg-zinc-900 border-zinc-800 text-white">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl font-semibold">
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-zinc-400">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-6">
          <AlertDialogCancel
            onClick={onClose}
            className="bg-transparent border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white sm:mt-0"
          >
            {cancelText}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              onConfirm();
              onClose();
            }}
            className={
              isDestructive
                ? 'bg-red-500/20 text-red-500 hover:bg-red-500 hover:text-white border border-red-500/50'
                : 'bg-green-500/20 text-green-500 hover:bg-green-500 hover:text-white border border-green-500/50'
            }
          >
            {confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
