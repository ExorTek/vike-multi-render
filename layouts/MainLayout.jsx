import '@styles/global.css';

function MainLayout({ children }) {
  return <main className='flex-grow'>{children}</main>;
}

export default MainLayout;
