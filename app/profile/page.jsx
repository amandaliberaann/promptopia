"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Profile from "@components/Profile";
import PromptCard from "@components/PromptCard";
import { useSearchParams } from "next/navigation";

const MyProfile = () => {
  const searchParams = useSearchParams();
  const userId = searchParams.get("id");

  const { data: session } = useSession();

  const [posts, setPosts] = useState([]);
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [searchedResults, setSearchedResults] = useState([]);
  const [searchText, setSearchText] = useState("");

  const handleEdit = (post) => {
    router.push(`/update-prompt?id=${post._id}`);
  };
  const handleDelete = async (post) => {
    const hasConfirmed = alert(
      "Are you sure that you want to delete the post?"
    );
    if (hasConfirmed) {
      try {
        const response = await fetch(`/api/prompt/delete/${post._id}`, {
          method: "DELETE",
        });
        if (response.ok) {
          const filteredPosts = posts.filter((p) => p._id != post._id);
          setPosts(filteredPosts);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

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

  useEffect(() => {
    let profileId = userId ? userId : session?.user.id;

    const fetchPost = async () => {
      const postResponse = await fetch(`/api/users/${profileId}/posts`);
      const postData = await postResponse.json();
      setPosts(postData);

      if (userId && !session?.user.id) {
        const userResponse = await fetch(`/api/users/${userId}`);
        const userData = await userResponse.json();

        setName(userData.username);
        setDesc(`Welcome to ${userData.username} personalized Page`);
      } else {
        setName("My");
        setDesc("Welcome to your personalized Page");
      }
    };

    fetchPost();
  }, []);

  return (
    <>
      <Profile
        name={name}
        desc={desc}
        data={posts}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
      />
      {searchText ? (
        <div className="mt-16 prompt_layout ">
          {searchedResults.map((post) => (
            <PromptCard
              key={post._id}
              post={post}
              handleEdit={() => handleEdit && handleEdit(post)}
              handleDelete={() => handleDelete && handleDelete(post)}
              handleTagClick={() => handleTagClick && handleTagClick(post.tag)}
            />
          ))}
        </div>
      ) : (
        <div className="mt-16 prompt_layout ">
          {posts.map((post) => (
            <PromptCard
              key={post._id}
              post={post}
              handleEdit={() => handleEdit && handleEdit(post)}
              handleDelete={() => handleDelete && handleDelete(post)}
              handleTagClick={() => handleTagClick && handleTagClick(post.tag)}
            />
          ))}
        </div>
      )}
    </>
  );
};

export default MyProfile;
