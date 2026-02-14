import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import MealPlans from './pages/MealPlans';
import WeeklyUpdates from './pages/WeeklyUpdates';
import PendingApproval from './pages/PendingApproval';
import CompleteProfile from './pages/CompleteProfile';
import FoodLogPage from './pages/FoodLog';
import MessagesPage from './pages/Messages';
import LabResultsPage from './pages/LabResults';
import AdminMessages from './pages/AdminMessages';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/complete-profile" element={<CompleteProfile />} />
            <Route path="/pending-approval" element={<PendingApproval />} />
            <Route element={<Layout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/meal-plans" element={<MealPlans />} />
              <Route path="/weekly-updates" element={<WeeklyUpdates />} />
              <Route path="/food-log" element={<FoodLogPage />} />
              <Route path="/messages" element={<MessagesPage />} />
              <Route path="/lab-results" element={<LabResultsPage />} />
              <Route path="/admin/messages" element={<AdminMessages />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
