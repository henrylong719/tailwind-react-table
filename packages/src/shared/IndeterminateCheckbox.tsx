import * as React from 'react';
import { forwardRef, useEffect, useRef } from 'react';
import { Props } from '../utils';

// checkout box
export const IndeterminateCheckbox = forwardRef<HTMLInputElement, Props>(
  ({ indeterminate, ...rest }, ref) => {
    const defaultRef = useRef() as React.MutableRefObject<HTMLInputElement>;
    const resolvedRef = ref || (defaultRef as any);

    useEffect(() => {
      resolvedRef.current.indeterminate = indeterminate;
    }, [resolvedRef, indeterminate]);

    return (
      <input
        type="checkbox"
        ref={resolvedRef}
        {...rest}
        className="focus:ring-indigo-500 text-indigo-600 border-gray-300 rounded"
      />
    );
  }
);
