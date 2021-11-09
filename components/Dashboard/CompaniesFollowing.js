import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import Loading from '../../components/Root/Loading';
import Link from 'next/link';

export const CompaniesFollowing = ({user}) => {

    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);

    const getCompanies = async () => {
        const { data, error } = await supabase
        .from('followers')
        .select(`
            company (
                name,
                ticker,
                logo,
                description
            )
        `)
        .eq('user', user.id)

        if (error) {
            console.error(error)
        } else {
            setCompanies(data);
            console.log(data);
            setLoading(false)
        }
    }

    useEffect(() => {
        getCompanies();
    }, [])

    return (
        <div className="mt-6">
            <div className="md:flex md:items-center md:justify-between">
                <div className="flex-1 min-w-0">
                <h2 className="text-lg font-bold leading-7 text-gray-900 sm:text-xl sm:truncate">Companies you follow</h2>
                </div>
                <div className="mt-4 flex md:mt-0 md:ml-4">
                {/* <button
                    type="button"
                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    <svg className="w-4 h-4 mr-2" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
                    </svg>
                    Tweet
                </button> */}
                </div>
            </div>
            <div className = 'mt-6'>
                {
                    loading ?

                    <Loading />

                    :

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        {companies.map((company) => (
                            <div
                                key={company.company.ticker}
                                className="justify-between relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm flex items-center space-x-3 hover:border-gray-400 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                            >
                                <div className = 'flex items-center'>
                                    <div className="flex-shrink-0">
                                        {company.company.image ? <img className="h-10 w-10 rounded-full" src={company.company.image} alt="" /> : <></>}
                                    </div>
                                    <div className="flex-1 min-w-0 ml-4">
                                        <div href="#" className="focus:outline-none">
                                            <p className="text-sm font-medium text-gray-900">{company.company.name} (${company.company.ticker})</p>
                                            <p className="text-sm text-gray-500 w-3/4">{company.company.description}</p>
                                        </div>
                                    </div>
                                </div>
                                <Link href = {'/companies/' + company.company.ticker}>
                                    <button
                                        type="button"
                                        className="w-1/4 cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    >
                                        View {company.company.ticker} &rarr;
                                    </button>
                                </Link>
                            </div>
                        ))}
                        </div>
                }
            </div>
        </div>
    )
}

