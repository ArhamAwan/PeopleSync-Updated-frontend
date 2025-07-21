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
      <h4 className="myTableHeader">
      Schedule Meeting
      </h4>
      <iframe
        src="https://api.leadconnectorhq.com/widget/booking/1B79hzRIFpWEeyz9kXI0"
        style={{
          width: "100%",
          border: "none",
          overflow: "hidden",
        }}
        scrolling="no"
        id="1B79hzRIFpWEeyz9kXI0_1753096505036"
        title="Schedule Meeting"
      ></iframe>
    </div>
  );
};

export default ScheduleMeeting;
