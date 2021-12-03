import Header from '../../components/Root/Header';
import Footer from '../../components/Root/Footer';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import Loading from '../../components/Root/Loading';
import Link from 'next/link';
import { ExternalLinkIcon } from '@heroicons/react/outline';

export default function Article() {
    
    const [loading, setLoading] = useState(true);
    const [article, setArticle] = useState(null);

    const router = useRouter();
    const { id } = router.query;

    const fetchId = async () => {
        const { id } = router.query;

        setTimeout(() => {
            return id
        }, 1000);
    }

    const fetchArticle = async () => {

        const id = await fetchId();

        const { data, error } = await supabase.from('releases').select(`
            contributor,
            subject,
            articleText,
            link,
            modified,
            title
        `).eq('identifier', id ?? 1)
        
        if (error) {
            alert(error.message)
        } else {
            setArticle(data[0])
            setLoading(false)
        }

    }

    useEffect(() => {  
        fetchArticle()
    }, [id])
    
    return (
        <div>
            <Header />
            {
                loading ?

                <Loading />

                :

                <div>
                    <div className="relative py-16 bg-white overflow-hidden">
                        <div className="relative px-4 sm:px-6 lg:px-8">
                        <div className="text-lg max-w-prose mx-auto">
                            <h1>
                            {/* <div className = 'flex items-center justify-center mb-4'>
                                <Link href = {"/companies/" + article.ticker_1.ticker}>
                                    <a className="border cursor-pointer inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-white text-green-700 border-green-600">
                                        <svg className="-ml-1 mr-1.5 h-2 w-2 text-green-600" fill="currentColor" viewBox="0 0 8 8">
                                        <circle cx={4} cy={4} r={3} />
                                        </svg>
                                        {article.ticker_1.ticker}
                                    </a>
                                </Link>
                            </div> */}
                            <div className = 'flex items-center justify-center mb-4'>
                                <div className="border inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-white text-green-700 border-green-600">
                                    <svg className="-ml-1 mr-1.5 h-2 w-2 text-green-600" fill="currentColor" viewBox="0 0 8 8">
                                    <circle cx={4} cy={4} r={3} />
                                    </svg>
                                    {article.subject}
                                </div>
                                <div className = 'm-2'></div>
                                <div className="border inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-white text-blue-700 border-blue-600">
                                    <svg className="-ml-1 mr-1.5 h-2 w-2 text-blue-600" fill="currentColor" viewBox="0 0 8 8">
                                    <circle cx={4} cy={4} r={3} />
                                    </svg>
                                    {article.contributor}
                                </div>
                            </div>
                            <span className="block text-base text-center text-indigo-600 font-semibold tracking-wide uppercase">
                                {(new Date(Date.parse(article.modified))).toLocaleDateString()}
                            </span>
                            <span className="mt-2 block text-3xl text-center leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                                {article.title}
                            </span>
                               
                            </h1>
                            <div className = 'mt-4 flex items-center justify-center mb-4'>
                                <Link href = {article.link}>
                                    <button type="button" className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                        Read on GlobeNewsWire
                                        <ExternalLinkIcon className="ml-2 w-5 h-5 -mr-1" />
                                    </button>
                                </Link>
                            </div>
                            
                            <p className="mt-8 text-xl text-gray-500 leading-8">
                                {article.description}
                            </p>
                        </div>
                        <div className="mt-6 px-12 text-lg text-gray-500 mx-auto" dangerouslySetInnerHTML={{ __html: article.articleText }}>
                        </div>
                        </div>
                    </div>
                </div>
            }
            <Footer />
        </div>
    );
}