function Page() {
  return (
    <div className={'w-full min-h-screen bg-gray-50'}>
      <nav className={'bg-white border-b shadow-sm'}>
        <div className={'max-w-6xl mx-auto px-4'}>
          <div className={'flex justify-between items-center h-16'}>
            <div className={'flex items-center space-x-8'}>
              <h1 className={'text-xl font-bold text-gray-900'}>Vike Multi Render</h1>

              <div className={'hidden md:flex space-x-6'}>
                <a
                  href={'/client-side'}
                  className={'text-gray-600 hover:text-gray-900'}>
                  Client Side
                </a>
                <a
                  href={'/server-side'}
                  className={'text-gray-600 hover:text-gray-900'}>
                  Server Side
                </a>
                <a
                  href={'/html'}
                  className={'text-gray-600 hover:text-gray-900'}>
                  HTML Only
                </a>
              </div>
            </div>

            <button className={'md:hidden'}>
              <svg
                className={'w-6 h-6'}
                fill={'none'}
                stroke={'currentColor'}
                viewBox={'0 0 24 24'}>
                <path
                  strokeLinecap={'round'}
                  strokeLinejoin={'round'}
                  strokeWidth={2}
                  d={'M4 6h16M4 12h16M4 18h16'}
                />
              </svg>
            </button>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default Page;
