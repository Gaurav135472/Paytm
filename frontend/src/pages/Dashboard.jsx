import { useState, useEffect } from 'react';
import { Appbar } from '../components/Appbar';
import { Balance } from '../components/Balance';
import { Users } from '../components/Users';
import axios from 'axios';
import { jwtDecode } from "jwt-decode";

export const Dashboard = () => {

     const [balance, setBalance] = useState(0);
    const [firstName, setFirstName] = useState('');
    const [error, setError] = useState(null);

    useEffect(() => {
        // Fetch user info and balance
        fetchUserInfo();
        fetchBalance();
    }, []);

    const fetchUserInfo = async () => {
    const token = localStorage.getItem('token');

    if (token) {
        try {
            const decodedToken = jwtDecode(token);
            const userId = decodedToken.userId;

            const response = await axios.get(`http://localhost:3000/api/v1/user/bulk?userId=${userId}`);
            const currentUser = response.data; // Assuming currentUser is an object containing an array of user objects

            console.log("CurrentUser:", currentUser); // Log currentUser to verify its structure

            if (currentUser && currentUser.user && Array.isArray(currentUser.user)) {
                // Loop through the array of users to find the user with the matching userId
                const userWithMatchingId = currentUser.user.find(user => user._id === userId);

                if (userWithMatchingId) {
                    const firstName = userWithMatchingId.firstName;
                    setFirstName(firstName);
                    console.log("First Name:", firstName);
                } else {
                    console.error('User not found');
                    setError('User not found');
                }
            } else {
                console.error('User data not found or invalid format');
                setError('Failed to fetch user info');
            }
        } catch (error) {
            console.error('Error fetching user info:', error);
            setError('Failed to fetch user info');
        }
    } else {
        console.error('Token not found in localStorage');
        setError('Token not found');
    }
};


     const fetchBalance = () => {
        const accessToken = localStorage.getItem('token');
        if (!accessToken) {
            setError('Access token not found');
            return;
        }
        
        axios.get('http://localhost:3000/api/v1/account/balance', {
            headers: {
                'Authorization': 'Bearer ' + accessToken // Include the access token in the request header
            }
        })
            .then(response => {
                setBalance(response.data.balance);
            })
            .catch(error => {
                console.error('Error fetching balance:', error);
                setError('Failed to fetch balance'); // Set error state if fetching balance fails
            });
    };

    return <div>
        <Appbar firstName={firstName} />
        <div className="m-8">
            <Balance balance={balance} />
            <Users />
        </div>
    </div>
}