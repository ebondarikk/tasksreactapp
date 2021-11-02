import React, { createElement, memo, useCallback, useRef } from 'react';

export const Field = memo(function Field({
  source,
  component,
  className,
  onChange = () => {},
  ...props
}) {
  const ref = useRef(null);

  const handleChange = useCallback(
    (e) => {
      source.set(e.target.value);
      onChange(e);
    },
    [source, onChange]
  );

  return (
    <div style={{ margin: '1rem' }} className={className} ref={ref}>
      {createElement(component, {
        error: !!source.errors,
        helperText: source.errors,
        onChange: handleChange,
        value: source.value,
        ...props,
      })}
    </div>
  );
});
