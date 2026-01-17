import { useAuth } from "../Auth/AuthProvider";
import login_background from "../Images/login_background.jpeg";

function UserDetails() {
  const { currentUser } = useAuth();
  console.log(currentUser, "from user details");

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center pt-16"
      style={{ backgroundImage: `url(${login_background})` }}
    >
      <div className="p-10 bg-[#c5d6bf] rounded-lg shadow-md max-w-md mx-auto">
        <div className="flex gap-4 items-center justify-between flex-col">
          <p className="text-lg font-semibold text-gray-700">
            Nazwa Użytkownika:
            <span className="text-amber-800"> {currentUser?.username}</span>
          </p>
          <p className="text-lg font-semibold text-gray-700">
            Adres e-mail:
            <span className="text-amber-800"> {currentUser?.email}</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default UserDetails;
