import React, { useEffect, useState } from "react";
import "../../App.css";

const messages = ["어렵네요...이벤트 배너.."];

const EventHeader = () => {
  return (
    <div className="event-header">
      {messages.map((message, index) => (
        <div
          key={index}
          className="message"
          style={{ animationDelay: `${index * 5}s` }} // 각 메시지마다 애니메이션 지연 설정
        >
          {message}
        </div>
      ))}
    </div>
  );
};

export default EventHeader;
