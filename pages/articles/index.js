import Header from '../../components/Root/Header'
import Markets from '../../components/Root/Markets'
import { Fragment, useState } from 'react'
import { Dialog, Disclosure, Transition } from '@headlessui/react'
import { XIcon } from '@heroicons/react/outline'
import { ChevronDownIcon, PlusSmIcon } from '@heroicons/react/solid'
import Link from 'next/link'
import ArticleCard from '../../components/Articles/ArticleCard'
import { supabase } from '../../lib/supabaseClient'
import TitleHeader from '../../components/Root/TitleHeader'
import Footer from '../../components/Root/Footer'
import algoliasearch from "algoliasearch/lite";
import { InstantSearch, connectHits, connectSearchBox, connectPagination, RefinementList, connectRefinementList } from "react-instantsearch-dom";
import { SearchIcon } from '@heroicons/react/solid'

const searchClient = algoliasearch(
    process.env.NEXT_PUBLIC_ALGOLIA_APP_ID,
    process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_KEY,
);


export default function ArticlesIndex() {

    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
    const articles = [
        {
            title: 'XYZ Example Title',
            date: 'October 11, 2021',
            description: 'Lorem ipsum bashar sit amet,. aisudaisd aihdas dasuid iasdi uaiusd aijud asd iaius ',
            href: '#',
            sector: 'analysis'
        },
        {
            title: 'ABC Example Title',
            date: 'October 11, 2021',
            description: 'Lorem ipsum bashar sit amet,. aisudaisd aihdas dasuid iasdi uaiusd aijud asd iaius ',
            href: '#',
            sector: 'economy'
        }
    ]

    return (
        <div className = ''>
            <Header />
            <TitleHeader title = 'Articles' />
            <div className = 'pl-2 pr-2 pt-4 sm:pl-6 sm:pr-6'>
                <main className = 'mt-6 pb-24'>
                    <InstantSearch 
                        searchClient={searchClient} 
                        indexName="articles">
                        <div>
                            {/* Mobile filter dialog */}
                            <Transition.Root show={mobileFiltersOpen} as={Fragment}>
                            <Dialog as="div" className="fixed inset-0 flex z-40 lg:hidden" onClose={setMobileFiltersOpen}>
                                <Transition.Child
                                as={Fragment}
                                enter="transition-opacity ease-linear duration-300"
                                enterFrom="opacity-0"
                                enterTo="opacity-100"
                                leave="transition-opacity ease-linear duration-300"
                                leaveFrom="opacity-100"
                                leaveTo="opacity-0"
                                >
                                <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-25" />
                                </Transition.Child>

                                <Transition.Child
                                as={Fragment}
                                enter="transition ease-in-out duration-300 transform"
                                enterFrom="translate-x-full"
                                enterTo="translate-x-0"
                                leave="transition ease-in-out duration-300 transform"
                                leaveFrom="translate-x-0"
                                leaveTo="translate-x-full"
                                >
                                <div className="ml-auto relative max-w-xs w-full h-full bg-white shadow-xl flex flex-col overflow-y-auto">
                                    <div className="px-4 flex items-center justify-between">
                                    <h2 className="text-lg font-medium text-gray-900">Filters</h2>
                                    <button
                                        type="button"
                                        className="-mr-2 w-10 h-10 p-2 flex items-center justify-center text-gray-400 hover:text-gray-500"
                                        onClick={() => setMobileFiltersOpen(false)}
                                    >
                                        <span className="sr-only">Close menu</span>
                                        <XIcon className="h-6 w-6" aria-hidden="true" />
                                    </button>
                                    </div>

                                    {/* Filters */}
                                    <form className="mt-4">
                                        <CustomSectorRefinementList />
                                    </form>
                                </div>
                                </Transition.Child>
                            </Dialog>
                            </Transition.Root>

                            <main className=" ">
                            <div className="border-b border-gray-200 pb-6">
                            <h3 className="text-2xl leading-6 font-medium text-gray-900">Latest Articles</h3>
                                <p className="mt-4 text-base text-gray-500">
                                    Find out the latest on the markets. Have a tip? Submit it <Link href = '/new/tip'><a className = 'font-semibold'>here</a></Link>.
                                </p>
                            </div>

                            <div className="pt-6 lg:grid lg:grid-cols-3 lg:gap-x-8 xl:grid-cols-4">
                                <aside>
                                <h2 className="sr-only">Filters</h2>

                                <button
                                    type="button"
                                    className="inline-flex items-center lg:hidden"
                                    onClick={() => setMobileFiltersOpen(true)}
                                >
                                    <span className="text-sm font-medium text-gray-700">Filters</span>
                                    <PlusSmIcon className="flex-shrink-0 ml-1 h-5 w-5 text-gray-400" aria-hidden="true" />
                                </button>

                                <div className="hidden lg:block">
                                    <form className="divide-y divide-gray-200 space-y-10">
                                    <CustomSectorRefinementList attribute = "sector"/>
                                    </form>
                                </div>
                                </aside>

                                {/* Product grid */}
                                <div className="mt-6 lg:mt-0 lg:col-span-2 xl:col-span-3">
                                    <CustomSearchBox />
                                    <div className="m-4"></div>
                                    <CustomHits />
                                </div>
                            </div>
                            </main>
                        </div>
                        
                    </InstantSearch>
                </main>
            </div>
            <Footer />
        </div>
    )
}



