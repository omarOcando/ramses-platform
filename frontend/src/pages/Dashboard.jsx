import Calendar from "react-calendar";
import { useEffect, useState } from "react";
import { getAvailableSlots } from "../services/availabilityService";
import { createAppointment } from "../services/appointmentService";
import { useAuth } from "../context/AuthContext";
import Button from "../components/Button";
import AdminAppointments from "./AdminAppointments";

function Dashboard() {
  const [slots, setSlots] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [bookingLoadingId, setBookingLoadingId] = useState(null);
  const { user } = useAuth();

  const isAdmin = user?.user?.role === "admin";

  useEffect(() => {
    if (user && !isAdmin) {
      loadSlots();
    }
  }, [user]);

  const loadSlots = async () => {
    try {
      const data = await getAvailableSlots(user.token);
      setSlots(data);
    } catch (error) {
      console.error("Error loading slots:", error);
    }
  };

  const handleBooking = async (availabilityId) => {
    try {
      setBookingLoadingId(availabilityId);
      await createAppointment(availabilityId, user.token);
      alert("Appointment booked!");
      loadSlots();
    } catch (error) {
      alert(error.response?.data?.message || "Booking failed");
    } finally {
      setBookingLoadingId(null);
    }
  };

  const isSameDay = (date1, date2) => {
    return (
      new Date(date1).getFullYear() === date2.getFullYear() &&
      new Date(date1).getMonth() === date2.getMonth() &&
      new Date(date1).getDate() === date2.getDate()
    );
  };

  const getDayStatus = (date) => {
    const now = new Date();

    const isPastDay =
      date.getFullYear() < now.getFullYear() ||
      (date.getFullYear() === now.getFullYear() &&
        date.getMonth() < now.getMonth()) ||
      (date.getFullYear() === now.getFullYear() &&
        date.getMonth() === now.getMonth() &&
        date.getDate() < now.getDate());

    if (isPastDay) return null;

    const daySlots = slots.filter((slot) => {
      if (!isSameDay(slot.date, date)) return false;

      const slotDateTime = new Date(slot.date);
      const [hour, minute] = slot.startHour.split(":").map(Number);
      slotDateTime.setHours(hour, minute, 0, 0);

      return slotDateTime > now && !slot.isBooked;
    });

    if (daySlots.length === 0) return null;

    return "available";
  };

  // Admin view

  if (isAdmin) {
    return <AdminAppointments />;
  }

  return (
    <div className="dashboard">
      <h2 className="dashboard__title">
        Book Your Session, {user?.user?.name?.split(" ")[0]}
      </h2>

      <Calendar
        onChange={setSelectedDate}
        value={selectedDate}
        locale="en-US"
        tileContent={({ date, view }) => {
          if (view !== "month") return null;

          const status = getDayStatus(date);

          if (!status) return null;

          return <div className={`calendar-dot calendar-dot--${status}`} />;
        }}
      />

      <p className="dashboard__slots-count">
        {
          slots.filter((slot) => {
            const now = new Date();
            const slotDateTime = new Date(slot.date);

            const [hour, minute] = slot.startHour.split(":").map(Number);
            slotDateTime.setHours(hour, minute, 0, 0);

            return slotDateTime > now && !slot.isBooked;
          }).length
        }{" "}
        slots available
      </p>

      <ul className="dashboard__list">
        {slots
          .filter((slot) => {
            const now = new Date();
            const slotDateTime = new Date(slot.date);

            const [hour, minute] = slot.startHour.split(":").map(Number);
            slotDateTime.setHours(hour, minute, 0, 0);

            const isFuture = slotDateTime > now;
            const isSelectedDay = isSameDay(slot.date, selectedDate);

            return isFuture && isSelectedDay;
          })
          .sort((a, b) => {
            const [hourA, minuteA] = a.startHour.split(":").map(Number);
            const [hourB, minuteB] = b.startHour.split(":").map(Number);

            const totalMinutesA = hourA * 60 + minuteA;
            const totalMinutesB = hourB * 60 + minuteB;

            return totalMinutesA - totalMinutesB;
          })
          .map((slot) => (
            <li
              key={slot._id}
              className={`dashboard__item ${
                slot.isBooked
                  ? "dashboard__item--booked"
                  : "dashboard__item--available"
              }`}
            >
              <div className="dashboard__info">
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
              </div>

              <Button
                variant={slot.isBooked ? "booked" : "book"}
                disabled={slot.isBooked || bookingLoadingId === slot._id}
                onClick={() => handleBooking(slot._id)}
              >
                {slot.isBooked
                  ? "Booked"
                  : bookingLoadingId === slot._id
                  ? "Processing..."
                  : "Book"}
              </Button>
            </li>
          ))}
      </ul>
    </div>
  );
}

export default Dashboard;