"use client";
import { useState, useEffect } from "react";

import PromptCard from "./PromptCard";

const PromptCardList = ({ data, handleTagClick }) => {

  return (
    <div className='mt-16 prompt_layout'>
      {data.map(data => {
        return (
          <PromptCard key={data._id} post={data} handleTagClick={handleTagClick} />
        )
      })}
    </div>
  );
};

const Feed = () => {
  const [allPosts, setAllPosts] = useState([]);
  const [filtered, setFiltered] = useState(allPosts);
  const [searchText, setSearchText] = useState("");

  const fetchPosts = async () => {
    const response = await fetch("/api/prompt");
    const data = await response.json();
    setAllPosts(data);
    setFiltered(data)
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleSearchChange = (e) => {
    setSearchText(e.target.value)
    const filtered = allPosts.filter(post => {
      return post.prompt.toLowerCase().includes(e.target.value)||
        post.creator.username.toLowerCase().includes(e.target.value) ||
        post.tag.includes(searchText)
    })
    setFiltered(filtered)
  };

  const handleTagClick = (tag) => {
    setSearchText(tag)
    const filteredByTags = allPosts.filter(post => (
      post.tag.includes(tag)
    ))
    setFiltered(filteredByTags)
  };

  return (
    <section className='feed'>

      <input
        type='text'
        placeholder='Search for a tag or a username'
        value={searchText}
        onChange={handleSearchChange}
        className='search_input peer'
        required
      />


      <PromptCardList data={filtered} handleTagClick={handleTagClick} />
    </section>
  );
};

export default Feed;