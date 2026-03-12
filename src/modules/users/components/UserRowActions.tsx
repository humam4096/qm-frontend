import React from "react";
import { useTranslation } from "react-i18next";
import { Button } from "../../../components/ui/button";
import type { User } from "../types";

type Props = {
  user: User;
  onView: (id: string | number) => void;
  onEdit: (user: User) => void;
  onDelete: (id: string | number) => void;
};

export const UserRowActions: React.FC<Props> = ({
  user,
  onView,
  onEdit,
  onDelete,
}) => {
  const { t } = useTranslation();

  const handleView = (e: React.MouseEvent) => {
    e.stopPropagation();
    onView(user.id);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(user);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(user.id);
  };

  return (
    <div className="flex items-center gap-2 justify-end">
      <Button variant="ghost" className="cursor-pointer" size="sm" onClick={handleView}>
        {t("users.view")}
      </Button>

      <Button variant="ghost" className="cursor-pointer" size="sm" onClick={handleEdit}>
        {t("users.edit")}
      </Button>

      <Button
        variant="ghost"
        size="sm"
        className="text-destructive hover:bg-destructive/10 hover:text-destructive "
        onClick={handleDelete}
      >
        {t("users.delete")}
      </Button>
    </div>
  );
};