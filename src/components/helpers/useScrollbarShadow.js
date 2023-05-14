/*
  Source: Marius Ibsen, “React Scroll Hook with Shadows”.
  URL: https://medium.com/dfind-consulting/react-scroll-hook-with-shadows-9ba2d47ae32
*/

import { useState } from 'react';

export default function useScrollbarShadow() {
  const [scrollTop, setScrollTop] = useState(0);
  const [scrollHeight, setScrollHeight] = useState(0);
  const [clientHeight, setClientHeight] = useState(0);

  const onScrollHandler = (event) => {
    setScrollTop(event.target.scrollTop);
    setScrollHeight(event.target.scrollHeight);
    setClientHeight(event.target.clientHeight);
  };

  const overflowTop = scrollTop > 0;
  const overflowBottom = clientHeight < scrollHeight - scrollTop;

  function getOverflows() {
    let overflow;
    if (overflowTop && overflowBottom) {
      overflow = 'top-and-bottom';
    } else if (overflowTop) {
      overflow = 'top';
    } else if (overflowBottom) {
      overflow = 'bottom';
    }
    return overflow;
  }

  return { overflow: getOverflows(), onScrollHandler };
}
