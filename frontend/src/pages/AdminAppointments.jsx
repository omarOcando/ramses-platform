import { useEffect, useState, useContext } from "react";
import {
  getAllAppointments,
  updateAppointmentStatus,
  markAttendance,
  markPaidSession,
  convertToPaidSession,
} from "../services/appointmentService";
import { AuthContext } from "../context/AuthContext";
import { useNotification } from "../context/NotificationContext";
import Button from "../components/Button";

function AdminAppointments() {
  const { user } = useContext(AuthContext);
  const { notify } = useNotification();

  const [appointments, setAppointments] = useState([]);

  const [loadingAction, setLoadingAction] = useState({
    id: null,
    type: null,
  });

  const loadAppointments = async () => {
    try {
      const data = await getAllAppointments(user.token);
      setAppointments(data);
    } catch (error) {
      notify("Error loading appointments", "error");
    }
  };

  useEffect(() => {
    loadAppointments();
  }, []);

  const handleApprove = async (id) => {
    try {
      setLoadingAction({ id, type: "approve" });
      await updateAppointmentStatus(id, "approved", user.token);
      await loadAppointments();
      notify("Appointment approved successfully", "success");
    } catch (error) {
      notify(error.response?.data?.message || "Error approving appointment", "error");
    } finally {
      setLoadingAction({ id: null, type: null });
    }
  };

  const handleCancel = async (id) => {
    try {
      setLoadingAction({ id, type: "cancel" });
      await updateAppointmentStatus(id, "cancelled", user.token);
      await loadAppointments();
      notify("Appointment cancelled successfully", "success");
    } catch (error) {
      notify("Error cancelling appointment", "error");
    } finally {
      setLoadingAction({ id: null, type: null });
    }
  };

  const handleShowUp = async (id) => {
    try {
      setLoadingAction({ id, type: "show_up" });
      await markAttendance(id, "show_up", user.token);
      await loadAppointments();
      notify("Attendance marked as SHOW UP", "success");
    } catch (error) {
      notify(error.response?.data?.message || "Error marking attendance", "error");
    } finally {
      setLoadingAction({ id: null, type: null });
    }
  };

  const handleNoShow = async (id) => {
    try {
      setLoadingAction({ id, type: "no_show" });
      await markAttendance(id, "no_show", user.token);
      await loadAppointments();
      notify("Attendance marked as NO SHOW", "success");
    } catch (error) {
      notify(error.response?.data?.message || "Error marking attendance", "error");
    } finally {
      setLoadingAction({ id: null, type: null });
    }
  };

  const handleMarkPaidSession = async (id) => {
    const amountInput = prompt("Enter the paid amount (€):");

    if (amountInput === null) return;

    const paidAmount = Number(amountInput);

    if (isNaN(paidAmount) || paidAmount <= 0) {
      notify("Please enter a valid amount.", "warning");
      return;
    }

    try {
      setLoadingAction({ id, type: "paid_session" });
      await markPaidSession(id, paidAmount, user.token);
      await loadAppointments();
      notify("Paid session marked successfully", "success");
    } catch (error) {
      notify(error.response?.data?.message || "Error marking paid session", "error");
    } finally {
      setLoadingAction({ id: null, type: null });
    }
  };

  const handleConvertToPaid = async (id) => {
    try {
      setLoadingAction({ id, type: "convert_paid" });
      await convertToPaidSession(id, user.token);
      await loadAppointments();
      notify("Session converted to paid successfully", "success");
    } catch (error) {
      notify(error.response?.data?.message || "Error converting session", "error");
    } finally {
      setLoadingAction({ id: null, type: null });
    }
  };

  return (
    <div className="admin-appointments">
      <h2>All Appointments</h2>

      {appointments.length === 0 ? (
        <p>No appointments yet</p>
      ) : (
        <ul>
          {appointments
            .filter((appt) => {
              const now = new Date();
              const apptDateTime = new Date(appt.availability.date);

              const [hour, minute] = appt.availability.startHour
                .split(":")
                .map(Number);
              apptDateTime.setHours(hour, minute, 0, 0);

              const sevenDaysAgo = new Date();
              sevenDaysAgo.setDate(now.getDate() - 7);

              return apptDateTime > now || apptDateTime >= sevenDaysAgo;
            })
            .sort((a, b) => {
              const dateA = new Date(a.availability.date);
              const dateB = new Date(b.availability.date);

              const [hourA, minuteA] = a.availability.startHour
                .split(":")
                .map(Number);
              const [hourB, minuteB] = b.availability.startHour
                .split(":")
                .map(Number);

              dateA.setHours(hourA, minuteA, 0, 0);
              dateB.setHours(hourB, minuteB, 0, 0);

              return dateB - dateA;
            })
            .map((appt) => (
              <li key={appt._id}>
                <div className="admin-appointments__info">
                  <p>
                    <strong>{appt.user?.name ?? "Deleted user"}</strong> — {appt.user?.email ?? "—"}
                  </p>

                  <p>
                    {new Date(appt.availability.date).toLocaleDateString()}
                    {" — "}
                    {appt.availability.startHour} to {appt.availability.endHour}
                  </p>

                  <p>
                    Session Type:{" "}
                    <span
                      className={
                        !appt.sessionType || appt.sessionType === "free"
                          ? "admin-appointments__session-type admin-appointments__session-type--free"
                          : "admin-appointments__session-type admin-appointments__session-type--paid"
                      }
                    >
                      {!appt.sessionType || appt.sessionType === "free"
                        ? "FREE SESSION"
                        : `PAID SESSION ${appt.sessionType.split("_")[1]}`}
                    </span>
                  </p>

                  <p>
                    Status:{" "}
                    <span
                      className={`admin-appointments__status admin-appointments__status--${appt.status}`}
                    >
                      {appt.attendanceStatus === "show_up" &&
                      (!appt.sessionType || appt.sessionType === "free")
                        ? "FREE SESSION USED"
                        : appt.attendanceStatus === "show_up" &&
                          appt.sessionType &&
                          appt.sessionType !== "free"
                        ? `PAID SESSION ${appt.sessionType.split("_")[1]}/4`
                        : appt.status.toUpperCase()}
                    </span>
                  </p>

                  {appt.attendanceStatus !== "pending" && (
                    <p>
                      Attendance:{" "}
                      <span
                        className={`admin-appointments__attendance admin-appointments__attendance--${appt.attendanceStatus}`}
                      >
                        {appt.attendanceStatus === "show_up"
                          ? "SHOW UP"
                          : "NO SHOW"}
                      </span>
                    </p>
                  )}
                </div>

                <div>
                  {appt.status === "pending" && (
                    <>
                      <Button
                        variant="book"
                        onClick={() => handleApprove(appt._id)}
                        disabled={loadingAction.id === appt._id}
                      >
                        {loadingAction.id === appt._id &&
                        loadingAction.type === "approve"
                          ? "Processing..."
                          : "Approve"}
                      </Button>

                      <Button
                        variant="secondary"
                        onClick={() => handleCancel(appt._id)}
                        disabled={loadingAction.id === appt._id}
                      >
                        {loadingAction.id === appt._id &&
                        loadingAction.type === "cancel"
                          ? "Processing..."
                          : "Cancel"}
                      </Button>
                    </>
                  )}

                  {appt.sessionType === "free" && (
                    <Button
                      variant="primary"
                      onClick={() => handleConvertToPaid(appt._id)}
                      disabled={loadingAction.id === appt._id}
                    >
                      {loadingAction.id === appt._id &&
                      loadingAction.type === "convert_paid"
                        ? "Processing..."
                        : "Convert to Paid"}
                    </Button>
                  )}

                  {appt.status === "approved" &&
                    appt.attendanceStatus === "pending" &&
                    (() => {
                      const now = new Date();
                      const apptDateTime = new Date(appt.availability.date);
                      const [hour, minute] = appt.availability.endHour
                        .split(":")
                        .map(Number);
                      apptDateTime.setHours(hour, minute, 0, 0);

                      return apptDateTime < now;
                    })() && (
                      <>
                        <Button
                          variant="book"
                          onClick={() => handleShowUp(appt._id)}
                          disabled={loadingAction.id === appt._id}
                        >
                          {loadingAction.id === appt._id &&
                          loadingAction.type === "show_up"
                            ? "Processing..."
                            : "Show up"}
                        </Button>

                        <Button
                          variant="secondary"
                          onClick={() => handleNoShow(appt._id)}
                          disabled={loadingAction.id === appt._id}
                        >
                          {loadingAction.id === appt._id &&
                          loadingAction.type === "no_show"
                            ? "Processing..."
                            : "No show"}
                        </Button>
                      </>
                    )}

                  {appt.status === "approved" &&
                    appt.attendanceStatus === "show_up" &&
                    appt.sessionType &&
                    appt.sessionType !== "free" &&
                    !appt.isPaidSessionMarked && (
                      <Button
                        variant="book"
                        onClick={() => handleMarkPaidSession(appt._id)}
                        disabled={loadingAction.id === appt._id}
                      >
                        {loadingAction.id === appt._id &&
                        loadingAction.type === "paid_session"
                          ? "Processing..."
                          : "Paid Session"}
                      </Button>
                    )}
                </div>
              </li>
            ))}
        </ul>
      )}
    </div>
  );
}

export default AdminAppointments;