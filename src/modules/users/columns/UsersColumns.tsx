import { Badge } from "@/components/ui/badge"
import type { ColumnDef } from "@/components/ui/data-table"
import type { User } from "../types"
import { UserRowActions } from "../components/UserRowActions"

type Options = {
  t: (key: string) => string
  onView: (id: string | number) => void
  onEdit: (user: User) => void
  onDelete: (id: string | number) => void
  onToggleStatus: (user: User, e: React.MouseEvent) => void
  isToggling: (id: string | number) => boolean
  page: number
  limit: number
}

export const getUsersColumns = ({
  t,
  onView,
  onEdit,
  onDelete,
  onToggleStatus,
  isToggling,
  page,
  limit
}: Options): ColumnDef<User>[] => [
  {
    header: "#",
    cell: (_, index) => (page - 1) * limit + index + 1
  },
  {
    header: t("users.name"),
    accessorKey: "name"
  },
  {
    header: t("users.email"),
    accessorKey: "email"
  },
  {
    header: t("users.role"),
    accessorKey: "role",
    cell: (user) => (
      <Badge variant="outline">
        {user.role.replace(/_/g, " ")}
      </Badge>
    )
  },
  {
    header: t("users.status"),
    accessorKey: "is_active",
    cell: (user) => {
      const loading = isToggling(user.id)

      return (
        <Badge
          variant={user.is_active ? 'default' : 'secondary'}
          className={loading ? "opacity-50 cursor-wait" : "cursor-pointer"}
          onClick={(e) => {
             if (loading) return;
             onToggleStatus(user, e)
          }}
        >
          {user.is_active ? t("users.active") : t("users.inactive")}
        </Badge>
      )
    }
  },
  {
    header: t("users.actions"),
    cell: (user) => (
      <UserRowActions
        user={user}
        onView={onView}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    )
  }
]