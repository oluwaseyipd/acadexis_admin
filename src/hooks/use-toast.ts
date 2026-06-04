import { useCallback, type ReactNode, type ReactElement, type JSXElementConstructor } from 'react';
import { toast as sonnerToast, Toaster } from 'sonner';

export interface Toast {
  id?: string;
  title?: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

/**
 * useToast hook - Compatible with shadcn/ui pattern but uses Sonner underneath
 */
export function useToast() {
  return {
    toast: useCallback(
      (props: Toast) => {
        const message = props.title || props.description;
        sonnerToast(message, {
          description: props.description && props.title ? props.description : undefined,
          action: props.action
            ? {
                label: props.action.label,
                onClick: props.action.onClick,
              }
            : undefined,
        });
      },
      []
    ),
  };
}

/**
 * Direct toast function for standalone usage
 */
export const toast = {
  success: (message: string, description?: string) => {
    sonnerToast.success(message, {
      description,
    });
  },
  error: (message: string, description?: string) => {
    sonnerToast.error(message, {
      description,
    });
  },
  loading: (message: string, description?: string) => {
    sonnerToast.loading(message, {
      description,
    });
  },
  info: (message: string, description?: string) => {
    sonnerToast(message, {
      description,
    });
  },
  custom: (component: ReactNode) => {
    sonnerToast.custom(() => component as ReactElement<unknown, string | JSXElementConstructor<unknown>>);
  },
};

export { Toaster };
