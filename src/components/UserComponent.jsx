import React from 'react'
import React, { useEffect, useState } from 'react'


function UserComponent() {
    const [users, setUsers] = useState([])

    useEffect(() => { 
        getUsers()
    }, [])

    const getUsers = () => {
        UserService.getUsers().then((response) => {
            setUsers(response.data)
            console.log(response.data)
        });
    }

    return (
        <div className="container">
            
        </div>
    )
}

export default UserComponent
