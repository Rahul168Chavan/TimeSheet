import React, { useState, useEffect } from 'react';
import './App.css';
import { AgGridReact } from 'ag-grid-react';
import { Pagination,TablePagination } from '@mui/material';
import 'ag-grid-enterprise';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
// import ag-theme-alpine
import { Grid, Button } from '@material-ui/core'
import FormDialog from './components/dialog';
const initialValue = { taskName: "", description: ""}
function App() {
  const [gridApi, setGridApi] = useState(null)
  const [tableData, setTableData] = useState(null)
  const [open, setOpen] = React.useState(false);
  const [formData, setFormData] = useState(initialValue)
  const pagesize = 6
  const [page, setPage] = useState(1)
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setFormData(initialValue)
  };
  const url = `http://localhost:4000/tasks`
  const columnDefs = [
    // { headerName: "ID", field: "id" },
    { headerName: "Task", flex:3,field: "taskName",resizable: true,tooltipField:"task-name" },
    { headerName: "Description", flex:5,field: "description",resizable: true,tooltipField: "work-description"},
    { headerName: "Day1", field: "weekFirstDay",type:"number", resizable: true,flex:1},
    { headerName: "Day2", field: "weekSecondDay", resizable: true,flex:1,filter: "agNumberColumnFilter" },
    { headerName: "Day3", field: "weekThirdDay", resizable: true,flex:1,filter: "agNumberColumnFilter" },
    { headerName: "Day4", field: "weekFourthDay",resizable: true,flex:1, filter: "agNumberColumnFilter" },
    { headerName: "Day5", field: "weekFifthDay", resizable: true,flex:1,filter: "agNumberColumnFilter" },
    { headerName: "Total Task Working hours", field:"total-task-working-hour-for-week"}
  ]
  // calling getUsers function for first time 
  useEffect(() => {
    getUsers()
  }, [page])

  //fetching user data from server
  const getUsers = () => {
    fetch(`${url}?page=${page}&pagesize=${pagesize}`).then(resp => resp.json()).then(resp => setTableData(resp))
  }
  const onChange = (e) => {
    const { value, id } = e.target
    setFormData({ ...formData, [id]: value })
  }
  const onGridReady = (params) => {
    setGridApi(params)
  }

  // setting update row data to form data and opening pop up window
  const handleUpdate = (oldData) => {
    setFormData(oldData)
    handleClickOpen()
  }

  const handleFormSubmit = () => {
    // adding new Task
    fetch(url, {
      method: "POST", body: JSON.stringify(formData), headers: {
        'content-type': "application/json"
      }
    }).then(resp => resp.json())
      .then(resp => {
        handleClose()
        getUsers()
      })
  }

  const getPageData = (event, page) => {
    setPage(page)
  }

  const editableColumns = ['Day1','Day2','Day3','Day4','Day5']
  const defaultColDef = {
    sortable: true,
    editable: (params) =>  editableColumns.includes(params.colDef.headerName),
    flex: 1, filter: true,
    floatingFilter: true
  }

  const handleCellValueChange = params => {
    const totalCellId = 'total-task-working-hour-for-week'
    const colId = params.column.colId
    if(totalCellId === colId) return
    // TODO add validation if invalid(Not a number) set value to zero
    const rowNode = params.api.getRowNode(params.rowIndex)
    const newValue = params.value
    if(!isNaN(newValue)) {
      rowNode.setDataValue(totalCellId, getWeekDaysSum(rowNode.data))
    }else{
      rowNode.setDataValue(colId, 0)
      alert('invalid value given, please enter a valid +ve number')
    }
  }

  const getWeekDaysSum = (rowNodeData) => {
    debugger
    const {weekFirstDay, weekSecondDay, weekThirdDay, weekFourthDay, weekFifthDay} = rowNodeData
    const row = [weekFirstDay, weekSecondDay, weekThirdDay, weekFourthDay, weekFifthDay]
    let sum = 0
    for(let value of row) {
      sum += parseInt(value || 0)
    }
    return sum
  }
  return (
    <div className="App">
      <h1 align="center">Leonardo247 Timesheet</h1>
      {/* <h3>CRUD Operation with Json-server in ag-Grid</h3> */}
      <Grid align="right">
        <Button variant="contained" color='primary' onClick={handleClickOpen}>Add Task</Button>
        <Button variant="contained" color='secondary' onClick={handleFormSubmit}>Save</Button>
        <Button variant="contained" color='inherit'>Edit</Button>
      </Grid>
      <div className="ag-theme-alpine" style={{ height: '400px' }}>
        <AgGridReact
          rowData={tableData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          onGridReady={onGridReady}
          onCellValueChanged={handleCellValueChange}
        />
        <br></br>
        <Pagination count={5} color='primary' shape="circular" onChange={getPageData}/>
      </div>
      <FormDialog open={open} handleClose={handleClose}
        data={formData} onChange={onChange} handleFormSubmit={handleFormSubmit} />
    </div>
  );
}

export default App;