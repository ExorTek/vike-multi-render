import { useState, useEffect } from 'react';
import { useClientCounterStore } from '@store';

function Page() {
  const [data, setData] = useState({ user: null, products: [] });

  const { count, increment, decrement } = useClientCounterStore();

  useEffect(() => {
    const fetchData = async () => {
      const [users, posts] = await Promise.all([
        fetch('https://jsonplaceholder.typicode.com/users').then(r => r.json()),
        fetch('https://jsonplaceholder.typicode.com/posts?_limit=12').then(r => r.json()),
      ]);

      const products = posts.map(post => ({
        id: post.id,
        name: post.title.charAt(0).toUpperCase() + post.title.slice(1, 40) + (post.title.length > 40 ? '...' : ''),
        category: ['Electronics', 'Office', 'Home & Garden', 'Accessories', 'Books', 'Sports'][post.id % 6],
        price: parseFloat((Math.random() * 150 + 10).toFixed(2)),
        stock: Math.floor(Math.random() * 200) + 5,
      }));

      setData({
        user: {
          id: users[0].id,
          name: users[0].name,
          email: users[0].email,
        },
        products,
      });
    };

    fetchData();
  }, []);

  const { user, products } = data;

  return (
    <div className={'w-full min-h-screen bg-gray-50'}>
      <header className={'bg-white shadow-sm border-b'}>
        <div className={'max-w-6xl mx-auto px-4 py-6'}>
          <h1 className={'text-3xl font-bold text-gray-900'}>E-Commerce Dashboard</h1>
          {user && <p className={'text-gray-600 mt-2'}>Welcome, {user.name}!</p>}
          <section className={'mt-4'}>
            <h2 className={'text-xl font-semibold mb-2'}>Counter: {count}</h2>
            <div className={'space-x-4'}>
              <button
                onClick={decrement}
                className={'px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600'}>
                Decrement
              </button>
              <button
                onClick={increment}
                className={'px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600'}>
                Increment
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
