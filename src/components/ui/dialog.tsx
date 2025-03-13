'use client';

import * as React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { XIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { JSX } from 'react';

const Dialog = (
    props: React.ComponentProps<typeof DialogPrimitive.Root>
): JSX.Element => {
    return <DialogPrimitive.Root data-slot="dialog" {...props} />;
};

const DialogTrigger = (
    props: React.ComponentProps<typeof DialogPrimitive.Trigger>
): JSX.Element => {
    return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />;
};

const DialogPortal = (
    props: React.ComponentProps<typeof DialogPrimitive.Portal>
): JSX.Element => {
    return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />;
};

const DialogClose = (
    props: React.ComponentProps<typeof DialogPrimitive.Close>
): JSX.Element => {
    return <DialogPrimitive.Close data-slot="dialog-close" {...props} />;
};

const DialogOverlay = ({
    className,
    ...props
}: React.ComponentProps<typeof DialogPrimitive.Overlay>): JSX.Element => {
    return (
        <DialogPrimitive.Overlay
            data-slot="dialog-overlay"
            className={cn(
                'data-[state=open]:animate-in data-[state=closed]:animate-out fixed inset-0 z-50 bg-black/80',
                className
            )}
            {...props}
        />
    );
};

const DialogContent = ({
    className,
    children,
    ...props
}: React.ComponentProps<typeof DialogPrimitive.Content>): JSX.Element => {
    return (
        <DialogPortal>
            <DialogOverlay />
            <DialogPrimitive.Content
                data-slot="dialog-content"
                className={cn(
                    'bg-background data-[state=open]:animate-in fixed top-[50%] left-[50%] z-50 grid w-full max-w-md translate-x-[-50%] translate-y-[-50%] rounded-lg border p-6 shadow-lg',
                    className
                )}
                {...props}
            >
                {children}
                <DialogPrimitive.Close className="absolute top-4 right-4 opacity-70 transition-opacity hover:opacity-100">
                    <XIcon />
                    <span className="sr-only">Close</span>
                </DialogPrimitive.Close>
            </DialogPrimitive.Content>
        </DialogPortal>
    );
};

const DialogHeader = ({
    className,
    ...props
}: React.ComponentProps<'div'>): JSX.Element => {
    return (
        <div
            data-slot="dialog-header"
            className={cn('flex flex-col gap-2 text-center', className)}
            {...props}
        />
    );
};

const DialogFooter = ({
    className,
    ...props
}: React.ComponentProps<'div'>): JSX.Element => {
    return (
        <div
            data-slot="dialog-footer"
            className={cn('flex justify-end gap-2', className)}
            {...props}
        />
    );
};

const DialogTitle = ({
    className,
    ...props
}: React.ComponentProps<typeof DialogPrimitive.Title>): JSX.Element => {
    return (
        <DialogPrimitive.Title
            className={cn('text-lg font-semibold', className)}
            {...props}
        />
    );
};

const DialogDescription = ({
    className,
    ...props
}: React.ComponentProps<typeof DialogPrimitive.Description>): JSX.Element => {
    return (
        <DialogPrimitive.Description
            className={cn('text-sm text-muted-foreground', className)}
            {...props}
        />
    );
};

export {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogOverlay,
    DialogPortal,
    DialogTitle,
    DialogTrigger
};
