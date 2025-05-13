import React, { useEffect } from "react";

const ScheduleMeeting = () => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://link.msgsndr.com/js/form_embed.js";
    script.type = "text/javascript";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div  style={{marginLeft:"20px", marginRight:"20px"}}>
      <h4 className="myTableHeader animate__animated animate__lightSpeedInLeft">
      Schedule Meeting
      </h4>
      <iframe
        src="https://api.leadconnectorhq.com/widget/booking/0BcwfsShutFpM5UxxYq2"
        style={{
          width: "100%",
          height: "100vh",
          border: "none",
          overflow: "hidden",
        }}
        scrolling="no"
        id="UAZYcOPVsbFC9vVtzVVD_1747161650293"
        title="Schedule Meeting"
      ></iframe>
    </div>
  );
};

export default ScheduleMeeting;
