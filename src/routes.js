import Home from './pages/Home';
import Blog from './pages/Blog';
import About from './pages/About';
import Contact from './pages/Contact';
import Post from './pages/Post';
import CMS from './pages/CMS'; // Import CMS page
import Login from './pages/Login';
import Register from './pages/Register'; // Import Login page
import UserProfile from './components/UserProfile/UserProfile'; // Import UserProfile component

const routes = [
    { path: '/', component: Home, exact: true },
    { path: '/blog', component: Blog },
    { path: '/about', component: About },
    { path: '/contact', component: Contact },
    { path: '/post/:postId', component: Post },
    { path: '/login', component: Login }, 
    { path: '/register', component: Register }, // Add Login route
    { path: '/profile', component: UserProfile }, // Add UserProfile route
    { path: '/cms', component: CMS, private: true, adminOnly: true } // Add CMS route with admin check
];

export default routes;
