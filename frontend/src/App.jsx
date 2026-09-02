import { auth, db, storage, firebaseReady } from "./firebase/config";

function App() {
  console.log("Firebase Auth:", auth);
  console.log("Firebase Database:", db);
  console.log("Firebase Storage:", storage);
  console.log("Firebase Ready:", firebaseReady);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-3">
      <h1 className="text-3xl font-bold">Salon Website</h1>
      <div
        className={`px-4 py-2 rounded-full text-sm font-medium ${
          firebaseReady
            ? "bg-green-100 text-green-700 border border-green-300"
            : "bg-red-100 text-red-700 border border-red-300"
        }`}
      >
        {firebaseReady ? "Firebase connected" : "Firebase not connected"}
      </div>
    </div>
  );
}

export default App;