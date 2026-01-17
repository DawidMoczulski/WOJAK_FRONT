import { useEffect, useState } from "react";
import { Link } from "react-router";
import FriendListElement from "./FriendListElement";
import login_background from "../Images/login_background.jpeg";

interface Friend {
  username: string;
  email: string;
}

function FriendsPage() {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [friendRequests, setFriendRequests] = useState<Friend[]>([]);
  async function getFriends() {
    try {
      const response = await fetch(
        "https://wojak-hbhdh4dgcaayb3eg.polandcentral-01.azurewebsites.net/api/users/user-all-friends",
        {
          credentials: "include",
        }
      );
      const data = await response.json();
      setFriends(data);
    } catch (err) {
      console.log(err);
    }
  }
  async function getFriendRequests() {
    try {
      const response = await fetch(
        "https://wojak-hbhdh4dgcaayb3eg.polandcentral-01.azurewebsites.net/api/users/current-user/friend-requests",
        {
          credentials: "include",
        }
      );
      const data = await response.json();
      setFriendRequests(data);
      console.log(data);
    } catch (err) {
      console.log(err);
    }
  }
  useEffect(() => {
    getFriends();
    getFriendRequests();
  }, []);

  //from-[#3c4352]/100
  return (
    <div
      className="justify-center bg-cover bg-center"
      style={{ backgroundImage: `url(${login_background})` }}
    >
      <div className=" min-h-screen flex flex-col items-center justify-center bg-cover bg-center p-4 mt-18 pt-10">
        <div className="w-full flex justify-center mt-2 pb-5">
          <Link
            to="/friends/Add"
            className="relative p-0.5 mb-5 me-2 inline-flex items-center justify-center transition-all ease-in duration-75 bg-white dark:bg-gray-600 rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent
    hover:scale-105 hover:translate-y-[-2px] hover:shadow-2xl"
          >
            <span className="relative px-5 py-2.5 overflow-hidden text-sm font-medium text-white rounded-lg border border-[#7a9a6e] bg-[#7a9a6e] hover:bg-black transition-colors duration-200">
              Dodaj znajomego
            </span>
          </Link>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center bg-cover bg-center px-4 box-border w-full overflow-x-hidden">
          <div className="w-full max-w-md bg-[#86a17c] rounded-2xl shadow-lg p-6 my-4 sm:my-8 sm:mx-4 box-border">
            <h2 className="text-2xl font-bold mb-4 text-gray-800 break-words">
              Twoi znajomi:
            </h2>
            <ul className="space-y-4">
              {friends.map((friend) => (
                <FriendListElement
                  key={friend.email}
                  friend={friend}
                  setFriends={setFriends}
                  setFriendRequests={setFriendRequests}
                />
              ))}
            </ul>
          </div>

          <div className="w-full max-w-md bg-[#86a17c] rounded-2xl shadow-lg p-6 my-4 sm:my-8 sm:mx-4 box-border">
            <h2 className="text-2xl font-bold mb-4 text-gray-800 break-words">
              Zaproszenia do znajomych:
            </h2>
            <ul className="space-y-4">
              {friendRequests.map((request) => (
                <FriendListElement
                  key={request.email}
                  friend={request}
                  setFriendRequests={setFriendRequests}
                  setFriends={setFriends}
                  isRequest={true}
                />
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FriendsPage;
