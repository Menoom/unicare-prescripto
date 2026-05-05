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
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center text-white text-3xl mx-auto mb-4 shadow-md">
            🩺
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Doctor Login</h1>
          <p className="text-gray-500 text-sm mt-1">Login to your doctor account</p>
        </div>

        <InputField label="Doctor Name" required placeholder="Dr. Sharma" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
        <InputField label="Registration No." required placeholder="MCI-2024-XXXXX" value={form.regNo} onChange={e => setForm({ ...form, regNo: e.target.value })} />
        <InputField label="Password" required type="password" placeholder="••••••••" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />

        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

        <button onClick={handleLogin} className="w-full bg-primary text-white py-3 rounded-full font-medium text-sm hover:bg-primary/90 transition-all mt-2">
          Login →
        </button>

        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-xs text-gray-400 font-semibold tracking-widest">NEW DOCTOR?</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        <button onClick={onRegister} className="w-full border border-primary text-primary py-3 rounded-full font-medium text-sm hover:bg-blue-50 transition-all">
          + Self Registration
        </button>
      </div>
    </div>
  );
}

function RegistrationPage({ onBack, onSuccess }) {
  const [form, setForm] = useState({
    fullName: "", email: "", phone: "", dob: "",
    gender: "", city: "",
    specialization: "", qualification: "", experience: "",
    medRegNo: "", licenseNo: "",
    aadhar: "", fees: "", about: "",
    hospitalName: "",
    password: "", confirmPassword: "",
  });
  const [files, setFiles] = useState({ license: "", photo: "" });
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
        name: form.fullName,
        email: form.email,
        phone: form.phone,
        password: form.password,
        speciality: form.specialization,
        degree: form.qualification,
        experience: form.experience + " Years",
        licenseNo: form.licenseNo,
        aadhar: form.aadhar,
        city: form.city,
        hospitalName: form.hospitalName,
        fees: form.fees,
        about: form.about,
      })
      if (response.data.success) {
        onSuccess(form.fullName)
      } else {
        setError(response.data.message)
      }
    } catch (err) {
      setError("Server error. Please try again.")
    }
  };

  return (
    <div className="py-10 max-w-2xl mx-auto">
      <button onClick={onBack} className="text-sm text-gray-400 hover:text-primary mb-6 font-medium transition-colors">&larr; Back to Login</button>
      <h2 className="text-2xl font-bold text-navy mb-1">Doctor Registration</h2>
      <p className="text-gray-400 text-sm mb-8">Fill in your details to create an account</p>

        <button onClick={onBack} className="text-sm text-gray-500 hover:text-primary flex items-center gap-1 mb-5">
          ← Back to Login
        </button>

        <div className="text-center mb-6">
          <span className="text-xs font-semibold text-primary bg-blue-50 border border-blue-100 px-3 py-1 rounded-full">Doctor Self Registration</span>
          <h1 className="text-2xl font-bold text-gray-800 mt-3">Create Your Account</h1>
          <p className="text-gray-500 text-sm mt-1">Fill in your complete details below</p>
        </div>

        {/* Personal Info */}
        <p className="text-xs font-bold text-primary uppercase tracking-widest mb-3 mt-4 border-b border-blue-100 pb-2">Personal Information</p>
        <div className="grid grid-cols-2 gap-4">
          <InputField label="Full Name" required placeholder="Dr. Priya Sharma" value={form.fullName} onChange={setField("fullName")} />
          <InputField label="Date of Birth" type="date" value={form.dob} onChange={setField("dob")} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <InputField label="Email Address" required type="email" placeholder="doctor@email.com" value={form.email} onChange={setField("email")} />
          <InputField label="Phone Number" required type="tel" placeholder="+91 98765 43210" value={form.phone} onChange={setField("phone")} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600 mb-1">Gender</label>
            <select className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-700 outline-none focus:border-primary" value={form.gender} onChange={setField("gender")}>
              <option value="">Select</option>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
          </div>
          <InputField label="City" placeholder="Mumbai" value={form.city} onChange={setField("city")} />
        </div>

        {/* Medical Credentials */}
        <p className="text-xs font-bold text-primary uppercase tracking-widest mb-3 mt-4 border-b border-blue-100 pb-2">Medical Credentials</p>
        <div className="grid grid-cols-2 gap-4">
          <InputField label="Medical Registration Number" required placeholder="MCI-2024-XXXXX" value={form.medRegNo} onChange={setField("medRegNo")} />
          <InputField label="License Number" required placeholder="LIC-XXXX-XXXX" value={form.licenseNo} onChange={setField("licenseNo")} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600 mb-1">Specialization <span className="text-red-500">*</span></label>
            <select className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-700 outline-none focus:border-primary" value={form.specialization} onChange={setField("specialization")}>
              <option value="">Select</option>
              <option>General Physician</option>
              <option>Cardiologist</option>
              <option>Orthopedic</option>
              <option>Neurologist</option>
              <option>Dermatologist</option>
              <option>Pediatrician</option>
              <option>Gynecologist</option>
              <option>Ophthalmologist</option>
              <option>ENT Specialist</option>
              <option>Dentist</option>
              <option>Other</option>
            </select>
          </div>
          <InputField label="Qualification" required placeholder="MBBS, MD..." value={form.qualification} onChange={setField("qualification")} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <InputField label="Experience (Years)" type="number" placeholder="5" value={form.experience} onChange={setField("experience")} />
          <InputField label="Hospital / Clinic Name" placeholder="City Hospital" value={form.hospitalName} onChange={setField("hospitalName")} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <InputField label="Consultation Fees (₹)" type="number" placeholder="500" value={form.fees} onChange={setField("fees")} />
          <InputField label="Aadhar Number" required placeholder="XXXX XXXX XXXX" value={form.aadhar} onChange={setField("aadhar")} />
        </div>

        {/* About */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600 mb-1">About Doctor</label>
          <textarea
            placeholder="Write a brief description about yourself, your expertise and experience..."
            value={form.about}
            onChange={setField("about")}
            rows={3}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-700 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-none"
          />
        </div>

        {/* Document Uploads */}
        <p className="text-xs font-bold text-primary uppercase tracking-widest mb-3 mt-4 border-b border-blue-100 pb-2">Document Uploads</p>
        <div className="grid grid-cols-2 gap-4">
          <FileField label="Medical License" required fileName={files.license} onChange={setFile("license")} />
          <FileField label="Doctor Photo" required fileName={files.photo} onChange={setFile("photo")} />
        </div>

        {/* Password */}
        <p className="text-xs font-bold text-primary uppercase tracking-widest mb-3 mt-4 border-b border-blue-100 pb-2">Account Setup</p>
        <div className="grid grid-cols-2 gap-4">
          <InputField label="Password" required type="password" placeholder="Min 6 characters" value={form.password} onChange={setField("password")} />
          <InputField label="Confirm Password" required type="password" placeholder="Re-enter password" value={form.confirmPassword} onChange={setField("confirmPassword")} />
        </div>

        {error && <p className="text-red-500 text-sm mb-3">⚠ {error}</p>}

        <button onClick={handleSubmit} className="w-full bg-primary text-white py-3 rounded-full font-medium text-sm hover:bg-primary/90 transition-all mt-2">
          Submit Registration →
        </button>
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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-lg p-10 w-full max-w-md text-center">
        <div className="text-6xl mb-4">✅</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Registration Successful!</h2>
        <p className="text-gray-500 text-sm leading-relaxed mb-6">
          <span className="text-primary font-semibold">Dr. {name}</span>, your registration has been submitted successfully.<br /><br />
          You will receive a confirmation email once your credentials are verified. Verification may take 24–48 hours.
        </p>
        <button onClick={onBack} className="w-full bg-primary text-white py-3 rounded-full font-medium text-sm hover:bg-primary/90 transition-all">
          Go to Login
        </button>
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
