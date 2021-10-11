import Header from '../../components/Root/Header'
import Markets from '../../components/Root/Markets'
import { Fragment, useState } from 'react'
import { Dialog, Disclosure, Transition } from '@headlessui/react'
import { XIcon } from '@heroicons/react/outline'
import { ChevronDownIcon, PlusSmIcon } from '@heroicons/react/solid'
import Link from 'next/link'
import ArticleCard from '../../components/Articles/ArticleCard'
import { supabase } from '../../lib/supabaseClient'

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
            <div className = 'pl-2 pr-2 pt-4 sm:pl-6 sm:pr-6'>
                <Markets />
                <main className = 'mt-6 pb-24'>
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
                                {filters.map((section) => (
                                    <Disclosure as="div" key={section.name} className="border-t border-gray-200 pt-4 pb-4">
                                    {({ open }) => (
                                        <fieldset>
                                        <legend className="w-full px-2">
                                            <Disclosure.Button className="w-full p-2 flex items-center justify-between text-gray-400 hover:text-gray-500">
                                            <span className="text-sm font-medium text-gray-900">{section.name}</span>
                                            <span className="ml-6 h-7 flex items-center">
                                                <ChevronDownIcon
                                                className={classNames(open ? '-rotate-180' : 'rotate-0', 'h-5 w-5 transform')}
                                                aria-hidden="true"
                                                />
                                            </span>
                                            </Disclosure.Button>
                                        </legend>
                                        <Disclosure.Panel className="pt-4 pb-2 px-4">
                                            <div className="space-y-6">
                                            {section.options.map((option, optionIdx) => (
                                                <div key={option.value} className="flex items-center">
                                                <input
                                                    id={`${section.id}-${optionIdx}-mobile`}
                                                    name={`${section.id}[]`}
                                                    defaultValue={option.value}
                                                    type="checkbox"
                                                    className="h-4 w-4 border-gray-300 rounded text-indigo-600 focus:ring-indigo-500"
                                                />
                                                <label
                                                    htmlFor={`${section.id}-${optionIdx}-mobile`}
                                                    className="ml-3 text-sm text-gray-500"
                                                >
                                                    {option.label}
                                                </label>
                                                </div>
                                            ))}
                                            </div>
                                        </Disclosure.Panel>
                                        </fieldset>
                                    )}
                                    </Disclosure>
                                ))}
                                </form>
                            </div>
                            </Transition.Child>
                        </Dialog>
                        </Transition.Root>

                        <main className="max-w-2xl mx-auto lg:max-w-7xl ">
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
                                {filters.map((section, sectionIdx) => (
                                    <div key={section.name} className={sectionIdx === 0 ? null : 'pt-10'}>
                                    <fieldset>
                                        <legend className="block text-sm font-medium text-gray-900">{section.name}</legend>
                                        <div className="pt-6 space-y-3">
                                        {section.options.map((option, optionIdx) => (
                                            <div key={option.value} className="flex items-center">
                                            <input
                                                id={`${section.id}-${optionIdx}`}
                                                name={`${section.id}[]`}
                                                defaultValue={option.value}
                                                type="checkbox"
                                                className="h-4 w-4 border-gray-300 rounded text-indigo-600 focus:ring-indigo-500"
                                            />
                                            <label htmlFor={`${section.id}-${optionIdx}`} className="ml-3 text-sm text-gray-600">
                                                {option.label}
                                            </label>
                                            </div>
                                        ))}
                                        </div>
                                    </fieldset>
                                    </div>
                                ))}
                                </form>
                            </div>
                            </aside>

                            {/* Product grid */}
                            <div className="mt-6 lg:mt-0 lg:col-span-2 xl:col-span-3">
                                <div className = 'grid grid-cols-1 sm:gap-4 sm:grid-cols-2'>
                                    {articles.map((article)=>(
                                        <ArticleCard article = {article} key = {article.title}/>
                                    ))}
                                </div>
                            </div>
                        </div>
                        </main>
                    </div>
                </main>
            </div>
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
