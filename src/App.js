import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Sidebar } from 'primereact/sidebar';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';

export default function BasicDemo() {
  const [data, setData] = useState([]);
  const [posts, setPosts] = useState([]);
  const [selectRow, setSelectRow] = useState(null);
  const [visibleRight, setVisibleRight] = useState(false);
  const [postUser, setPostUser] = useState([]);
  const [visibleNewPost, setVisibleNewPost] = useState(false);
  const [newPost_body, setNewPost_body] = useState('');
  const [newPost_title, setNewPost_title] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleNewPOstTitle = (e) => {
    setNewPost_title(e.target.value);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responseUsers = await fetch('https://jsonplaceholder.typicode.com/users');
        const userData = await responseUsers.json();
        setData(userData);

        const responsePosts = await fetch('https://jsonplaceholder.typicode.com/posts');
        const postsData = await responsePosts.json();
        setPosts(postsData);

        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error.message);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const AddPost = async () => {
    try {
      const id = posts[posts.length - 1].id + 1;
      const obj = {
        id: id,
        userId: selectRow.userId,
        title: newPost_title,
        body: newPost_body,
        userId: 1,
      };

      const createPost = await fetch('https://jsonplaceholder.typicode.com/posts', {
        method: 'POST',
        body: JSON.stringify({
          title: newPost_title,
          body: newPost_body,
          userId: 1,
        }),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      });

      const createdPostData = await createPost.json();
      console.log(createdPostData);

      setPosts([...posts, obj]);
      setPostUser([...postUser, obj]);
    } catch (error) {
      console.error('Error adding new post:', error);
    }
  };

  const openPost = (id) => {
    const postsUser = posts.filter((element) => element.userId === id);
    setPostUser(postsUser);
    setVisibleRight(true);
  };

  const footerContent = (
    <div>
      <Button
        label="Cancel"
        icon="pi pi-times"
        onClick={() => {
          setVisibleNewPost(false);
          setNewPost_body('');
          setNewPost_title('');
        }}
        className="p-button-text"
      />
      <Button
        label="Save"
        icon="pi pi-check"
        onClick={() => {
          AddPost();
          setVisibleNewPost(false);
          setNewPost_body('');
          setNewPost_title('');
        }}
        autoFocus
      />
    </div>
  );

  return (
    <div className="card">
      {isLoading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {!isLoading && !error && (
        <>
          <DataTable
            value={data}
            selectionMode="single"
            selection={selectRow}
            onSelectionChange={(e) => setSelectRow(e.value)}
            removableSort
            tableStyle={{ minWidth: '50rem' }}
          >
            <Column
              field="name"
              header="name"
              sortable
              filter
              style={{ width: '25%' }}
              body={(rowData) => (
                <div onClick={() => openPost(rowData.id)} style={{ cursor: 'pointer' }}>
                  {rowData.name}
                </div>
              )}
            ></Column>

            <Column field="email" header="email" sortable filter style={{ width: '25%' }}></Column>
            <Column field="company.name" header="Company" style={{ width: '25%' }}></Column>
          </DataTable>

          {selectRow != null && (
            <Sidebar visible={visibleRight} position="right" style={{ width: '50%' }} onHide={() => setVisibleRight(false)}>
              <h2> {selectRow.name}'s posts</h2>
              <p>
                <Button label="Create post" onClick={() => setVisibleNewPost(true)} />
                <br></br>
                <br></br>
                <DataTable value={postUser} tableStyle={{ minWidth: '150rem' }}>
                  <Column field="id" header="id" style={{ width: '5%' }}></Column>
                  <Column field="title" header="title" style={{ width: '10%' }}></Column>
                  <Column field="body" header="body" style={{ width: '85%' }}></Column>
                </DataTable>
              </p>
            </Sidebar>
          )}
          <Dialog header="Add new post" visible={visibleNewPost} style={{ width: '50vw' }} onHide={() => setVisibleNewPost(false)} footer={footerContent}>
            <div className="card">
              <InputText
                type="text"
                className="p-inputtext-lg"
                placeholder="Write the title"
                value={newPost_title}
                onChange={handleNewPOstTitle}
              />{' '}
              <br></br>
              <br></br>
              <InputTextarea
                autoResize
                value={newPost_body}
                placeholder="Write the body of the post"
                onChange={(e) => setNewPost_body(e.target.value)}
                rows={5}
                cols={30}
              />
            </div>
          </Dialog>
        </>
      )}
    </div>
  );
}
