import React from "react";


const Footer = () => {
  return (
    <div className="footer">
      <h4 className="text-center">All Rights Reserved &copy; 2024</h4>
      <p style={{ cursor: "pointer" }} className="text-center mt-3">
        <a
          href="https://portfolio-xrqg.vercel.app/"
          target="_blank"
          rel="noopener noreferrer"
          style={{ textDecoration: "none", color: "inherit" }} // Optional styling
        >
          Designed and Developed by Shaista Nasrullah
        </a>
      </p>

      {/* <p className="text-center mt-3">
        <Link to="/about">About</Link>|<Link to="/contact">Contact</Link>|
        <Link to="/policy">Privacy Policy</Link>
      </p> */}
    </div>
  );
};

export default Footer;
