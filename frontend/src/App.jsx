import { Routes, Route } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";
import Home from "./pages/Home";
import MyStory from "./pages/MyStory";
import DoYouFeelThis from "./pages/DoYouFeelThis";
import TheWayToTransformation from "./pages/TheWayToTransformation";
import WhatCouplesSay from "./pages/WhatCouplesSay";
import TakeTheFirstStep from "./pages/TakeTheFirstStep";
import InsideTheRoom from "./pages/InsideTheRoom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import PrivateRoute from "./routes/PrivateRoute";
import AdminRoute from "./routes/AdminRoute";
import MyAppointments from "./pages/MyAppointments";
import AdminAppointments from "./pages/AdminAppointments";
import AdminAvailability from "./pages/AdminAvailability";
import Revenue from "./pages/Revenue";
import AdminUsers from "./pages/AdminUsers";
import Impressum from "./pages/Impressum";
import Datenschutz from "./pages/Datenschutz";
import { useState } from "react";
import Loader from "./components/Loader";
import ScrollToTop from "./components/ScrollToTop";

function App() {
  const [loading, setLoading] = useState(true);

  if (loading) {
    return <Loader onFinish={() => setLoading(false)} />;
  }

  return (
    <div className="appFade">
      <ScrollToTop />
      <MainLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/my-story" element={<MyStory />} />
          <Route path="/do-you-feel-this" element={<DoYouFeelThis />} />
          <Route
            path="/the-way-to-transformation"
            element={<TheWayToTransformation />}
          />
          <Route path="/take-the-first-step" element={<TakeTheFirstStep />} />
          <Route
            path="/inside-the-room"
            element={
              <PrivateRoute>
                <InsideTheRoom />
              </PrivateRoute>
            }
          />
          <Route path="/what-couples-say" element={<WhatCouplesSay />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/impressum" element={<Impressum />} />
          <Route path="/datenschutz" element={<Datenschutz />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/my-appointments"
            element={
              <PrivateRoute>
                <MyAppointments />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/appointments"
            element={
              <AdminRoute>
                <AdminAppointments />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/availability"
            element={
              <AdminRoute>
                <AdminAvailability />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/revenue"
            element={
              <AdminRoute>
                <Revenue />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <AdminRoute>
                <AdminUsers />
              </AdminRoute>
            }
          />
        </Routes>
      </MainLayout>
    </div>
  );
}

export default App;