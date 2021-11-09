import Header from '../../components/Root/Header';
import Head from 'next/head'
import TitleHeader from '../../components/Root/TitleHeader';
import { supabase } from '../../lib/supabaseClient';
import { useState, useEffect } from 'react';
import Loading from '../../components/Root/Loading';
import { PencilIcon, PaperClipIcon } from '@heroicons/react/solid';
import Footer from '../../components/Root/Footer';
import { CheckIcon, XIcon } from '@heroicons/react/outline';
import { CompaniesFollowing } from '../../components/Dashboard/CompaniesFollowing';

export default function CompaniesIndex() {

    const [user, setUser] = useState([]);
    const [profile, setProfile] = useState([]);
    const [setUp, setSetUp] = useState(true);
    const [notAllowed, setNotAllowed] = useState(false);
    const [loading, setLoading] = useState(true);

    const fetchUser = async () => {
        const user = supabase.auth.user();

        if (user) {
            setUser(user);
            const { data, error } = await supabase.from('profiles').select().eq('id', user.id)
            
            if (data) {
                setProfile(data[0]);
                setSetUp(data[0].set_up);
                setLoading(false);
            } else {
                setNotAllowed(true);
                setLoading(false);
            }
        } else {
            setNotAllowed(true);
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchUser();
    }, []);

    return (
        <div>
            <Head>
                <title>Atlas Research - Dashboard</title>
            </Head>
            <Header />
            <TitleHeader title="Dashboard" />
            <div className = 'pl-6 pr-6 pt-12 sm:pl-12 sm:pr-12'>

                {
                    loading ?
                
                    <Loading />
                
                    : notAllowed ?

                    <NotAllowed />

                    : setUp ?
                    
                    <UserProfile user = {user} profile = {profile}/>

                    :

                    <SetUpAccount />

                    }

            </div>
            <Footer />
        </div>
    )
}

export const UserProfile = ({user, profile}) => {

    const [editing, setEditing] = useState(false);
    const [email, setEmail] = useState(profile.email);
    const [firstName, setFirstName] = useState(profile.first_name);
    const [lastName, setLastName] = useState(profile.last_name);
    const [bio, setBio] = useState(profile.bio);
    const [followingCompanies, setFollowingCompanies] = useState([]);

    return (
        <>
            {/* USER PROFILE */}
            <div className = 'flex justify-between items-center'>
                <div className="flex">
                    <div className="mr-4 flex-shrink-0">
                        <img src = {profile.profile_picture} className = 'w-12 h-12 rounded-full' />
                    </div>
                    <div>
                        <h4 className="text-lg font-bold">@{profile.username}</h4>
                        <p className="mt-1">
                        {profile.bio}
                        </p>
                    </div>
                </div>
                <div>
                    <button
                        type="button"
                        onClick={() => {setEditing(!editing)}}
                        className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        {editing ? <CheckIcon className="-ml-1 mr-3 h-5 w-5" aria-hidden="true" /> : <PencilIcon className="-ml-1 mr-3 h-5 w-5" aria-hidden="true" />}
                        {editing ? 'Save Changes' : 'Edit Profile'}
                    </button> 
                </div>
            </div>

            {/* ABOUT PANEL */}
            <div className="bg-white border mt-6 overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">About {profile.first_name}</h3>
                    <p className="mt-1 max-w-2xl text-sm text-gray-500">{profile.bio}</p>
                </div>
                <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                    <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                    <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">Full name</dt>
                        {
                            editing ?

                            <input
                                type = "text"
                                defaultValue={profile.first_name + ' ' + profile.last_name}
                                className="mt-1 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                            />

                            :

                            <dd className="mt-1 text-sm text-gray-900">{profile.first_name} {profile.last_name}</dd>
                        }
                    </div>
                    <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">Awesome?</dt>
                        <dd className="mt-1 text-sm text-gray-900">Yup.</dd>
                    </div>
                    <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">Email address</dt>
                        {
                            editing ?

                            <input
                                type = "text"
                                defaultValue={user.email}
                                onChange={(e) => {profile.email = e.target.value}}
                                className="mt-1 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                            />

                            :
                            
                            <dd className="mt-1 text-sm text-gray-900">{user.email}</dd>
                        }
                    </div>
                    <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">Member since</dt>
                        <dd className="mt-1 text-sm text-gray-900">{new Date(profile.created_at).toDateString()}</dd>
                    </div>
                    <div className="sm:col-span-2">
                        <dt className="text-sm font-medium text-gray-500">About</dt>
                        {
                            editing ?
                            
                            <textarea
                                className="mt-1 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                rows="3"
                                defaultValue={profile.bio}
                            />

                            :

                            <dd className="mt-1 text-sm text-gray-900">
                                {profile.bio}
                            </dd>
                        }
                    </div>
                    
                    </dl>
                </div>
                </div>
                <CompaniesFollowing user = {user} />
        </>
    )
}

