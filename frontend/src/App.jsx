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
import MyAppointments from "./pages/MyAppointments";
import AdminAppointments from "./pages/AdminAppointments";
import Impressum from "./pages/Impressum";
import Datenschutz from "./pages/Datenschutz";

function App() {
  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/my-story" element={<MyStory />} />
        <Route path="/do-you-feel-this" element={<DoYouFeelThis />} />
        <Route path="/the-way-to-transformation" element={<TheWayToTransformation />} />
        <Route path="/take-the-first-step" element={<TakeTheFirstStep />} />
        <Route path="/inside-the-room"
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
        <Route path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route path="/my-appointments"
          element={
            <PrivateRoute>
              <MyAppointments />
            </PrivateRoute>
          }
        />
        <Route path="/admin/appointments"
          element={
            <PrivateRoute>
              <AdminAppointments />
            </PrivateRoute>
          }
        />
      </Routes>
    </MainLayout>
  );
}

export default App;