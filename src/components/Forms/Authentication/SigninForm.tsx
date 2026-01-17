import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router";
import logout_background from "../../../Images/logout_background.jpg";
//import Footer from "../../Footer";

interface FormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

function SigninForm() {
  const navigate = useNavigate();

  const [enteredValues, setEnteredValues] = useState<FormData>({
    email: "",
    password: "",
    confirmPassword: "",
    username: "",
  });

  const [errors, setErrors] = useState<string[]>([]);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (imgRef.current?.complete) {
      setIsImageLoaded(true);
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEnteredValues({ ...enteredValues, [name]: value });
  };

  const validateForm = () => {
    const newErrors: string[] = [];

    if (!enteredValues.username) {
      newErrors.push("Username is required.");
    } else if (
      enteredValues.username.length < 3 ||
      enteredValues.username.length > 20
    ) {
      newErrors.push("Length of username must be between 3 and 20 characters");
    }

    if (!enteredValues.email) {
      newErrors.push("Email is required.");
    } else if (!enteredValues.email.includes("@")) {
      newErrors.push("Please enter a valid email.");
    }

    if (!enteredValues.password) {
      newErrors.push("Password is required.");
    } else {
      if (enteredValues.password.length < 6) {
        newErrors.push("Password must be at least 6 characters long.");
      }
      if (!/[0-9]/.test(enteredValues.password)) {
        newErrors.push("Password must contain at least one digit.");
      }
      if (!/[a-z]/.test(enteredValues.password)) {
        newErrors.push("Password must contain at least one lowercase letter.");
      }
      if (!/[A-Z]/.test(enteredValues.password)) {
        newErrors.push("Password must contain at least one uppercase letter.");
      }
      if (!/[^a-zA-Z0-9]/.test(enteredValues.password)) {
        newErrors.push("Password must contain at least one special character.");
      }
    }

    if (!enteredValues.confirmPassword) {
      newErrors.push("Confirm Password is required.");
    } else if (enteredValues.password !== enteredValues.confirmPassword) {
      newErrors.push("Passwords do not match.");
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const requestBody = {
      email: enteredValues.email,
      password: enteredValues.password,
      userName: enteredValues.username,
    };

    try {
      const response = await fetch(
        "https://wojak-hbhdh4dgcaayb3eg.polandcentral-01.azurewebsites.net/api/account/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
          credentials: "include",
        }
      );
      if (response.status === 409) {
        setErrors(["Username or email is already in use"]);
        return;
      }
      if (!response.ok) {
        const errorResponse = await response.json();
        console.log(errorResponse);
        throw new Error("Failed to add user");
      }

      navigate(`/signin/confirmEmail/${enteredValues.email}`);

      setEnteredValues({
        email: "",
        password: "",
        confirmPassword: "",
        username: "",
      });
    } catch (err) {
      console.log("Error during signUp user", err);
    }
  };

  return (
    <div className="relative w-full min-h-screen flex flex-col m-0 p-0 overflow-hidden">
      {/* Background with progressive loading */}
      <div className="fixed top-0 left-0 w-full h-full -z-10">
        {!isImageLoaded && (
          <div
            className="absolute top-0 left-0 w-full h-full bg-gray-200"
            style={{
              backgroundImage: `url(${logout_background})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              filter: "blur(20px)",
            }}
          />
        )}
        <img
          ref={imgRef}
          className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-500 ${
            isImageLoaded ? "opacity-100" : "opacity-0"
          }`}
          src={logout_background}
          alt="WOJAK background"
          onLoad={() => setIsImageLoaded(true)}
          loading="lazy"
        />
      </div>

      {/* Main content */}
      <main className="flex-1 flex items-center justify-center overflow-y-auto py-8">
        <div className="container mx-auto px-4 py-8 flex flex-col lg:flex-row items-center justify-center min-h-full">
          <div className="w-full lg:w-1/2 flex items-center justify-center py-8 lg:py-0">
            <svg width="100%" height="100%">
              <text
                x="50%"
                y="50%"
                dominantBaseline="middle"
                textAnchor="middle"
                className="text-4xl md:text-6xl xl:text-7xl font-mono fill-black stroke-[#eb8954] stroke-[2px]"
              >
                <tspan className="inline md:hidden" x="50%" dy="-1em">
                  Witamy
                </tspan>
                <tspan className="inline md:hidden" x="50%" dy="1.2em">
                  w WOJAK!
                </tspan>

                <tspan className="hidden md:inline">Witamy w WOJAK!</tspan>
              </text>
            </svg>
          </div>

          <div className="w-full lg:w-1/2 flex items-center justify-center relative">
            <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-lg ring-2 ring-[#ed8311]">
              <form onSubmit={handleSubmit}>
                <h2 className="text-2xl font-semibold text-center mb-6">
                  Rejestracja:
                </h2>

                <div className="mb-4">
                  <label
                    htmlFor="username"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Nazwa użytkownika
                  </label>
                  <input
                    type="text"
                    name="username"
                    id="username"
                    value={enteredValues.username}
                    onChange={handleInputChange}
                    className="mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
                  />
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Adres e-mail
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={enteredValues.email}
                    onChange={handleInputChange}
                    className="mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
                  />
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Hasło
                  </label>
                  <input
                    type="password"
                    name="password"
                    id="password"
                    value={enteredValues.password}
                    onChange={handleInputChange}
                    className="mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
                  />
                </div>

                <div className="mb-6">
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Powtórz hasło
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    id="confirmPassword"
                    value={enteredValues.confirmPassword}
                    onChange={handleInputChange}
                    className="mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
                  />
                </div>

                {errors.length > 0 && (
                  <div className="mb-4">
                    {errors.map((error, index) => (
                      <p key={index} className="text-red-500 text-xs mt-1">
                        {error}
                      </p>
                    ))}
                  </div>
                )}

                <div className="flex justify-between">
                  <button
                    type="button"
                    onClick={() =>
                      setEnteredValues({
                        email: "",
                        password: "",
                        confirmPassword: "",
                        username: "",
                      })
                    }
                    className="text-base text-black hover:underline"
                  >
                    Resetuj
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  >
                    Zarejestruj się
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default SigninForm;
