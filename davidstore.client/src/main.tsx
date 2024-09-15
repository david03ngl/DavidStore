import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './redux';
import App from './App';
/*import 'bootstrap/dist/css/bootstrap.min.css';*/

const appEl = document.getElementById('root') as HTMLDivElement;
const root = ReactDOM.createRoot(appEl);

root.render(
    <Provider store={store}>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </Provider>,
);