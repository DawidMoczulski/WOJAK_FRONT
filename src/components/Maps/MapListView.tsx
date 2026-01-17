import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import login_background from "../../Images/login_background.jpeg";
import { MdDeleteOutline } from "react-icons/md";

type UserMap = {
  id: number;
  name: string;
  description: string;
};

function MapListView() {
  const [maps, setMaps] = useState<UserMap[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [newMapName, setNewMapName] = useState("");
  const navigate = useNavigate();
  const [error, setError] = useState<string>("");

  async function validateResponse(response: Response) {
    if (response.ok) return;

    const text = await response.text(); // Read the body once

    if (response.status === 404) {
      setError("User not found!");
      throw Error("User not found!");
    }

    if (response.status === 400) {
      setError(text);
      throw Error(text);
    }

    // For other errors
    setError(text || "Something went wrong");
    throw new Error(text || "Something went wrong");
  }

  async function getMaps() {
    try {
      const response = await fetch(
        "https://wojak-hbhdh4dgcaayb3eg.polandcentral-01.azurewebsites.net/api/map/get-maps",
        {
          credentials: "include",
        }
      );
      const data = await response.json();
      setMaps(data);
      console.log(data);
    } catch (err) {
      console.log(err);
    }
  }

  async function handleCreateMap() {
    if (newMapName.trim() === "") {
      setError("Map name cannot be empty!");
      return;
    }

    try {
      const response = await fetch(
        "https://wojak-hbhdh4dgcaayb3eg.polandcentral-01.azurewebsites.net/api/map/create-map",
        {
          headers: {
            "content-type": "application/json",
          },
          method: "POST",
          credentials: "include",
          body: JSON.stringify({ name: newMapName.trim(), description: "" }),
        }
      );

      await validateResponse(response);
      // Odśwież listę map po stworzeniu nowej
      await getMaps();
      setNewMapName("");
      setShowModal(false);
    } catch (err) {
      console.log(err);
    }
  }

  async function mapDelete(mapId: number) {
    try {
      console.log(mapId);
      const response = await fetch(
        "https://wojak-hbhdh4dgcaayb3eg.polandcentral-01.azurewebsites.net/api/map/delete-map",
        {
          headers: {
            "content-type": "application/json",
          },
          credentials: "include",
          method: "DELETE",
          body: JSON.stringify({ mapId }),
        }
      );
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const message = errorData.message || (await response.text());
        throw new Error(message || "Something went wrong");
      }

      await validateResponse(response);
      await getMaps();
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    getMaps();
  }, []);

  return (
    <div
      className="flex flex-col min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${login_background})` }}
    >
      {/* MAIN SECTION */}
      <main className="flex-grow flex flex-col items-center justify-center p-6 pt-20">
        <button
          onClick={() => setShowModal(true)}
          className="relative p-0.5 mb-2 me-2 inline-flex items-center justify-center transition-all ease-in duration-75 bg-white dark:bg-gray-600 rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent"
        >
          <span className="relative px-5 py-2.5 overflow-hidden text-sm font-medium text-white rounded-lg border border-[#7a9a6e] bg-[#7a9a6e] hover:bg-black transition-colors duration-200">
            Add New Map
          </span>
        </button>

        <ul className="mt-6 space-y-2 text-center">
          {maps.map((map) => (
            <div
              className="flex items-center justify-between bg-gray-100 rounded-xl p-4"
              key={map.id}
            >
              <li>
                <p
                  className="font-medium text-gray-700 cursor-pointer hover:text-gray-900 transition-colors duration-200"
                  onClick={() => navigate(`/maps/${map.id}`)}
                >
                  {map.name}
                </p>
              </li>
              <MdDeleteOutline
                className="ml-10 text-red-500 w-6 h-6 cursor-pointer hover:text-red-600 transition duration-200"
                onClick={() => mapDelete(map.id)}
              />
            </div>
          ))}
        </ul>
      </main>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-sm">
            <h2 className="text-lg font-semibold mb-4">Podaj nazwę mapy</h2>
            <input
              type="text"
              className="border p-2 w-full mb-4 rounded"
              value={newMapName}
              onChange={(e) => setNewMapName(e.target.value)}
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
              >
                Anuluj
              </button>
              <button
                onClick={handleCreateMap}
                className="bg-[#7a9a6e] text-white px-4 py-2 rounded hover:bg-[#78947d]"
              >
                Stwórz mapę
              </button>
            </div>
            {error && <p className="mt-4 text-red-500 text-center">{error}</p>}
          </div>
        </div>
      )}
    </div>
  );
}

export default MapListView;
