import React, { useState } from "react";
import { FaGithub, FaStar } from "react-icons/fa";

const GitHubUserFinder = () => {
  const [username, setUsername] = useState("");
  const [userData, setUserData] = useState(null);
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchUserData = async () => {
    setLoading(true);
    setError(null);
    try {
      const userResponse = await fetch(`https://api.github.com/users/${username}`);
      if (!userResponse.ok) throw new Error("User not found");
      const userData = await userResponse.json();

      const reposResponse = await fetch(
        `https://api.github.com/users/${username}/repos?sort=stars&per_page=5`
      );
      const reposData = await reposResponse.json();

      setUserData(userData);
      setRepos(reposData);
    } catch (err) {
      setError(err.message);
      setUserData(null);
      setRepos([]);
    }
    setLoading(false);
  };

  return (
    <div className="container">
      <div className="content-box">
        <h1>GitHub User Finder</h1>
        <div className="search-box">
          <input
            type="text"
            placeholder="Enter GitHub username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <button onClick={fetchUserData}>Search</button>
        </div>

        {loading && <p>Loading...</p>}
        {error && <p className="error">{error}</p>}

        {userData && (
          <div className="profile-card">
            <img src={userData.avatar_url} alt="Avatar" />
            <h2>{userData.name || userData.login}</h2>
            <p>{userData.bio}</p>
            <p>Followers: {userData.followers}</p>
            <a href={userData.html_url} target="_blank" rel="noopener noreferrer">
              View Profile <FaGithub />
            </a>
          </div>
        )}

        {repos.length > 0 && (
          <div className="repo-list">
            <h3>Top 5 Repositories:</h3>
            {repos.map((repo) => (
              <div key={repo.id} className="repo-card">
                <h3>{repo.name}</h3>
                <p>{repo.description || "No description available"}</p>
                <p>
                  <FaStar /> {repo.stargazers_count}
                </p>
                <a href={repo.html_url} target="_blank" rel="noopener noreferrer">
                  View Repository
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default GitHubUserFinder;
