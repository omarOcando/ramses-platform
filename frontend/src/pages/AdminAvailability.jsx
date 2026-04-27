import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNotification } from "../context/NotificationContext";
import {
  getAllSlots,
  createSlotRange,
  updateSlot,
  deleteSlot,
} from "../services/availabilityService";
import Button from "../components/Button";
import Modal from "../components/Modal";

function AdminAvailability() {
  const { user } = useAuth();
  const { notify } = useNotification();

  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    date: "",
    startHour: "",
    endHour: "",
  });

  const [editingSlotId, setEditingSlotId] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [deleteConfirmSlotId, setDeleteConfirmSlotId] = useState(null);

  const [editData, setEditData] = useState({
    date: "",
    startHour: "",
    endHour: "",
  });

  const loadSlots = async () => {
    try {
      const data = await getAllSlots(user.token);
      setSlots(data);
    } catch (error) {
      notify("Error loading slots", "error");
    }
  };

  useEffect(() => {
    if (user) {
      loadSlots();
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "startHour" || name === "endHour") {
      let digitsOnly = value.replace(/\D/g, "").slice(0, 4);

      let formatted = "";

      if (digitsOnly.length === 0) {
        formatted = "";
      } else if (digitsOnly.length <= 2) {
        formatted = digitsOnly;

        if (digitsOnly.length === 2) {
          formatted += ":";
        }
      } else {
        formatted = `${digitsOnly.slice(0, 2)}:${digitsOnly.slice(2)}`;
      }

      setFormData((prev) => ({
        ...prev,
        [name]: formatted,
      }));

      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const timeRegex = /^([01]\d|2[0-3]):(00|30)$/;

  const resetForm = () => {
    setFormData({ date: "", startHour: "", endHour: "" });
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditingSlotId(null);
    setEditData({ date: "", startHour: "", endHour: "" });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;

    if (name === "startHour" || name === "endHour") {
      let digitsOnly = value.replace(/\D/g, "").slice(0, 4);
      let formatted = "";
      if (digitsOnly.length === 0) {
        formatted = "";
      } else if (digitsOnly.length <= 2) {
        formatted = digitsOnly;
        if (digitsOnly.length === 2) formatted += ":";
      } else {
        formatted = `${digitsOnly.slice(0, 2)}:${digitsOnly.slice(2)}`;
      }
      setEditData((prev) => ({ ...prev, [name]: formatted }));
      return;
    }

    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !timeRegex.test(formData.startHour) ||
      !timeRegex.test(formData.endHour)
    ) {
      notify("Please enter valid hours in HH:00 or HH:30 format (example: 09:00 or 09:30)", "warning");
      return;
    }

    try {
      setLoading(true);
      const cleanedData = {
        ...formData,
        startHour: formData.startHour.slice(0, 5),
        endHour: formData.endHour.slice(0, 5),
      };
      await createSlotRange(cleanedData, user.token);
      notify("Slots created successfully", "success");
      resetForm();
      loadSlots();
    } catch (error) {
      notify(error.response?.data?.message || "Something went wrong", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    if (
      !timeRegex.test(editData.startHour) ||
      !timeRegex.test(editData.endHour)
    ) {
      notify("Please enter valid hours in HH:00 or HH:30 format (example: 09:00 or 09:30)", "warning");
      return;
    }

    try {
      setLoading(true);
      const cleanedData = {
        ...editData,
        startHour: editData.startHour.slice(0, 5),
        endHour: editData.endHour.slice(0, 5),
      };
      await updateSlot(editingSlotId, cleanedData, user.token);
      notify("Slot updated successfully", "success");
      closeEditModal();
      loadSlots();
    } catch (error) {
      notify(error.response?.data?.message || "Something went wrong", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <div className="adminAvailability">
      <div className="adminAvailability__header">
        <h2 className="adminAvailability__title">Manage Availability</h2>
        <p className="adminAvailability__subtitle">
          Add your available time and manage existing appointment slots.
        </p>
      </div>

      <div className="adminAvailability__panel">
        <h3 className="adminAvailability__sectionTitle">
          Create 1-hour slots, one by one, or several at once by entering a range
        </h3>

        <p className="adminAvailability__helper">
          Example: if you choose 09:00 to 18:00, the system will automatically calculate and create 1-hour slots for that day.
        </p>

        <form className="adminAvailability__form" onSubmit={handleSubmit}>
          <div className="adminAvailability__field">
            <label htmlFor="date">Date</label>
            <input
              id="date"
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              min={new Date().toISOString().split("T")[0]}
              required
            />
          </div>

          <div className="adminAvailability__field">
            <label htmlFor="startHour">From</label>
            <input
              id="startHour"
              type="text"
              name="startHour"
              value={formData.startHour}
              onChange={handleChange}
              placeholder="HH:MM"
              maxLength={5}
              required
            />
          </div>

          <div className="adminAvailability__field">
            <label htmlFor="endHour">To</label>
            <input
              id="endHour"
              type="text"
              name="endHour"
              value={formData.endHour}
              onChange={handleChange}
              placeholder="HH:MM"
              maxLength={5}
              required
            />
          </div>

          <div className="adminAvailability__formActions">
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Create Slots"}
            </Button>
          </div>
        </form>
      </div>

      <ul className="adminAvailability__list">
        {slots
          .filter((slot) => {
            const now = new Date();
            const slotDateTime = new Date(slot.date);
            const [hour, minute] = slot.startHour.split(":").map(Number);

            slotDateTime.setHours(hour, minute, 0, 0);

            return slotDateTime >= now;
          })
          .sort((a, b) => {
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);

            if (dateA.getTime() !== dateB.getTime()) {
              return dateA - dateB;
            }

            const [hourA, minuteA] = a.startHour.split(":").map(Number);
            const [hourB, minuteB] = b.startHour.split(":").map(Number);

            const totalMinutesA = hourA * 60 + minuteA;
            const totalMinutesB = hourB * 60 + minuteB;

            return totalMinutesA - totalMinutesB;
          })
          .map((slot) => (
            <li
              key={slot._id}
              className={`adminAvailability__item ${
                slot.isBooked
                  ? "adminAvailability__item--booked"
                  : "adminAvailability__item--free"
              }`}
            >
              <div className="adminAvailability__info">
                <p>
                  <strong>
                    {new Date(slot.date).toLocaleDateString("es-ES", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })}
                  </strong>{" "}
                  — {slot.startHour} to {slot.endHour}
                </p>

                <p>Status: {slot.isBooked ? "Booked" : "Available"}</p>
              </div>

              <div className="adminAvailability__actions">
                <Button
                  type="button"
                  onClick={() => {
                    setEditData({
                      date: new Date(slot.date).toISOString().split("T")[0],
                      startHour: slot.startHour,
                      endHour: slot.endHour,
                    });
                    setEditingSlotId(slot._id);
                    setIsEditModalOpen(true);
                  }}
                >
                  Edit
                </Button>

                <Button
                  type="button"
                  disabled={slot.isBooked}
                  onClick={() => setDeleteConfirmSlotId(slot._id)}
                >
                  Delete
                </Button>
              </div>
            </li>
          ))}
      </ul>
    </div>

    {deleteConfirmSlotId && (
      <Modal onClose={() => setDeleteConfirmSlotId(null)}>
        <h3 className="modal__title">Delete Slot</h3>
        <p>Are you sure you want to delete this slot?</p>
        <div className="modal__actions">
          <Button
            type="button"
            disabled={loading}
            onClick={async () => {
              try {
                setLoading(true);
                await deleteSlot(deleteConfirmSlotId, user.token);
                notify("Slot deleted successfully", "success");
                setDeleteConfirmSlotId(null);
                loadSlots();
              } catch (error) {
                notify(error.response?.data?.message || "Delete failed", "error");
              } finally {
                setLoading(false);
              }
            }}
          >
            {loading ? "Deleting..." : "Confirm"}
          </Button>
          <Button type="button" onClick={() => setDeleteConfirmSlotId(null)}>
            Cancel
          </Button>
        </div>
      </Modal>
    )}

    {isEditModalOpen && (
      <Modal onClose={closeEditModal}>
        <h3 className="modal__title">Edit Slot</h3>
        <form className="adminAvailability__form" onSubmit={handleEditSubmit}>
          <div className="adminAvailability__field">
            <label htmlFor="edit-date">Date</label>
            <input
              id="edit-date"
              type="date"
              name="date"
              value={editData.date}
              onChange={handleEditChange}
              min={new Date().toISOString().split("T")[0]}
              required
            />
          </div>

          <div className="adminAvailability__field">
            <label htmlFor="edit-startHour">From</label>
            <input
              id="edit-startHour"
              type="text"
              name="startHour"
              value={editData.startHour}
              onChange={handleEditChange}
              placeholder="HH:MM"
              maxLength={5}
              required
            />
          </div>

          <div className="adminAvailability__field">
            <label htmlFor="edit-endHour">To</label>
            <input
              id="edit-endHour"
              type="text"
              name="endHour"
              value={editData.endHour}
              onChange={handleEditChange}
              placeholder="HH:MM"
              maxLength={5}
              required
            />
          </div>

          <div className="modal__actions">
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Update Slot"}
            </Button>
            <Button type="button" onClick={closeEditModal}>
              Cancel
            </Button>
          </div>
        </form>
      </Modal>
    )}
    </>
  );
}

export default AdminAvailability;