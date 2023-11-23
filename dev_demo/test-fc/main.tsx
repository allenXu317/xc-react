import React from 'react';
import ReactDOM from 'react-dom/client';

function App() {
	return (
		<div>
			<span>hello world!</span>
		</div>
	);
}

ReactDOM.createRoot(document.getElementById('root')!).render(<App />);
