import { usePageContext } from '@hooks';
import { useServerCounterStore } from '@store';

function Page() {
  const pageContext = usePageContext();
  const { user, products } = pageContext.data;

  const { count, increment, decrement } = useServerCounterStore();

  return (
    <div className={'w-full min-h-screen bg-gray-50'}>
      <header className={'bg-white shadow-sm border-b'}>
        <div className={'max-w-6xl mx-auto px-4 py-6'}>
          <h1 className={'text-3xl font-bold text-gray-900'}>E-Commerce Dashboard</h1>
          {user && <p className={'text-gray-600 mt-2'}>Welcome, {user.name}!</p>}
          <section className={'mt-8'}>
            <h2 className={'text-2xl font-bold mb-4'}>Counter</h2>
            <div className={'flex items-center space-x-4'}>
              <button
                onClick={decrement}
                className={'px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600'}>
                -
              </button>
              <span className={'text-xl font-semibold'}>{count}</span>
              <button
                onClick={increment}
                className={'px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600'}>
                +
              </button>
            </div>
          </section>
        </div>
      </header>

      <main className={'max-w-6xl mx-auto px-4 py-8'}>
        <div className={'grid gap-6 md:grid-cols-2 lg:grid-cols-3'}>
          <div className={'bg-white rounded-lg shadow p-6'}>
            <h2 className={'text-xl font-semibold mb-4'}>Total Products</h2>
            <p className={'text-3xl font-bold text-blue-600'}>{products?.length || 0}</p>
          </div>

          <div className={'bg-white rounded-lg shadow p-6'}>
            <h2 className={'text-xl font-semibold mb-4'}>Active Campaigns</h2>
            <p className={'text-3xl font-bold text-green-600'}>3</p>
          </div>

          <div className={'bg-white rounded-lg shadow p-6'}>
            <h2 className={'text-xl font-semibold mb-4'}>Daily Visits</h2>
            <p className={'text-3xl font-bold text-purple-600'}>1,247</p>
          </div>
        </div>

        <section className={'mt-8'}>
          <h2 className={'text-2xl font-bold mb-6'}>Recent Products</h2>
          <div className={'bg-white rounded-lg shadow overflow-hidden'}>
            {products?.length > 0 ? (
              <div className={'divide-y divide-gray-200'}>
                {products.map(product => (
                  <div
                    key={product.id}
                    className={'p-4 hover:bg-gray-50'}>
                    <div className={'flex justify-between items-center'}>
                      <div className={''}>
                        <h3 className={'font-medium text-gray-900'}>{product.name}</h3>
                        <p className={'text-gray-500 text-sm'}>{product.category}</p>
                      </div>
                      <div className={'text-right'}>
                        <p className={'font-semibold text-gray-900'}>₺{product.price}</p>
                        <p className={'text-sm text-gray-500'}>Stock: {product.stock}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className={'p-8 text-center text-gray-500'}>No products yet</div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default Page;
