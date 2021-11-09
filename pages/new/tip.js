import { Fragment, useEffect, useState } from 'react'
import { Disclosure, Menu, RadioGroup, Transition } from '@headlessui/react'
import { HomeIcon, PlusIcon, SearchIcon } from '@heroicons/react/solid'
import { BellIcon, MenuIcon, XIcon } from '@heroicons/react/outline'
import Header from '../../components/Root/Header'
import Footer from '../../components/Root/Footer'
import { supabase } from '../../lib/supabaseClient'
import Loading from '../../components/Root/Loading'

const settings = [
  { name: 'Public info', value: 2, description: <>If we publish the information, we will credit you</> },
  { name: 'Private to us', value: 1, description: <>Only we can view your information</> },
  { name: 'Completely Anonymous', value: 0, description: <>We don&apos;t store any info about you. You won&apos;t be able to edit the tip later</> },
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Tip() {
  const [selected, setSelected] = useState(settings[0])
  const [loading, setLoading] = useState(true)
  const [tldr, setTdlr] = useState('')
  const [details, setDetails] = useState('')
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState([])
  const [message, setMessage] = useState(null)

  const fetchUser = async () => {
    const user = supabase.auth.user()
    if (user) {
        setUser(user)
        const { data, error } = await supabase.from('profiles').select().eq('id', user.id)

        if (error) {
            console.error(error)
        } else {
            setProfile(data[0])
            setLoading(false)
        }
    } else {
        setLoading(false)
    }
  }

  const submitTip = async (event) => {
      event.preventDefault()

    const { data, error } = await supabase.from('tips').insert({
        tldr: tldr,
        description: details,
        user_id: user.id,
        privacy: selected.value,
        created_at: new Date(),
    })

    if (error) {
        alert(error.message)
    } else {
        alert('Tip submitted!')
    }
 }


  useEffect(() => {
    fetchUser()
  }, [])

  return (
    <>
      <Header />

      <main className="max-w-lg mx-auto pt-10 pb-12 px-4 lg:pb-16">
        <form onSubmit={submitTip}>
          <div className="space-y-6">
            <div>
              <h1 className="text-lg leading-6 font-medium text-gray-900">{message ? message : 'Submit a new tip'}</h1>
              <p className="mt-1 text-sm text-gray-500">
                Have some news you hink we should know? Submit a tip to help us
              </p>
            </div>

            {
                loading ? 

                <Loading />

                :

                user !== null ?

                <>
                <div>
                    <label htmlFor="project-name" className="block text-sm font-medium text-gray-700">
                        TLDR
                    </label>
                    <div className="mt-1">
                        <input
                        type="text"
                        name="project-name"
                        onChange={(e) => setTdlr(e.target.value)}
                        required
                        id="project-name"
                        className="block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 rounded-md"
                        />
                    </div>
                    </div>

                    <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                        Details
                    </label>
                    <div className="mt-1">
                        <textarea
                        id="description"
                        name="description"
                        required
                        onChange={(e) => setDetails(e.target.value)}
                        rows={3}
                        className="block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border border-gray-300 rounded-md"
                        defaultValue={''}
                        />
                    </div>
                    </div>

                    <RadioGroup value={selected} onChange={setSelected}>
                    <RadioGroup.Label className="text-sm font-medium text-gray-900">Privacy</RadioGroup.Label>

                    <div className="mt-1 bg-white rounded-md shadow-sm -space-y-px">
                        {settings.map((setting, settingIdx) => (
                        <RadioGroup.Option
                            key={setting.name}
                            value={setting}
                            onClick={() => {
                                console.log('nr')
                            }}
                            className={({ checked }) =>
                            classNames(
                                settingIdx === 0 ? 'rounded-tl-md rounded-tr-md' : '',
                                settingIdx === settings.length - 1 ? 'rounded-bl-md rounded-br-md' : '',
                                checked ? 'bg-indigo-50 border-indigo-200 z-10' : 'border-gray-200',
                                'relative border p-4 flex cursor-pointer focus:outline-none'
                            )
                            }
                        >
                            {({ active, checked }) => (
                            <>
                                <span
                                className={classNames(
                                    checked ? 'bg-indigo-600 border-transparent' : 'bg-white border-gray-300',
                                    active ? 'ring-2 ring-offset-2 ring-indigo-500' : '',
                                    'h-4 w-4 mt-0.5 cursor-pointer rounded-full border flex items-center justify-center'
                                )}
                                aria-hidden="true"
                                >
                                <span className="rounded-full bg-white w-1.5 h-1.5" />
                                </span>
                                <div className="ml-3 flex flex-col">
                                <RadioGroup.Label
                                    as="span"
                                    className={classNames(
                                    checked ? 'text-indigo-900' : 'text-gray-900',
                                    'block text-sm font-medium'
                                    )}
                                >
                                    {setting.name}
                                </RadioGroup.Label>
                                <RadioGroup.Description
                                    as="span"
                                    className={classNames(checked ? 'text-indigo-700' : 'text-gray-500', 'block text-sm')}
                                >
                                    {setting.description}
                                </RadioGroup.Description>
                                </div>
                            </>
                            )}
                        </RadioGroup.Option>
                        ))}
                    </div>
                    </RadioGroup>

                    <div className="flex justify-end">
                    <button
                        type="button"
                        className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >   
                        Submit { selected == settings[2] ? 'Anonymously' : <>as {profile.first_name}</> }
                    </button>
                    </div>
                </>

                :

                <div>You need to be logged in to submit a tip</div>
            }
          </div>
        </form>
      </main>

      <Footer />
    </>
  )
}
