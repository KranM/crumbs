import { requireAdminSession } from "@/lib/auth-helpers";
import { listUsers } from "@/actions/admin";
import { UsersTable } from "@/components/admin/users-table";

export default async function AdminUsersPage() {
  const session = await requireAdminSession();
  const isSuperAdmin = session.role === "superadmin";

  const { users: allUsers } = await listUsers();

  const regularUsers = allUsers.filter((u) => !u.role || u.role === "user");
  const adminUsers = isSuperAdmin
    ? allUsers.filter((u) => u.role === "admin" || u.role === "superadmin")
    : [];

  return (
    <UsersTable
      users={regularUsers}
      admins={adminUsers}
      isSuperAdmin={isSuperAdmin}
    />
  );
}
