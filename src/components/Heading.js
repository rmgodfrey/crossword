function Heading({ headingLevel, children }) {
  const HeadingElement = (
    [1, 2, 3, 4, 5, 6].includes(headingLevel)
    ? `h${headingLevel}`
    : 'p'
  );
  return (
    <HeadingElement>{children}</HeadingElement>
  )
}

export default Heading;
