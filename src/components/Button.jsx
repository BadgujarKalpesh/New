import React from 'react';
import colors from '../utils/colors';

function Button({ label, onClick, loading, disabled, type = 'button' }) {
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled || loading}
            className={`w-full py-2.5 rounded-lg text-white font-medium transition-all duration-300 ${disabled || loading
                    ? 'opacity-70 cursor-not-allowed'
                    : `bg-[${colors.primary}] hover:bg-[${colors.accent}] shadow-md`
                }`}
            style={{
                backgroundColor: disabled || loading ? colors.primaryLight : colors.primary,
            }}
        >
            {loading ? 'Please wait...' : label}
        </button>
    );
}

export default Button;
