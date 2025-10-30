import React from 'react';
import colors from '../utils/colors';

function InputField({ label, name, id, type , value, onChange, placeholder, className = '' }) {
    return (
        <div>
            <label className="block text-sm font-medium mb-2" style={{ color: colors.textDark }}>
                {label}
            </label>
            <input
                id={id || name}
                name={name}
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all ${className}`}
                style={{
                    backgroundColor: colors.white,
                    borderColor: colors.border,
                    color: colors.textDark,
                }}
            />
        </div>
    );
}

export default InputField;
