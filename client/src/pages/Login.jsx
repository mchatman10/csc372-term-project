import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { login, register } = useAuth()
  const [isRegister, setIsRegister] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    if (isRegister) {
      await register(email, password, name)
    } else {
      await login(email, password)
    }
  }

  return (
    <div>
      <h2>{isRegister ? 'Register' : 'Login'}</h2>

      <form onSubmit={handleSubmit}>
        {isRegister && (
          <input placeholder='Display Name'
            value={name} onChange={e => setName(e.target.value)} />
        )}
        <input placeholder='Email'
          value={email} onChange={e => setEmail(e.target.value)} />
        <input type='password' placeholder='Password'
          value={password} onChange={e => setPassword(e.target.value)} />

        <button type='submit'>
          {isRegister ? 'Create Account' : 'Login'}
        </button>
      </form>

      <button onClick={() => setIsRegister(!isRegister)}>
        {isRegister ? 'Already have an account?' : 'Create an account'}
      </button>
    </div>
  )
}
