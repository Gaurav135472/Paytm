import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { BottomWarning } from "../components/BottomWarning";
import { Button } from "../components/Button";
import { Heading } from "../components/Heading";
import { InputBox } from "../components/InputBox";
import { SubHeading } from "../components/SubHeading";

export const Signin = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigateTo = useNavigate();

    const handleSignIn = async () => {
        try {
            // Check if email and password are provided
            if (!email || !password) {
                console.error("Email and password are required");
                return;
            }

            // Send a GET request to retrieve all user information
            const response = await axios.get(`http://localhost:3000/api/v1/user/getData`);

            // Check if any user with the provided email exists
            const users = response.data.user;
            const user = users.find(user => user.username === email);
            if (!user) {
                console.error("User with the provided email does not exist");
                return;
            }

            // Check if the provided password matches the stored password
            if (user.password === password) {
                // Authentication successful, navigate to dashboard
                navigateTo("/dashboard");
            } else {
                // Password does not match, log an error message
                console.error("Incorrect password");
            }

        } catch (error) {
            console.error("Sign-in failed:", error);
        }
    };

    return (
        <div className="bg-slate-300 h-screen flex justify-center">
            <div className="flex flex-col justify-center">
                <div className="rounded-lg bg-white w-80 text-center p-2 h-max px-4">
                    <Heading label={"Sign in"} />
                    <SubHeading label={"Enter your credentials to access your account"} />
                    <InputBox
                        placeholder="harkirat@gmail.com"
                        label={"Email"}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <InputBox
                        placeholder="123456"
                        label={"Password"}
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <div className="pt-4">
                        <Button label={"Sign in"} onClick={handleSignIn} />
                    </div>
                    <BottomWarning
                        label={"Don't have an account?"}
                        buttonText={"Sign up"}
                        to={"/signup"}
                    />
                </div>
            </div>
        </div>
    );
};
