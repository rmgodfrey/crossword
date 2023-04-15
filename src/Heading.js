function Heading({ headingLevel, children }) {
  const HeadingElement = headingLevel;
  return (
    <HeadingElement>{children}</HeadingElement>
  )
}

export default Heading;
