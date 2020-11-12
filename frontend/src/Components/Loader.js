import React from 'react';
import { Spinner } from "react-bootstrap";

const Loader = () => {
    return (
        <Spinner animation="border"
            role="status"
            style={{ display: "block", height: "100px", width: "100px", margin: "auto" }}>
        </Spinner>
    )
}

export default Loader;
