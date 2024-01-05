"use client";
import { useState, useEffect } from "react";
import PromptCard from "./PromptCard";
import { useRouter } from "next/navigation";
const PromptCardList = ({ data, handleTagClick, handleProfileClick }) => {
  return (
    <div className="mt-16 prompt_layout ">
      {data.map((post) => (
        <PromptCard
          key={post._id}
          post={post}
          handleTagClick={handleTagClick}
          handleProfileClick={handleProfileClick}
        />
      ))}
    </div>
  );
};
const Feed = () => {
  const router = useRouter();
  const [searchText, setSearchText] = useState("");
  const [posts, setPosts] = useState([]);
  const [searchedResults, setSearchedResults] = useState([]);

  const handleTagClick = async (tag) => {
    try {
      setSearchText(tag);
      const response = await fetch(`/api/prompt/search?tagData=${tag}`);

      if (response.ok) {
        const data = await response.json();

        setSearchedResults(data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  // hanlde Profile click to check others profile,if not user do not show edit/delete button
  const handleProfileClick = (creator) => {
    router.push(`/profile?id=${creator._id}`);
  };

  //Toto handle Search by searching tag name as well as username
  const handleSearchChange = (e) => {
    // check tag or username to see whether there are any posts releated
  };
  useEffect(() => {
    const fetchPost = async () => {
      const response = await fetch("/api/prompt");
      const data = await response.json();

      setPosts(data);
    };
    fetchPost();
  }, []);
  return (
    <section className="feed">
      <form className="relative w-full flex-center">
        <input
          type="text"
          placeholder="Search for a tag or a username"
          value={searchText}
          onChange={handleSearchChange}
          required
          className="search_input peer"
        />
      </form>
      {searchText ? (
        <PromptCardList
          data={searchedResults}
          handleTagClick={handleTagClick}
          handleProfileClick={handleProfileClick}
        />
      ) : (
        <PromptCardList
          data={posts}
          handleTagClick={handleTagClick}
          handleProfileClick={handleProfileClick}
        />
      )}
    </section>
  );
};

export default Feed;
