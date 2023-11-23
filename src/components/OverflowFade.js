import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
} from 'react';
import './styles/OverflowFade.css';

const directionProperties = {
  vertical: {
    elementProperties: {
      scrollStart: 'scrollTop',
      scrollSize: 'scrollHeight',
      clientSize: 'clientHeight',
    },
    classNames: {
      start: 'top',
      end: 'bottom',
    },
  },
  horizontal: {
    elementProperties: {
      scrollStart: 'scrollLeft',
      scrollSize: 'scrollWidth',
      clientSize: 'clientWidth',
    },
    classNames: {
      start: 'left',
      end: 'right',
    },
  },
};

const className = 'OverflowFade';

export default forwardRef(function OverflowFade({
  direction,
  children,
}, parentRef) {
  const elementRef = useRef(null);
  useImperativeHandle(parentRef, () => elementRef.current);
  const updateOverflowFade = useCallback(() => {
    const { classNames, elementProperties } = directionProperties[direction];
    const element = elementRef.current;
    const scrollStart = element[elementProperties.scrollStart];
    const scrollSize = element[elementProperties.scrollSize];
    const clientSize = element[elementProperties.clientSize];
    const scrollEnd = scrollSize - clientSize - scrollStart;

    // If there's just a tiny bit of overflow (less than or equal to `leeway`),
    // act as if there's no overflow. (This helps compensate for rounding
    // errors.)
    const leeway = 1;
    const overflows = {
      start: scrollStart > leeway,
      end: scrollEnd > leeway,
    };
    for (const endpoint of Object.keys(classNames)) {
      if (overflows[endpoint]) {
        element.classList.add(`${className}--${classNames[endpoint]}`);
      } else {
        element.classList.remove(`${className}--${classNames[endpoint]}`);
      }
    }
  }, [direction]);

  useLayoutEffect(() => {
    const resizeObserver = new ResizeObserver(updateOverflowFade);
    resizeObserver.observe(elementRef.current.children[0]);
    return () => {
      resizeObserver.disconnect()
    };
  }, [updateOverflowFade]);

  return (
    <div
      className={className}
      onScroll={updateOverflowFade}
      ref={elementRef}
    >
      {children}
    </div>
  );
});
