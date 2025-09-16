import { usePageContext } from '@hooks';

function Link({ href, children }) {
  const pageContext = usePageContext();
  const { urlPathname } = pageContext;
  const isActive = href === '/' ? urlPathname === href : urlPathname.startsWith(href);
  return (
    <a
      href={href}
      className={isActive ? 'is-active' : undefined}>
      {children}
    </a>
  );
}

export default Link;
