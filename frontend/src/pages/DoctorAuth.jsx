import axios from 'axios';
import { useState } from "react";

function InputField({ label, required, type = "text", placeholder, value, onChange }) {
  return (
    <div className="mb-4">
      <label className="text-sm font-medium text-gray-600 block mb-1.5">
        {label}{required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      <input type={type} placeholder={placeholder} value={value} onChange={onChange}
        className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-primary transition-colors" />
    </div>
  );
}

function FileField({ label, required, fileName, onChange }) {
  return (
    <div className="mb-4">
      <label className="text-sm font-medium text-gray-600 block mb-1.5">
        {label}{required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      <label className={`flex items-center gap-2 px-4 py-2.5 border rounded-lg cursor-pointer text-sm transition-colors ${fileName ? 'border-primary text-primary bg-blue-50' : 'border-dashed border-gray-300 text-gray-400 hover:border-gray-400'}`}>
        <span>{fileName || `Upload ${label}`}</span>
        <input type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden" onChange={onChange} />
      </label>
    </div>
  );
}

function LoginPage({ onRegister }) {
  const [form, setForm] = useState({ name: "", regNo: "", password: "" });
  const [error, setError] = useState("");

  const handleLogin = () => {
    if (!form.name || !form.regNo || !form.password) { setError("Please fill in all required fields."); return; }
    setError("Doctor not found. Please register below.");
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-8">
      <div className="w-full max-w-[400px] p-8">
        <h2 className="text-2xl font-bold text-navy">Doctor Login</h2>
        <p className="text-gray-400 text-sm mt-1 mb-8">Sign in to your doctor portal</p>

        <InputField label="Doctor Name" required placeholder="Dr. Sharma" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
        <InputField label="Registration No." required placeholder="MCI-2024-XXXXX" value={form.regNo} onChange={e => setForm({ ...form, regNo: e.target.value })} />
        <InputField label="Password" required type="password" placeholder="••••••••" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />

        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

        <button onClick={handleLogin} className="bg-primary text-white w-full py-2.5 rounded-lg text-sm font-medium hover:bg-primary-hover transition-colors">
          Sign In
        </button>

        <p className="text-center text-sm text-gray-400 mt-6">
          New doctor? <span onClick={onRegister} className="text-primary font-medium cursor-pointer hover:underline">Register here</span>
        </p>
      </div>
    </div>
  );
}

function RegistrationPage({ onBack, onSuccess }) {
  const [form, setForm] = useState({
    fullName: "", email: "", phone: "", dob: "", gender: "", address: "", city: "",
    specialization: "", qualification: "", experience: "", medRegNo: "", licenseNo: "",
    aadhar: "", panCard: "", hospitalName: "", password: "", confirmPassword: "",
  });
  const [files, setFiles] = useState({ license: "", certificate: "", aadharDoc: "", photo: "" });
  const [error, setError] = useState("");
  const setField = (key) => (e) => setForm({ ...form, [key]: e.target.value });
  const setFile = (key) => (e) => { const f = e.target.files[0]; if (f) setFiles({ ...files, [key]: f.name }); };

  const handleSubmit = async () => {
    const required = [form.fullName, form.email, form.phone, form.medRegNo, form.licenseNo, form.aadhar, form.password, form.specialization, form.qualification];
    if (required.some(v => !v)) { setError("Please fill in all required fields."); return; }
    if (form.password !== form.confirmPassword) { setError("Passwords do not match."); return; }
    if (form.password.length < 6) { setError("Password must be at least 6 characters."); return; }
    try {
      const response = await axios.post('http://localhost:4000/api/doctor/register', {
        name: form.fullName, email: form.email, phone: form.phone, password: form.password,
        speciality: form.specialization, degree: form.qualification, experience: form.experience + " Years",
        licenseNo: form.licenseNo, aadhar: form.aadhar, city: form.city, address: form.address, hospitalName: form.hospitalName
      });
      if (response.data.success) onSuccess(form.fullName); else setError(response.data.message);
    } catch (err) { setError("Server error. Please try again."); }
  };

  return (
    <div className="py-10 max-w-2xl mx-auto">
      <button onClick={onBack} className="text-sm text-gray-400 hover:text-primary mb-6 font-medium transition-colors">&larr; Back to Login</button>
      <h2 className="text-2xl font-bold text-navy mb-1">Doctor Registration</h2>
      <p className="text-gray-400 text-sm mb-8">Fill in your details to create an account</p>

      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 mt-6 pt-4 border-t border-gray-100">Personal Information</p>
      <div className="grid grid-cols-2 gap-4">
        <InputField label="Full Name" required placeholder="Dr. Priya Sharma" value={form.fullName} onChange={setField("fullName")} />
        <InputField label="Date of Birth" required type="date" value={form.dob} onChange={setField("dob")} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <InputField label="Email" required type="email" placeholder="doctor@email.com" value={form.email} onChange={setField("email")} />
        <InputField label="Phone" required type="tel" placeholder="+91 98765 43210" value={form.phone} onChange={setField("phone")} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="mb-4">
          <label className="text-sm font-medium text-gray-600 block mb-1.5">Gender<span className="text-red-400 ml-0.5">*</span></label>
          <select className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-primary" value={form.gender} onChange={setField("gender")}>
            <option value="">Select</option><option>Male</option><option>Female</option><option>Other</option>
          </select>
        </div>
        <InputField label="City" placeholder="Mumbai" value={form.city} onChange={setField("city")} />
      </div>
      <InputField label="Address" placeholder="123, Street Name, Colony..." value={form.address} onChange={setField("address")} />

      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 mt-6 pt-4 border-t border-gray-100">Medical Credentials</p>
      <div className="grid grid-cols-2 gap-4">
        <InputField label="Reg. Number" required placeholder="MCI-2024-XXXXX" value={form.medRegNo} onChange={setField("medRegNo")} />
        <InputField label="License Number" required placeholder="LIC-XXXX-XXXX" value={form.licenseNo} onChange={setField("licenseNo")} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="mb-4">
          <label className="text-sm font-medium text-gray-600 block mb-1.5">Specialization<span className="text-red-400 ml-0.5">*</span></label>
          <select className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-primary" value={form.specialization} onChange={setField("specialization")}>
            <option value="">Select</option><option>General Physician</option><option>Cardiologist</option><option>Orthopedic</option><option>Neurologist</option><option>Dermatologist</option><option>Pediatrician</option><option>Gynecologist</option><option>Ophthalmologist</option><option>ENT Specialist</option><option>Dentist</option><option>Other</option>
          </select>
        </div>
        <InputField label="Qualification" required placeholder="MBBS, MD..." value={form.qualification} onChange={setField("qualification")} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <InputField label="Experience (Years)" type="number" placeholder="5" value={form.experience} onChange={setField("experience")} />
        <InputField label="Hospital Name" placeholder="City Hospital" value={form.hospitalName} onChange={setField("hospitalName")} />
      </div>

      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 mt-6 pt-4 border-t border-gray-100">Identity Documents</p>
      <div className="grid grid-cols-2 gap-4">
        <InputField label="Aadhar Number" required placeholder="XXXX XXXX XXXX" value={form.aadhar} onChange={setField("aadhar")} />
        <InputField label="PAN Number" placeholder="ABCDE1234F" value={form.panCard} onChange={setField("panCard")} />
      </div>

      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 mt-6 pt-4 border-t border-gray-100">Document Uploads</p>
      <div className="grid grid-cols-2 gap-4">
        <FileField label="Medical License" required fileName={files.license} onChange={setFile("license")} />
        <FileField label="Degree Certificate" required fileName={files.certificate} onChange={setFile("certificate")} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <FileField label="Aadhar Card" required fileName={files.aadharDoc} onChange={setFile("aadharDoc")} />
        <FileField label="Doctor Photo" fileName={files.photo} onChange={setFile("photo")} />
      </div>

      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 mt-6 pt-4 border-t border-gray-100">Account Setup</p>
      <div className="grid grid-cols-2 gap-4">
        <InputField label="Password" required type="password" placeholder="Min 6 characters" value={form.password} onChange={setField("password")} />
        <InputField label="Confirm Password" required type="password" placeholder="Re-enter password" value={form.confirmPassword} onChange={setField("confirmPassword")} />
      </div>

      {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
      <button onClick={handleSubmit} className="bg-primary text-white w-full py-2.5 rounded-lg text-sm font-medium hover:bg-primary-hover transition-colors mt-2">
        Submit Registration
      </button>
    </div>
  );
}

function SuccessPage({ name, onBack }) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center max-w-sm">
        <div className="w-14 h-14 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-7 h-7 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
        </div>
        <h2 className="text-xl font-bold text-navy mb-2">Registration Submitted</h2>
        <p className="text-gray-400 text-sm mb-6">Dr. {name}, your registration is under review. You'll receive a confirmation email within 24–48 hours.</p>
        <button onClick={onBack} className="bg-primary text-white px-8 py-2 rounded-lg text-sm font-medium hover:bg-primary-hover transition-colors">Back to Login</button>
      </div>
    </div>
  );
}

export default function DoctorAuth() {
  const [page, setPage] = useState("login");
  const [doctorName, setDoctorName] = useState("");
  return (
    <>
      {page === "login" && <LoginPage onRegister={() => setPage("register")} />}
      {page === "register" && <RegistrationPage onBack={() => setPage("login")} onSuccess={(name) => { setDoctorName(name); setPage("success"); }} />}
      {page === "success" && <SuccessPage name={doctorName} onBack={() => setPage("login")} />}
    </>
  );
}