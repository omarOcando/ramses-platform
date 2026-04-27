import { useEffect, useState, useContext } from "react";
import { getRevenueStats } from "../services/appointmentService";
import { AuthContext } from "../context/AuthContext";
import { useNotification } from "../context/NotificationContext";
import Button from "../components/Button";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";

function Revenue() {
  const { user } = useContext(AuthContext);
  const { notify } = useNotification();

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
      notify("Error loading revenue stats", "error");
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

      {stats.paidAppointments.length > 0 && (
        <div className="revenue__charts">
          <div className="revenue__chart-block">
            <h3 className="revenue__section-title">Revenue vs Commissions per Session</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={stats.paidAppointments.map((appt, i) => ({
                  name: `${appt.user?.name?.split(" ")[0] ?? "User"} #${i + 1}`,
                  Revenue: parseFloat(appt.paidAmount.toFixed(2)),
                  Commission: parseFloat(appt.commissionAmount.toFixed(2)),
                }))}
                margin={{ top: 10, right: 20, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tickFormatter={(v) => `€${v}`} />
                <Tooltip formatter={(value) => `€${value}`} />
                <Legend />
                <Bar dataKey="Revenue" fill="#4f8ef7" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Commission" fill="#f7a14f" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="revenue__chart-block">
            <h3 className="revenue__section-title">Revenue Breakdown</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={[
                    {
                      name: "Net Revenue",
                      value: parseFloat(
                        (stats.totalRevenue - stats.totalCommission).toFixed(2)
                      ),
                    },
                    {
                      name: "Commissions",
                      value: parseFloat(stats.totalCommission.toFixed(2)),
                    },
                  ]}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                >
                  <Cell key="net" fill="#4f8ef7" />
                  <Cell key="commission" fill="#f7a14f" />
                </Pie>
                <Tooltip formatter={(value) => `€${value}`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

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