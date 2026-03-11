import { useEffect, useState, useContext } from "react";
import { getAllAppointments, updateAppointmentStatus } from "../services/appointmentService";
import { AuthContext } from "../context/AuthContext";
import Button from "../components/Button";

function AdminAppointments() {

  const { user } = useContext(AuthContext);

  const [appointments, setAppointments] = useState([]);

  const loadAppointments = async () => {
    try {
      const data = await getAllAppointments(user.token);
      setAppointments(data);
    } catch (error) {
      console.error("Error loading appointments:", error);
    }
  };

  useEffect(() => {
    loadAppointments();
  }, []);

  const handleApprove = async (id) => {
    try {
      await updateAppointmentStatus(id, "approved", user.token);

      loadAppointments();
    } catch (error) {
      alert("Error approving appointment");
    }
  };

  const handleCancel = async (id) => {
    try {
      await updateAppointmentStatus(id, "cancelled", user.token);

      loadAppointments();
    } catch (error) {
      alert("Error cancelling appointment");
    }
  };

  return (
    <div className="admin-appointments">

      <h2>All Appointments</h2>

      {appointments.length === 0 ? (
        <p>No appointments yet</p>
      ) : (
        <ul>
          {appointments.map((appt) => (

            <li key={appt._id}>

              <div>
                <strong>{appt.user.name}</strong> — {appt.user.email}

                <br />

                {new Date(appt.availability.date).toLocaleDateString()}  
                {" — "}
                {appt.availability.startHour} to {appt.availability.endHour}

                <br />

                Status: <strong>{appt.status}</strong>
              </div>

              {appt.status === "pending" && (

                <div>
                  <Button
                    variant="book"
                    onClick={() => handleApprove(appt._id)}
                  >
                    Approve
                  </Button>

                  <Button
                    variant="secondary"
                    onClick={() => handleCancel(appt._id)}
                  >
                    Cancel
                  </Button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default AdminAppointments;