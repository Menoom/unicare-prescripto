import { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

const Login = () => {
  const [state, setState] = useState('Sign Up')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()
  const { backendUrl, token, setToken } = useContext(AppContext)

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      if (state === 'Sign Up') {
        const { data } = await axios.post(backendUrl + '/api/user/register', { name, email, password })
        if (data.success) { localStorage.setItem('token', data.token); setToken(data.token) }
        else { toast.error(data.message) }
      } else {
        const { data } = await axios.post(backendUrl + '/api/user/login', { email, password })
        if (data.success) { localStorage.setItem('token', data.token); setToken(data.token) }
        else { toast.error(data.message) }
      }
    } catch (error) { console.log(error); toast.error(error.message) }
  }

  useEffect(() => { if (token) navigate('/') }, [token])

  return (
    <form onSubmit={onSubmitHandler} className='min-h-[80vh] flex items-center justify-center'>
      <div className='w-full max-w-[400px] p-8'>
        <h2 className='text-2xl font-bold text-navy'>{state === 'Sign Up' ? 'Create Account' : 'Welcome Back'}</h2>
        <p className='text-gray-400 text-sm mt-1 mb-8'>
          {state === 'Sign Up' ? 'Sign up to book appointments' : 'Log in to your account'}
        </p>

        {state === 'Sign Up' && (
          <div className='mb-4'>
            <label className='text-sm font-medium text-gray-600 block mb-1.5'>Full Name</label>
            <input onChange={(e) => setName(e.target.value)} value={name}
              className='w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-primary transition-colors' type="text" placeholder='Your name' required />
          </div>
        )}
        <div className='mb-4'>
          <label className='text-sm font-medium text-gray-600 block mb-1.5'>Email</label>
          <input onChange={(e) => setEmail(e.target.value)} value={email}
            className='w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-primary transition-colors' type="email" placeholder='you@email.com' required />
        </div>
        <div className='mb-6'>
          <label className='text-sm font-medium text-gray-600 block mb-1.5'>Password</label>
          <input onChange={(e) => setPassword(e.target.value)} value={password}
            className='w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-primary transition-colors' type="password" placeholder='••••••••' required />
        </div>

        <button className='bg-primary text-white w-full py-2.5 rounded-lg text-sm font-medium hover:bg-primary-hover transition-colors'>
          {state === 'Sign Up' ? 'Create Account' : 'Log In'}
        </button>

        <p className='text-center text-sm text-gray-400 mt-6'>
          {state === 'Sign Up'
            ? <>Already have an account? <span onClick={() => setState('Login')} className='text-primary font-medium cursor-pointer hover:underline'>Log in</span></>
            : <>New here? <span onClick={() => setState('Sign Up')} className='text-primary font-medium cursor-pointer hover:underline'>Create account</span></>
          }
        </p>
      </div>
    </form>
  )
}

export default Login