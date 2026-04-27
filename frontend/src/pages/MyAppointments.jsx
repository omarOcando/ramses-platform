import { useEffect, useContext } from "react";
import { getMyAppointments, cancelAppointment } from "../services/appointmentService";
import { AuthContext } from "../context/AuthContext";
import { useNotification } from "../context/NotificationContext";
import useApi from "../hooks/useApi";
import Button from "../components/Button";
import Card from "../components/Card";

function MyAppointments() {
  const { user } = useContext(AuthContext);
  const { notify } = useNotification();

  const { data: appointments, loading, error, execute: fetchAppointments } = useApi(getMyAppointments);

  useEffect(() => {
    if (user?.token) {
      fetchAppointments(user.token);
    }
  }, [user]);

  const handleCancel = async (id) => {
    try {
      await cancelAppointment(id, user.token);
      fetchAppointments(user.token);
    } catch (error) {
      notify("Error cancelling appointment", "error");
    }
  };

  return (
    <div className="my-appointments">
      <h2 className="my-appointments__title">
        Your Appointments, {user?.user?.name?.split(" ")[0]}
      </h2>

      {loading && <p className="my-appointments__empty">Loading your appointments...</p>}

      {error && <p className="my-appointments__empty">{error}</p>}

      {!loading && !error && (!appointments || appointments.length === 0) && (
        <p className="my-appointments__empty">No bookings yet</p>
      )}

      {!loading && appointments && appointments.length > 0 && (
        <ul className="my-appointments__list">
          {appointments
            .sort((a, b) => {
              const dateA = new Date(a.availability.date);
              const dateB = new Date(b.availability.date);

              const [hourA, minuteA] = a.availability.startHour.split(":").map(Number);
              const [hourB, minuteB] = b.availability.startHour.split(":").map(Number);

              dateA.setHours(hourA, minuteA, 0, 0);
              dateB.setHours(hourB, minuteB, 0, 0);

              return dateB - dateA;
            })
            .map((appt) => (
              <Card as="li" key={appt._id} className="my-appointments__item">
                <div className="my-appointments__info">
                  <p>
                    {new Date(appt.availability.date).toLocaleDateString("es-ES", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })}
                    {" — "}
                    {appt.availability.startHour} to {appt.availability.endHour}
                  </p>

                  <p>
                    Status:{" "}
                    <span className={`my-appointments__status my-appointments__status--${appt.status}`}>
                      {appt.status.toUpperCase()}
                    </span>
                  </p>

                  <p className="my-appointments__session">
                    {appt.sessionType === "free"
                      ? "Free Session"
                      : `Paid Session ${appt.sessionType.split("_")[1]}`}
                  </p>
                </div>

                {appt.status === "pending" && (
                  <Button variant="secondary" onClick={() => handleCancel(appt._id)}>
                    Cancel
                  </Button>
                )}
              </Card>
            ))}
        </ul>
      )}
    </div>
  );
}

export default MyAppointments;