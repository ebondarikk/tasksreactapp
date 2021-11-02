import { merge, isEmpty, replace, get } from 'lodash-es';
import { useEffect, useState, useCallback, useMemo } from 'react';
import {
  TASK_SORT_FIELDS,
  DIRECTION_ASC,
  TASK_DONE_STATUSES,
  TASK_EDIT_STATUSES,
} from 'consts';

const useFails = (errors) => {
  const [fails, setFails] = useState(errors);

  useEffect(() => setFails(errors), [errors]);

  return [fails, setFails];
};

export const useValue = (initialValue, errors) => {
  const [value, setValue] = useState(initialValue);
  const [fails, setFails] = useFails(errors);

  useEffect(() => setValue(initialValue), [initialValue]);

  const handleValue = useCallback(
    (v) => {
      setFails(null);
      setValue(v);
    },
    [setFails]
  );

  return useMemo(
    () => ({
      value,
      set: handleValue,
      errors: fails,
      fail: setFails,
      reset: () => handleValue(initialValue),
    }),
    [value, handleValue, fails, setFails, initialValue]
  );
};

export const useErrors = (errors) => {
  return useMemo(() => merge({}, errors), [errors]);
};

const defaultTask = {
  username: '',
  email: '',
  text: '',
  status: 0,
};

export const useTask = (task, initialErrors) => {
  const initial = useMemo(() => merge({}, defaultTask, task), [task]);

  const errors = useErrors(initialErrors);

  const username = useValue(initial.username, errors.username);
  const email = useValue(initial.email, errors.email);
  const text = useValue(initial.text, errors.text);
  const status = useValue(initial.status, errors.status);

  const clear = useCallback(() => {
    [username, email, text, status].map((f) => f.reset());
  }, [username, email, text, status]);

  return useMemo(
    () => ({
      id: initial.id,
      username,
      email,
      text,
      status,
      clear,
    }),
    [initial.id, username, email, text, status, clear]
  );
};

export const useLogin = (initialErrors) => {
  const errors = useErrors(initialErrors);

  const username = useValue('', errors.username);
  const password = useValue('', errors.password);

  const clear = useCallback(
    () => [username, password].map((f) => f.reset()),
    [username, password]
  );

  return useMemo(
    () => ({
      username,
      password,
      clear,
    }),
    [username, password, clear]
  );
};

export const useFormValidation = (func, schema, value) => {
  return useCallback(
    (e) => {
      e.preventDefault();
      schema
        .validate(schema.cast(value, { assert: false }), {
          abortEarly: false,
        })
        .then((_) => {
          func(value);
        })
        .catch((err) => {
          err.inner.forEach((e) => {
            const path = replace(e.path, /\.value$/, '');
            const prop = get(value, path);
            if (isEmpty(prop.errors)) {
              prop.fail(e.errors);
            }
          });
        });
    },
    [schema, func, value]
  );
};

export const useTasksSorting = () => {
  const [sortBy, setSortBy] = useState(TASK_SORT_FIELDS[0]);
  const [direction, setDirection] = useState(DIRECTION_ASC);

  return useMemo(
    () => ({
      sortBy,
      setSortBy,
      direction,
      setDirection,
    }),
    [sortBy, setSortBy, direction, setDirection]
  );
};

export const useStatus = (value) => {
  const [isDone, setIsDone] = useState(
    value && TASK_DONE_STATUSES.includes(value.status)
  );

  const [isEdit, setIsEdit] = useState(
    value && TASK_EDIT_STATUSES.includes(value.status)
  );

  const [status, setStatus] = useState(value ? value.status : 0);

  useEffect(() => {
    setStatus(Number([isDone, isEdit].map((x) => Number(x)).join('')));
  }, [setStatus, isDone, isEdit]);

  return useMemo(
    () => ({
      status,
      isDone,
      setIsDone,
      isEdit,
      setIsEdit,
    }),
    [status, isDone, setIsDone, isEdit, setIsEdit]
  );
};
