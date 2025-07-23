import React from "react";
import "./BoardingList.css";

const rooms = [
  {
    id: 1,
    title: "Shared Room in Meddawatha",
    address: "no 801, Ariyawamsa mawatha , Meddawatha",
    status: "Gone",
    date: "Available from May 16",
    image: "/room1.jpeg",
  },
  
  {
    id: 2,
    title: "Single Room in Wellamadawa",
    address: "no 16 , main road , Wellamadawa",
    status: "Available",
    image: "/room2.jpeg",
  },

  {
    id: 3,
    title: "Shared Room in Eliyakanda",
    address: "no 12, Eliyakanda , Matara",
    status: "Available",
    image: "/room3.jpeg",
  },

  {
    id: 4,
    title: "Shared Room in Matara town",
    address: "no 38 , Beach road , Matara",
    status: "Available",
    image: "/room4.jpeg",
  },

  {
    id: 5,
    title: "Shared Room in Meddawatha",
    address: "no 81, Pallimulla, Matara",
    status: "Gone",
    date: "Available from June 21",
    image: "/room5.jpeg",
  },

 /*{
    id: 7,
    title: "Single Room in Meddawatha",
    address: "no 71,Meddawatha,Matara",
    status: "Gone",
    date: "Available from Feb 16",
    image: "/room7.jpeg",
  }, */

];

export default function BoardingList() {
  return (
    <div className="boarding-container">
      {rooms.map((room) => (
        <div key={room.id} className="boarding-card">
          <img src={room.image} alt={room.title} className="boarding-img" />
          <h2 className="boarding-title">{room.title}</h2>
          <p className="boarding-address">{room.address}</p>
          <button
            className={`boarding-status ${
              room.status.toLowerCase() === "available"
                ? "available"
                : "gone"
            }`}
          >
            {room.status}
          </button>
          {room.date && <p className="boarding-date">{room.date}</p>}
        </div>
      ))}
    </div>
  );
}

<div className="button-group">
  <button className="available">Available</button>
  <button className="gone">Gone</button>
</div>



