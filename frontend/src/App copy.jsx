import React from "react";
import './css/bootstrap.css';
import './css/style.css';
import './js/bootstrap.js';
import './js/popper.js';


function App(){

  const [count, setCount] = React.useState(0);
  const [dataForm, setDataForm] = React.useState([]);

  const [nilaiJudul, setNilaiJudul] = React.useState("");
  const [nilaiDeskripsi, setDeskripsi] = React.useState("");

  function tambah(){
    setCount(count + 1);
  }

  React.useEffect(() => {
    fetch('http://127.0.0.1:5050/api/form').then((response)=>response.json()).then((data) => setDataForm(data.data));
    // console.log("Hello World")
  },[])

  return (
    <>
    
    {dataForm.map((item,index) => {
      return(

        <div key={index} >
          <div>{item.judul}</div>
          <div>{item.deskripsi}</div>
        </div>
      )
      
    })}
    
    

 <form action="">
  <label>Judul</label>
    <input type="text" name="judul" onChange={(e) => setNilaiJudul(e.target.value)}></input>
  <label>Deskripsi</label>
    <input type="text" name="deskripsi" onChange={(e) => setDeskripsi(e.target.value)}></input>
    
    <input type="submit" value="Tambah"></input>
 </form>


    </>
  )
}

export default App
