import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import "./Dealers.css";
import "../assets/style.css";
import Header from '../Header/Header';

const PostReview = () => {
  const [dealer, setDealer] = useState({});
  const [review, setReview] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [date, setDate] = useState("");
  const [carmodels, setCarmodels] = useState([]);

  let curr_url = window.location.href;
  let root_url = curr_url.substring(0, curr_url.indexOf("postreview"));
  let params = useParams();
  let id = params.id;
  let dealer_url = root_url + `djangoapp/dealer/${id}`;
  let review_url = root_url + `djangoapp/add_review`;
  let carmodels_url = root_url + `djangoapp/get_cars`;

  const postreview = async () => {
    let name = sessionStorage.getItem("firstname") + " " + sessionStorage.getItem("lastname");
    if (name.includes("null")) {
      name = sessionStorage.getItem("username");
    }
    if (!model || review === "" || date === "" || year === "") {
      alert("All details are mandatory");
      return;
    }

    let model_split = model.split(" ");
    let make_chosen = model_split[0];
    let model_chosen = model_split[1];

    let jsoninput = JSON.stringify({
      name: name,
      dealership: id,
      review: review,
      purchase: true,
      purchase_date: date,
      car_make: make_chosen,
      car_model: model_chosen,
      car_year: year,
    });

    const res = await fetch(review_url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: jsoninput,
    });

    const json = await res.json();
    if (json.status === 200) {
      window.location.href = window.location.origin + "/dealer/" + id;
    }
  };

  const get_dealer = async () => {
    const res = await fetch(dealer_url);
    const retobj = await res.json();
    if (retobj.status === 200) {
      if (Array.isArray(retobj.dealer)) setDealer(retobj.dealer[0]);
      else setDealer(retobj.dealer);
    }
  };

  const get_cars = async () => {
    const res = await fetch(carmodels_url);
    const retobj = await res.json();
    if (retobj.CarModels) setCarmodels(Array.from(retobj.CarModels));
  };

  useEffect(() => {
    get_dealer();
    get_cars();
  }, []);

  return (
    <div style={{ fontFamily: "Arial, sans-serif", backgroundColor: "#f4f7f8", minHeight: "100vh" }}>
      <Header />
      <div style={{ maxWidth: "600px", margin: "40px auto", padding: "30px", backgroundColor: "#fff", borderRadius: "12px", boxShadow: "0 8px 20px rgba(0,0,0,0.1)" }}>
        
        <h1 style={{ color: "#2c3e50", textAlign: "center", marginBottom: "20px" }}>
          Review for {dealer.full_name || "Dealer"}
        </h1>

        <textarea
          placeholder="Write your review here..."
          value={review}
          onChange={(e) => setReview(e.target.value)}
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            marginBottom: "20px",
            resize: "vertical",
            fontSize: "14px",
          }}
          rows={6}
        />

        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
          <div style={{ flex: "0 0 48%" }}>
            <label style={{ display: "block", marginBottom: "6px", fontWeight: "bold" }}>Purchase Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #ccc" }}
            />
          </div>

          <div style={{ flex: "0 0 48%" }}>
            <label style={{ display: "block", marginBottom: "6px", fontWeight: "bold" }}>Car Year</label>
            <input
              type="number"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              min={2015}
              max={2023}
              style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #ccc" }}
            />
          </div>
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label style={{ display: "block", marginBottom: "6px", fontWeight: "bold" }}>Car Make & Model</label>
          <select
            value={model}
            onChange={(e) => setModel(e.target.value)}
            style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #ccc" }}
          >
            <option value="" disabled hidden>Select Make & Model</option>
            {carmodels.map((carmodel, idx) => (
              <option key={idx} value={carmodel.CarMake + " " + carmodel.CarModel}>
                {carmodel.CarMake} {carmodel.CarModel}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={postreview}
          style={{
            width: "100%",
            padding: "12px",
            backgroundColor: "#2980b9",
            color: "#fff",
            fontSize: "16px",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            transition: "background-color 0.3s",
          }}
          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#3498db")}
          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#2980b9")}
        >
          Post Review
        </button>
      </div>
    </div>
  );
};

export default PostReview;
