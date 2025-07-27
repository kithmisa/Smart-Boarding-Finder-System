import React from "react";
import "./BoardingList.css";

// Import images from src/assets/
import room1 from "../assets/room1.jpeg";
import room2 from "../assets/room2.jpeg";
import room3 from "../assets/room3.jpeg";
import room4 from "../assets/room4.jpeg";
import room5 from "../assets/room5.jpeg";

const rooms = [
  {
    id: 1,
    title: "Shared Room in Meddawatha",
    address: "no 801, Ariyawamsa mawatha , Meddawatha",
    status: "Gone",
    date: "Available from May 16",
    image: room1, // Use imported image
  },
  
  {
    id: 2,
    title: "Single Room in Wellamadawa",
    address: "no 16 , main road , Wellamadawa",
    status: "Available",
    image: room2, // Use imported image
    
  },

  {
    id: 3,
    title: "Shared Room in Eliyakanda",
    address: "no 12, Eliyakanda , Matara",
    status: "Available",
    image: room3, // Use imported image
  },

  {
    id: 4,
    title: "Shared Room in Matara town",
    address: "no 38 , Beach road , Matara",
    status: "Available",
    image: room4, // Use imported image

  },

  {
    id: 5,
    title: "Shared Room in Meddawatha",
    address: "no 81, Pallimulla, Matara",
    status: "Gone",
    date: "Available from June 21",
    image: room5, // Use imported image
  },

    {
    id: 6,
    title: "Shared Room in Meddawatha",
    address: "no 81, Pallimulla, Matara",
    status: "Gone",
    date: "Available from June 21",
    image: room5, // Use imported image
  },

    {
    id: 7,
    title: "Shared Room in Meddawatha",
    address: "no 81, Pallimulla, Matara",
    status: "Gone",
    date: "Available from June 21",
    image: room5, // Use imported image
  },

    {
    id: 8,
    title: "Shared Room in Meddawatha",
    address: "no 81, Pallimulla, Matara",
    status: "Gone",
    date: "Available from June 21",
    image: room5, // Use imported image
  },
];

export default function BoardingList() {
  return (
    <div className="boarding-container">
      {rooms.map((room) => (
        <div key={room.id} className="boarding-card">
          <img 
            src={room.image} 
            alt={room.title} 
            className="boarding-img"
          />
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