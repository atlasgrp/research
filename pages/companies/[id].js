import Header from '../../components/Root/Header';
import Footer from '../../components/Root/Footer';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Loading from '../../components/Root/Loading'
import { supabase } from '../../lib/supabaseClient';
import TitleHeader from '../../components/Root/TitleHeader';
import { CheckCircleIcon } from '@heroicons/react/solid';
import { PlusCircleIcon } from '@heroicons/react/outline';
import Head from 'next/head';

export default function CompanyPage() {

    const router = useRouter()
    const { id } = router.query
    const [loading, setLoading] = useState(true)
    const [company, setCompany] = useState([])

    const getCompany = async () => {
        const { data, error } = await supabase
            .from('tickers')
            .select()
            .eq('ticker', id)
        
        if (error) {
            console.log(error)
        } else {
            setCompany(data[0])
            setLoading(false)
        }
    }

    useEffect(() => {
        getCompany()
    }, [])

    return (
        <div>
            <Head>
                <title>Atlas Research</title>
            </Head>
            <Header />
            {
                loading ? 
                
                <div className = 'pl-6 pr-6 pt-12 sm:pl-12 sm:pr-12'>
                    <Loading /> 
                </div>
                
                : 

                <div>
                    <TitleHeader title = {company.name} />
                    <div className = 'pl-6 pr-6 pt-12 sm:pl-12 sm:pr-12'>
                        <div className = 'flex justify-between items-center'>
                            <IntroPanel company = {company}/>
                            <FollowButton company = {company} />
                        </div>
                    </div>
                </div>
            }
            <Footer />
        </div>
    )
}


export function IntroPanel({company}) {
    return (
      <div className="flex items-center">
        <div className="mr-4 flex-shrink-0 self-center">
          <img className="h-24 w-24 rounded-full border" src={company.logo} alt="company logo" />
        </div>
        <div>
          <h4 className="text-lg font-bold">{company.name} (${company.ticker})</h4>
          <p className="mt-1">
            {company.description}
          </p>
        </div>
      </div>
    )
  }
  
export const FollowButton = ({company}) => {

    const [following, setFollowing] = useState(true)

    const follow = async () => {

        const user = supabase.auth.user()

        const { data, error } = await supabase
            .from('followers')
            .insert({
                company: company.id,
                user: user.id,
            })

        if (error) {
            alert(error.message)
            setFollowing(false)
        } else {
            setFollowing(true)
        }
    }

    const unfollow = async () => {

        const user = supabase.auth.user()

        const { data, error } = await supabase
            .from('followers')
            .delete()
            .match({ user: user.id, company: company.id })

        if (error) {    
            console.log(error)
            alert(error.message)
        } else {
            setFollowing(false)
        }
    }

    const checkFollowing = async () => {

        const user = supabase.auth.user()
        
        if (user) {

            const { data, error } = await supabase
                .from('followers')
                .select()
                .eq('company', company.id)
                .eq('user', user.id)

            if (error) {
                console.log(error)
            } else {
                if (data.length > 0) {
                    setFollowing(true)
                    console.log(data)
                } else {
                    setFollowing(false)
                }
            }
        } else {
            setFollowing(false)
        }

    }


    useEffect(() => {
        checkFollowing()
    }, [])

    return (
        <div className="mt-6">
            {
                following ?

                <button
                    type="button"
                    onClick={() => {
                        unfollow()
                        setFollowing(false)
                    }}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >   
                    <CheckCircleIcon className="w-4 h-4 mr-2 text-green-600" />
                    Following
                </button>

                :
                
                <button
                    type="button"
                    onClick={() => {
                        const user = supabase.auth.user()

                        if (user) {
                            setFollowing(true)
                            follow()
                        } else {
                            alert('You need to be logged in to follow companies')
                        }
                    }}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    <PlusCircleIcon className="w-4 h-4 mr-2" />
                    Follow
                </button>
            }
        </div>
    )
}