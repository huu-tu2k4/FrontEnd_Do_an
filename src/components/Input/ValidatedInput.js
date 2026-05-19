import React, { useState, useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import './ValidatedInput.scss';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const ValidatedInput = ({ value, onChange, type, placeholder, className, required, disabled, error: externalError, name }) => {
    const [touched, setTouched] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!touched) return;
        validate(value);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value]);

    const validate = (val) => {
        if (required && (!val || String(val).trim() === '')) {
            setError('validation.required');
            return false;
        }
        if (type === 'email') {
            if (val && !emailRegex.test(val)) {
                setError('validation.invalid_email');
                return false;
            }
        }
        if (type === 'phone') {
            const digits = String(val || '').replace(/\D/g, '');
            if (digits.length !== 10) {
                setError('validation.invalid_phone');
                return false;
            }
        }
        setError('');
        return true;
    };

    const handleBlur = () => {
        setTouched(true);
        validate(value);
    };

    const handleChange = (e) => {
        if (onChange) onChange(e);
    };

    const displayError = externalError || error;

    return (
        <div className={`validated-input ${className || ''}`}>
            <input
                name={name}
                type="text"
                className={`form-control ${displayError ? 'is-invalid' : ''}`}
                value={value}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder={placeholder}
                disabled={disabled}
            />
            {displayError ? (
                <div className="error-message">
                    {typeof displayError === 'string' && displayError.startsWith && displayError.startsWith('validation.') ? (
                        <FormattedMessage id={displayError} />
                    ) : (
                        displayError
                    )}
                </div>
            ) : null}
        </div>
    );
};

ValidatedInput.propTypes = {
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    onChange: PropTypes.func,
    type: PropTypes.oneOf(['text', 'email', 'phone']),
    placeholder: PropTypes.string,
    className: PropTypes.string,
    required: PropTypes.bool,
    disabled: PropTypes.bool,
    error: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    name: PropTypes.string
};

ValidatedInput.defaultProps = {
    type: 'text',
    required: false
};

export default ValidatedInput;
