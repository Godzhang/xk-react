import React from "react";
import ReactDOM from "react-dom/client";

const App = () => {
	return (
		<div>
			<Child />
		</div>
	);
};

const Child = () => {
	return <span>xk-react</span>;
};

ReactDOM.createRoot(document.getElementById("root")!).render(<App />);
