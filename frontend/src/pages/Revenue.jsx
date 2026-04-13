import { useEffect, useState, useContext } from "react";
import { getRevenueStats } from "../services/appointmentService";
import { AuthContext } from "../context/AuthContext";
import Button from "../components/Button";

function Revenue() {
  const { user } = useContext(AuthContext);

  const [filter, setFilter] = useState("this_month");
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalCommission: 0,
    totalPaidSessions: 0,
    paidAppointments: [],
  });

  const loadRevenueStats = async () => {
    try {
      const data = await getRevenueStats(filter, user.token);
      setStats(data);
    } catch (error) {
      console.error("Error loading revenue stats:", error);
    }
  };

  useEffect(() => {
    if (user?.token) {
      loadRevenueStats();
    }
  }, [filter, user]);

  return (
    <div className="revenue">
      <h2 className="revenue__title">Revenue</h2>

      <div className="revenue__cards">
        <div className="revenue__card">
          <p className="revenue__label">Total Revenue</p>
          <p className="revenue__value">€ {stats.totalRevenue.toFixed(2)}</p>
        </div>

        <div className="revenue__card">
          <p className="revenue__label">Total Commissions</p>
          <p className="revenue__value">€ {stats.totalCommission.toFixed(2)}</p>
        </div>

        <div className="revenue__card">
          <p className="revenue__label">Total Paid Sessions</p>
          <p className="revenue__value">{stats.totalPaidSessions}</p>
        </div>
      </div>

      <div className="revenue__filters">
        <Button
          variant="primary"
          onClick={() => setFilter("this_month")}
          className={
            filter === "this_month"
              ? "revenue__filter-btn revenue__filter-btn--active"
              : "revenue__filter-btn"
          }
        >
          This Month
        </Button>

        <Button
          variant="primary"
          onClick={() => setFilter("last_month")}
          className={
            filter === "last_month"
              ? "revenue__filter-btn revenue__filter-btn--active"
              : "revenue__filter-btn"
          }
        >
          Last Month
        </Button>

        <Button
          variant="primary"
          onClick={() => setFilter("all")}
          className={
            filter === "all"
              ? "revenue__filter-btn revenue__filter-btn--active"
              : "revenue__filter-btn"
          }
        >
          All
        </Button>
      </div>

      <h3 className="revenue__section-title">Paid Sessions Overview</h3>

      <div className="revenue__list">
        {stats.paidAppointments.length === 0 ? (
          <p className="revenue__empty">No paid sessions found</p>
        ) : (
          <ul className="revenue__items">
            {stats.paidAppointments.map((appt) => (
              <li key={appt._id} className="revenue__item">
                <div className="revenue__item-info">
                  <p>
                    <strong>{appt.user?.name}</strong>
                  </p>

                  <p>
                    {new Date(appt.availability?.date).toLocaleDateString()} —{" "}
                    {appt.sessionType === "free"
                      ? "Free Session"
                      : `Paid Session ${appt.sessionType.split("_")[1]}`}
                  </p>
                </div>

                <div className="revenue__item-values">
                  <p>
                    <strong>Session:</strong> € {appt.paidAmount.toFixed(2)}
                  </p>
                  <p>
                    <strong>Commission:</strong> € {appt.commissionAmount.toFixed(2)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Revenue;