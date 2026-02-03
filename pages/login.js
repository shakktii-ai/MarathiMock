
import { useState } from 'react';
import { useRouter } from 'next/router';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Login() {
    const [identifier, setIdentifier] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const togglePasswordVisibility = () => setShowPassword(!showPassword);

    // const handleChange = (e) => {
    //     if (e.target.name === 'email') {
    //         setEmail(e.target.value);
    //     } else if (e.target.name === 'password') {
    //         setPassword(e.target.value);
    //     }
    // };
    const handleChange = (e) => {
        if (e.target.name === 'identifier') {
            setIdentifier(e.target.value);
        } else if (e.target.name === 'password') {
            setPassword(e.target.value);
        }
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        toast.dismiss(); // Dismiss any previous toasts
        setLoading(true);
         if (!identifier || !password) {
        toast.error("कृपया सर्व माहिती भरा.");
        setLoading(false);
        return;
    }
        const data = { identifier, password };

        try {


            const res = await fetch(`/api/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            const response = await res.json();

            // Check if the response is a 401 error (Unauthorized)
            if (res.status === 401) {
                // Show the error from the response in a toast
                toast.error(response.error || 'अवैध क्रेडेन्शियल्स. कृपया तुमचा ईमेल आणि पासवर्ड तपासा.', {
                    position: "top-left",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
                setLoading(false);
                return; // Stop further execution
            }

            // Reset the form fields if login is successful
            // setEmail('');
            setIdentifier('');
            setPassword('');

            if (response.success) {
                // Store token and user data in localStorage
                localStorage.setItem('token', response.token);
                localStorage.setItem('user', JSON.stringify(response.user));

                toast.success('तुम्ही यशस्वीरित्या लॉगिन झाला आहात!', {
                    position: "top-left",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });

                setTimeout(() => {
                    router.push({
                        pathname: '/',
                        query: { user: response.user },
                    });
                }, 1000);
            } else {
                // Show general error in toast if not a 401 but some other error
                toast.error(response.error || 'An unexpected error occurred. Please try again.', {
                    position: "top-left",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
                setLoading(false);
            }
        } catch (err) {
            console.error(err);
            toast.error('An error occurred, please try again.', {
                position: "top-left",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen  relative overflow-hidden">
            <img src="/bg.gif" className="absolute top-0 left-0 w-full h-full object-cover z-[-1]" alt="background" />
            <img src="/Logoo.png" className="absolute top-4 right-8 w-20 mb-4" alt="Logo" />

            <div className="bg-transparent text-center p-6 w-full max-w-xs rounded-lg">
                <h1 className="text-2xl text-white mb-6">स्वागत आहे <span className="text-pink-400">मागे जा!</span></h1>

                <form onSubmit={handleSubmit}>
                    {/* <input 
                        type="email" 
                        id="email"
                        name="email"
                        value={email}
                        onChange={handleChange}
                        placeholder="आपला ईमेल प्रविष्ट करा" 
                        className="w-full p-3 rounded-md bg-white bg-opacity-20 text-white text-base mb-4 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent"
                    /> */}
                    <input
                        type="text"
                        id="identifier"
                        name="identifier"
                        value={identifier}
                        onChange={handleChange}
                        placeholder="ईमेल किंवा मोबाईल नंबर प्रविष्ट करा"
                        className="w-full p-3 rounded-md bg-white bg-opacity-20 text-white text-base mb-4 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent"
                    />

                    <div className="relative mb-4">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            id="password"
                            name="password"
                            value={password}
                            onChange={handleChange}
                            placeholder="आपला पासवर्ड प्रविष्ट करा"
                            className="w-full p-3 rounded-md bg-white bg-opacity-20 text-white text-base focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent"
                        />
                        <span
                            className="absolute top-1/2 transform -translate-y-1/2 right-4 cursor-pointer text-white text-xl"
                            onClick={togglePasswordVisibility}
                        >
                            {showPassword ? '🙈' : '👁️'}
                        </span>
                    </div>

                    <div className="flex items-center text-white text-sm mb-4">
                        <input type="checkbox" id="remember" className="mr-2" />
                        <label htmlFor="remember">३० दिवसांसाठी आपली माहिती लक्षात ठेवा.</label>
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 rounded-md bg-pink-400 text-white text-base transition-all hover:bg-pink-600"
                    >
                        {loading ? (
                            <>
                                <div className="flex justify-center items-center h-4">
                                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                                </div>
                                लॉग इन...
                            </>
                        ) : " लॉग इन"}
                    </button>

                </form>

                <a href="/forgot-password" className="text-pink-400 text-sm mt-4 block">पासवर्ड विसरलात?</a>

                <div className="text-white text-sm mt-4">
                    नोंदणी नसल्यास, कृपया नवीन खाते तयार करा
                    <a href="/signup" className="font-bold text-pink-400"> साइन अप</a>
                </div>
            </div>

            <ToastContainer />
        </div>
    );
}
