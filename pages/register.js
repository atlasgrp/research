import { useRouter } from "next/router"
import { useState } from "react"
import { supabase } from '../lib/supabaseClient'
import Link from 'next/link'

export default function Register() {
    
    const router = useRouter()

    const [email, setEmail] = useState(null)
    const [password, setPassword] = useState(null)
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)

    const signUp = async (event) => {
        
        event.preventDefault()
        setLoading(true)

        const { user, session, error } = await supabase.auth.signUp({
            email: email,
            password: password,
        })

        if (error) {
            setError(error.message)
            setLoading(false)
        } else {
            const { data, error } = await supabase.from('profiles').insert([{ id: user.id }])
            if (error) {
              setError(error.message)
            } else {
              router.push('/app')
            }
        }
    }
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <img
            className="mx-auto h-12 w-auto"
            src="/Atlas.png"
            alt="Atlas"
          />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Sign up to Atlas</h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link href="/login">
              <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
                log in
              </a>
            </Link>
          </p>
        </div>
  
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <form className="space-y-6" onSubmit={signUp} method="POST">
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email address
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    onChange={(e)=>{
                        setEmail(e.target.value)
                    }}
                    autoComplete="email"
                    required
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
              </div>


              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="mt-1">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    onChange={(e)=>{
                        setPassword(e.target.value)
                    }}
                    autoComplete="current-password"
                    required
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
              </div>
  
              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  { loading ? 'Getting your account setup...' : 'Register' }
                </button>
              </div>
              {
                  error ?

                  <p className = 'mt-3 text-red-600 font-bold'>{error}</p>
                
                :

                <></>
              }
            </form>
  
          </div>
        </div>
      </div>
    )
  }
  