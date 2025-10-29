import React from 'react';
import colors from '../utils/colors';

function InputField({ label, type, value, onChange, placeholder }) {
    return (
        <div>
            <label className="block text-sm font-medium mb-2" style={{ color: colors.textDark }}>
                {label}
            </label>
            <input
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
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
