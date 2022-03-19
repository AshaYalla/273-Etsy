import Axios from "axios";
import React, { useEffect, useState } from "react";

function Navbar() {

  const [itemName, setItemName] = useState("");
  const [itemImage, setItemImage] = useState("");
  const [itemDetails, setItemDetails] = useState();
  const [itemDetailsRes, setItemDetailsRes] = useState(false);

  const addItemDetails = (e) => {
    e.preventDefault();
    console.log("Add Item details");
    const formData = new FormData();
    formData.append("itemImage", itemImage);
    formData.append("itemName", itemName)
    console.log(formData)
    Axios.post( "http://localhost:4001/addItems", formData, { headers: { "content-Type": "multipart/form-data" } } )
    .then((response) => { if (response.data.success) { console.log(response); 
      setItemDetailsRes = true;
      // setItemDetails(response.data)
    } else if(response.error){ console.log("err: ", response.error) }  });
  };

  useEffect(() => {
    Axios.get("http://locahost:4001/getItems").then((response) =>{
      console.log(response.data.result[0]);
      setItemDetails(response.data.result[0]); 
    });
  }, []);



 
  return (
    <div>
    <header className="navBar">
        <h2 className="logo">Etsy</h2>
        <input type="text" id="searchBar" className="searchBar"></input>
        <i className="material-icons md-48" >shopping_cart</i>
    </header>

    <div className="bg-modal">
      <div className="modal-content">
        <h2 className="addItemDetails">Add Item Details</h2>
        <form className="addItemDetails_form" encType="multipart/form-data" method="post">
          <div className="htmlForm-group">
            <label style={{ fontSize: "18px" }} htmlFor="item_name"> Item Name </label>
            <br />
            <input type="text" className="item_name" id="item_name" placeholder="Item Name" required onChange={(event) => { setItemName(event.target.value); }}/>
            <br />
            <label style={{ fontSize: "18px" }} htmlFor="item_image"> Item Image </label>
            <br />
            <input style={{ border: "none" }} type="file" name="item_image" className="item_image" id="item_image" onChange={(event) => { setItemImage(event.target.files[0]); }} required />
          </div>

          <div>
            <button style={{ marginTop: "10px", width: "20%", borderRadius: "4px", padding: "5px", backgroundColor: "gray", border: "none", color: "white", }} onClick={addItemDetails} >
              Upload Item Details
            </button>
            {/* { itemDetailsRes && itemDetails.map((val)=>{
              return (<div><h1>Item Name : {val.itemName}</h1>
              <img src={require("../../images" + val.itemImage)} /></div>
              )})} */}
          </div>
        </form>
      </div>
    </div>  
    </div>  
  )
}

export default Navbar;
