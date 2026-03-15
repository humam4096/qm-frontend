"use client"

import * as React from "react"
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog"
import { cn } from "@/lib/utils"
import { XIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

const Sheet = DialogPrimitive.Root

const SheetTrigger = DialogPrimitive.Trigger

const SheetPortal = DialogPrimitive.Portal

const SheetClose = DialogPrimitive.Close

const SheetOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Backdrop>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Backdrop>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Backdrop
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-black/50 duration-100 data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0",
      className
    )}
    {...props}
  />
))
SheetOverlay.displayName = DialogPrimitive.Backdrop.displayName

interface SheetContentProps
  extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Popup> {
  side?: "top" | "right" | "bottom" | "left"
}

const SheetContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Popup>,
  SheetContentProps
>(({ side = "right", className, children, dir, ...props }, ref) => {
  const isRTL = dir === "rtl"
  
  // Adjust side for RTL
  const adjustedSide = isRTL && (side === "right" || side === "left") 
    ? side === "right" ? "left" : "right"
    : side

  const sideStyles = {
    top: "inset-x-0 top-0 border-b data-open:slide-in-from-top data-closed:slide-out-to-top",
    right: "inset-y-0 right-0 h-full w-full max-w-sm border-l data-open:slide-in-from-right data-closed:slide-out-to-right",
    bottom: "inset-x-0 bottom-0 border-t data-open:slide-in-from-bottom data-closed:slide-out-to-bottom",
    left: "inset-y-0 left-0 h-full w-full max-w-sm border-r data-open:slide-in-from-left data-closed:slide-out-to-left",
  }

  const closeButtonPosition = isRTL 
    ? "absolute top-4 left-4"
    : "absolute top-4 right-4"

  return (
    <SheetPortal>
      <SheetOverlay />
      <DialogPrimitive.Popup
        ref={ref}
        className={cn(
          "fixed z-50 gap-4 bg-background p-4 shadow-lg duration-200 outline-none overflow-y-scroll data-open:animate-in data-closed:animate-out",
          sideStyles[adjustedSide],
          className
        )}
        dir={dir}
        {...props}
      >
        {children}
        <SheetClose
          render={
            <Button
              variant="ghost"
              size="icon-sm"
              className={closeButtonPosition}
            />
          }
        >
          <XIcon className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </SheetClose>
      </DialogPrimitive.Popup>
    </SheetPortal>
  )
})
SheetContent.displayName = DialogPrimitive.Popup.displayName

const SheetHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("flex flex-col gap-2 text-left", className)}
    {...props}
  />
)
SheetHeader.displayName = "SheetHeader"

const SheetFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
      className
    )}
    {...props}
  />
)
SheetFooter.displayName = "SheetFooter"

const SheetTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn("text-lg font-semibold leading-none tracking-tight", className)}
    {...props}
  />
))
SheetTitle.displayName = DialogPrimitive.Title.displayName

const SheetDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
SheetDescription.displayName = DialogPrimitive.Description.displayName

export {
  Sheet,
  SheetPortal,
  SheetOverlay,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
}
