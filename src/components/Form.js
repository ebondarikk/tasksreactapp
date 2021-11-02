import React, { memo } from 'react';
import { useFormValidation } from 'hooks';

export const Form = memo(function Form({ value, schema, submit, children }) {
  const handleSubmit = useFormValidation(submit, schema, value);

  return <form onSubmit={handleSubmit}>{children}</form>;
});
