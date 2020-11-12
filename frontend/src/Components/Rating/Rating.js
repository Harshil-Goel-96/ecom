import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faStarHalfAlt } from '@fortawesome/free-solid-svg-icons';
import { faStar as faStarR } from '@fortawesome/free-regular-svg-icons';

const Rating = ({ value }) => {
    //console.log(value)
    return (
        <div className="rating">
            <span style={{ color: "#FDCC0D" }}>
                {value >= 1 ? <FontAwesomeIcon icon={faStar} /> :
                    (value >= 0.5) ?
                        <FontAwesomeIcon icon={faStarHalfAlt} /> : <FontAwesomeIcon icon={faStarR} />}
            </span>
            <span style={{ color: "#FDCC0D" }}>
                {value >= 2 ? <FontAwesomeIcon icon={faStar} /> :
                    (value >= 1.5) ?
                        <FontAwesomeIcon icon={faStarHalfAlt} /> : <FontAwesomeIcon icon={faStarR} />}
            </span>
            <span style={{ color: "#FDCC0D" }}>
                {value >= 3 ? <FontAwesomeIcon icon={faStar} /> :
                    (value >= 2.5) ?
                        <FontAwesomeIcon icon={faStarHalfAlt} /> : <FontAwesomeIcon icon={faStarR} />}
            </span>
            <span style={{ color: "#FDCC0D" }}>
                {value >= 4 ? <FontAwesomeIcon icon={faStar} /> :
                    (value >= 3.5) ?
                        <FontAwesomeIcon icon={faStarHalfAlt} /> : <FontAwesomeIcon icon={faStarR} />}
            </span>
            <span style={{ color: "#FDCC0D" }}>
                {value >= 5 ? <FontAwesomeIcon icon={faStar} /> :
                    (value >= 4.5) ?
                        <FontAwesomeIcon icon={faStarHalfAlt} /> : <FontAwesomeIcon icon={faStarR} />}
            </span>
            <span>
                {" "}{value} out of 5 Ratings
            </span>


        </div>
    )
}

export default Rating
