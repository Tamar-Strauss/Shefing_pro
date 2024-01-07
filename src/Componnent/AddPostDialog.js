import React, { useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';

const AddPost = (props) => {

  const [fields, setFields] = useState({
    title: '',
    body: ''
  });

  const [errors, setErrors] = useState({});
  
  //A function that creates the new post
  const addPost_ = async () => {
    const formFields = { ...fields };
    try {
      const id = props.posts[props.posts.length - 1].id + 1;
      const obj = {
        id: id,
        userId: props.selectRow.id,
        title: formFields.title,
        body: formFields.body,
      };

      // Create a new post with a demo request
      const createPost = await fetch('https://jsonplaceholder.typicode.com/posts', {
        method: 'POST',
        body: JSON.stringify({
          title: formFields.title,
          body: formFields.body,
          userId: props.selectRow.userId,
        }),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      });

      const createdPostData = await createPost.json();
      props.setPosts([...props.posts, obj]);
      props.setPostUser([...props.postUser, obj]);

    } catch (error) {
      console.error('Error adding new post:', error);
    }
  };
//Validation on the new post
  const handleValidation = () => {
    const formFields = { ...fields };
    const formErrors = {};
    let formIsValid = true;

    // Title
    if (!formFields.title) {
      formIsValid = false;
      formErrors.title = 'Write the title - Cannot be empty';
    }
    // Body
    if (!formFields.body) {
      formIsValid = false;
      formErrors.body = 'Write the body - Cannot be empty';
    }

    setErrors(formErrors);
    return formIsValid;
  };

  const handleChange = (field, value) => {
    setFields({
      ...fields,
      [field]: value,
    });
  };

//By clicking save of the new post  
  const contactSubmit = (e) => {
    e.preventDefault();
    if (handleValidation()) {
      addPost_();
      props.setVisibleNewPost(false);
      setFields({
        title: '',
        body: '',
      });
      setErrors({
        title: '',
        body: '',
      });
    }
  };

  return (
    <>
      {/* Dialog for adding a new post */}
      <Dialog header="Add new post" visible={props.visibleNewPost} style={{ width: '50vw' }} onHide={() => props.setVisibleNewPost(false)}>
        <div className="card">
          <form onSubmit={(e) => contactSubmit(e)}>
            <InputText placeholder="Write the title" onChange={(e) => handleChange('title', e.target.value)} value={fields.title} />
            <span className="error">{errors.title}</span>
            <br></br>
            <br></br>
            <InputTextarea placeholder="Write the body" onChange={(e) => handleChange('body', e.target.value)} value={fields.body} />
            <span className="error">{errors.body}</span>
            <br></br>
            <br></br>
            <button className="btn btn-lg pro" id="submit" value="Submit">
              Save
            </button>
          </form>
          {/* button Cancel of new post */}
          <button
            onClick={() => {
              props.setVisibleNewPost(false);
              setFields({
                title: '',
                body: '',
              });
              setErrors({
                title: '',
                body: '',
              });
            }}
          >
            Cancel
          </button>
        </div>
      </Dialog>
    </>
  );
};

export default AddPost;
