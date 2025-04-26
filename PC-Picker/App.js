import React, { useState } from "react";
import { motion } from "framer-motion";

const components = {
  CPU: ["Intel i5", "Intel i7", "AMD Ryzen 5", "AMD Ryzen 7", "Intel i9", "AMD Ryzen 9"],
  GPU: ["NVIDIA RTX 3060", "NVIDIA RTX 3070", "AMD RX 6600", "AMD RX 6700", "NVIDIA RTX 3080", "AMD RX 6800"],
  RAM: ["8GB DDR4", "16GB DDR4", "32GB DDR4", "64GB DDR5"],
  Storage: ["256GB SSD", "512GB SSD", "1TB HDD", "1TB NVMe SSD"],
  PowerSupply: ["500W", "650W", "750W", "850W Modular"],
  Motherboard: ["ATX B450", "ATX X570", "Micro-ATX B550", "ITX Z690"],
  Cooling: ["Air Cooler", "240mm AIO", "360mm AIO"],
};

export default function PCPicker() {
  const [selectedParts, setSelectedParts] = useState({});

  const handleSelect = (category, value) => {
    setSelectedParts((prev) => ({ ...prev, [category]: value }));
  };

  return (
    <motion.div 
      style={{
        padding: "30px",
        maxWidth: "750px",
        margin: "auto",
        fontFamily: "'Poppins', sans-serif",
        background: "linear-gradient(135deg, #ff9a9e, #fad0c4, #fad0c4)",
        borderRadius: "15px",
        boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.2)",
        textAlign: "center",
      }}
      // initial={{ opacity: 0}} 
      // animate={{ opacity: 1 }}
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }}
    >
      <h1 style={{ fontSize: "30px", fontWeight: "bold", marginBottom: "20px", color: "#fff", textShadow: "2px 2px 5px rgba(0,0,0,0.3)" }}>
         Build Your Dream PC
      </h1>
      
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
        {Object.keys(components).map((category, index) => (
          <motion.div 
            key={category}
            style={{
              padding: "15px",
              borderRadius: "10px",
              background: index % 2 === 0 ? "#ffb6b9" : "#61c0bf",
              boxShadow: "0px 3px 6px rgba(0, 0, 0, 0.1)",
              color: "#fff",
            }}
            whileHover={{ scale: 1.05 }}
          >
            <h2 style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "8px" }}>{category}</h2>
            <select 
              onChange={(e) => handleSelect(category, e.target.value)}
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "5px",
                border: "none",
                fontSize: "16px",
                background: "#f8f8f8",
                cursor: "pointer",
              }}
            >
              <option value="">Select {category}</option>
              {components[category].map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>
          </motion.div>
        ))}
      </div>
      
      <motion.div 
        style={{
          marginTop: "20px",
          padding: "20px",
          borderRadius: "10px",
          background: "#ffde7d",
          boxShadow: "0px 3px 6px rgba(0, 0, 0, 0.1)",
          color: "#333",
          textAlign: "left",
        }}
        whileHover={{ scale: 1.02 }}
      >
        <h2 style={{ fontSize: "20px", fontWeight: "bold", marginBottom: "10px" }}>🖥 Selected Components:</h2>
        <ul style={{ listStyle: "none", paddingLeft: "0" }}>
          {Object.entries(selectedParts).map(([key, value]) => (
            <li key={key} style={{ fontSize: "16px", fontWeight: "bold", marginBottom: "5px", color: "#222" }}>
              {key}: <span style={{ color: "#0077cc" }}>{value}</span>
            </li>
          ))}
        </ul>
      </motion.div>

      {/* Build PC Button */}
      <motion.button 
        style={{
          width: "100%",
          marginTop: "20px",
          padding: "12px",
          fontSize: "18px",
          fontWeight: "bold",
          borderRadius: "5px",
          border: "none",
          background: "#ff6363",
          color: "white",
          cursor: "pointer",
          transition: "0.3s",
        }}
        whileHover={{ scale: 1.1, backgroundColor: "#e63946" }}
        onClick={() => alert("PC Build Submitted!")}
      >
         Build PC
      </motion.button>
    </motion.div>
  );
}

