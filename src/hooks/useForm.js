import { useState } from 'react';

export const useForm = (initialState, validate) => {
  const [values, setValues] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    setValues(prev => ({ ...prev, [name]: newValue }));
    if (touched[name]) {
      const error = validate ? validate(name, newValue) : '';
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    if (validate) {
      const error = validate(name, value);
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  const handleSubmit = (callback) => (e) => {
    e.preventDefault();
    const allTouched = {};
    Object.keys(values).forEach(key => { allTouched[key] = true; });
    setTouched(allTouched);

    let formIsValid = true;
    const newErrors = {};
    for (const [key, value] of Object.entries(values)) {
      const error = validate ? validate(key, value) : '';
      if (error) {
        formIsValid = false;
        newErrors[key] = error;
      }
    }
    setErrors(newErrors);
    if (formIsValid) callback(values);
  };

  const resetForm = () => {
    setValues(initialState);
    setErrors({});
    setTouched({});
  };

  return { values, errors, touched, handleChange, handleBlur, handleSubmit, resetForm, setValues };
};