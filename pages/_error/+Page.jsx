import { usePageContext } from 'vike-react/usePageContext';
import { Link } from '@components';

function Page() {
  const pageContext = usePageContext();
  const { is404, abortStatusCode } = pageContext;

  if (is404) {
    return (
      <div className={'flex flex-col items-center justify-center min-h-screen text-center'}>
        <h1 className={'text-6xl font-bold mb-4'}>404</h1>
        <p className={'text-gray-600 mb-8'}>Page not found</p>
        <Link href={'/'}>
          <span className={'text-blue-600 hover:underline'}>Go home</span>
        </Link>
      </div>
    );
  }

  return (
    <div className={'flex flex-col items-center justify-center min-h-screen text-center'}>
      <h1 className={'text-6xl font-bold mb-4'}>{abortStatusCode || 500}</h1>
      <p className={'text-gray-600 mb-8'}>Something went wrong</p>
      <Link href={'/'}>
        <span className={'text-blue-600 hover:underline'}>Go home</span>
      </Link>
    </div>
  );
}

export default Page;
