const getAllItems = () => {
	axios.get(`${backendURL}/getitems`).then((res) => {
		if (res.status==200){
			const allItems = res.data.result
			setItems(allItems)
		} else {
			console.log("items not recieved");
		}
	}).catch((err) => console.log(err));
  }

  import config from '../config/config'
  const backendURL = "http://44.202.37.89:3002"
  export default backendURL;