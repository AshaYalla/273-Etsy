import React from "react";
import cookie from "react-cookies";

function Dashboard() {
  return (
    <div>
      <div className="dash_board">
        { <h1  className="title" >Explore one-of-a-kind finds from independent makers</h1> }
        <div className="dashboard_items">
          <div className="dashboard_item">
            <img
              src="https://images.pexels.com/photos/53577/hotel-architectural-tourism-travel-53577.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260"
              alt="home"
            ></img>
            <h3 style={{ fontSize: "20px" }}>Wall Decor</h3>
          </div>
          <div className="dashboard_item">
            <img
              src="https://images.pexels.com/photos/4530530/pexels-photo-4530530.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260"
              alt="Garden"
            ></img>
            <h3 style={{ fontSize: "20px", marginLeft: "2px" }}>
              Outdoors
            </h3>
          </div>
          
          <div className="dashboard_item">
            <img
              src="https://images.pexels.com/photos/906056/pexels-photo-906056.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260"
              alt="home"
            ></img>
            <h3 style={{ fontSize: "20px", marginLeft: "10%" }}>Necklaces</h3>
          </div>
          <div className="dashboard_item">
            <img
              src="https://images.pexels.com/photos/5038747/pexels-photo-5038747.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260"
              alt="home"
            ></img>
            <h3 style={{ fontSize: "20px", marginLeft: "-10%" }}>
              Wedding Decor
            </h3>
          </div>
          <div className="dashboard_item">
            <img
              src="https://images.pexels.com/photos/4530530/pexels-photo-4530530.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260"
              alt="Garden"
            ></img>
            <h3 style={{ fontSize: "20px", marginLeft: "-5px" }}>
              Kitchen Items
            </h3>
          </div>

          
         
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
