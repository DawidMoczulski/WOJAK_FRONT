import { useState } from "react";
import { useAuth } from "../../Auth/AuthProvider";
import { useNavigate } from "react-router";
import login_background from "../../Images/login_background.jpeg";

interface Conversation {
  name: string;
  description: string;
}
function AddConversationForm() {
  const [conversation, setConversation] = useState<Conversation>({
    name: "",
    description: "",
  });
  const [error, setError] = useState<string>("");
  const { currentUser } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();
  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setConversation({ ...conversation, [name]: value });
  }
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (conversation.name === "") {
      setError("Conversation name can't be empty!");
      return;
    }
    setIsSubmitting(true);
    try {
      const response = await fetch(
        `https://wojak-hbhdh4dgcaayb3eg.polandcentral-01.azurewebsites.net/api/conversations`,
        {
          credentials: "include",
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({ ...conversation, userId: currentUser?.id }),
        }
      );
      if (!response.ok) {
        throw new Error("Error during creating conversation");
      }
      navigate("/chats");
    } catch {
      console.log("error during creating conversation");
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center bg-gray-100"
      style={{ backgroundImage: `url(${login_background})` }}
    >
      <div className="max-w-md mx-auto mt-30 p-10 rounded-lg shadow-lg  bg-gray-300">
        <form onSubmit={handleSubmit}>
          <h2 className="text-2xl font-semibold text-center mb-6">
            Stwórz drużynę
          </h2>
          <div className="mb-4">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Nazwa Drużyny:
            </label>
            <input
              type="text"
              name="name"
              id="name"
              value={conversation.name}
              onChange={handleInputChange}
              className="mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              Opis Drużyny:
            </label>
            <input
              type="description"
              name="description"
              id="description"
              value={conversation.description}
              onChange={handleInputChange}
              className="mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>
          <div className="flex justify-between">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-6 py-2 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                isSubmitting
                  ? "bg-gray-500 cursor-not-allowed"
                  : "bg-[#647d5a] hover:bg-[#759c7c]"
              }`}
            >
              {isSubmitting ? "Tworzenie..." : "Stwórz"}
            </button>
          </div>
          <p className="text-red-500 text-l mt-1">{error}</p>
        </form>
      </div>
    </div>
  );
}

export default AddConversationForm;
