import React, { useState } from "react";
import { useNavigate } from "react-router";
import login_background from "../Images/login_background.jpeg";

function AddFriendPage() {
  const [email, setEmail] = useState<string>("");
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();
  async function validateResponse(response: Response) {
    if (response.ok) {
      return;
    }

    if (response.status === 404) {
      setError("User not found!");
      throw Error("User not found!");
    }
    if (response.status === 400) {
      const text = await response.text();
      setError(text);
      throw Error(text);
    }
  }
  async function handleClick() {
    if (!email.includes("@")) {
      setError("Incorrect email format!");
      return;
    }
    try {
      console.log(JSON.stringify({ email }));
      const response = await fetch(
        "https://wojak-hbhdh4dgcaayb3eg.polandcentral-01.azurewebsites.net/api/users/friend-request",
        {
          headers: {
            "content-type": "application/json",
          },
          method: "POST",
          credentials: "include",
          body: JSON.stringify({ email }),
        }
      );
      await validateResponse(response);
      navigate("/friends");
    } catch (err) {
      console.log(err);
    }
  }
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setEmail(e.target.value);
  }
  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center bg-gray-100"
      style={{ backgroundImage: `url(${login_background})` }}
    >
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
        <input
          type="text"
          value={email}
          placeholder="Enter user email"
          onChange={handleChange}
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleClick}
          className="w-full p-3 bg-[#7a9a6e] text-white rounded-lg hover:bg-[#768a6e] transition duration-200"
        >
          Dodaj
        </button>
        {error && <p className="mt-4 text-red-500 text-center">{error}</p>}
      </div>
    </div>
  );
}

export default AddFriendPage;
