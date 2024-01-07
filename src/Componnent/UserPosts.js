import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Sidebar } from 'primereact/sidebar';
import { Button } from 'primereact/button';
import AddPost from './AddPostDialog.js';

const UserPosts = (props) => {
  const [posts, setPosts] = useState([]);
  const [visibleRight, setVisibleRight] = useState(false);
  const [postUser, setPostUser] = useState([]);
  const [visibleNewPost, setVisibleNewPost] = useState(false);


  useEffect(() => {
    const fetchData = async () => {
      try {

        //Read the posts data
        const responsePosts = await fetch('https://jsonplaceholder.typicode.com/posts');
        const postsData = await responsePosts.json();
        setPosts(postsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (props.selectRow) {
      const postsUser = posts.filter((element) => element.userId === props.selectRow.id);
      setPostUser(postsUser);
      setVisibleRight(true);
    }
  }, [props.selectRow, posts]);

  return (
    <div>
      {/* Sidebar with posts of a specific user */}
      <Sidebar visible={visibleRight} position="right" style={{ width: '50%' }} onHide={() => setVisibleRight(false)}>
        <h2>Posts by {props.selectRow.name}</h2>
        <Button label="Create post" onClick={() => { setVisibleNewPost(true) }} />
        <br />
        <br />
        <DataTable value={postUser} tableStyle={{ minWidth: '150rem' }}>
          <Column field="id" header="ID" style={{ width: '5%' }}></Column>
          <Column field="title" header="Title" style={{ width: '10%' }}></Column>
          <Column field="body" header="Body" style={{ width: '85%' }}></Column>
        </DataTable>
      </Sidebar>
      {visibleNewPost && <AddPost visibleNewPost={visibleNewPost} setVisibleNewPost={setVisibleNewPost} selectRow={props.selectRow} posts={posts} setPosts={setPosts} postUser={postUser} setPostUser={setPostUser} ></AddPost>}
    </div>
  )
}
export default UserPosts;
