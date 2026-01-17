import { MdDeleteOutline, MdDownloadDone } from "react-icons/md";

interface Friend {
  email: string;
  username: string;
}

interface FriendListElementProps {
  friend: Friend;
  isRequest?: boolean;
  setFriends: React.Dispatch<React.SetStateAction<Friend[]>>;
  setFriendRequests: React.Dispatch<React.SetStateAction<Friend[]>>;
}

function FriendListElement({
  friend,
  isRequest = false,
  setFriends,
  setFriendRequests,
}: FriendListElementProps) {
  async function handleFriendRequestDelete(email: string) {
    try {
      const response = await fetch(
        "https://wojak-hbhdh4dgcaayb3eg.polandcentral-01.azurewebsites.net/api/users/friend-request-delete",
        {
          headers: {
            "content-type": "application/json",
          },
          credentials: "include",
          method: "DELETE",
          body: JSON.stringify({ email }),
        }
      );
      if (!response.ok) {
        const message = await response.text();
        throw Error(message);
      }
      setFriendRequests((requests) =>
        requests.filter((request) => request.email !== email)
      );
    } catch (err) {
      console.log(err);
    }
  }
  async function handleFriendRequestConfirm(email: string) {
    try {
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
      setFriendRequests((requests) =>
        requests.filter((request) => request.email !== email)
      );
      setFriends((friends) => [
        ...friends,
        { email, username: friend.username },
      ]);
      console.log(response);
    } catch (err) {
      console.log(err);
    }
  }
  async function handleFriendDelete(email: string) {
    try {
      const response = await fetch(
        "https://wojak-hbhdh4dgcaayb3eg.polandcentral-01.azurewebsites.net/api/users/friend-delete",
        {
          headers: {
            "content-type": "application/json",
          },
          credentials: "include",
          method: "DELETE",
          body: JSON.stringify({ email }),
        }
      );
      if (!response.ok) {
        const message = await response.text();
        if (message !== "Not friends already") throw Error(message);
      }
      setFriends((friends) =>
        friends.filter((friend) => friend.email !== email)
      );
    } catch (err) {
      console.log(err);
    }
  }
  return (
    <li
      key={friend.email}
      className="flex items-center justify-between bg-gray-100 rounded-xl p-4"
    >
      <div>
        <p className="font-medium text-gray-700">{friend.username}</p>
        <p className="text-sm text-gray-500">{friend.email}</p>
      </div>
      {isRequest && (
        <MdDownloadDone
          className="text-red-500 w-6 h-6 cursor-pointer hover:text-red-600 transition duration-200"
          onClick={() => handleFriendRequestConfirm(friend.email)}
        />
      )}

      <MdDeleteOutline
        className="text-red-500 w-6 h-6 cursor-pointer hover:text-red-600 transition duration-200"
        onClick={() =>
          isRequest
            ? handleFriendRequestDelete(friend.email)
            : handleFriendDelete(friend.email)
        }
      />
    </li>
  );
}

export default FriendListElement;
