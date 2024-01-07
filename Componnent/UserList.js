import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

const UserList = (props) => {

  const [data, setData] = useState([]);;
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);


  useEffect(() => {
    const fetchData = async () => {
      try {
        //Read the user data
        const responseUsers = await fetch('https://jsonplaceholder.typicode.com/users');
        const userData = await responseUsers.json();
        setData(userData);

        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error.message);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (

    <div>
      <div className="card">
        {isLoading && <p>Loading...</p>}
        {error && <p>Error: {error}</p>}
        {!isLoading && !error && (
          <>
            <DataTable
              value={data}
              selectionMode="single"
              selection={props.selectRow}
              onSelectionChange={(e) => props.setSelectRow(e.value)}
              removableSort
              tableStyle={{ minWidth: '50rem' }}
            >
              <Column
                field="name"
                header="name"
                sortable
                filter
                style={{ width: '25%' }}
              ></Column>
              <Column field="email" header="email" sortable filter style={{ width: '25%' }}></Column>
              <Column field="company.name" header="company" style={{ width: '25%' }}></Column>
            </DataTable>
          </>

        )}
      </div></div>
  )

}
export default UserList;