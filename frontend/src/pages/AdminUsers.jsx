import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNotification } from "../context/NotificationContext";
import { getAllUsers, updateUser, deleteUser } from "../services/userService";
import Button from "../components/Button";
import Modal from "../components/Modal";

function AdminUsers() {
  const { user } = useAuth();
  const { notify } = useNotification();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const [editingUser, setEditingUser] = useState(null);
  const [editData, setEditData] = useState({ name: "", email: "", role: "" });

  const [deleteConfirmUserId, setDeleteConfirmUserId] = useState(null);

  const loadUsers = async () => {
    try {
      const data = await getAllUsers(user.token);
      setUsers(data);
    } catch (error) {
      notify("Error loading users", "error");
    }
  };

  useEffect(() => {
    if (user) loadUsers();
  }, [user]);

  const openEditModal = (u) => {
    setEditingUser(u);
    setEditData({ name: u.name, email: u.email, role: u.role });
  };

  const closeEditModal = () => {
    setEditingUser(null);
    setEditData({ name: "", email: "", role: "" });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await updateUser(editingUser._id, editData, user.token);
      notify("User updated successfully", "success");
      closeEditModal();
      loadUsers();
    } catch (error) {
      notify(error.response?.data?.message || "Error updating user", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      await deleteUser(deleteConfirmUserId, user.token);
      notify("User deleted successfully", "success");
      setDeleteConfirmUserId(null);
      loadUsers();
    } catch (error) {
      notify(error.response?.data?.message || "Error deleting user", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="adminUsers">
        <div className="adminUsers__header">
          <h2 className="adminUsers__title">Manage Users</h2>
          <p className="adminUsers__subtitle">
            View, edit and delete registered users.
          </p>
        </div>

        <ul className="adminUsers__list">
          {users.map((u) => (
            <li key={u._id} className="adminUsers__item">
              <div className="adminUsers__info">
                <p>
                  <strong>{u.name}</strong> — {u.email}
                </p>
                <p>
                  Role:{" "}
                  <span className={`adminUsers__role adminUsers__role--${u.role}`}>
                    {u.role.toUpperCase()}
                  </span>
                </p>
                <p className="adminUsers__date">
                  Registered:{" "}
                  {new Date(u.createdAt).toLocaleDateString("es-ES", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })}
                </p>
              </div>

              <div className="adminUsers__actions">
                <Button type="button" onClick={() => openEditModal(u)}>
                  Edit
                </Button>
                <Button
                  type="button"
                  onClick={() => setDeleteConfirmUserId(u._id)}
                >
                  Delete
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {editingUser && (
        <Modal onClose={closeEditModal}>
          <h3 className="modal__title">Edit User</h3>
          <form className="adminUsers__form" onSubmit={handleEditSubmit}>
            <div className="adminUsers__field">
              <label htmlFor="edit-name">Name</label>
              <input
                id="edit-name"
                type="text"
                value={editData.name}
                onChange={(e) =>
                  setEditData((prev) => ({ ...prev, name: e.target.value }))
                }
                required
              />
            </div>

            <div className="adminUsers__field">
              <label htmlFor="edit-email">Email</label>
              <input
                id="edit-email"
                type="email"
                value={editData.email}
                onChange={(e) =>
                  setEditData((prev) => ({ ...prev, email: e.target.value }))
                }
                required
              />
            </div>

            <div className="adminUsers__field">
              <label htmlFor="edit-role">Role</label>
              <select
                id="edit-role"
                value={editData.role}
                onChange={(e) =>
                  setEditData((prev) => ({ ...prev, role: e.target.value }))
                }
              >
                <option value="client">Client</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div className="modal__actions">
              <Button type="submit" disabled={loading}>
                {loading ? "Saving..." : "Update User"}
              </Button>
              <Button type="button" onClick={closeEditModal}>
                Cancel
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {deleteConfirmUserId && (
        <Modal onClose={() => setDeleteConfirmUserId(null)}>
          <h3 className="modal__title">Delete User</h3>
          <p>Are you sure you want to delete this user? This action cannot be undone.</p>
          <div className="modal__actions">
            <Button type="button" disabled={loading} onClick={handleDelete}>
              {loading ? "Deleting..." : "Confirm"}
            </Button>
            <Button type="button" onClick={() => setDeleteConfirmUserId(null)}>
              Cancel
            </Button>
          </div>
        </Modal>
      )}
    </>
  );
}

export default AdminUsers;