export const NotAllowed = () => {
    return (
        <div>
            <h1>You are not allowed to view this page</h1>
            <p>To get access, log in.</p>
        </div>
    )
}

export const SetUpAccount = () => {

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [about, setAbout] = useState('');
    const [loading, setLoading] = useState(false);
    const [username, setUsername] = useState('');

    const setUpAccount = async (event) => {

        event.preventDefault();
        setLoading(true)

        const user = supabase.auth.user();

        const { data, error } = await supabase
            .from('profiles')
            .update({ 
                first_name: firstName,
                last_name: lastName,
                bio: about,
                username: username,
                set_up: true
            })
            .match({ id: user.id })

        if (data) {
            setLoading(false);
        } else {
            console.log(error);
            setLoading(false);
        }
    }

    return (
        <div className = 'max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 '>
            <form className="bg-white overflow-hidden rounded-lg divide-y divide-gray-200 border" onSubmit={setUpAccount}>
                <div className="px-4 py-5 sm:px-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Set Up Your Account</h3>
                </div>
                <div className="px-4 py-5 sm:p-6">

                <div className="sm:col-span-6 mb-4">
                    <label htmlFor="photo" className="block text-sm font-medium text-gray-700">
                        Photo
                    </label>
                    <div className="mt-1 flex items-center">
                        <span className="h-12 w-12 rounded-full overflow-hidden bg-gray-100">
                        <svg className="h-full w-full text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                        </span>
                        <button
                        type="button"
                        className="ml-5 bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                        Change
                        </button>
                    </div>
                </div>


                <div className="sm:col-span-4">
                    <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                        Username
                    </label>
                    <div className="mt-1 flex rounded-md shadow-sm">
                        <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                        atlasfinance.org/
                        </span>
                        <input
                            type="text"
                            name="username"
                            onChange={(e) => setUsername(e.target.value)}
                            id="username"
                            required
                            autoComplete="username"
                            className="flex-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full min-w-0 rounded-none rounded-r-md sm:text-sm border-gray-300"
                        />
                    </div>
                    </div>

                    <div className = 'mt-4'>
                        <label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-700">
                            First Name
                        </label>
                        <div className="mt-1">
                            <input
                                type="text"
                                required
                                onChange={(e) => setFirstName(e.target.value)}
                                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                placeholder="Tiger"
                            />
                        </div>
                    </div>

                    <div className = 'mt-4'>
                        <label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-700">
                            Last Name
                        </label>
                        <div className="mt-1">
                            <input
                                type="text"
                                required
                                onChange={(e) => setLastName(e.target.value)}
                                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                placeholder="Woods"
                            />
                        </div>
                    </div>

                    <div className="sm:col-span-6 mt-4">
                    <label htmlFor="about" className="block text-sm font-medium text-gray-700">
                        About
                    </label>
                    <div className="mt-1">
                        <textarea
                            id="about"
                            required
                            name="about"
                            onChange={(e) => setAbout(e.target.value)}
                            rows={3}
                            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border border-gray-300 rounded-md"
                            defaultValue={''}
                        />
                    </div>
                    <p className="mt-2 text-sm text-gray-500">Write a few sentences about yourself.</p>
                    </div>

                    

                </div>
                <div className="px-4 py-4 sm:px-6">
                    <div className = 'flex justify-end'>
                        <button
                            type="submit"
                            className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            { loading ? 'Getting everything ready...' : <>Continue To Dashboard &rarr;</>}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    )
}