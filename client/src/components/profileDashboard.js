import React, { useState, useEffect } from "react";
import { PhotoCameraOutlined, EditOutlined } from "@material-ui/icons";
import cookie from "react-cookies";
import { useNavigate } from "react-router-dom";
import Axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { selectUser } from "../features/userSlice";
import {
  favouritesList,
  getAllFavourites,
  updateFavourites,
} from "../features/productsSlice";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import AirportShuttleIcon from "@mui/icons-material/AirportShuttle";
import { Navigate } from "react-router-dom";

function profileDashboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const [favProdS, setFavProds] = useState([]);
  const favProds = useSelector(getAllFavourites);
  const [numOfFav, setNumOfFav] = useState(0);

  useEffect(() => {
    getFavouriteItems();
  }, []);

  const getFavouriteItems = () => {
    Axios.get("http://localhost:4000/getFavourites/" + user.id).then(
      (response) => {
        console.log(response.data.result);
        if (response.data.success === true) {
          console.log("geting all fav products and storing in redux");
          dispatch(favouritesList(response.data.result));
          console.log(response.data.result.length);

          console.log(favProds);
        }
      }
    );
  };

  const editProfile = () => {
    navigate("/updateProfile");
  };

  const handleFavourite = (itemId, userId) => {
    console.log("Favourites deletd" + itemId + userId);
    Axios.delete(
      "http://localhost:4000/deleteFavourite/" + itemId + "/" + userId,
      {
        itemId: itemId,
        userId: userId,
      }
    ).then((response) => {
      if (response.data.success === true) {
        window.location.pathname = "/profile";
        console.log(response);
      }
    });
  };

  let renderFavourites = null;

  if (favProds === null) {
    renderFavourites = () => {
      return <div>No Favourites added</div>;
    };
  } else {
    renderFavourites = favProds.map((pro) => {
      return (
        <div className="home_cards col-md-4 mb-4">
          <div className="home_card card">
            <div
              style={{
                backgroundColor: "white",
                borderRadius: "50%",
                padding: "5px",
              }}
              className="favourite_icon"
              onClick={() => {
                handleFavourite(pro.itemId, user.id);
              }}
            >
              <FavoriteBorderIcon />
            </div>
            <img
              src={require("../Images/" + pro.itemImage)}
              className="card-img-top"
              alt="..."
            />
            <p className="home_price">
              <AirportShuttleIcon /> ${pro.itemPrice}
            </p>

            <div className="card-body">
              <h5 className="card-title">{pro.itemName}</h5>

              <p className="card-text">{pro.itemDescription}</p>
              {/* <button className="btn-sm btn-dark">Edit</button> */}
            </div>
          </div>
        </div>
      );
    });
  }

  let redirectVar = null;
  if (user === null || !cookie.load("user")) {
    console.log("cookie is found " + user);
    redirectVar = <Navigate to="/home" />;
  }
  return (
    <div>
      {redirectVar}
      <div className="profile_dashboard">
        {user !== null && (
          <img
            className="profile_image"
            src={"/Users/Images/" + user.profilePic}
            alt="profile pic"
          />
        )}
        {/* <img className="profile_pic" src="" /> */}
        <span className="profile_imageIcon">
          <PhotoCameraOutlined />
        </span>

        <div className="profile_name">{cookie.load("user")}</div>
        <div className="edit_profileIcon">
          <span onClick={editProfile} className="edit_icon">
            <EditOutlined />
          </span>
        </div>

        <div className="profile_favourites">
          <div className="container-fluid mx-1">
            <div className="row mt-5 mx-1">
              <div className="col-md-9">
                <div className="row"> {renderFavourites} </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default profileDashboard;
