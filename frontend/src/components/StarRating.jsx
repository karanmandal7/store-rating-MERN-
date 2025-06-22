import React from 'react';
import './StarRating.css';

const StarRating = ({ rating, onSelect }) => {
    return (
        <div className="star-rating">
            {[...Array(5)].map((star, index) => {
                index += 1;
                return (
                    <button
                        type="button"
                        key={index}
                        className={index <= rating ? "on" : "off"}
                        onClick={(e) => {
                            e.stopPropagation();
                            onSelect(index);
                        }}
                    >
                        <span className="star">&#9733;</span>
                    </button>
                );
            })}
        </div>
    );
};

export default StarRating; 