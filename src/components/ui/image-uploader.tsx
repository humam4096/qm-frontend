import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ImageIcon, Trash2, UploadCloud } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ImageUploaderProps {
  value?: File[];
  onChange: (files: File[]) => void;
  onErrorChange?: (message: string | null) => void;
  accept?: string[];
  maxFiles?: number;
  maxFileSizeInBytes?: number;
  disabled?: boolean;
  className?: string;
  labels?: {
    title: string;
    description: string;
    hint: string;
    browse: string;
    remove: string;
  };
  messages?: {
    invalidType: string;
    fileTooLarge: string;
    tooManyFiles: string;
  };
}

interface PreviewFile {
  file: File;
  previewUrl: string;
  key: string;
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function ImageUploader({
  value = [],
  onChange,
  onErrorChange,
  accept = ["image/jpeg", "image/png", "image/webp"],
  maxFiles = 5,
  maxFileSizeInBytes = 5 * 1024 * 1024,
  disabled = false,
  className,
  labels,
  messages,
}: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const acceptedTypes = useMemo(() => new Set(accept), [accept]);
  const acceptAttribute = useMemo(() => accept.join(","), [accept]);

  const setError = useCallback(
    (message: string | null) => {
      setLocalError(message);
      onErrorChange?.(message);
    },
    [onErrorChange]
  );

  const previews = useMemo<PreviewFile[]>(
    () =>
      value.map((file) => ({
        file,
        previewUrl: URL.createObjectURL(file),
        key: `${file.name}-${file.lastModified}-${file.size}`,
      })),
    [value]
  );

  useEffect(() => {
    return () => {
      previews.forEach((preview) => URL.revokeObjectURL(preview.previewUrl));
    };
  }, [previews]);

  const mergeFiles = useCallback(
    (incomingFiles: File[]) => {
      if (disabled || incomingFiles.length === 0) return;

      const nextFiles = [...value];
      const existingKeys = new Set(
        value.map((file) => `${file.name}-${file.lastModified}-${file.size}`)
      );

      for (const file of incomingFiles) {
        const key = `${file.name}-${file.lastModified}-${file.size}`;
        if (existingKeys.has(key)) continue;

        if (!acceptedTypes.has(file.type)) {
          setError(messages?.invalidType ?? "Invalid file type.");
          return;
        }

        if (file.size > maxFileSizeInBytes) {
          setError(messages?.fileTooLarge ?? "File is too large.");
          return;
        }

        if (nextFiles.length >= maxFiles) {
          setError(messages?.tooManyFiles ?? "Too many files selected.");
          return;
        }

        existingKeys.add(key);
        nextFiles.push(file);
      }

      setError(null);
      onChange(nextFiles);
    },
    [
      acceptedTypes,
      disabled,
      maxFileSizeInBytes,
      maxFiles,
      messages?.fileTooLarge,
      messages?.invalidType,
      messages?.tooManyFiles,
      onChange,
      setError,
      value,
    ]
  );

  const handleFileSelection = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(event.target.files ?? []);
      mergeFiles(files);
      event.target.value = "";
    },
    [mergeFiles]
  );

  const handleDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      event.stopPropagation();
      setIsDragging(false);
      mergeFiles(Array.from(event.dataTransfer.files ?? []));
    },
    [mergeFiles]
  );

  const handleRemove = useCallback(
    (indexToRemove: number) => {
      setError(null);
      onChange(value.filter((_, index) => index !== indexToRemove));
    },
    [onChange, setError, value]
  );

  return (
    <div className={cn("space-y-3", className)}>
      {value.length === 0 && (
        <div
          role="button"
          tabIndex={disabled ? -1 : 0}
          onClick={() => !disabled && inputRef.current?.click()}
          onDragEnter={(event) => {
            event.preventDefault();
            event.stopPropagation();
            if (!disabled) setIsDragging(true);
          }}
          onDragOver={(event) => {
            event.preventDefault();
            event.stopPropagation();
            if (!disabled) setIsDragging(true);
          }}
          onDragLeave={(event) => {
            event.preventDefault();
            event.stopPropagation();
            if (event.currentTarget.contains(event.relatedTarget as Node | null)) {
              return;
            }
            setIsDragging(false);
          }}
          onDrop={handleDrop}
          onKeyDown={(event) => {
            if (disabled) return;
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              inputRef.current?.click();
            }
          }}
          className={cn(
            "group relative flex min-h-40 cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-muted/30 px-4 py-6 text-center transition-all sm:min-h-44 sm:px-6 sm:py-8",
            "hover:border-primary/40 hover:bg-muted/50",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            isDragging && "border-primary bg-primary/5 shadow-sm",
            disabled && "cursor-not-allowed opacity-60"
          )}
        >
          <div
            className={cn(
              "mb-4 flex size-12 items-center justify-center rounded-full border bg-background text-muted-foreground transition-colors",
              isDragging && "border-primary/30 text-primary"
            )}
          >
            <UploadCloud className="size-5" />
          </div>

          <div className="space-y-1">
            <p className="text-sm font-medium text-foreground">{labels?.title ?? "Upload images"}</p>
            <p className="text-sm text-muted-foreground">
              {labels?.description ?? "Drag and drop files here, or click to browse."}
            </p>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs text-muted-foreground">
            <span>{labels?.hint ?? "JPG, PNG, WEBP accepted"}</span>
            <span className="h-1 w-1 rounded-full bg-border" />
            <span>{maxFiles} max</span>
            <span className="h-1 w-1 rounded-full bg-border" />
            <span>{formatBytes(maxFileSizeInBytes)} each</span>
          </div>

          <Button
            type="button"
            variant="outline"
            className="mt-5"
            onClick={(event) => {
              event.stopPropagation();
              inputRef.current?.click();
            }}
            disabled={disabled}
          >
            {labels?.browse ?? "Choose files"}
          </Button>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={acceptAttribute}
        multiple
        className="hidden"
        onChange={handleFileSelection}
        disabled={disabled}
      />

      {localError && <p className="text-sm text-destructive">{localError}</p>}

      {previews.length > 0 && (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
          {previews.map((preview, index) => (
            <div
              key={preview.key}
              className="overflow-hidden rounded-lg border bg-background shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="relative aspect-4/3 overflow-hidden bg-muted/40">
                <img
                  src={preview.previewUrl}
                  alt={preview.file.name}
                  className="h-full w-full object-cover"
                />
                <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/30 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              </div>

              <div className="flex items-start justify-between gap-2 p-2">
                <div className="min-w-0 space-y-1">
                  <div className="flex items-center gap-1.5 text-[11px] font-medium text-foreground sm:text-xs">
                    <ImageIcon className="size-3.5 shrink-0 text-muted-foreground" />
                    <span className="truncate">{preview.file.name}</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground sm:text-xs">{formatBytes(preview.file.size)}</p>
                </div>

                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  className="shrink-0 text-muted-foreground hover:text-destructive"
                  onClick={() => handleRemove(index)}
                  disabled={disabled}
                  aria-label={labels?.remove ?? "Remove image"}
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
