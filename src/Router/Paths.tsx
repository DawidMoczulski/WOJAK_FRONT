import { Suspense, lazy } from "react";
import { createBrowserRouter } from "react-router";
import SigninForm from "../components/Forms/Authentication/SigninForm";
import LoginForm from "../components/Forms/Authentication/LoginForm";
const ReadQrcodePage = lazy(() => import("../components/ReadQrcodePage"));
const AddByQrcodePage = lazy(() => import("../components/AddByQrcodePage"));
const MessageController = lazy(() => import("../signalR/MessageController"));
const UserDetails = lazy(() => import("../components/UserDetails"));
const EmailConfirmationPage = lazy(
  () => import("../components/EmailConfirmationPage")
);
const ConversationsPage = lazy(() => import("../components/ConversationsPage"));
const AddConversationForm = lazy(
  () => import("../components/Forms/AddConversationForm")
);
const FriendsPage = lazy(() => import("../components/FriendsPage"));
const AddFriendPage = lazy(() => import("../components/AddFriendPage"));
const ConversationPage = lazy(() => import("../components/ConversationPage"));
const AddFriendsToConversationPage = lazy(
  () => import("../components/AddFriendsToConversationPage")
);
const RootComponent = lazy(() => import("../RootComponent"));
const MapListView = lazy(() => import("../components/Maps/MapListView"));
const MapComponent = lazy(() => import("../components/Maps/MapComponent"));
const LoadingComponent = lazy(
  () => import("../components/common/LoadingComponent")
);

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootComponent />,
    errorElement: (
      <Suspense fallback={<LoadingComponent />}>
        <LoadingComponent />
      </Suspense>
    ),
    children: [
      {
        path: "signin",
        element: (
          <Suspense fallback={<LoadingComponent />}>
            <SigninForm />
          </Suspense>
        ),
      },
      {
        path: "signin/confirmEmail/:email",
        element: (
          <Suspense fallback={<LoadingComponent />}>
            <EmailConfirmationPage
              header="Confirm Your Email"
              content="Please check your email inbox and confirm your email address to
          complete your registration."
              buttonText="Resend Email"
              isResending={true}
            />
          </Suspense>
        ),
      },
      {
        path: "signin/confirmedEmail",
        element: (
          <Suspense fallback={<LoadingComponent />}>
            <EmailConfirmationPage
              header="Congratulations"
              content="Your email has been confirmed successfully! You can now log into your account."
              buttonText="Log in"
            />
          </Suspense>
        ),
      },
      {
        path: "signin/alreadyConfirmedEmail",
        element: (
          <Suspense fallback={<LoadingComponent />}>
            <EmailConfirmationPage
              header="Email confirmed"
              content="Your email has been already confirmed. You can log into your account."
              buttonText="Log in"
            />
          </Suspense>
        ),
      },
      {
        path: "login",
        element: (
          <Suspense fallback={<LoadingComponent />}>
            <LoginForm />
          </Suspense>
        ),
      },
      {
        path: "chat",
        element: (
          <Suspense fallback={<LoadingComponent />}>
            <MessageController />
          </Suspense>
        ),
      },
      {
        path: "userdetails",
        element: (
          <Suspense fallback={<LoadingComponent />}>
            <UserDetails />
          </Suspense>
        ),
      },
      {
        path: "chats",
        element: (
          <Suspense fallback={<LoadingComponent />}>
            <ConversationsPage />
          </Suspense>
        ),
      },
      {
        path: "chats/:conversationId",
        element: (
          <Suspense fallback={<LoadingComponent />}>
            <ConversationPage />
          </Suspense>
        ),
      },
      {
        path: "chats/:conversationId/add-by-qr",
        element: (
          <Suspense fallback={<LoadingComponent />}>
            <AddByQrcodePage />
          </Suspense>
        ),
      },
      {
        path: "/read-qr",
        element: (
          <Suspense fallback={<LoadingComponent />}>
            <ReadQrcodePage />
          </Suspense>
        ),
      },
      {
        path: "chats/:conversationId/add-friends",
        element: (
          <Suspense fallback={<LoadingComponent />}>
            <AddFriendsToConversationPage />
          </Suspense>
        ),
      },
      {
        path: "friends",
        element: (
          <Suspense fallback={<LoadingComponent />}>
            <FriendsPage />
          </Suspense>
        ),
      },
      {
        path: "friends/add",
        element: (
          <Suspense fallback={<LoadingComponent />}>
            <AddFriendPage />
          </Suspense>
        ),
      },
      {
        path: "chats/addConversation",
        element: (
          <Suspense fallback={<LoadingComponent />}>
            <AddConversationForm />
          </Suspense>
        ),
      },
      {
        path: "maps",
        element: (
          <Suspense fallback={<LoadingComponent />}>
            <MapListView />
          </Suspense>
        ),
      },
      {
        path: "maps/:conversationId",
        element: (
          <Suspense fallback={<LoadingComponent />}>
            <MapComponent />
          </Suspense>
        ),
      },
    ],
  },
]);

export default router;
