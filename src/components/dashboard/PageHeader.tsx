import React from "react";

interface PageHeaderProps {
  title?: string;
  description?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
}) => {
  return (
    <div className="flex flex-col mb-6">
      <h2 className="text-3xl font-bold mb-1 text-primary">{title}</h2>
      {description && (
        <p className="text-muted-foreground">{description}</p>
      )}
    </div>
  );
};