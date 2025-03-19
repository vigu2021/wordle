const Message = ({ text, type }) => {
  return (
    <div className={`message-container ${type}`}>
      {text}
    </div>
  );
};

export default Message; 