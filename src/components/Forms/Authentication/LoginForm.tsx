import { useState, useRef, useEffect } from "react";
import { useAuth } from "../../../Auth/AuthProvider";
import logout_background from "../../../Images/logout_background.jpg";
//import Footer from "../../Footer";
import LoadingComponent from "../../common/LoadingComponent";
import { useNavigate } from "react-router";

interface LoginCredentials {
  username: string;
  password: string;
}

function LoginForm() {
  const [enteredValues, setEnteredValues] = useState<LoginCredentials>({
    username: "",
    password: "",
  });
  const { handleLogin } = useAuth();
  const [isLogging, setIsLogging] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (imgRef.current?.complete) {
      setIsImageLoaded(true);
    }
  }, []);

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setEnteredValues({ ...enteredValues, [name]: value });
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!enteredValues.password || !enteredValues.username) {
      setError("Oba pola muszą być wypełnione.");
      return;
    }
    try {
      setIsLogging(true);
      const isLoggingSuccessful = await handleLogin(enteredValues);
      if (!isLoggingSuccessful) {
        setIsLogging(false);
        throw new Error("Login credentials are incorrect");
      }
      setEnteredValues({
        username: "",
        password: "",
      });
      setIsLogging(false);
      navigate("/");
    } catch (err) {
      setError("Nieprawidłowe dane logowania. Spróbuj ponownie.");
      setIsLogging(false);
      console.log("Error during logging in user", err);
    }
  }

  return (
    <div className="relative w-full min-h-screen flex flex-col m-0 p-0 overflow-hidden">
      {/* Background with progressive loading */}
      <div className="fixed top-0 left-0 w-full h-full -z-10">
        {/* Blurred placeholder */}
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

        {/* Full resolution image */}
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
        <div className="container mx-auto px-4 py-8 flex flex-col xl:flex-row items-center justify-center min-h-full">
          {isLogging ? (
            <LoadingComponent />
          ) : (
            <>
              <div className="w-full xl:w-1/2 flex items-center justify-center py-8 xl:py-0">
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
                      Zaloguj się
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

                    <div className="flex justify-between">
                      <button
                        type="submit"
                        className="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
                      >
                        Zaloguj się
                      </button>
                    </div>
                  </form>

                  {error && (
                    <div className="text-red-600 text-center m-4">{error}</div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

export default LoginForm;
