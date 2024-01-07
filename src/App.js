import React, { useState } from 'react';

// import { DataView } from '../src/Componnent/DataView.js';
import UserList from '../src/Componnent/UserList.js';
import UserPosts from './Componnent/UserPosts.js';

export default function Shefing_pro() {
  const [selectRow, setSelectRow] = useState(null);
  
  return (<>
    <UserList selectRow={selectRow} setSelectRow={setSelectRow} ></UserList>
    {selectRow && <UserPosts selectRow={selectRow} ></UserPosts> }
    </>
  )
}
