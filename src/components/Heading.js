export default function Heading({ headingLevel, className, children }) {
  const HeadingElement = (
    [1, 2, 3, 4, 5, 6].includes(headingLevel)
    ? `h${headingLevel}`
    : 'p'
  );
  return (
    <HeadingElement className={className}>{children}</HeadingElement>
  );
}
