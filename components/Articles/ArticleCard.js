import Link from 'next/link'

export default function ArticleCard({article}) {
    return (
        <div key={article.title} className = 'border border-gray-400 p-6 rounded-lg'>
            <p className="text-sm text-gray-500">
            <time dateTime={article.datetime}>{article.date}</time>
            <span className = {classNames(article.sector == 'analysis' ? 'border-blue-800 bg-blue-100 text-blue-800' : article.sector == 'economy' ? 'border-yellow-800 bg-yellow-100 text-yellow-800' : article.sector == 'yolo' ? 'border-red-800 bg-red-100 text-red-800': 'border-green-800 bg-green-100 text-green-800', 'ml-2 inline-flex items-center border px-2.5 py-0.25 rounded-full text-xs font-medium  capitalize')}>
                {article.sector}
            </span>
            </p>
            <a href="#" className="mt-2 block">
            <p className="text-xl font-semibold text-gray-900">{article.title}</p>
            <p className="mt-3 text-base text-gray-500">{article.description}</p>
            </a>
            <div className="mt-3">
                <Link href = {"/articles/" + article.id}>
                    <a href={article.href} className="cursor-pointer text-base font-semibold text-indigo-600 hover:text-indigo-500">
                        Read full story &rarr;
                    </a>
                </Link>
            </div>
        </div>
    )
}

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
  }
  