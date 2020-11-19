import React from 'react';
import { Pagination } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

const PaginationComponent = ({ pageNumber, pages, keyword }) => {
    return (pages ?
        <div className="d-flex justify-content-center align-items-center">
            <Pagination className="mb-0">
                {
                    [...Array(pages).keys()].map((x) => (
                        <LinkContainer key={x + 1} to={keyword ? `/search/${keyword}/page/${x + 1}` : `/page/${x + 1}`}>
                            <Pagination.Item active={pageNumber === (x + 1)} >
                                {x + 1}
                            </Pagination.Item>
                        </LinkContainer>
                    ))
                }
            </Pagination>
        </div>
        : null

    )
}

export default PaginationComponent
