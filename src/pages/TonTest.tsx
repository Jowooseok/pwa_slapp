import { useState } from "react";

import WebApp from "@twa-dev/sdk";

function TonTest() {
  const [count, setCount] = useState(0);

  return (
    <div className="flex flex-col gap-4 items-center justify-center h-full bg-white">
      <div></div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
      </div>
      {/* Here we add our button with alert callback */}
      <div className="card">
        <button
          onClick={() =>
            WebApp.showAlert(`Hello World! Current count is ${count}`)
          }
        >
          Show Alert
        </button>
      </div>
    </div>
  );
}

export default TonTest;
