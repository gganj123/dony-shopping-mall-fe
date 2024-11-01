import React, { useEffect, useState } from "react";
import "../../App.css";

const messages = ["코알누 구독 시 2천원 할인 쿠폰 증정!"];

const EventHeader = () => {
  return (
    <div className="event-header">
      {messages.map((message, index) => (
        <div
          key={index}
          className="message"
          style={{ animationDelay: `${index * 3}s` }} // 각 메시지마다 애니메이션 지연 설정
        >
          {message}
        </div>
      ))}
    </div>
  );
};

export default EventHeader;
