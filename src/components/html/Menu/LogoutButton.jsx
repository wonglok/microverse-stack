export function LogoutButton() {
  return (
    <button
      className="btn-primary btn p-2"
      onClick={() => {
        //
        console.log("logout");
        //
      }}
    >
      Logout
      <svg
        className="ml-3 h-6 w-6"
        width="24"
        height="24"
        xmlns="http://www.w3.org/2000/svg"
        fillRule="evenodd"
        clipRule="evenodd"
      >
        <path
          fill="white"
          d="M16 2v7h-2v-5h-12v16h12v-5h2v7h-16v-20h16zm2 9v-4l6 5-6 5v-4h-10v-2h10z"
        />
      </svg>
    </button>
  );
}
