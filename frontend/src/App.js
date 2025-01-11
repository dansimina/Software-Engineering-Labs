import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./compontents/Register";
import Login from "./compontents/Login";
import Home from "./compontents/Home";
import Users from "./compontents/Users";
import UserProfile from "./compontents/UserProfile";
import MoviePage from "./compontents/MoviePage";
import Movies from "./compontents/Movies";
import AddRecommendationPage from './compontents/AddRecommendationPage';
import RecommendationPage from './compontents/RecommendationPage';
import Chat from './compontents/Chat';

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Login />} />
          <Route path="/users" element={<Users />} />
          <Route path="/users/:userId" element={<UserProfile />} />
          <Route path="/movies" element={<Movies />} />
          <Route path="/movies/:movieId" element={<MoviePage />} />
          <Route path="/movie/:movieId/add-recommendation" element={<AddRecommendationPage />} />
          <Route path="/recommendations/:recommendationId" element={<RecommendationPage />} />
          <Route path="/chat" element={<Chat />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;