import { ConversationParticipant } from "../Types/ConversationParticipant";

interface usersModalProps {
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  users: Array<ConversationParticipant>;
}

function usersModal({ setIsModalOpen, users }: usersModalProps) {
  return (
    <div
      className="fixed inset-0 bg-gray-950/50 flex justify-center items-center z-50"
      onClick={() => setIsModalOpen(false)}
    >
      <div
        className="bg-white p-6 rounded-md w-80 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-xl font-semibold mb-4">Członkowie drużyny</h3>
        <ul className="space-y-2">
          {users.map((participant) => (
            <li
              key={participant.email}
              className=" p-2 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              <div className="text-gray-800 text-xl">
                {participant.username}
              </div>
              <div className="text-gray-800 text-xs">{participant.email}</div>
            </li>
          ))}
        </ul>
        <button
          onClick={() => setIsModalOpen(false)}
          className="mt-4 bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-400 focus:outline-none"
        >
          Zamknij
        </button>
      </div>
    </div>
  );
}

export default usersModal;