const filters = [
  {
    id: 'type',
    name: 'Type',
    options: [
      { value: 'analysis', label: 'Analysis (DD)' },
      { value: 'economy', label: 'Economy' },
      { value: 'yolos', label: 'YOLOs' },
      { value: 'other', label: 'Other' },
    ],
  },
  {
    id: 'sector',
    name: 'Sector',
    options: [
      { value: 'tech', label: 'Technology' },
      { value: 'biotech', label: 'Biotech' },
      { value: 'meme', label: 'Meme stocks' },
      { value: 'energy', label: 'Energy' },
      { value: 'suits', label: 'Financial Sector' },
      { value: 'helth', label: 'Healthcare' },
      { value: 'industrial', label: 'Industrial' },
    ],
  },
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}


export function SearchBox({ currentRefinement, isSearchStalled, refine }) {
    return (
      <form noValidate action="" role="search" className = 'w-full mr-2'>
          <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center">
                  <SearchIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </div>
              <input
                  type="search"
                  value={currentRefinement}
                  onChange={event => refine(event.currentTarget.value)}
                  placeholder = "Search for an article, sector, etc"
                  className = "block w-full bg-white border border-gray-300 rounded-md py-2 pl-10 pr-3 text-sm placeholder-gray-500 focus:outline-none focus:text-gray-900 focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
              </div>
          {isSearchStalled ? 'Loading...' : ''}
      </form>
    );
  }
  
  const CustomSearchBox = connectSearchBox(SearchBox);
  
  const Hits = ({ hits }) => (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {hits.map((article) => (
              <ArticleCard article = {article} key = {article.title}/>
          ))}
          </div>
  );
  
  const CustomHits = connectHits(Hits);

  const SectorRefinementList = ({ items, refine }) => {
    return (
        <div className = "pt-6">
            <fieldset>
                <legend className="block text-sm font-medium text-gray-900">Sector</legend>
                <div className="pt-6 space-y-3">
                    {items.map(item => (
                        <div key = {item.label}>
                        <input
                            id={item.label}
                            type="checkbox"
                            onClick={event => {
                                event.preventDefault();
                                refine(item.value);
                            }}
                            className="h-4 w-4 border-gray-300 rounded text-indigo-600 focus:ring-indigo-500"
                        />
                        <label htmlFor={item.label} className="capitalize ml-3 text-sm text-gray-600">
                            {item.label} ({item.count})
                        </label>
                        </div>
                    ))}
                </div>
            </fieldset>
            
        </div>
    )
  };

  

const CustomSectorRefinementList = connectRefinementList(SectorRefinementList);
