import React, { useState } from 'react'
import { Form, Button } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';

const SearchBox = () => {

    const [keyword, setKeyword] = useState("");
    let history = useHistory();

    const submitHandler = (e) => {
        e.preventDefault();

        if (keyword.trim()) {
            history.push(`/search/${keyword}`);
        }
        else {
            history.push("/")
        }

    }
    return (
        <Form onSubmit={submitHandler} inline className="my-2 my-sm-0">
            <Form.Control type="text" name="search" onChange={(e) => setKeyword(e.target.value)} value={keyword} placeholder="Search..." size="sm" />
            <Button type="submit" variant="outline-success" className="btn-sm mt-2 mt-sm-0 ml-sm-2">Search</Button>
        </Form>
    )
}

export default SearchBox
