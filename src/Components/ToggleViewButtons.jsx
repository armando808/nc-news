import React from 'react'

function ToggleViewButtons({ selectedView, handleViewChange }) {
    return (
    <div className="toggle-view flex gap-2">
        <button
        className={`toggle-button px-3 py-2 rounded-md transition duration-300 ${
            selectedView === 'newest' ? 'font-bold border-white border-2' : 'font-normal'
        }`}
        onClick={() => handleViewChange('newest')}
        >
        Newest
        </button>
        <button
        className={`toggle-button px-3 py-2 rounded-md transition duration-300 ${
            selectedView === 'popular' ? 'font-bold border-white border-2' : 'font-normal'
        }`}
        onClick={() => handleViewChange('popular')}
        >
        Most Popular
        </button>
    </div>
    )
}

export default ToggleViewButtons
