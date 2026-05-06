import React, { useContext, useEffect } from 'react'
import { DoctorContext } from './context/DoctorContext';
import { AdminContext } from './context/AdminContext';
import { AppContext } from './context/AppContext';
import { Route, Routes } from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Admin/Dashboard';
import AllAppointments from './pages/Admin/AllAppointments';
import AddDoctor from './pages/Admin/AddDoctor';
import DoctorsList from './pages/Admin/DoctorsList';
import Analytics from './pages/Admin/Analytics';
import DoctorApproval from './pages/Admin/DoctorApproval';
import PatientsList from './pages/Admin/PatientsList';
import Revenue from './pages/Admin/Revenue';
import Ratings from './pages/Admin/Ratings';
import Notifications from './pages/Admin/Notifications';
import Login from './pages/Login';
import DoctorAppointments from './pages/Doctor/DoctorAppointments';
import DoctorDashboard from './pages/Doctor/DoctorDashboard';
import DoctorProfile from './pages/Doctor/DoctorProfile';

const App = () => {
  const { dToken } = useContext(DoctorContext)
  const { aToken } = useContext(AdminContext)
  const { theme } = useContext(AppContext)

  useEffect(() => {
    const root = window.document.documentElement;
    if ((dToken || aToken) && theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [dToken, aToken, theme]);

  return dToken || aToken ? (
    <div className='bg-[#F8F9FD] dark:bg-gray-900 min-h-screen transition-colors duration-200 text-gray-900 dark:text-gray-100'>
      <ToastContainer position="top-right" autoClose={3000} />
      <Navbar />
      <div className='flex items-start'>
        <Sidebar />
        <div className='flex-1 overflow-auto'>
          <Routes>
            <Route path='/' element={<></>} />
            {/* Existing Admin Routes */}
            <Route path='/admin-dashboard' element={<Dashboard />} />
            <Route path='/all-appointments' element={<AllAppointments />} />
            <Route path='/add-doctor' element={<AddDoctor />} />
            <Route path='/doctor-list' element={<DoctorsList />} />
            <Route path='/analytics' element={<Analytics />} />
            {/* New Admin Routes */}
            <Route path='/doctor-approval' element={<DoctorApproval />} />
            <Route path='/patients-list' element={<PatientsList />} />
            <Route path='/revenue' element={<Revenue />} />
            <Route path='/ratings' element={<Ratings />} />
            <Route path='/notifications' element={<Notifications />} />
            {/* Doctor Routes */}
            <Route path='/doctor-dashboard' element={<DoctorDashboard />} />
            <Route path='/doctor-appointments' element={<DoctorAppointments />} />
            <Route path='/doctor-profile' element={<DoctorProfile />} />
          </Routes>
        </div>
      </div>
    </div>
  ) : (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <Login />
    </>
  )
}

export default App
