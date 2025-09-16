export async function data() {
  const [users, posts] = await Promise.all([
    fetch('https://jsonplaceholder.typicode.com/users').then(r => r.json()),
    fetch('https://jsonplaceholder.typicode.com/posts?_limit=12').then(r => r.json()),
  ]);

  const products = posts.map(post => ({
    id: post.id,
    name: post.title.substring(0, 30) + '...',
    category: ['Electronics', 'Office', 'Home & Garden', 'Accessories'][post.id % 4],
    price: Math.floor(Math.random() * 100) + 10,
    stock: Math.floor(Math.random() * 200) + 5,
  }));

  return {
    user: {
      id: users[0].id,
      name: users[0].name,
      email: users[0].email,
    },
    products,
  };
}
