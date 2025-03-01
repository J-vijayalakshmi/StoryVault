import React, { useState, useEffect } from "react";
import "../styles/Generes.css";

import { Link } from "react-router-dom";
import NavigationMenu from "./NavigationMenu";

interface Genre {
  id: number;
  name: string;
  go?: string;
}

const Generes: React.FC = () => {
  const [genres, setGenres] = useState<Genre[]>([]);

  useEffect(() => {
    const fetchGenres = async () => {
      // Example genres data; replace with API call if needed
      const data: Genre[] = [
        { id: 1, name: "Action", go: "https://google.com" },
        { id: 2, name: "Drama", go: "https://google.com" },
        { id: 3, name: "Comedy" },
        { id: 4, name: "Sci-Fi" },
        { id: 5, name: "Horror" },
        { id: 6, name: "Romance" },
        { id: 7, name: "Thriller" },
        { id: 8, name: "Fantasy" },
        { id: 9, name: "Mystery" },
        { id: 10, name: "Adventure" },
        { id: 11, name: "Animation" },
        { id: 12, name: "Documentary" },
        { id: 13, name: "Biography" },
        { id: 14, name: "Crime" },
        { id: 15, name: "Family" },
        { id: 16, name: "History" },
        { id: 17, name: "Musical" },
        { id: 18, name: "Sport" },
        { id: 19, name: "War" },
        { id: 20, name: "Western" },
        { id: 21, name: "Superhero" },
        { id: 22, name: "Noir" },
        { id: 23, name: "Disaster" },
        { id: 24, name: "Martial Arts" },
        { id: 25, name: "Psychological" },
        { id: 26, name: "Cyberpunk" },
        { id: 27, name: "Steampunk" },
        { id: 28, name: "Post-Apocalyptic" },

        // Add more genres as needed
      ];
      setGenres(data);
    };

    fetchGenres();
  }, []);

  return (
    <>
    <NavigationMenu />
      <div id="genere">
        <p id="genere-heading">Select the genre you're into!</p>
        <div id="genere-list">
          {genres.map((genre) => (
            <Link
              key={genre.id}
              type="button"
              className="genere-button"
              to={"./list/" + genre.name}
            >
              {genre.name}
            </Link>
          ))}
        </div>
      </div>
    </>
  );
};

export default Generes;
