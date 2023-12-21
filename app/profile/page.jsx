"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Profile from "@components/Profile";
import PromptCard from "@components/PromptCard";

const MyProfile = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [posts, setPosts] = useState([]);

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

  useEffect(() => {
    const fetchPost = async () => {
      const response = await fetch(`/api/users/${session?.user.id}/posts`);
      const data = await response.json();
      setPosts(data);
    };
    if (session?.user.id) {
      fetchPost();
    }
  }, []);
  return (
    <>
      <Profile
        name="My"
        desc="Weclome to your personalized Page"
        data={posts}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
      />
      <div className="mt-16 prompt_layout ">
        {posts.map((post) => (
          <PromptCard
            key={post._id}
            post={post}
            handleEdit={() => handleEdit && handleEdit(post)}
            handleDelete={() => handleDelete && handleDelete(post)}
          />
        ))}
      </div>
    </>
  );
};

export default MyProfile;
