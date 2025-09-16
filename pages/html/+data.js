export async function data() {
  const [users, posts] = await Promise.all([
    fetch('https://jsonplaceholder.typicode.com/users').then(r => r.json()),
    fetch('https://jsonplaceholder.typicode.com/posts?_limit=6').then(r => r.json()),
  ]);

  const products = posts.map(post => ({
    id: post.id,
    name: post.title.charAt(0).toUpperCase() + post.title.slice(1, 40) + (post.title.length > 40 ? '...' : ''),
    category: ['Electronics', 'Office', 'Home & Garden', 'Accessories', 'Books', 'Sports'][post.id % 6],
    price: parseFloat((Math.random() * 150 + 10).toFixed(2)),
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
